import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { 
  getOrCreateSubscription, 
  updateSubscriptionTier, 
  checkAndResetDailyLimit,
  incrementPredictionUsage,
  createPrediction,
  getUserPredictions,
  getUserPredictionHistory,
  getUserFeedbackStats,
} from "./db";
import { invokeLLM } from "./_core/llm";
import { TRPCError } from "@trpc/server";
import { storagePut } from "./storage";
import { nanoid } from "nanoid";
import { stripe } from "./_core/stripe";
import { STRIPE_PRODUCTS } from "./products";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  subscription: router({
    getCurrent: protectedProcedure.query(async ({ ctx }) => {
      const subscription = await checkAndResetDailyLimit(ctx.user.id);
      return subscription;
    }),

    upgrade: protectedProcedure
      .input(z.object({
        tier: z.enum(["free", "pro", "premium"]),
      }))
      .mutation(async ({ ctx, input }) => {
        const updated = await updateSubscriptionTier(ctx.user.id, input.tier);
        return updated;
      }),
    
    createCheckoutSession: protectedProcedure
      .input(z.object({
        tier: z.enum(["pro", "premium"]),
        interval: z.enum(["month", "year"]).default("month"),
      }))
      .mutation(async ({ ctx, input }) => {
        const origin = ctx.req.headers.origin || "http://localhost:3000";
        const product = STRIPE_PRODUCTS[input.tier];
        
        // Create Stripe checkout session
        const session = await stripe.checkout.sessions.create({
          mode: "subscription",
          customer_email: ctx.user.email || undefined,
          client_reference_id: ctx.user.id.toString(),
          metadata: {
            user_id: ctx.user.id.toString(),
            customer_email: ctx.user.email || "",
            customer_name: ctx.user.name || "",
            tier: input.tier,
          },
          line_items: [
            {
              price_data: {
                currency: "usd",
                product_data: {
                  name: product.name,
                  description: product.description,
                },
                unit_amount: input.interval === "month" ? product.priceMonthly : product.priceYearly,
                recurring: {
                  interval: input.interval,
                },
              },
              quantity: 1,
            },
          ],
          success_url: `${origin}/dashboard?payment=success`,
          cancel_url: `${origin}/dashboard?payment=cancelled`,
          allow_promotion_codes: true,
        });
        
        return {
          checkoutUrl: session.url,
        };
      }),
  }),

  prediction: router({
    generate: protectedProcedure
      .input(z.object({
        userInput: z.string().min(1).max(1000),
        category: z.enum(["career", "love", "finance", "health", "general"]).optional(),
        attachmentUrls: z.array(z.string()).optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        // Check subscription limits
        const subscription = await checkAndResetDailyLimit(ctx.user.id);
        
        // For free tier, check total lifetime limit
        if (subscription.tier === "free") {
          if (subscription.totalUsed >= 3) {
            throw new TRPCError({
              code: "FORBIDDEN",
              message: `You've reached your free tier limit of 3 predictions. Upgrade to Pro or Premium for unlimited predictions!`,
            });
          }
        } else {
          // For paid tiers, check daily limit
          if (subscription.usedToday >= subscription.dailyLimit) {
            throw new TRPCError({
              code: "FORBIDDEN",
              message: `Daily prediction limit reached (${subscription.dailyLimit}). Try again tomorrow or upgrade for higher limits.`,
            });
          }
        }

        // Get user's prediction history and feedback stats for personalization
        const userHistory = await getUserPredictionHistory(ctx.user.id, 5);
        const feedbackStats = await getUserFeedbackStats(ctx.user.id);
        
        // Build personalized system prompt based on user preferences
        let systemPrompt = `You are an AI fortune teller and prediction specialist. Generate insightful, personalized predictions based on user input. Be creative, positive, and specific. Keep predictions between 100-300 words. If files are provided, analyze them for additional context.`;
        
        // Add personalization based on user history
        if (userHistory.length > 0) {
          systemPrompt += `\n\n**Personalization Context:**\nThis user has received ${feedbackStats.total} predictions previously.`;
          
          if (feedbackStats.liked > 0) {
            systemPrompt += ` They particularly enjoyed predictions about: ${feedbackStats.likedCategories.slice(0, 3).join(", ") || "various topics"}.`;
            systemPrompt += ` Adjust your tone and style to match what resonated with them before - be more ${feedbackStats.liked > feedbackStats.disliked ? "optimistic and encouraging" : "balanced and realistic"}.`;
          }
          
          // Include recent prediction context for continuity
          const recentPredictions = userHistory.slice(0, 2).map(p => 
            `- ${p.category}: "${p.userInput.substring(0, 100)}..." (${p.userFeedback ? `User ${p.userFeedback}d this` : "No feedback yet"})`
          ).join("\n");
          
          if (recentPredictions) {
            systemPrompt += `\n\n**Recent Predictions for Context:**\n${recentPredictions}\n\nBuild on these themes and show progression or new insights related to their journey.`;
          }
        }
        
        // Build user message with text and file attachments
        type MessageContent = 
          | { type: "text"; text: string } 
          | { type: "image_url"; image_url: { url: string } } 
          | { type: "file_url"; file_url: { url: string; mime_type?: "application/pdf" | "audio/mpeg" | "audio/wav" | "audio/mp4" | "video/mp4" } };
        const userMessageContent: MessageContent[] = [];
        
        // Add text prompt
        const textPrompt = input.category 
          ? `Generate a ${input.category} prediction for: ${input.userInput}`
          : `Generate a prediction for: ${input.userInput}`;
        userMessageContent.push({ type: "text", text: textPrompt });
        
        // Add file attachments if present
        if (input.attachmentUrls && input.attachmentUrls.length > 0) {
          for (const url of input.attachmentUrls) {
            // Determine if it's an image or other file type
            const isImage = url.match(/\.(jpg|jpeg|png|gif|webp)$/i);
            if (isImage) {
              userMessageContent.push({ 
                type: "image_url", 
                image_url: { url } 
              });
            } else {
              // For PDFs and other documents
              userMessageContent.push({ 
                type: "file_url", 
                file_url: { url, mime_type: "application/pdf" as const } 
              });
            }
          }
        }

        const response = await invokeLLM({
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userMessageContent },
          ],
        });

        const messageContent = response.choices[0]?.message?.content;
        const predictionResult = typeof messageContent === 'string' 
          ? messageContent 
          : "Unable to generate prediction at this time.";

        // Save prediction to database and get the ID
        const newPrediction = await createPrediction({
          userId: ctx.user.id,
          userInput: input.userInput,
          predictionResult,
          category: input.category || "general",
          attachmentUrls: input.attachmentUrls ? JSON.stringify(input.attachmentUrls) : null,
        });

        // Increment usage counter
        await incrementPredictionUsage(ctx.user.id);

        return {
          prediction: predictionResult,
          predictionId: newPrediction.id,
          remainingToday: subscription.dailyLimit - subscription.usedToday - 1,
        };
      }),

    getHistory: protectedProcedure
      .input(z.object({
        limit: z.number().min(1).max(100).optional(),
      }))
      .query(async ({ ctx, input }) => {
        const history = await getUserPredictions(ctx.user.id, input.limit || 50);
        return history;
      }),

    uploadFile: protectedProcedure
      .input(z.object({
        fileName: z.string(),
        fileData: z.string(), // base64 encoded
        mimeType: z.string(),
      }))
      .mutation(async ({ ctx, input }) => {
        // Convert base64 to buffer
        const buffer = Buffer.from(input.fileData, 'base64');
        
        // Generate unique file key
        const fileExtension = input.fileName.split('.').pop() || 'file';
        const fileKey = `predictions/${ctx.user.id}/${nanoid()}.${fileExtension}`;
        
        // Upload to S3
        const { url } = await storagePut(fileKey, buffer, input.mimeType);
        
        return { url, fileName: input.fileName };
      }),
    
    submitFeedback: protectedProcedure
      .input(z.object({
        predictionId: z.number(),
        feedback: z.enum(["like", "dislike"]),
      }))
      .mutation(async ({ ctx, input }) => {
        // Update prediction with user feedback
        const { updatePredictionFeedback } = await import("./db");
        await updatePredictionFeedback(input.predictionId, ctx.user.id, input.feedback);
        
        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;
