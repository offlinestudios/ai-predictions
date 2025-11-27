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
} from "./db";
import { invokeLLM } from "./_core/llm";
import { TRPCError } from "@trpc/server";
import { storagePut } from "./storage";
import { nanoid } from "nanoid";

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
        
        if (subscription.usedToday >= subscription.dailyLimit) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: `Daily prediction limit reached (${subscription.dailyLimit}). Upgrade your subscription for more predictions.`,
          });
        }

        // Generate AI prediction
        const systemPrompt = `You are an AI fortune teller and prediction specialist. Generate insightful, personalized predictions based on user input. Be creative, positive, and specific. Keep predictions between 100-300 words. If files are provided, analyze them for additional context.`;
        
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

        // Save prediction to database
        await createPrediction({
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
  }),
});

export type AppRouter = typeof appRouter;
