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
});
