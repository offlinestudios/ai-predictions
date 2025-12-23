import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { router, protectedProcedure } from "../_core/trpc";
import { getDb } from "../db";
import { users, psycheProfiles, subscriptions } from "../../drizzle/schema";
import { eq } from "drizzle-orm";

/**
 * Admin router for administrative operations
 * All endpoints require admin role
 */
export const adminRouter = router({
  /**
   * Seed test users with different personality types
   * Creates 8 test users, one for each personality type
   */
  seedTestUsers: protectedProcedure.mutation(async ({ ctx }) => {
    // Verify user is admin
    if (ctx.user.role !== "admin") {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Admin access required",
      });
    }

    const db = await getDb();
    if (!db) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Database unavailable",
      });
    }

    try {
      // Define test users with their personality types
      const testUsers = [
        {
          email: "test-maverick@test.com",
          name: "Test Maverick",
          nickname: "Test Maverick",
          psycheType: "risk_addict" as const,
          displayName: "The Maverick",
          description: "Bold, passionate, and driven by instinct. You thrive on taking risks and making quick, decisive moves based on your gut feelings.",
          coreTraits: ["Risk-embracing", "Emotionally expressive", "Present-focused", "Intuitive"],
          decisionMakingStyle: "Quick decision-making with high energy and adaptability",
          growthEdge: "May act impulsively and struggle with patience",
          psycheParameters: {
            risk_appetite: 0.9,
            emotional_reactivity: 0.9,
            time_horizon: 0.2,
            analytical_weight: 0.2,
            volatility_tolerance: 0.9,
            change_aversion: 0.1,
          },
        },
        {
          email: "test-strategist@test.com",
          name: "Test Strategist",
          nickname: "Test Strategist",
          psycheType: "quiet_strategist" as const,
          displayName: "The Strategist",
          description: "Methodical, patient, and data-driven. You excel at long-term planning and making calculated decisions based on thorough analysis.",
          coreTraits: ["Risk-averse", "Emotionally measured", "Future-oriented", "Analytical"],
          decisionMakingStyle: "Strategic thinking with consistent execution and risk management",
          growthEdge: "May miss time-sensitive opportunities and struggle with uncertainty",
          psycheParameters: {
            risk_appetite: 0.2,
            emotional_reactivity: 0.2,
            time_horizon: 0.9,
            analytical_weight: 0.9,
            volatility_tolerance: 0.1,
            change_aversion: 0.8,
          },
        },
        {
          email: "test-visionary@test.com",
          name: "Test Visionary",
          nickname: "Test Visionary",
          psycheType: "ambitious_builder" as const,
          displayName: "The Visionary",
          description: "Bold yet calculated, you take big risks backed by solid research. You balance ambition with strategic thinking for long-term success.",
          coreTraits: ["Calculated risk-taker", "Emotionally controlled", "Future-oriented", "Strategic"],
          decisionMakingStyle: "Big-picture thinking with disciplined execution",
          growthEdge: "May undervalue emotional factors and be overly confident",
          psycheParameters: {
            risk_appetite: 0.8,
            emotional_reactivity: 0.3,
            time_horizon: 0.8,
            analytical_weight: 0.8,
            volatility_tolerance: 0.7,
            change_aversion: 0.3,
          },
        },
        {
          email: "test-guardian@test.com",
          name: "Test Guardian",
          nickname: "Test Guardian",
          psycheType: "stabilizer" as const,
          displayName: "The Guardian",
          description: "Protective, emotionally attuned, and focused on long-term security. You prioritize stability and deep connections over quick wins.",
          coreTraits: ["Risk-cautious", "Emotionally aware", "Future-oriented", "Intuitive"],
          decisionMakingStyle: "Emotionally intelligent with strong protective instincts",
          growthEdge: "May avoid necessary risks and struggle with change",
          psycheParameters: {
            risk_appetite: 0.2,
            emotional_reactivity: 0.8,
            time_horizon: 0.8,
            analytical_weight: 0.3,
            volatility_tolerance: 0.2,
            change_aversion: 0.8,
          },
        },
        {
          email: "test-pioneer@test.com",
          name: "Test Pioneer",
          nickname: "Test Pioneer",
          psycheType: "long_term_builder" as const,
          displayName: "The Pioneer",
          description: "Passionate and ambitious with a long-term vision. You are willing to take bold risks to achieve your dreams and inspire others.",
          coreTraits: ["Risk-embracing", "Emotionally driven", "Future-oriented", "Visionary"],
          decisionMakingStyle: "Inspirational leadership with high motivation",
          growthEdge: "May overextend resources and be emotionally volatile",
          psycheParameters: {
            risk_appetite: 0.8,
            emotional_reactivity: 0.8,
            time_horizon: 0.9,
            analytical_weight: 0.4,
            volatility_tolerance: 0.7,
            change_aversion: 0.2,
          },
        },
        {
          email: "test-pragmatist@test.com",
          name: "Test Pragmatist",
          nickname: "Test Pragmatist",
          psycheType: "pattern_analyst" as const,
          displayName: "The Pragmatist",
          description: "Practical, grounded, and focused on what works right now. You make steady, rational decisions based on current realities.",
          coreTraits: ["Risk-averse", "Emotionally neutral", "Present-focused", "Practical"],
          decisionMakingStyle: "Reliable execution with clear-headed decisions",
          growthEdge: "May lack long-term vision and be overly conservative",
          psycheParameters: {
            risk_appetite: 0.3,
            emotional_reactivity: 0.3,
            time_horizon: 0.3,
            analytical_weight: 0.8,
            volatility_tolerance: 0.3,
            change_aversion: 0.6,
          },
        },
        {
          email: "test-catalyst@test.com",
          name: "Test Catalyst",
          nickname: "Test Catalyst",
          psycheType: "momentum_chaser" as const,
          displayName: "The Catalyst",
          description: "Energetic, spontaneous, and emotionally expressive. You live in the moment and inspire action through your passion and enthusiasm.",
          coreTraits: ["Emotionally expressive", "Present-focused", "Intuitive", "Action-oriented"],
          decisionMakingStyle: "High energy with inspiring presence",
          growthEdge: "May lack long-term planning and be impulsive",
          psycheParameters: {
            risk_appetite: 0.7,
            emotional_reactivity: 0.8,
            time_horizon: 0.2,
            analytical_weight: 0.3,
            volatility_tolerance: 0.8,
            change_aversion: 0.2,
          },
        },
        {
          email: "test-adapter@test.com",
          name: "Test Adapter",
          nickname: "Test Adapter",
          psycheType: "intuitive_empath" as const,
          displayName: "The Adapter",
          description: "Flexible, balanced, and context-aware. You adjust your approach based on the situation, blending intuition with analysis and caution with boldness.",
          coreTraits: ["Balanced risk approach", "Emotionally flexible", "Adaptable time horizon", "Situational decision-making"],
          decisionMakingStyle: "Versatile and context-sensitive approach",
          growthEdge: "May lack clear identity and struggle with commitment",
          psycheParameters: {
            risk_appetite: 0.5,
            emotional_reactivity: 0.5,
            time_horizon: 0.5,
            analytical_weight: 0.5,
            volatility_tolerance: 0.5,
            change_aversion: 0.5,
          },
        },
      ];

      const createdUsers = [];

      for (const testUser of testUsers) {
        // Check if user already exists
        const existingUser = await db
          .select()
          .from(users)
          .where(eq(users.email, testUser.email))
          .limit(1);

        let userId: number;

        if (existingUser.length > 0) {
          // User exists, update it
          userId = existingUser[0].id;
          
          await db
            .update(users)
            .set({
              name: testUser.name,
              nickname: testUser.nickname,
              onboardingCompleted: true,
              interests: JSON.stringify(["career"]),
              careerProfile: JSON.stringify({
                position: "mid",
                direction: "clarity",
                challenge: "direction",
                timeline: "6mo",
              }),
              updatedAt: new Date(),
            })
            .where(eq(users.id, userId));
        } else {
          // Create new user
          const [newUser] = await db
            .insert(users)
            .values({
              openId: `test_${testUser.psycheType}_${Date.now()}`,
              email: testUser.email,
              name: testUser.name,
              nickname: testUser.nickname,
              loginMethod: "test",
              role: "user",
              onboardingCompleted: true,
              interests: JSON.stringify(["career"]),
              careerProfile: JSON.stringify({
                position: "mid",
                direction: "clarity",
                challenge: "direction",
                timeline: "6mo",
              }),
            })
            .returning();

          userId = newUser.id;
        }

        // Check if psyche profile exists
        const existingProfile = await db
          .select()
          .from(psycheProfiles)
          .where(eq(psycheProfiles.userId, userId))
          .limit(1);

        if (existingProfile.length > 0) {
          // Update existing profile
          await db
            .update(psycheProfiles)
            .set({
              psycheType: testUser.psycheType,
              displayName: testUser.displayName,
              description: testUser.description,
              coreTraits: JSON.stringify(testUser.coreTraits),
              decisionMakingStyle: testUser.decisionMakingStyle,
              growthEdge: testUser.growthEdge,
              psycheParameters: JSON.stringify(testUser.psycheParameters),
              updatedAt: new Date(),
            })
            .where(eq(psycheProfiles.userId, userId));
        } else {
          // Create new profile
          await db.insert(psycheProfiles).values({
            userId,
            psycheType: testUser.psycheType,
            displayName: testUser.displayName,
            description: testUser.description,
            coreTraits: JSON.stringify(testUser.coreTraits),
            decisionMakingStyle: testUser.decisionMakingStyle,
            growthEdge: testUser.growthEdge,
            psycheParameters: JSON.stringify(testUser.psycheParameters),
          });
        }

        // Check if subscription exists
        const existingSubscription = await db
          .select()
          .from(subscriptions)
          .where(eq(subscriptions.userId, userId))
          .limit(1);

        if (existingSubscription.length === 0) {
          // Create subscription
          await db.insert(subscriptions).values({
            userId,
            tier: "free",
            dailyLimit: 10,
            usedToday: 0,
            totalUsed: 0,
            currentStreak: 0,
            longestStreak: 0,
            isActive: true,
          });
        }

        createdUsers.push({
          email: testUser.email,
          personality: testUser.displayName,
          psycheType: testUser.psycheType,
        });
      }

      return {
        success: true,
        message: `Successfully seeded ${createdUsers.length} test users`,
        users: createdUsers,
      };
    } catch (error) {
      console.error("[Admin] Error seeding test users:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to seed test users",
      });
    }
  }),

  /**
   * Get all test users
   */
  getTestUsers: protectedProcedure.query(async ({ ctx }) => {
    // Verify user is admin
    if (ctx.user.role !== "admin") {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Admin access required",
      });
    }

    const db = await getDb();
    if (!db) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Database unavailable",
      });
    }

    try {
      // Get all users with test emails
      const testUsers = await db
        .select({
          id: users.id,
          email: users.email,
          name: users.name,
          nickname: users.nickname,
          onboardingCompleted: users.onboardingCompleted,
          createdAt: users.createdAt,
        })
        .from(users)
        .where(eq(users.loginMethod, "test"));

      // Get psyche profiles for test users
      const usersWithProfiles = await Promise.all(
        testUsers.map(async (user) => {
          const [profile] = await db
            .select({
              displayName: psycheProfiles.displayName,
              psycheType: psycheProfiles.psycheType,
            })
            .from(psycheProfiles)
            .where(eq(psycheProfiles.userId, user.id))
            .limit(1);

          return {
            ...user,
            personality: profile?.displayName || "Not assigned",
            psycheType: profile?.psycheType || null,
          };
        })
      );

      return usersWithProfiles;
    } catch (error) {
      console.error("[Admin] Error getting test users:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to get test users",
      });
    }
  }),

  /**
   * Delete all test users
   */
  /**
   * Impersonate a personality type for testing
   * Updates the current admin user's psyche profile to match the selected personality
   */
  impersonatePersonality: protectedProcedure
    .input(z.object({
      personalityType: z.enum([
        "maverick", "strategist", "visionary", "guardian",
        "pioneer", "pragmatist", "catalyst", "adapter"
      ]),
    }))
    .mutation(async ({ ctx, input }) => {
      // Verify user is admin
      if (ctx.user.role !== "admin") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Admin access required",
        });
      }

      const db = await getDb();
      if (!db) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Database unavailable",
        });
      }

      // Define personality profiles
      const personalities: Record<string, {
        psycheType: string;
        displayName: string;
        description: string;
        coreTraits: string[];
        decisionMakingStyle: string;
        growthEdge: string;
        psycheParameters: Record<string, number>;
      }> = {
        maverick: {
          psycheType: "risk_addict",
          displayName: "The Maverick",
          description: "Bold, passionate, and driven by instinct. You thrive on taking risks and making quick, decisive moves based on your gut feelings.",
          coreTraits: ["Risk-embracing", "Emotionally expressive", "Present-focused", "Intuitive"],
          decisionMakingStyle: "Quick decision-making with high energy and adaptability",
          growthEdge: "May act impulsively and struggle with patience",
          psycheParameters: {
            risk_appetite: 0.9,
            emotional_reactivity: 0.9,
            time_horizon: 0.2,
            analytical_weight: 0.2,
            volatility_tolerance: 0.9,
            change_aversion: 0.1,
          },
        },
        strategist: {
          psycheType: "quiet_strategist",
          displayName: "The Strategist",
          description: "Methodical, patient, and data-driven. You excel at long-term planning and making calculated decisions based on thorough analysis.",
          coreTraits: ["Risk-averse", "Emotionally measured", "Future-oriented", "Analytical"],
          decisionMakingStyle: "Strategic thinking with consistent execution and risk management",
          growthEdge: "May miss time-sensitive opportunities and struggle with uncertainty",
          psycheParameters: {
            risk_appetite: 0.2,
            emotional_reactivity: 0.2,
            time_horizon: 0.9,
            analytical_weight: 0.9,
            volatility_tolerance: 0.1,
            change_aversion: 0.8,
          },
        },
        visionary: {
          psycheType: "ambitious_builder",
          displayName: "The Visionary",
          description: "Bold yet calculated, you take big risks backed by solid research. You balance ambition with strategic thinking for long-term success.",
          coreTraits: ["Calculated risk-taker", "Emotionally controlled", "Future-oriented", "Strategic"],
          decisionMakingStyle: "Big-picture thinking with disciplined execution",
          growthEdge: "May undervalue emotional factors and be overly confident",
          psycheParameters: {
            risk_appetite: 0.8,
            emotional_reactivity: 0.3,
            time_horizon: 0.8,
            analytical_weight: 0.8,
            volatility_tolerance: 0.7,
            change_aversion: 0.3,
          },
        },
        guardian: {
          psycheType: "stabilizer",
          displayName: "The Guardian",
          description: "Protective, emotionally attuned, and focused on long-term security. You prioritize stability and deep connections over quick wins.",
          coreTraits: ["Risk-cautious", "Emotionally aware", "Future-oriented", "Intuitive"],
          decisionMakingStyle: "Emotionally intelligent with strong protective instincts",
          growthEdge: "May avoid necessary risks and struggle with change",
          psycheParameters: {
            risk_appetite: 0.2,
            emotional_reactivity: 0.8,
            time_horizon: 0.8,
            analytical_weight: 0.3,
            volatility_tolerance: 0.2,
            change_aversion: 0.8,
          },
        },
        pioneer: {
          psycheType: "long_term_builder",
          displayName: "The Pioneer",
          description: "Passionate and ambitious with a long-term vision. You are willing to take bold risks to achieve your dreams and inspire others.",
          coreTraits: ["Risk-embracing", "Emotionally driven", "Future-oriented", "Visionary"],
          decisionMakingStyle: "Inspirational leadership with high motivation",
          growthEdge: "May overextend resources and be emotionally volatile",
          psycheParameters: {
            risk_appetite: 0.8,
            emotional_reactivity: 0.8,
            time_horizon: 0.9,
            analytical_weight: 0.4,
            volatility_tolerance: 0.7,
            change_aversion: 0.2,
          },
        },
        pragmatist: {
          psycheType: "pattern_analyst",
          displayName: "The Pragmatist",
          description: "Practical, grounded, and focused on what works right now. You make steady, rational decisions based on current realities.",
          coreTraits: ["Risk-averse", "Emotionally neutral", "Present-focused", "Practical"],
          decisionMakingStyle: "Reliable execution with clear-headed decisions",
          growthEdge: "May lack long-term vision and be overly conservative",
          psycheParameters: {
            risk_appetite: 0.3,
            emotional_reactivity: 0.3,
            time_horizon: 0.3,
            analytical_weight: 0.8,
            volatility_tolerance: 0.3,
            change_aversion: 0.6,
          },
        },
        catalyst: {
          psycheType: "momentum_chaser",
          displayName: "The Catalyst",
          description: "Energetic, spontaneous, and emotionally expressive. You live in the moment and inspire action through your passion and enthusiasm.",
          coreTraits: ["Emotionally expressive", "Present-focused", "Intuitive", "Action-oriented"],
          decisionMakingStyle: "High energy with inspiring presence",
          growthEdge: "May lack long-term planning and be impulsive",
          psycheParameters: {
            risk_appetite: 0.7,
            emotional_reactivity: 0.8,
            time_horizon: 0.2,
            analytical_weight: 0.3,
            volatility_tolerance: 0.8,
            change_aversion: 0.2,
          },
        },
        adapter: {
          psycheType: "intuitive_empath",
          displayName: "The Adapter",
          description: "Flexible, balanced, and context-aware. You adjust your approach based on the situation, blending intuition with analysis and caution with boldness.",
          coreTraits: ["Balanced risk approach", "Emotionally flexible", "Adaptable time horizon", "Situational decision-making"],
          decisionMakingStyle: "Versatile and context-sensitive approach",
          growthEdge: "May lack clear identity and struggle with commitment",
          psycheParameters: {
            risk_appetite: 0.5,
            emotional_reactivity: 0.5,
            time_horizon: 0.5,
            analytical_weight: 0.5,
            volatility_tolerance: 0.5,
            change_aversion: 0.5,
          },
        },
      };

      const personality = personalities[input.personalityType];
      if (!personality) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid personality type",
        });
      }

      try {
        // Check if psyche profile exists for current user
        const existingProfile = await db
          .select()
          .from(psycheProfiles)
          .where(eq(psycheProfiles.userId, ctx.user.id))
          .limit(1);

        if (existingProfile.length > 0) {
          // Update existing profile
          await db
            .update(psycheProfiles)
            .set({
              psycheType: personality.psycheType as any,
              displayName: personality.displayName,
              description: personality.description,
              coreTraits: JSON.stringify(personality.coreTraits),
              decisionMakingStyle: personality.decisionMakingStyle,
              growthEdge: personality.growthEdge,
              psycheParameters: JSON.stringify(personality.psycheParameters),
              updatedAt: new Date(),
            })
            .where(eq(psycheProfiles.userId, ctx.user.id));
        } else {
          // Create new profile
          await db.insert(psycheProfiles).values({
            userId: ctx.user.id,
            psycheType: personality.psycheType as any,
            displayName: personality.displayName,
            description: personality.description,
            coreTraits: JSON.stringify(personality.coreTraits),
            decisionMakingStyle: personality.decisionMakingStyle,
            growthEdge: personality.growthEdge,
            psycheParameters: JSON.stringify(personality.psycheParameters),
          });
        }

        return {
          success: true,
          message: `Now impersonating: ${personality.displayName}`,
          personality: {
            type: input.personalityType,
            displayName: personality.displayName,
            description: personality.description,
          },
        };
      } catch (error) {
        console.error("[Admin] Error impersonating personality:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to impersonate personality",
        });
      }
    }),

  /**
   * Delete all test users
   */
  deleteTestUsers: protectedProcedure.mutation(async ({ ctx }) => {
    // Verify user is admin
    if (ctx.user.role !== "admin") {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Admin access required",
      });
    }

    const db = await getDb();
    if (!db) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Database unavailable",
      });
    }

    try {
      // Get all test user IDs
      const testUsers = await db
        .select({ id: users.id })
        .from(users)
        .where(eq(users.loginMethod, "test"));

      const userIds = testUsers.map((u) => u.id);

      if (userIds.length === 0) {
        return {
          success: true,
          message: "No test users to delete",
          deletedCount: 0,
        };
      }

      // Delete psyche profiles
      for (const userId of userIds) {
        await db.delete(psycheProfiles).where(eq(psycheProfiles.userId, userId));
      }

      // Delete subscriptions
      for (const userId of userIds) {
        await db.delete(subscriptions).where(eq(subscriptions.userId, userId));
      }

      // Delete users
      for (const userId of userIds) {
        await db.delete(users).where(eq(users.id, userId));
      }

      return {
        success: true,
        message: `Successfully deleted ${userIds.length} test users`,
        deletedCount: userIds.length,
      };
    } catch (error) {
      console.error("[Admin] Error deleting test users:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to delete test users",
      });
    }
  }),

  /**
   * Change current user's subscription tier (for testing)
   */
  changeSubscriptionTier: protectedProcedure
    .input(z.object({
      tier: z.enum(["free", "plus", "pro", "premium"]),
    }))
    .mutation(async ({ ctx, input }) => {
      // Verify user is admin
      if (ctx.user.role !== "admin") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Admin access required",
        });
      }

      const db = await getDb();
      if (!db) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Database unavailable",
        });
      }

      try {
        // Check if subscription exists for current user
        const existingSub = await db
          .select()
          .from(subscriptions)
          .where(eq(subscriptions.userId, ctx.user.id))
          .limit(1);

        if (existingSub.length > 0) {
          // Update existing subscription
          await db
            .update(subscriptions)
            .set({
              tier: input.tier,
              updatedAt: new Date(),
            })
            .where(eq(subscriptions.userId, ctx.user.id));
        } else {
          // Create new subscription
          await db.insert(subscriptions).values({
            userId: ctx.user.id,
            tier: input.tier,
            stripeCustomerId: `test_${ctx.user.id}`,
            stripeSubscriptionId: `test_sub_${ctx.user.id}`,
          });
        }

        const tierNames: Record<string, string> = {
          free: "Free",
          plus: "Plus ($9.99/mo)",
          pro: "Pro ($19.99/mo)",
          premium: "Premium ($59/year)",
        };

        return {
          success: true,
          message: `Subscription changed to ${tierNames[input.tier]}`,
          tier: input.tier,
        };
      } catch (error) {
        console.error("[Admin] Error changing subscription tier:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to change subscription tier",
        });
      }
    }),

  /**
   * Reset prediction count for testing free tier limits
   * Resets both usedToday and totalUsed to 0
   */
  resetPredictionCount: protectedProcedure.mutation(async ({ ctx }) => {
    if (ctx.user.role !== "admin") {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Admin access required",
      });
    }

    const db = await getDb();
    if (!db) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Database unavailable",
      });
    }

    try {
      await db
        .update(subscriptions)
        .set({
          usedToday: 0,
          totalUsed: 0,
          lastResetDate: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(subscriptions.userId, ctx.user.id));

      return {
        success: true,
        message: "Prediction count reset to 0. You can now test the free tier limits.",
      };
    } catch (error) {
      console.error("[Admin] Error resetting prediction count:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to reset prediction count",
      });
    }
  }),

  /**
   * Reset onboarding status for testing the onboarding flow
   * Sets onboardingCompleted to false and removes psyche profile
   */
  resetOnboarding: protectedProcedure.mutation(async ({ ctx }) => {
    if (ctx.user.role !== "admin") {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Admin access required",
      });
    }

    const db = await getDb();
    if (!db) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Database unavailable",
      });
    }

    try {
      // Reset onboarding status on user
      await db
        .update(users)
        .set({
          onboardingCompleted: false,
          updatedAt: new Date(),
        })
        .where(eq(users.id, ctx.user.id));

      // Delete psyche profile
      await db
        .delete(psycheProfiles)
        .where(eq(psycheProfiles.userId, ctx.user.id));

      return {
        success: true,
        message: "Onboarding reset. You can now go through the onboarding flow again.",
      };
    } catch (error) {
      console.error("[Admin] Error resetting onboarding:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to reset onboarding",
      });
    }
  }),
});

// ============================================================================
// ADMIN ANALYTICS ENDPOINTS
// ============================================================================

/**
 * Get comprehensive dashboard analytics
 * Returns user stats, revenue metrics, prediction analytics, and insights
 */
getAnalytics: protectedProcedure.query(async ({ ctx }) => {
  if (ctx.user.role !== "admin") {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Admin access required",
    });
  }

  const db = await getDb();
  if (!db) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Database unavailable",
    });
  }

  try {
    const { users: usersTable, subscriptions: subscriptionsTable, predictions: predictionsTable, psycheProfiles: psycheProfilesTable } = await import("../../drizzle/schema");
    const { sql, count, sum, avg } = await import("drizzle-orm");

    // Get all users
    const allUsers = await db.select().from(usersTable);
    const totalUsers = allUsers.length;

    // Get users created in last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const newUsersLast7Days = allUsers.filter(u => new Date(u.createdAt) >= sevenDaysAgo).length;

    // Get users created in last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const newUsersLast30Days = allUsers.filter(u => new Date(u.createdAt) >= thirtyDaysAgo).length;

    // Get active users (logged in last 7 days)
    const activeUsers = allUsers.filter(u => new Date(u.lastSignedIn) >= sevenDaysAgo).length;

    // Get all subscriptions
    const allSubscriptions = await db.select().from(subscriptionsTable);
    
    // Count by tier
    const freeTier = allSubscriptions.filter(s => s.tier === "free").length;
    const plusTier = allSubscriptions.filter(s => s.tier === "plus" && s.isActive).length;
    const premiumTier = allSubscriptions.filter(s => s.tier === "premium" && s.isActive).length;
    const paidUsers = plusTier + premiumTier;

    // Calculate conversion rate
    const conversionRate = totalUsers > 0 ? (paidUsers / totalUsers) * 100 : 0;

    // Calculate MRR (Monthly Recurring Revenue)
    // Plus: $9.99/month, Premium: $59/year = $4.92/month
    const plusMRR = plusTier * 9.99;
    const premiumMRR = premiumTier * 4.92; // $59/year ÷ 12 months
    const totalMRR = plusMRR + premiumMRR;

    // Calculate total revenue (approximate - Plus monthly + Premium yearly)
    const totalRevenue = (plusTier * 9.99) + (premiumTier * 59);

    // Get all predictions
    const allPredictions = await db.select().from(predictionsTable);
    const totalPredictions = allPredictions.length;
    const avgPredictionsPerUser = totalUsers > 0 ? totalPredictions / totalUsers : 0;

    // Predictions by category
    const predictionsByCategory = allPredictions.reduce((acc, p) => {
      const category = p.category || "general";
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Get all psyche profiles
    const allProfiles = await db.select().from(psycheProfilesTable);
    
    // Count by personality type
    const personalityDistribution = allProfiles.reduce((acc, p) => {
      acc[p.psycheType] = (acc[p.psycheType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Calculate predictions by personality type
    const predictionsByPersonality: Record<string, number> = {};
    for (const prediction of allPredictions) {
      const userProfile = allProfiles.find(p => p.userId === prediction.userId);
      if (userProfile) {
        const type = userProfile.psycheType;
        predictionsByPersonality[type] = (predictionsByPersonality[type] || 0) + 1;
      }
    }

    // Calculate average predictions per personality type
    const avgPredictionsByPersonality: Record<string, number> = {};
    for (const [type, count] of Object.entries(personalityDistribution)) {
      const totalPreds = predictionsByPersonality[type] || 0;
      avgPredictionsByPersonality[type] = count > 0 ? totalPreds / count : 0;
    }

    return {
      // User metrics
      users: {
        total: totalUsers,
        newLast7Days: newUsersLast7Days,
        newLast30Days: newUsersLast30Days,
        active: activeUsers,
      },
      // Revenue metrics
      revenue: {
        mrr: Math.round(totalMRR * 100) / 100,
        totalRevenue: Math.round(totalRevenue * 100) / 100,
        conversionRate: Math.round(conversionRate * 100) / 100,
      },
      // Subscription metrics
      subscriptions: {
        free: freeTier,
        plus: plusTier,
        premium: premiumTier,
        paid: paidUsers,
      },
      // Prediction metrics
      predictions: {
        total: totalPredictions,
        avgPerUser: Math.round(avgPredictionsPerUser * 100) / 100,
        byCategory: predictionsByCategory,
      },
      // Personality insights
      personality: {
        distribution: personalityDistribution,
        avgPredictions: avgPredictionsByPersonality,
      },
    };
  } catch (error) {
    console.error("[Admin] Error getting analytics:", error);
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to get analytics",
    });
  }
}),

/**
 * Get detailed user list with search and filtering
 */
getUserList: protectedProcedure
  .input(
    z.object({
      search: z.string().optional(),
      tier: z.enum(["all", "free", "plus", "premium"]).optional().default("all"),
      limit: z.number().min(1).max(100).optional().default(50),
      offset: z.number().min(0).optional().default(0),
    })
  )
  .query(async ({ ctx, input }) => {
    if (ctx.user.role !== "admin") {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Admin access required",
      });
    }

    const db = await getDb();
    if (!db) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Database unavailable",
      });
    }

    try {
      const { users: usersTable, subscriptions: subscriptionsTable, psycheProfiles: psycheProfilesTable, predictions: predictionsTable } = await import("../../drizzle/schema");
      const { sql, like, or } = await import("drizzle-orm");

      // Get all users with their subscriptions and profiles
      const allUsers = await db.select().from(usersTable);
      const allSubscriptions = await db.select().from(subscriptionsTable);
      const allProfiles = await db.select().from(psycheProfilesTable);
      const allPredictions = await db.select().from(predictionsTable);

      // Filter by search
      let filteredUsers = allUsers;
      if (input.search) {
        const searchLower = input.search.toLowerCase();
        filteredUsers = filteredUsers.filter(u => 
          u.email?.toLowerCase().includes(searchLower) ||
          u.name?.toLowerCase().includes(searchLower) ||
          u.nickname?.toLowerCase().includes(searchLower)
        );
      }

      // Join with subscriptions and profiles
      const usersWithDetails = filteredUsers.map(user => {
        const subscription = allSubscriptions.find(s => s.userId === user.id);
        const profile = allProfiles.find(p => p.userId === user.id);
        const userPredictions = allPredictions.filter(p => p.userId === user.id);

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          createdAt: user.createdAt,
          lastSignedIn: user.lastSignedIn,
          onboardingCompleted: user.onboardingCompleted,
          tier: subscription?.tier || "free",
          isActive: subscription?.isActive ?? false,
          personalityType: profile?.displayName || null,
          predictionCount: userPredictions.length,
        };
      });

      // Filter by tier
      let finalUsers = usersWithDetails;
      if (input.tier !== "all") {
        finalUsers = finalUsers.filter(u => u.tier === input.tier);
      }

      // Sort by creation date (newest first)
      finalUsers.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      // Apply pagination
      const total = finalUsers.length;
      const paginatedUsers = finalUsers.slice(input.offset, input.offset + input.limit);

      return {
        users: paginatedUsers,
        total,
        hasMore: input.offset + input.limit < total,
      };
    } catch (error) {
      console.error("[Admin] Error getting user list:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to get user list",
      });
    }
  }),

/**
 * Get detailed insights and recommendations
 */
getInsights: protectedProcedure.query(async ({ ctx }) => {
  if (ctx.user.role !== "admin") {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Admin access required",
    });
  }

  const db = await getDb();
  if (!db) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Database unavailable",
    });
  }

  try {
    const { users: usersTable, subscriptions: subscriptionsTable, psycheProfiles: psycheProfilesTable, predictions: predictionsTable } = await import("../../drizzle/schema");

    const allUsers = await db.select().from(usersTable);
    const allSubscriptions = await db.select().from(subscriptionsTable);
    const allProfiles = await db.select().from(psycheProfilesTable);
    const allPredictions = await db.select().from(predictionsTable);

    // Calculate personality type conversion rates
    const personalityConversion: Record<string, { total: number; paid: number; rate: number }> = {};
    
    for (const profile of allProfiles) {
      const type = profile.psycheType;
      const subscription = allSubscriptions.find(s => s.userId === profile.userId);
      const isPaid = subscription && (subscription.tier === "plus" || subscription.tier === "premium") && subscription.isActive;

      if (!personalityConversion[type]) {
        personalityConversion[type] = { total: 0, paid: 0, rate: 0 };
      }

      personalityConversion[type].total++;
      if (isPaid) {
        personalityConversion[type].paid++;
      }
    }

    // Calculate conversion rates
    for (const type in personalityConversion) {
      const data = personalityConversion[type];
      data.rate = data.total > 0 ? (data.paid / data.total) * 100 : 0;
    }

    // Find most engaged personality types (by predictions)
    const personalityEngagement: Record<string, { predictions: number; avgPerUser: number }> = {};
    
    for (const profile of allProfiles) {
      const type = profile.psycheType;
      const userPredictions = allPredictions.filter(p => p.userId === profile.userId);

      if (!personalityEngagement[type]) {
        personalityEngagement[type] = { predictions: 0, avgPerUser: 0 };
      }

      personalityEngagement[type].predictions += userPredictions.length;
    }

    // Calculate averages
    for (const type in personalityEngagement) {
      const count = personalityConversion[type]?.total || 0;
      personalityEngagement[type].avgPerUser = count > 0 ? personalityEngagement[type].predictions / count : 0;
    }

    // Generate recommendations
    const recommendations = [];

    // Recommendation 1: Target high-conversion personality types
    const sortedByConversion = Object.entries(personalityConversion)
      .sort(([, a], [, b]) => b.rate - a.rate)
      .slice(0, 3);

    if (sortedByConversion.length > 0) {
      recommendations.push({
        title: "Target High-Converting Personality Types",
        description: `${sortedByConversion.map(([type, data]) => `${type} (${data.rate.toFixed(1)}% conversion)`).join(", ")} show the highest conversion rates. Consider creating targeted marketing campaigns for these personality types.`,
        priority: "high",
      });
    }

    // Recommendation 2: Engage high-activity users
    const sortedByEngagement = Object.entries(personalityEngagement)
      .sort(([, a], [, b]) => b.avgPerUser - a.avgPerUser)
      .slice(0, 3);

    if (sortedByEngagement.length > 0) {
      recommendations.push({
        title: "Focus on Highly Engaged Users",
        description: `${sortedByEngagement.map(([type, data]) => `${type} (${data.avgPerUser.toFixed(1)} predictions/user)`).join(", ")} are the most engaged. These users are likely to benefit from premium features.`,
        priority: "medium",
      });
    }

    // Recommendation 3: Improve onboarding completion
    const completedOnboarding = allUsers.filter(u => u.onboardingCompleted).length;
    const onboardingRate = allUsers.length > 0 ? (completedOnboarding / allUsers.length) * 100 : 0;

    if (onboardingRate < 80) {
      recommendations.push({
        title: "Improve Onboarding Completion Rate",
        description: `Only ${onboardingRate.toFixed(1)}% of users complete onboarding. Consider simplifying the process or adding incentives to improve completion rates.`,
        priority: "high",
      });
    }

    // Recommendation 4: Conversion rate optimization
    const paidUsers = allSubscriptions.filter(s => (s.tier === "plus" || s.tier === "premium") && s.isActive).length;
    const conversionRate = allUsers.length > 0 ? (paidUsers / allUsers.length) * 100 : 0;

    if (conversionRate < 5) {
      recommendations.push({
        title: "Optimize Free-to-Paid Conversion",
        description: `Current conversion rate is ${conversionRate.toFixed(1)}%. Industry average is 2-5%. Consider A/B testing different paywall placements and messaging.`,
        priority: "high",
      });
    }

    return {
      personalityConversion,
      personalityEngagement,
      recommendations,
      metrics: {
        onboardingCompletionRate: Math.round(onboardingRate * 100) / 100,
        overallConversionRate: Math.round(conversionRate * 100) / 100,
      },
    };
  } catch (error) {
    console.error("[Admin] Error getting insights:", error);
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to get insights",
    });
  }
}),
