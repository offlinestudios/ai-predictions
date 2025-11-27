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
        const systemPrompt = `You are an AI fortune teller and prediction specialist. Generate insightful, personalized predictions based on user input. Be creative, positive, and specific. Keep predictions between 100-300 words.`;
        
        const userPrompt = input.category 
          ? `Generate a ${input.category} prediction for: ${input.userInput}`
          : `Generate a prediction for: ${input.userInput}`;

        const response = await invokeLLM({
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
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
  }),
});

export type AppRouter = typeof appRouter;
