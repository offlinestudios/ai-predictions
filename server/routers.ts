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
  getDb,
} from "./db";
import { predictions } from "../drizzle/schema";
import { eq, desc, like, or, isNull, sql, and } from "drizzle-orm";
import { invokeLLM } from "./_core/llm";
import { TRPCError } from "@trpc/server";
import { storagePut } from "./storage";
import { nanoid } from "nanoid";
import { stripe } from "./_core/stripe";
import { STRIPE_PRODUCTS } from "./products";
import { sendWelcomeEmail } from "./email";

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
    
    createPortalSession: protectedProcedure
      .mutation(async ({ ctx }) => {
        const origin = ctx.req.headers.origin || "http://localhost:3000";
        
        // Get or create Stripe customer for this user
        // First, try to find existing customer by email
        let customerId: string | undefined;
        
        if (ctx.user.email) {
          const customers = await stripe.customers.list({
            email: ctx.user.email,
            limit: 1,
          });
          
          if (customers.data.length > 0) {
            customerId = customers.data[0].id;
          }
        }
        
        // If no customer found, create one
        if (!customerId) {
          const customer = await stripe.customers.create({
            email: ctx.user.email || undefined,
            name: ctx.user.name || undefined,
            metadata: {
              user_id: ctx.user.id.toString(),
            },
          });
          customerId = customer.id;
        }
        
        // Create Customer Portal session
        const session = await stripe.billingPortal.sessions.create({
          customer: customerId,
          return_url: `${origin}/account`,
        });
        
        return {
          portalUrl: session.url,
        };
      }),
  }),

  prediction: router({
    generate: protectedProcedure
      .input(z.object({
        userInput: z.string().min(1).max(1000),
        category: z.enum(["career", "love", "finance", "health", "general"]).optional(),
        attachmentUrls: z.array(z.string()).optional(),
        deepMode: z.boolean().optional().default(false),
      }))
      .mutation(async ({ ctx, input }) => {
        // Check subscription limits
        const subscription = await checkAndResetDailyLimit(ctx.user.id);
        
        // Check if user has access to deep mode (Pro/Premium only)
        if (input.deepMode && !['pro', 'premium'].includes(subscription.tier)) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "Deep Prediction Mode is only available for Pro and Premium users. Upgrade to unlock advanced AI analysis!",
          });
        }
        
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
        
        // Build personalized system prompt based on user preferences and mode
        let systemPrompt = input.deepMode
          ? `You are an advanced AI oracle and prediction specialist with deep analytical capabilities. Generate comprehensive, highly detailed predictions with multi-layered insights.

**Deep Analysis Requirements:**
- Provide 400-600 words of detailed analysis
- Include specific timeframes and milestones
- Analyze multiple possible outcomes with probability assessments
- Consider psychological, practical, and external factors
- Offer actionable steps and warning signs
- Structure your response with clear sections: Overview, Key Insights, Timeline, Recommendations, and Confidence Assessment
- Be specific with dates, percentages, and concrete details
- If files are provided, perform thorough analysis and reference specific details

**Confidence Score:** At the end, provide a confidence score (0-100) based on the clarity of the question, available context, and prediction complexity. Format: "Confidence: XX%"`
          : `You are an AI fortune teller and prediction specialist. Generate insightful, personalized predictions based on user input. Be creative, positive, and specific. Keep predictions between 100-300 words. If files are provided, analyze them for additional context.`;
        
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
        let predictionResult = typeof messageContent === 'string' 
          ? messageContent 
          : "Unable to generate prediction at this time.";
        
        // Extract confidence score if present (for deep mode)
        let confidenceScore: number | null = null;
        if (input.deepMode && typeof predictionResult === 'string') {
          const confidenceMatch = predictionResult.match(/Confidence:\s*(\d+)%/i);
          if (confidenceMatch) {
            confidenceScore = parseInt(confidenceMatch[1], 10);
            // Remove the confidence line from the displayed result
            predictionResult = predictionResult.replace(/\n?Confidence:\s*\d+%/i, '').trim();
          }
        }

        // Save prediction to database and get the ID
        const newPrediction = await createPrediction({
          userId: ctx.user.id,
          userInput: input.userInput,
          predictionResult,
          category: input.category || "general",
          attachmentUrls: input.attachmentUrls ? JSON.stringify(input.attachmentUrls) : null,
          predictionMode: input.deepMode ? 'deep' : 'standard',
          confidenceScore,
        });

        // Increment usage counter
        await incrementPredictionUsage(ctx.user.id);
        
        // Send welcome email on first prediction
        if (subscription.totalUsed === 0) {
          const userName = ctx.user.name || "there";
          const userEmail = ctx.user.email || "";
          if (userEmail) {
            await sendWelcomeEmail(userEmail, userName);
            console.log(`[Email] Sent welcome email to ${userEmail}`);
          }
        }

        return {
          prediction: predictionResult,
          predictionId: newPrediction.id,
          shareToken: newPrediction.shareToken!,
          remainingToday: subscription.dailyLimit - subscription.usedToday - 1,
          confidenceScore,
          deepMode: input.deepMode,
        };
      }),

    getHistory: protectedProcedure
      .input(z.object({
        limit: z.number().min(1).max(100).optional(),
        offset: z.number().min(0).optional(),
        category: z.enum(["career", "love", "finance", "health", "general", "all"]).optional(),
        search: z.string().optional(),
        feedback: z.enum(["like", "dislike", "none", "all"]).optional(),
      }))
      .query(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
        
        // Build where conditions
        const conditions: any[] = [eq(predictions.userId, ctx.user.id)];
        
        // Apply category filter
        if (input.category && input.category !== "all") {
          conditions.push(eq(predictions.category, input.category));
        }
        
        // Apply feedback filter
        if (input.feedback && input.feedback !== "all") {
          if (input.feedback === "none") {
            conditions.push(isNull(predictions.userFeedback));
          } else {
            conditions.push(eq(predictions.userFeedback, input.feedback));
          }
        }
        
        // Apply search filter (search in userInput and predictionResult)
        if (input.search && input.search.trim()) {
          const searchTerm = `%${input.search.trim()}%`;
          conditions.push(
            or(
              like(predictions.userInput, searchTerm),
              like(predictions.predictionResult, searchTerm)
            )!
          );
        }
        
        // Apply pagination
        const limit = input.limit || 20;
        const offset = input.offset || 0;
        
        const history = await db.select()
          .from(predictions)
          .where(and(...conditions))
          .orderBy(desc(predictions.createdAt))
          .limit(limit)
          .offset(offset);
        
        // Get total count for pagination
        const countConditions: any[] = [eq(predictions.userId, ctx.user.id)];
        
        if (input.category && input.category !== "all") {
          countConditions.push(eq(predictions.category, input.category));
        }
        
        if (input.feedback && input.feedback !== "all") {
          if (input.feedback === "none") {
            countConditions.push(isNull(predictions.userFeedback));
          } else {
            countConditions.push(eq(predictions.userFeedback, input.feedback));
          }
        }
        
        if (input.search && input.search.trim()) {
          const searchTerm = `%${input.search.trim()}%`;
          countConditions.push(
            or(
              like(predictions.userInput, searchTerm),
              like(predictions.predictionResult, searchTerm)
            )!
          );
        }
        
        const totalResult = await db.select({ count: sql<number>`count(*)` })
          .from(predictions)
          .where(and(...countConditions));
        
        const total = Number(totalResult[0]?.count || 0);
        
        return {
          predictions: history,
          total,
          hasMore: offset + history.length < total,
        };
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
    
    getSharedPrediction: publicProcedure
      .input(z.object({
        shareToken: z.string(),
      }))
      .query(async ({ input }) => {
        const { getPredictionByShareToken } = await import("./db");
        const prediction = await getPredictionByShareToken(input.shareToken);
        
        if (!prediction) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Prediction not found",
          });
        }
        
        return prediction;
      }),
    
    generateAnonymous: publicProcedure
      .input(z.object({
        userInput: z.string().min(1).max(1000),
        category: z.enum(["career", "love", "finance", "health", "general"]).optional(),
      }))
      .mutation(async ({ input }) => {
        // Generate prediction without authentication
        // Simple system prompt for anonymous users
        const systemPrompt = `You are an AI fortune teller and prediction specialist. Generate insightful, personalized predictions based on user input. Be creative, positive, and specific. Keep predictions between 100-200 words.`;
        
        const textPrompt = input.category 
          ? `Generate a ${input.category} prediction for: ${input.userInput}`
          : `Generate a prediction for: ${input.userInput}`;

        const response = await invokeLLM({
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: textPrompt },
          ],
        });

        const messageContent = response.choices[0]?.message?.content;
        const predictionResult = typeof messageContent === 'string' 
          ? messageContent 
          : "Unable to generate prediction at this time.";

        return {
          prediction: predictionResult,
          category: input.category || "general",
        };
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
