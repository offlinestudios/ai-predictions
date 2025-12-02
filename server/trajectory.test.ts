import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { appRouter } from "./routers";
import { getDb } from "./db";
import { users, subscriptions, predictions } from "../drizzle/schema";
import { eq } from "drizzle-orm";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createTestContext(userId: string, userEmail: string, userName: string): TrpcContext {
  const user: AuthenticatedUser = {
    id: userId,
    clerkId: `test_clerk_${Date.now()}`,
    email: userEmail,
    name: userName,
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const ctx: TrpcContext = {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };

  return ctx;
}

describe("Trajectory Prediction Feature", () => {
  let testUserId: string;
  let testUserEmail: string;
  const db = getDb();

  beforeAll(async () => {
    // Create a test user
    testUserEmail = `test-trajectory-${Date.now()}@example.com`;
    const [user] = await db
      .insert(users)
      .values({
        clerkId: `test_clerk_${Date.now()}`,
        email: testUserEmail,
        name: "Test Trajectory User",
        role: "user",
      })
      .returning();
    testUserId = user.id;
  });

  afterAll(async () => {
    // Cleanup: delete test data
    if (testUserId) {
      await db.delete(predictions).where(eq(predictions.userId, testUserId));
      await db.delete(subscriptions).where(eq(subscriptions.userId, testUserId));
      await db.delete(users).where(eq(users.id, testUserId));
    }
  });

  describe("Tier-based Access Control", () => {
    it("should allow Free tier users to generate instant predictions only", async () => {
      // Create Free tier subscription
      await db.insert(subscriptions).values({
        userId: testUserId,
        tier: "free",
        dailyLimit: 0,
        usedToday: 0,
        totalUsed: 0,
        resetDate: new Date(),
      });

      const ctx = createTestContext(testUserId, testUserEmail, "Test User");
      const caller = appRouter.createCaller(ctx);

      // Test that 30-day trajectory is blocked for Free tier
      try {
        await caller.prediction.generate({
          userInput: "What will happen in my career?",
          category: "career",
          trajectoryType: "30day",
        });
        expect.fail("Should have thrown an error for Free tier accessing 30-day trajectory");
      } catch (error: any) {
        expect(error.message).toContain("30-Day Trajectory Predictions are only available for Plus");
      }
    });

    it("should allow Plus tier users to generate 30-day trajectories", async () => {
      // Update to Plus tier
      await db
        .update(subscriptions)
        .set({ tier: "plus", dailyLimit: 10 })
        .where(eq(subscriptions.userId, testUserId));

      const ctx = createTestContext(testUserId, testUserEmail, "Test User");
      const caller = appRouter.createCaller(ctx);

      // Test that 30-day trajectory is allowed for Plus tier
      const result = await caller.prediction.generate({
        userInput: "What will happen in my career over the next 30 days?",
        category: "career",
        trajectoryType: "30day",
      });

      expect(result).toBeDefined();
      expect(result.prediction).toBeDefined();
      expect(result.predictionId).toBeDefined();
      
      // Verify the prediction was saved with correct trajectory type
      const [savedPrediction] = await db
        .select()
        .from(predictions)
        .where(eq(predictions.id, result.predictionId))
        .limit(1);
      
      expect(savedPrediction.trajectoryType).toBe("30day");
    });

    it("should block Plus tier users from generating 90-day trajectories", async () => {
      const ctx = createTestContext(testUserId, testUserEmail, "Test User");
      const caller = appRouter.createCaller(ctx);

      // Test that 90-day trajectory is blocked for Plus tier
      try {
        await caller.prediction.generate({
          userInput: "What will happen in my career over the next 90 days?",
          category: "career",
          trajectoryType: "90day",
        });
        expect.fail("Should have thrown an error for Plus tier accessing 90-day trajectory");
      } catch (error: any) {
        expect(error.message).toContain("90-Day and Yearly Trajectory Predictions are only available for Pro");
      }
    });

    it("should allow Pro tier users to generate 90-day and yearly trajectories", async () => {
      // Update to Pro tier
      await db
        .update(subscriptions)
        .set({ tier: "pro", dailyLimit: 20 })
        .where(eq(subscriptions.userId, testUserId));

      const ctx = createTestContext(testUserId, testUserEmail, "Test User");
      const caller = appRouter.createCaller(ctx);

      // Test 90-day trajectory
      const result90day = await caller.prediction.generate({
        userInput: "What will happen in my career over the next 90 days?",
        category: "career",
        trajectoryType: "90day",
      });

      expect(result90day).toBeDefined();
      expect(result90day.prediction).toBeDefined();
      
      const [saved90day] = await db
        .select()
        .from(predictions)
        .where(eq(predictions.id, result90day.predictionId))
        .limit(1);
      
      expect(saved90day.trajectoryType).toBe("90day");

      // Test yearly trajectory
      const resultYearly = await caller.prediction.generate({
        userInput: "What will happen in my career over the next year?",
        category: "career",
        trajectoryType: "yearly",
      });

      expect(resultYearly).toBeDefined();
      expect(resultYearly.prediction).toBeDefined();
      
      const [savedYearly] = await db
        .select()
        .from(predictions)
        .where(eq(predictions.id, resultYearly.predictionId))
        .limit(1);
      
      expect(savedYearly.trajectoryType).toBe("yearly");
    });

    it("should allow Premium tier users to generate all trajectory types", async () => {
      // Update to Premium tier
      await db
        .update(subscriptions)
        .set({ tier: "premium", dailyLimit: 100 })
        .where(eq(subscriptions.userId, testUserId));

      const ctx = createTestContext(testUserId, testUserEmail, "Test User");
      const caller = appRouter.createCaller(ctx);

      // Test instant prediction
      const resultInstant = await caller.prediction.generate({
        userInput: "What will happen today?",
        category: "general",
      });
      expect(resultInstant).toBeDefined();

      // Test 30-day trajectory
      const result30day = await caller.prediction.generate({
        userInput: "What will happen in the next 30 days?",
        category: "general",
        trajectoryType: "30day",
      });
      expect(result30day).toBeDefined();

      // Test 90-day trajectory
      const result90day = await caller.prediction.generate({
        userInput: "What will happen in the next 90 days?",
        category: "general",
        trajectoryType: "90day",
      });
      expect(result90day).toBeDefined();

      // Test yearly trajectory
      const resultYearly = await caller.prediction.generate({
        userInput: "What will happen in the next year?",
        category: "general",
        trajectoryType: "yearly",
      });
      expect(resultYearly).toBeDefined();
    });
  });

  describe("Trajectory Type Storage", () => {
    it("should default to 'instant' when trajectoryType is not provided", async () => {
      const ctx = createTestContext(testUserId, testUserEmail, "Test User");
      const caller = appRouter.createCaller(ctx);

      const result = await caller.prediction.generate({
        userInput: "What will happen?",
        category: "general",
      });

      const [savedPrediction] = await db
        .select()
        .from(predictions)
        .where(eq(predictions.id, result.predictionId))
        .limit(1);
      
      expect(savedPrediction.trajectoryType).toBe("instant");
    });

    it("should correctly store trajectory type in database", async () => {
      const ctx = createTestContext(testUserId, testUserEmail, "Test User");
      const caller = appRouter.createCaller(ctx);

      const trajectoryTypes = ["30day", "90day", "yearly"] as const;

      for (const trajectoryType of trajectoryTypes) {
        const result = await caller.prediction.generate({
          userInput: `What will happen in my ${trajectoryType}?`,
          category: "general",
          trajectoryType,
        });

        const [savedPrediction] = await db
          .select()
          .from(predictions)
          .where(eq(predictions.id, result.predictionId))
          .limit(1);
        
        expect(savedPrediction.trajectoryType).toBe(trajectoryType);
      }
    });
  });

  describe("Deep Mode with Trajectories", () => {
    it("should support Deep Mode with trajectory predictions for Pro tier", async () => {
      const ctx = createTestContext(testUserId, testUserEmail, "Test User");
      const caller = appRouter.createCaller(ctx);

      const result = await caller.prediction.generate({
        userInput: "What will happen in my career over the next 90 days?",
        category: "career",
        trajectoryType: "90day",
        deepMode: true,
      });

      expect(result).toBeDefined();
      expect(result.prediction).toBeDefined();
      expect(result.deepMode).toBe(true);
      expect(result.confidenceScore).toBeDefined();
      expect(result.confidenceScore).toBeGreaterThanOrEqual(0);
      expect(result.confidenceScore).toBeLessThanOrEqual(100);

      const [savedPrediction] = await db
        .select()
        .from(predictions)
        .where(eq(predictions.id, result.predictionId))
        .limit(1);
      
      expect(savedPrediction.trajectoryType).toBe("90day");
      expect(savedPrediction.predictionMode).toBe("deep");
      expect(savedPrediction.confidenceScore).toBeDefined();
    });
  });
});
