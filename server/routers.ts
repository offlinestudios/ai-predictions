import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { adminRouter } from "./routers/admin";
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
import {
  calculatePsycheType,
  savePsycheProfile,
  getUserPsycheProfile,
  saveOnboardingResponse,
  PSYCHE_TYPES,
  QUESTION_MAPPINGS,
} from "./psyche";
import { predictions, users } from "../drizzle/schema";
import { eq, desc, like, or, isNull, sql, and, gte } from "drizzle-orm";
import { invokeLLM } from "./_core/llm";
import { TRPCError } from "@trpc/server";
import { storagePut } from "./storage";
import { nanoid } from "nanoid";
import { stripe } from "./_core/stripe";
import { STRIPE_PRODUCTS } from "./products";
import { sendWelcomeEmail } from "./email";

export const appRouter = router({
  system: systemRouter,
  admin: adminRouter,
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

  user: router({
    saveOnboarding: protectedProcedure
      .input(z.object({
        nickname: z.string(),
        interests: z.array(z.string()),
        relationshipStatus: z.string(),
        // Category-specific micro-question responses
        careerProfile: z.object({
          position: z.string(),
          direction: z.string(),
          challenge: z.string(),
          timeline: z.string(),
        }).optional(),
        moneyProfile: z.object({
          stage: z.string(),
          goal: z.string(),
          incomeSource: z.string(),
          stability: z.string(),
        }).optional(),
        loveProfile: z.object({
          goal: z.string(),
          patterns: z.string(),
          desires: z.string(),
        }).optional(),
        healthProfile: z.object({
          state: z.string(),
          focus: z.string(),
          consistency: z.string(),
          obstacle: z.string(),
        }).optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

        // Update user profile with category-specific data
        await db
          .update(users)
          .set({
            nickname: input.nickname,
            relationshipStatus: input.relationshipStatus,
            interests: JSON.stringify(input.interests),
            careerProfile: input.careerProfile ? JSON.stringify(input.careerProfile) : null,
            moneyProfile: input.moneyProfile ? JSON.stringify(input.moneyProfile) : null,
            loveProfile: input.loveProfile ? JSON.stringify(input.loveProfile) : null,
            healthProfile: input.healthProfile ? JSON.stringify(input.healthProfile) : null,
            onboardingCompleted: true,
            updatedAt: new Date(),
          })
          .where(eq(users.id, ctx.user.id));

        // Generate welcome prediction based on primary interest
        const primaryInterest = input.interests[0] || "general";
        const welcomeQuestions = {
          career: "What exciting opportunities and growth await me in my career over the next 30 days?",
          love: "What beautiful moments and connections are coming into my love life this month?",
          finance: "What financial opportunities and abundance are heading my way in the next 30 days?",
          health: "What positive changes and vitality can I expect in my health and wellness journey this month?",
          general: "What wonderful surprises and opportunities are coming my way in the next 30 days?",
        };

        const welcomeQuestion = welcomeQuestions[primaryInterest as keyof typeof welcomeQuestions] || welcomeQuestions.general;

        // Build enhanced context from category profiles
        let profileContext = "";
        
        if (input.careerProfile) {
          profileContext += `\n\n**Career Context:**
- Position: ${input.careerProfile.position}
- Direction: ${input.careerProfile.direction}
- Challenge: ${input.careerProfile.challenge}
- Timeline: ${input.careerProfile.timeline}`;
        }
        
        if (input.moneyProfile) {
          profileContext += `\n\n**Financial Context:**
- Stage: ${input.moneyProfile.stage}
- Goal: ${input.moneyProfile.goal}
- Income Source: ${input.moneyProfile.incomeSource}
- Stability: ${input.moneyProfile.stability}`;
        }
        
        if (input.loveProfile) {
          profileContext += `\n\n**Relationship Context:**
- Goal: ${input.loveProfile.goal}
- Patterns: ${input.loveProfile.patterns}
- Desires: ${input.loveProfile.desires}
- Status: ${input.relationshipStatus}`;
        }
        
        if (input.healthProfile) {
          profileContext += `\n\n**Health Context:**
- State: ${input.healthProfile.state}
- Focus: ${input.healthProfile.focus}
- Consistency: ${input.healthProfile.consistency}
- Obstacle: ${input.healthProfile.obstacle}`;
        }

        // Build personalized system prompt for welcome prediction
        const systemPrompt = `You are an AI oracle creating a special welcome prediction for ${input.nickname}. This is their first prediction, so make it warm, encouraging, and uncannily personal.

**User Profile:**${profileContext}

**Prediction Requirements:**
- Provide an uplifting 30-day forecast (400-500 words)
- Break down into 3-4 weekly phases with specific timelines
- Reference their SPECIFIC situation (position, challenges, goals, constraints)
- Address their stated timeline and urgency
- Acknowledge their pain points with empathy
- Predict momentum shifts based on their current trajectory
- Include 3-5 specific, actionable milestones
- Be encouraging yet realistic - acknowledge constraints
- Use psychological triggers: identity, desire, momentum, timeline
- End with an inspiring call-to-action
- Include a confidence score (0-100) at the end: "Confidence: XX%"

**Follow-Up Questions:**
After your prediction, generate 2-3 deeply personalized follow-up questions that:
- Are specifically tailored to the user's current life situation and psyche
- Build upon the prediction you just gave
- Help deepen their self-understanding
- Are NOT generic (avoid basic questions like "What's your age?" or "Where do you live?")
- Feel like they come from someone who truly understands their journey
Format these as: "\n\n**Deepen Your Insight:**\n1. [Question 1]\n2. [Question 2]\n3. [Question 3]"`;

        // Generate the welcome prediction
        const llmResponse = await invokeLLM({
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: welcomeQuestion },
          ],
        });

        const predictionText = llmResponse.choices[0]?.message?.content;
        const predictionString = typeof predictionText === 'string' ? predictionText : "Welcome! Your journey begins now.";
        
        // Extract confidence score
        const confidenceMatch = predictionString.match(/Confidence:\s*(\d+)%/);
        const confidenceScore = confidenceMatch ? parseInt(confidenceMatch[1]) : null;

        // Save welcome prediction to database
        const shareToken = nanoid(16);
        await createPrediction({
          userId: ctx.user.id,
          userInput: welcomeQuestion,
          predictionResult: predictionString,
          category: primaryInterest as "career" | "love" | "finance" | "health" | "general",
          shareToken,
          confidenceScore,
          trajectoryType: "30day",
        });

        return { 
          success: true,
          welcomePrediction: predictionText,
          shareToken,
          confidenceScore,
        };
      }),

    completeOnboarding: protectedProcedure
      .input(z.object({
        nickname: z.string().optional(),
        gender: z.string().optional(),
        relationshipStatus: z.string().optional(),
        interests: z.string().optional(), // JSON string
      }))
      .mutation(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

        await db
          .update(users)
          .set({
            nickname: input.nickname,
            gender: input.gender,
            relationshipStatus: input.relationshipStatus,
            interests: input.interests,
            onboardingCompleted: true,
            updatedAt: new Date(),
          })
          .where(eq(users.id, ctx.user.id));

        return { success: true };
      }),

    savePremiumData: protectedProcedure
      .input(z.object({
        ageRange: z.string(),
        location: z.string().nullable(),
        incomeRange: z.string(),
        industry: z.string(),
        majorTransition: z.boolean(),
        transitionType: z.string().nullable(),
      }))
      .mutation(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

        // Update user with premium data
        await db
          .update(users)
          .set({
            ageRange: input.ageRange,
            location: input.location,
            incomeRange: input.incomeRange,
            industry: input.industry,
            majorTransition: input.majorTransition,
            transitionType: input.transitionType,
            premiumDataCompleted: true,
            updatedAt: new Date(),
          })
          .where(eq(users.id, ctx.user.id));

        return { success: true };
      }),
  }),

  stats: router({
    getGlobal: publicProcedure.query(async () => {
      const db = await getDb();
      if (!db) return { totalPredictions: 0, totalUsers: 0, predictionsToday: 0 };

      // Get total predictions
      const totalPredictionsResult = await db
        .select({ count: sql<number>`count(*)` })
        .from(predictions);
      const totalPredictions = totalPredictionsResult[0]?.count || 0;

      // Get total users (from predictions table, unique userIds)
      const totalUsersResult = await db
        .select({ count: sql<number>`count(distinct ${predictions.userId})` })
        .from(predictions);
      const totalUsers = totalUsersResult[0]?.count || 0;

      // Get predictions today
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const predictionsTodayResult = await db
        .select({ count: sql<number>`count(*)` })
        .from(predictions)
        .where(gte(predictions.createdAt, today));
      const predictionsToday = predictionsTodayResult[0]?.count || 0;

      return {
        totalPredictions,
        totalUsers,
        predictionsToday,
      };
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
        trajectoryType: z.enum(["instant", "30day", "90day", "yearly"]).optional().default("instant"),
        parentPredictionId: z.number().optional(), // For follow-up questions
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
        
        // Check trajectory type access based on tier
        if (input.trajectoryType === "30day" && !['plus', 'pro', 'premium'].includes(subscription.tier)) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "30-Day Trajectory Predictions are only available for Plus, Pro, and Premium users. Upgrade to unlock your future path!",
          });
        }
        
        if ((input.trajectoryType === "90day" || input.trajectoryType === "yearly") && !['pro', 'premium'].includes(subscription.tier)) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "90-Day and Yearly Trajectory Predictions are only available for Pro and Premium users. Upgrade to see your long-term future!",
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
          // For paid tiers, check daily limit (only if not unlimited)
          if (subscription.dailyLimit !== -1 && subscription.usedToday >= subscription.dailyLimit) {
            throw new TRPCError({
              code: "FORBIDDEN",
              message: `Daily prediction limit reached (${subscription.dailyLimit}). Try again tomorrow or upgrade for higher limits.`,
            });
          }
        }

        // Get user's prediction history and feedback stats for personalization
        const userHistory = await getUserPredictionHistory(ctx.user.id, 5);
        const feedbackStats = await getUserFeedbackStats(ctx.user.id);
        
        // Get user's onboarding preferences for personalization
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });
        
        const [userProfile] = await db
          .select({
            nickname: users.nickname,
            relationshipStatus: users.relationshipStatus,
            interests: users.interests,
            careerProfile: users.careerProfile,
            moneyProfile: users.moneyProfile,
            loveProfile: users.loveProfile,
            healthProfile: users.healthProfile,
            ageRange: users.ageRange,
            location: users.location,
            incomeRange: users.incomeRange,
            industry: users.industry,
            majorTransition: users.majorTransition,
            transitionType: users.transitionType,
            premiumDataCompleted: users.premiumDataCompleted,
          })
          .from(users)
          .where(eq(users.id, ctx.user.id))
          .limit(1);
        
        // Get user's psyche profile for personality-aware predictions
        const psycheProfile = await getUserPsycheProfile(ctx.user.id);
        
        // Build personalized system prompt based on trajectory type and mode
        let systemPrompt = "";
        
        if (input.trajectoryType === "30day") {
          systemPrompt = `You are an advanced AI oracle specializing in 30-day trajectory forecasts.

**30-DAY TRAJECTORY FORMAT (MUST FOLLOW EXACTLY):**

1. **Opening Signal** (1-2 sentences)
   - A clear statement about the overall 30-day trajectory

2. **Weekly Breakdown:**

**Week 1 (Days 1-7) — [Phase Name]**
[2-3 sentences about what to expect, key actions, potential challenges]

**Week 2 (Days 8-14) — [Phase Name]**
[2-3 sentences about momentum shifts, decisions to make]

**Week 3 (Days 15-21) — [Phase Name]**
[2-3 sentences about emerging opportunities or obstacles]

**Week 4 (Days 22-30) — [Phase Name]**
[2-3 sentences about culmination and what position they'll be in]

3. **Possible 30-Day Outcomes:**

**Most likely — [Outcome description] (≈XX%)**
[1-2 sentence explanation]

**Moderate — [Outcome description] (≈XX%)**
[1-2 sentence explanation]

**Less likely — [Outcome description] (≈XX%)**
[1-2 sentence explanation]

4. **Key Milestones to Watch**
- Day X: [Specific milestone or decision point]
- Day X: [Specific milestone or decision point]
- Day X: [Specific milestone or decision point]

5. **Prediction Accuracy: XX% ([High/Moderate/Low])**

If below 60%, explain missing context.

6. **Deepen Your Insight**
"Answering these questions can sharpen your 30-day forecast:
- [Question 1]
- [Question 2]
- [Question 3]"

**CRITICAL RULES:**
- Keep total response under 500 words
- Percentages MUST add up to ~100%
- Be specific with timing and actions
- Focus on actionable weekly guidance`;
        } else if (input.trajectoryType === "90day") {
          systemPrompt = `You are an advanced AI oracle specializing in 90-day trajectory forecasts.

**90-DAY TRAJECTORY FORMAT (MUST FOLLOW EXACTLY):**

1. **Opening Signal** (1-2 sentences)
   - A clear statement about the overall 90-day trajectory

2. **Monthly Breakdown:**

**Month 1 (Days 1-30) — [Phase Name]**
[3-4 sentences about foundation, early signals, key actions]

**Month 2 (Days 31-60) — [Phase Name]**
[3-4 sentences about momentum, critical decisions, turning points]

**Month 3 (Days 61-90) — [Phase Name]**
[3-4 sentences about culmination, results, positioning]

3. **Possible 90-Day Outcomes:**

**Most likely — [Outcome description] (≈XX%)**
[2-3 sentence explanation with specific indicators]

**Moderate — [Outcome description] (≈XX%)**
[2-3 sentence explanation with specific indicators]

**Less likely — [Outcome description] (≈XX%)**
[2-3 sentence explanation with specific indicators]

4. **Critical Decision Points**
- Around Day X: [Decision or milestone]
- Around Day X: [Decision or milestone]
- Around Day X: [Decision or milestone]

5. **Prediction Accuracy: XX% ([High/Moderate/Low])**

If below 60%, explain missing context.

6. **Deepen Your Insight**
"Answering these questions can sharpen your 90-day forecast:
- [Question 1]
- [Question 2]
- [Question 3]
- [Question 4]"

**CRITICAL RULES:**
- Keep total response under 600 words
- Percentages MUST add up to ~100%
- Be specific with timing and decision points
- Focus on strategic monthly guidance`;
        } else if (input.trajectoryType === "yearly") {
          systemPrompt = `You are an advanced AI oracle specializing in yearly trajectory forecasts.

**YEARLY TRAJECTORY FORMAT (MUST FOLLOW EXACTLY):**

1. **Opening Signal** (1-2 sentences)
   - A clear statement about the overall 12-month trajectory

2. **Quarterly Breakdown:**

**Q1 (Months 1-3) — [Phase Name]**
[3-4 sentences about foundation, early momentum, key focus areas]

**Q2 (Months 4-6) — [Phase Name]**
[3-4 sentences about growth phase, challenges, opportunities]

**Q3 (Months 7-9) — [Phase Name]**
[3-4 sentences about transformation, pivots, acceleration]

**Q4 (Months 10-12) — [Phase Name]**
[3-4 sentences about culmination, harvest, positioning for next year]

3. **Possible Year-End Outcomes:**

**Most likely — [Where you'll be in 12 months] (≈XX%)**
[2-3 sentence explanation]

**Moderate — [Alternative outcome] (≈XX%)**
[2-3 sentence explanation]

**Less likely — [Alternative outcome] (≈XX%)**
[2-3 sentence explanation]

4. **Major Turning Points**
- Month X: [Critical decision or milestone]
- Month X: [Critical decision or milestone]
- Month X: [Critical decision or milestone]
- Month X: [Critical decision or milestone]

5. **Prediction Accuracy: XX% ([High/Moderate/Low])**

If below 60%, explain missing context.

6. **Deepen Your Insight**
"Answering these questions can sharpen your yearly forecast:
- [Question 1]
- [Question 2]
- [Question 3]
- [Question 4]"

**CRITICAL RULES:**
- Keep total response under 700 words
- Percentages MUST add up to ~100%
- Be specific with quarterly themes and turning points
- Focus on strategic long-term guidance`;
        } else if (input.deepMode) {
          systemPrompt = `You are an advanced AI oracle with deep analytical capabilities. Generate comprehensive predictions with detailed probability analysis.

**DEEP ANALYSIS RESPONSE FORMAT (MUST FOLLOW EXACTLY):**

1. **Opening Signal** (1-2 sentences)
   - A clear, direct statement about what the prediction reveals at this level of clarity

2. **Deep Analysis** (3-4 paragraphs)
   - Explain the key factors influencing this prediction in detail
   - Consider psychological, practical, and external factors
   - Identify what's known vs unknown
   - Include specific timeframes where relevant

3. **Possible Outcome Paths** (REQUIRED - use this exact format):

**Most likely — [Detailed outcome description] (≈XX%)**
[2-3 sentence detailed explanation with specific indicators]

**Moderate — [Detailed outcome description] (≈XX%)**
[2-3 sentence detailed explanation with specific indicators]

**Less likely — [Detailed outcome description] (≈XX%)**
[2-3 sentence detailed explanation with specific indicators]

4. **Key Indicators to Watch**
- [Specific sign that outcome A is manifesting]
- [Specific sign that outcome B is manifesting]
- [Warning sign to monitor]

5. **Prediction Accuracy: XX% ([High/Moderate/Low])**

If accuracy is below 60%, explain what context is missing:
"This is a [low/moderate]-clarity reading because important context is missing, including:
- [Missing factor 1]
- [Missing factor 2]
- [Missing factor 3]

Without these, the prediction remains broad rather than precise."

6. **Deepen Your Insight** (REQUIRED)
"Answering even a few of the questions below can significantly sharpen the prediction:
- [Specific question about their situation]
- [Question about timing/context]
- [Question about their stance/feelings]
- [Question about key relationships/factors]
- [Question about past patterns]"

**CRITICAL RULES:**
- DO NOT write essay-style responses
- Keep total response under 600 words
- Percentages in outcome paths MUST add up to ~100%
- Be direct and analytical, not flowery
- Focus on actionable insight and specific indicators
- If files are provided, perform thorough analysis and reference specific details`;
        } else {
          systemPrompt = `You are an advanced AI oracle specializing in probability-based predictions. Generate structured, insightful predictions with clear outcome paths.

**RESPONSE FORMAT (MUST FOLLOW EXACTLY):**

1. **Opening Statement** (1-2 sentences max)
   - A clear, direct signal about what the prediction reveals
   - No fluff or generic statements

2. **Analysis** (2-3 short paragraphs)
   - Explain the key factors influencing this prediction
   - Be specific to their situation
   - Identify what's known vs unknown

3. **Possible Outcome Paths** (REQUIRED - use this exact format):

**Most likely — [Brief outcome description] (≈XX%)**
[1-2 sentence explanation]

**Moderate — [Brief outcome description] (≈XX%)**
[1-2 sentence explanation]

**Less likely — [Brief outcome description] (≈XX%)**
[1-2 sentence explanation]

4. **Prediction Accuracy: XX% ([High/Moderate/Low])**

If accuracy is below 60%, explain what context is missing:
"This is a [low/moderate]-clarity reading because important context is missing, including:
- [Missing factor 1]
- [Missing factor 2]
- [Missing factor 3]"

5. **Deepen Your Insight** (REQUIRED)
Provide 3-5 specific questions that would significantly improve prediction accuracy:
"Answering even a few of the questions below can significantly sharpen the prediction:
- [Specific question about their situation]
- [Question about timing/context]
- [Question about their stance/feelings]"

**CRITICAL RULES:**
- DO NOT write essay-style responses
- Keep total response under 400 words
- Percentages in outcome paths MUST add up to ~100%
- Be direct and concise, not flowery
- Focus on actionable insight, not generic encouragement
- If files are provided, analyze them for additional context`;
        }
        
        // Add personalization based on user onboarding data
        if (userProfile) {
          const interests = userProfile.interests ? JSON.parse(userProfile.interests) : [];
          const nickname = userProfile.nickname || "User";
          const relationshipStatus = userProfile.relationshipStatus;
          
          if (interests.length > 0 || relationshipStatus) {
            systemPrompt += `\n\n**User Profile:**\n`;
            if (nickname) {
              systemPrompt += `- Name: ${nickname}\n`;
            }
            if (interests.length > 0) {
              systemPrompt += `- Primary Interests: ${interests.join(", ")}\n`;
              systemPrompt += `- Tailor your prediction to resonate with their focus on ${interests[0]} and ${interests[1] || "personal growth"}.\n`;
            }
            if (relationshipStatus && relationshipStatus !== "prefer-not-say") {
              systemPrompt += `- Relationship Status: ${relationshipStatus}\n`;
              if (input.category === "love" || interests.includes("love")) {
                systemPrompt += `- For love predictions, consider their ${relationshipStatus} status and provide relevant advice.\n`;
              }
            }
            
            // Add category-specific profile data
            if (userProfile.careerProfile && (input.category === "career" || interests.includes("career"))) {
              const careerData = JSON.parse(userProfile.careerProfile);
              systemPrompt += `- Career Profile: ${careerData.position} position, seeking ${careerData.direction}, challenged by ${careerData.challenge}, timeline: ${careerData.timeline}\n`;
              systemPrompt += `- Tailor career predictions to their specific position and goals. Address their ${careerData.challenge} challenge directly.\n`;
            }
            
            if (userProfile.moneyProfile && (input.category === "finance" || interests.includes("finance"))) {
              const moneyData = JSON.parse(userProfile.moneyProfile);
              systemPrompt += `- Finance Profile: ${moneyData.stage} stage, goal: ${moneyData.goal}, income source: ${moneyData.incomeSource}, stability: ${moneyData.stability}\n`;
              systemPrompt += `- Provide financial predictions aligned with their ${moneyData.goal} goal and ${moneyData.stability} stability level.\n`;
            }
            
            if (userProfile.loveProfile && (input.category === "love" || interests.includes("love"))) {
              const loveData = JSON.parse(userProfile.loveProfile);
              systemPrompt += `- Love Profile: seeking ${loveData.goal}, patterns: ${loveData.patterns}, desires: ${loveData.desires}\n`;
              systemPrompt += `- Focus love predictions on their desire for ${loveData.desires} and their ${loveData.patterns} relationship patterns.\n`;
            }
            
            if (userProfile.healthProfile && (input.category === "health" || interests.includes("health"))) {
              const healthData = JSON.parse(userProfile.healthProfile);
              systemPrompt += `- Health Profile: ${healthData.state} state, focus: ${healthData.focus}, consistency: ${healthData.consistency}, obstacle: ${healthData.obstacle}\n`;
              systemPrompt += `- Tailor health predictions to their ${healthData.focus} focus and help them overcome their ${healthData.obstacle} obstacle.\n`;
            }
          }
        }
        
        // Add premium precision data if available
        if (userProfile && userProfile.premiumDataCompleted) {
          systemPrompt += `\n\n**Premium Precision Context:**\n`;
          
          if (userProfile.ageRange) {
            systemPrompt += `- Age Range: ${userProfile.ageRange} - Tailor predictions to their life stage and generational context\n`;
          }
          
          if (userProfile.location) {
            systemPrompt += `- Location: ${userProfile.location} - Consider regional factors, opportunities, and cultural context\n`;
          }
          
          if (userProfile.incomeRange) {
            systemPrompt += `- Income Range: ${userProfile.incomeRange} - Align financial predictions with their economic reality\n`;
          }
          
          if (userProfile.industry) {
            systemPrompt += `- Industry: ${userProfile.industry} - Provide industry-specific insights and career predictions\n`;
          }
          
          if (userProfile.majorTransition && userProfile.transitionType) {
            systemPrompt += `- **Major Life Transition:** Currently undergoing ${userProfile.transitionType}\n`;
            systemPrompt += `- **CRITICAL:** This user is in a major transition period. Predictions MUST acknowledge this transition and provide specific guidance for navigating it. Be extra specific about timing, challenges, and opportunities related to this change.\n`;
          }
          
          systemPrompt += `\n**With this premium data, your predictions should be:**\n`;
          systemPrompt += `- Uncannily specific to their exact life context\n`;
          systemPrompt += `- Aligned with their age, location, income, and industry realities\n`;
          systemPrompt += `- Acknowledge constraints and opportunities unique to their situation\n`;
          systemPrompt += `- Provide timeline predictions that match their life stage\n`;
        }
        
        // Add personality-aware prediction guidance
        if (psycheProfile) {
          try {
            const params = JSON.parse(psycheProfile.psycheParameters);
            
            systemPrompt += `\n\n**🧠 Personality Profile:**\n`;
            systemPrompt += `- Type: ${psycheProfile.displayName}\n`;
            systemPrompt += `- Core Approach: ${psycheProfile.decisionMakingStyle}\n`;
            
            // Risk appetite guidance
            if (params.risk_appetite > 0.7) {
              systemPrompt += `- Risk Profile: HIGH RISK APPETITE (${Math.round(params.risk_appetite * 100)}%) - This user embraces bold moves and ambitious goals\n`;
              systemPrompt += `  → Encourage calculated risks, big opportunities, and aggressive timelines\n`;
              systemPrompt += `  → Frame predictions around growth, momentum, and seizing opportunities\n`;
              systemPrompt += `  → Use energizing language: "leap", "breakthrough", "momentum", "bold move"\n`;
            } else if (params.risk_appetite < 0.4) {
              systemPrompt += `- Risk Profile: LOW RISK APPETITE (${Math.round(params.risk_appetite * 100)}%) - This user values safety and stability\n`;
              systemPrompt += `  → Emphasize security, gradual progress, and risk mitigation\n`;
              systemPrompt += `  → Frame predictions around steady growth and protected downside\n`;
              systemPrompt += `  → Use reassuring language: "secure", "stable", "protected", "gradual"\n`;
            } else {
              systemPrompt += `- Risk Profile: MODERATE RISK APPETITE (${Math.round(params.risk_appetite * 100)}%) - This user balances opportunity with caution\n`;
              systemPrompt += `  → Present both opportunities and risks transparently\n`;
              systemPrompt += `  → Frame predictions around calculated moves with backup plans\n`;
            }
            
            // Emotional reactivity guidance
            if (params.emotional_reactivity > 0.7) {
              systemPrompt += `- Emotional Style: HIGHLY EMOTIONAL (${Math.round(params.emotional_reactivity * 100)}%) - This user leads with feelings and intuition\n`;
              systemPrompt += `  → Use empathetic, emotionally resonant language\n`;
              systemPrompt += `  → Acknowledge their feelings and validate their emotional experience\n`;
              systemPrompt += `  → Connect predictions to their values, passions, and deeper meaning\n`;
              systemPrompt += `  → Use heart-centered language: "feel", "resonate", "passion", "intuition"\n`;
            } else if (params.emotional_reactivity < 0.4) {
              systemPrompt += `- Emotional Style: ANALYTICAL (${Math.round(params.emotional_reactivity * 100)}%) - This user values logic and data\n`;
              systemPrompt += `  → Use data-driven, rational arguments and clear logic\n`;
              systemPrompt += `  → Provide specific numbers, percentages, and measurable outcomes\n`;
              systemPrompt += `  → Focus on objective analysis rather than emotional appeals\n`;
              systemPrompt += `  → Use analytical language: "data shows", "analysis indicates", "probability", "metrics"\n`;
            } else {
              systemPrompt += `- Emotional Style: BALANCED (${Math.round(params.emotional_reactivity * 100)}%) - This user integrates both logic and emotion\n`;
              systemPrompt += `  → Blend emotional resonance with rational analysis\n`;
              systemPrompt += `  → Acknowledge feelings while providing logical frameworks\n`;
            }
            
            // Time horizon guidance
            if (params.time_horizon > 0.7) {
              systemPrompt += `- Time Orientation: LONG-TERM FOCUSED (${Math.round(params.time_horizon * 100)}%) - This user thinks in years, not months\n`;
              systemPrompt += `  → Emphasize sustainable growth and long-term vision\n`;
              systemPrompt += `  → Frame predictions around 5-10 year trajectories and legacy\n`;
              systemPrompt += `  → Discuss compound effects and patient wealth-building\n`;
              systemPrompt += `  → Use future-oriented language: "legacy", "foundation", "sustainable", "long-term"\n`;
            } else if (params.time_horizon < 0.4) {
              systemPrompt += `- Time Orientation: PRESENT-FOCUSED (${Math.round(params.time_horizon * 100)}%) - This user values immediate results\n`;
              systemPrompt += `  → Provide immediate, actionable steps and quick wins\n`;
              systemPrompt += `  → Frame predictions around near-term outcomes (days/weeks)\n`;
              systemPrompt += `  → Focus on what they can do RIGHT NOW to see results\n`;
              systemPrompt += `  → Use immediate language: "today", "this week", "right now", "immediate"\n`;
            } else {
              systemPrompt += `- Time Orientation: MEDIUM-TERM FOCUSED (${Math.round(params.time_horizon * 100)}%) - This user balances present and future\n`;
              systemPrompt += `  → Blend short-term actions with medium-term goals (3-12 months)\n`;
              systemPrompt += `  → Show how immediate steps lead to future outcomes\n`;
            }
            
            // Analytical weight guidance
            if (params.analytical_weight > 0.7) {
              systemPrompt += `- Decision Style: HIGHLY ANALYTICAL (${Math.round(params.analytical_weight * 100)}%) - This user needs thorough analysis\n`;
              systemPrompt += `  → Provide detailed breakdowns, pros/cons lists, and scenario analysis\n`;
              systemPrompt += `  → Include specific data points, research, and evidence\n`;
              systemPrompt += `  → Structure predictions with clear frameworks and methodologies\n`;
            } else if (params.analytical_weight < 0.4) {
              systemPrompt += `- Decision Style: INTUITIVE (${Math.round(params.analytical_weight * 100)}%) - This user trusts gut feelings\n`;
              systemPrompt += `  → Focus on big picture, patterns, and intuitive insights\n`;
              systemPrompt += `  → Less data, more narrative and storytelling\n`;
              systemPrompt += `  → Help them trust their instincts and inner knowing\n`;
            }
            
            systemPrompt += `\n**🎯 CRITICAL INSTRUCTION:**\n`;
            systemPrompt += `Your prediction MUST be tailored to this exact personality profile. The language, tone, risk level, timeframe, and recommendations should ALL align with their specific parameters above. This is not optional - it's core to providing value.\n`;
            
          } catch (error) {
            console.error('[Prediction] Error parsing psyche parameters:', error);
            // Continue without personality customization if parsing fails
          }
        }
        
        // Add personalization based on user history
        if (userHistory.length > 0) {
          systemPrompt += `\n\n**Prediction History Context:**\nThis user has received ${feedbackStats.total} predictions previously.`;
          
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
        
        // Extract confidence score if present (for ALL predictions now)
        let confidenceScore: number | null = null;
        if (typeof predictionResult === 'string') {
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
          trajectoryType: input.trajectoryType || 'instant',
          parentPredictionId: input.parentPredictionId || null, // Track follow-ups
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
          id: newPrediction.id, // Alias for predictionId for consistency
          shareToken: newPrediction.shareToken!,
          remainingToday: subscription.dailyLimit - subscription.usedToday - 1,
          confidenceScore,
          deepMode: input.deepMode,
          isFollowUp: !!input.parentPredictionId, // Flag to indicate if this was a follow-up
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
        
        // Only show root predictions (not follow-ups) in the sidebar
        conditions.push(isNull(predictions.parentPredictionId));
        
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
        
        // Only count root predictions (not follow-ups)
        countConditions.push(isNull(predictions.parentPredictionId));
        
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

    delete: protectedProcedure
      .input(z.object({
        predictionId: z.number(),
      }))
      .mutation(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

        // Verify the prediction belongs to the user
        const [prediction] = await db
          .select()
          .from(predictions)
          .where(and(
            eq(predictions.id, input.predictionId),
            eq(predictions.userId, ctx.user.id)
          ))
          .limit(1);

        if (!prediction) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Prediction not found or you don't have permission to delete it",
          });
        }

        // Delete the prediction
        await db.delete(predictions).where(eq(predictions.id, input.predictionId));

        return { success: true };
      }),

    rename: protectedProcedure
      .input(z.object({
        predictionId: z.number(),
        newTitle: z.string().min(1).max(200),
      }))
      .mutation(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

        // Verify the prediction belongs to the user
        const [prediction] = await db
          .select()
          .from(predictions)
          .where(and(
            eq(predictions.id, input.predictionId),
            eq(predictions.userId, ctx.user.id)
          ))
          .limit(1);

        if (!prediction) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Prediction not found or you don't have permission to rename it",
          });
        }

        // Update the userInput (which serves as the title)
        await db
          .update(predictions)
          .set({ userInput: input.newTitle })
          .where(eq(predictions.id, input.predictionId));

        return { success: true, newTitle: input.newTitle };
      }),
    
    getAnalytics: protectedProcedure
      .input(z.object({
        dateRange: z.enum(["7d", "30d", "90d", "all"]).optional().default("30d"),
      }))
      .query(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

        // Calculate date threshold based on date range
        const now = new Date();
        let dateThreshold: Date | null = null;
        
        if (input.dateRange !== "all") {
          const daysMap = { "7d": 7, "30d": 30, "90d": 90 };
          const days = daysMap[input.dateRange];
          dateThreshold = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
        }

        // Build where clause
        const whereClause = dateThreshold
          ? and(eq(predictions.userId, ctx.user.id), gte(predictions.createdAt, dateThreshold))
          : eq(predictions.userId, ctx.user.id);

        // Fetch all predictions for the user within date range
        const userPredictions = await db
          .select()
          .from(predictions)
          .where(whereClause)
          .orderBy(desc(predictions.createdAt));

        // Calculate analytics
        const totalPredictions = userPredictions.length;

        // Trajectory breakdown (replaces category breakdown)
        const trajectoryBreakdown: Record<string, number> = {
          instant: 0,
          "30day": 0,
          "90day": 0,
          yearly: 0,
        };
        
        userPredictions.forEach(p => {
          const trajectory = p.trajectoryType || "instant";
          if (trajectoryBreakdown[trajectory] !== undefined) {
            trajectoryBreakdown[trajectory]++;
          }
        });

        // Time-based trends (predictions per week for last 8 weeks)
        const weeklyTrends: { week: string; count: number }[] = [];
        const eightWeeksAgo = new Date(now.getTime() - 8 * 7 * 24 * 60 * 60 * 1000);
        
        for (let i = 0; i < 8; i++) {
          const weekStart = new Date(now.getTime() - (7 - i) * 7 * 24 * 60 * 60 * 1000);
          const weekEnd = new Date(now.getTime() - (6 - i) * 7 * 24 * 60 * 60 * 1000);
          weekStart.setHours(0, 0, 0, 0);
          weekEnd.setHours(23, 59, 59, 999);
          
          const weekCount = userPredictions.filter(p => {
            const predDate = new Date(p.createdAt);
            return predDate >= weekStart && predDate <= weekEnd;
          }).length;
          
          weeklyTrends.push({
            week: `Week ${i + 1}`,
            count: weekCount
          });
        }

        // Confidence score distribution
        const allConfidenceScores = userPredictions
          .map(p => p.confidenceScore)
          .filter((score): score is number => score !== null);
        
        const confidenceDistribution = {
          low: allConfidenceScores.filter(s => s < 50).length,      // 0-49%
          moderate: allConfidenceScores.filter(s => s >= 50 && s < 70).length, // 50-69%
          high: allConfidenceScores.filter(s => s >= 70 && s < 85).length,     // 70-84%
          veryHigh: allConfidenceScores.filter(s => s >= 85).length,           // 85-100%
        };

        // Feedback statistics
        const feedbackStats = {
          liked: userPredictions.filter(p => p.userFeedback === "like").length,
          disliked: userPredictions.filter(p => p.userFeedback === "dislike").length,
        };

        // Deep mode statistics
        const deepModePredictions = userPredictions.filter(p => p.predictionMode === "deep");
        const deepModeStats = {
          count: deepModePredictions.length,
        };

        // Average confidence score for deep mode predictions
        const confidenceScores = deepModePredictions
          .map(p => p.confidenceScore)
          .filter((score): score is number => score !== null);
        
        const confidenceAverage = confidenceScores.length > 0
          ? Math.round(confidenceScores.reduce((sum, score) => sum + score, 0) / confidenceScores.length)
          : null;

        // Calculate streaks
        const allUserPredictions = await db
          .select({ createdAt: predictions.createdAt })
          .from(predictions)
          .where(eq(predictions.userId, ctx.user.id))
          .orderBy(desc(predictions.createdAt));

        let currentStreak = 0;
        let longestStreak = 0;
        let tempStreak = 0;
        let lastDate: Date | null = null;

        for (const pred of allUserPredictions) {
          const predDate = new Date(pred.createdAt);
          predDate.setHours(0, 0, 0, 0);

          if (!lastDate) {
            tempStreak = 1;
            lastDate = predDate;
            continue;
          }

          const daysDiff = Math.floor((lastDate.getTime() - predDate.getTime()) / (1000 * 60 * 60 * 24));

          if (daysDiff === 1) {
            tempStreak++;
          } else if (daysDiff > 1) {
            longestStreak = Math.max(longestStreak, tempStreak);
            tempStreak = 1;
          }

          lastDate = predDate;
        }

        longestStreak = Math.max(longestStreak, tempStreak);

        // Current streak (check if last prediction was today or yesterday)
        if (allUserPredictions.length > 0) {
          const lastPredDate = new Date(allUserPredictions[0]!.createdAt);
          lastPredDate.setHours(0, 0, 0, 0);
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const daysSinceLastPred = Math.floor((today.getTime() - lastPredDate.getTime()) / (1000 * 60 * 60 * 24));

          if (daysSinceLastPred <= 1) {
            currentStreak = tempStreak;
          }
        }

        return {
          totalPredictions,
          trajectoryBreakdown,
          weeklyTrends,
          confidenceDistribution,
          feedbackStats,
          deepModeStats,
          confidenceAverage,
          currentStreak,
          longestStreak,
        };
      }),

    generateAnonymous: publicProcedure
      .input(z.object({
        userInput: z.string().min(1).max(1000),
        category: z.enum(["career", "love", "finance", "health", "general"]).optional(),
        // Optional onboarding data for welcome predictions
        onboardingData: z.object({
          nickname: z.string().optional(),
          interests: z.array(z.string()).optional(),
          relationshipStatus: z.string().optional(),
          careerProfile: z.any().optional(),
          financeProfile: z.any().optional(),
          loveProfile: z.any().optional(),
          healthProfile: z.any().optional(),
        }).optional(),
      }))
      .mutation(async ({ input }) => {
        console.log('[generateAnonymous] Starting prediction generation');
        console.log('[generateAnonymous] Input:', { category: input.category, hasOnboardingData: !!input.onboardingData });
        
        // Generate prediction without authentication
        let systemPrompt = `You are an AI fortune teller and prediction specialist. Generate insightful, personalized predictions based on user input. Be creative, positive, and specific. Keep predictions between 100-200 words.`;
        
        // If onboarding data is provided, enhance the system prompt
        if (input.onboardingData) {
          const { nickname, interests, relationshipStatus, careerProfile, financeProfile, loveProfile, healthProfile } = input.onboardingData;
          
          systemPrompt += `\n\nUser Context:`;
          if (nickname) systemPrompt += `\n- Name: ${nickname}`;
          if (interests && interests.length > 0) systemPrompt += `\n- Interests: ${interests.join(', ')}`;
          if (relationshipStatus) systemPrompt += `\n- Relationship Status: ${relationshipStatus}`;
          
          // Add category-specific profile data
          if (careerProfile) {
            systemPrompt += `\n- Career: ${JSON.stringify(careerProfile)}`;
          }
          if (financeProfile) {
            systemPrompt += `\n- Finance: ${JSON.stringify(financeProfile)}`;
          }
          if (loveProfile) {
            systemPrompt += `\n- Love: ${JSON.stringify(loveProfile)}`;
          }
          if (healthProfile) {
            systemPrompt += `\n- Health: ${JSON.stringify(healthProfile)}`;
          }
          
          systemPrompt += `\n\nUse this context to provide a deeply personalized, specific prediction that addresses their current situation, challenges, and timeline.`;
        }
        
        const textPrompt = input.category 
          ? `Generate a ${input.category} prediction for: ${input.userInput}`
          : `Generate a prediction for: ${input.userInput}`;

        try {
          console.log('[generateAnonymous] Calling LLM...');
          const response = await invokeLLM({
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: textPrompt },
            ],
          });

          console.log('[generateAnonymous] LLM response received');
          const messageContent = response.choices[0]?.message?.content;
          const predictionResult = typeof messageContent === 'string' 
            ? messageContent 
            : "Unable to generate prediction at this time.";

          console.log('[generateAnonymous] Prediction generated successfully');
          return {
            prediction: predictionResult,
            category: input.category || "general",
          };
        } catch (error) {
          console.error('[generateAnonymous] Error generating prediction:', error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: `Failed to generate prediction: ${error instanceof Error ? error.message : 'Unknown error'}`,
          });
        }
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

  psyche: router({
    // Submit hybrid onboarding responses (12 questions)
    submitHybridOnboarding: protectedProcedure
      .input(z.object({
        nickname: z.string(),
        primaryInterest: z.string(),
        coreResponses: z.array(z.object({
          questionId: z.string(),
          selectedOptionIndex: z.number(),
          scores: z.object({
            risk: z.number(),
            emotional: z.number(),
            timeHorizon: z.number(),
            decisionStyle: z.number(),
          }),
        })),
        adaptiveResponses: z.array(z.object({
          questionId: z.string(),
          selectedOptionIndex: z.number(),
          scores: z.object({
            risk: z.number(),
            emotional: z.number(),
            timeHorizon: z.number(),
            decisionStyle: z.number(),
          }),
        })),
      }))
      .mutation(async ({ ctx, input }) => {
        try {
          const db = await getDb();
          if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

          // Import hybrid calculation function
          const { calculateHybridPsycheType, generateCategoryInsights } = await import("./lib/psycheHybrid");

          // Combine all responses
          const allResponses = [...input.coreResponses, ...input.adaptiveResponses];

          // Calculate psyche type from hybrid responses
          const { psycheType, scores } = calculateHybridPsycheType(allResponses, input.primaryInterest);

          // Generate category-specific insights
          const insights = generateCategoryInsights(psycheType, input.primaryInterest, scores);

          // Save to user record
          await db.update(users)
            .set({
              nickname: input.nickname,
              interests: JSON.stringify([input.primaryInterest]),
              onboardingCompleted: true,
              updatedAt: new Date(),
            })
            .where(eq(users.id, ctx.user.id));

          // Save psyche profile using existing function
          // Use dbType for database compatibility, fallback to type if not present
          await savePsycheProfile(ctx.user.id, psycheType.dbType || psycheType.type);

          return {
            success: true,
            psycheType,
            scores,
            insights,
            nickname: input.nickname,
            primaryInterest: input.primaryInterest,
          };
        } catch (error) {
          console.error('[submitHybridOnboarding] Error:', error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: `Failed to process hybrid onboarding: ${error instanceof Error ? error.message : 'Unknown error'}`,
          });
        }
      }),

    // Submit onboarding responses and calculate psyche profile
    submitOnboarding: protectedProcedure
      .input(z.object({
        nickname: z.string(),
        interests: z.array(z.string()),
        relationshipStatus: z.string(),
        categoryAnswers: z.record(z.record(z.string())),
        psycheResponses: z.array(z.object({
          questionId: z.number(),
          questionText: z.string(),
          selectedOption: z.string(),
          answerText: z.string(),
        })),
      }))
      .mutation(async ({ ctx, input }) => {
        try {
          const db = await getDb();
          if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

          // Save practical info to user record
          await db.update(users)
            .set({
              nickname: input.nickname,
              relationshipStatus: input.relationshipStatus,
              interests: JSON.stringify(input.interests),
              onboardingCompleted: true,
              updatedAt: new Date(),
            })
            .where(eq(users.id, ctx.user.id));

          // Save each psyche response
          for (const response of input.psycheResponses) {
            const mapping = QUESTION_MAPPINGS[response.questionId as keyof typeof QUESTION_MAPPINGS];
            const mappedTypes = mapping?.[response.selectedOption as keyof typeof mapping] || [];
            
            await saveOnboardingResponse(
              ctx.user.id,
              response.questionId,
              response.questionText,
              response.selectedOption,
              response.answerText,
              mappedTypes
            );
          }
          
          // Calculate psyche type
          const psycheType = calculatePsycheType(input.psycheResponses);
          
          // Save psyche profile
          const profile = await savePsycheProfile(ctx.user.id, psycheType);
          
          return {
            success: true,
            psycheType,
            profile: {
              displayName: profile.displayName,
              description: profile.description,
              coreTraits: profile.coreTraits,
              decisionMakingStyle: profile.decisionMakingStyle,
              growthEdge: profile.growthEdge,
            },
            nickname: input.nickname,
            interests: input.interests,
            relationshipStatus: input.relationshipStatus,
          };
        } catch (error) {
          console.error('[submitOnboarding] Error:', error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: `Failed to process onboarding: ${error instanceof Error ? error.message : 'Unknown error'}`,
          });
        }
      }),
    
    // Get user's psyche profile
    getProfile: protectedProcedure
      .query(async ({ ctx }) => {
        const profile = await getUserPsycheProfile(ctx.user.id);
        if (!profile) {
          return null;
        }
        
        return {
          psycheType: profile.psycheType,
          displayName: profile.displayName,
          description: profile.description,
          coreTraits: JSON.parse(profile.coreTraits),
          decisionMakingStyle: profile.decisionMakingStyle,
          growthEdge: profile.growthEdge,
          parameters: JSON.parse(profile.psycheParameters),
        };
      }),
  }),
});

export type AppRouter = typeof appRouter;
