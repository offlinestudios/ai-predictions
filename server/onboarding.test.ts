import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { appRouter } from "./routers";
import { getDb } from "./db";
import { users } from "../drizzle/schema";
import { eq } from "drizzle-orm";

describe("Category-Specific Onboarding", () => {
  let testUserId: number;
  let testOpenId: string;

  beforeAll(async () => {
    // Create a test user
    const db = await getDb();
    if (!db) throw new Error("Database unavailable");

    testOpenId = `test-onboarding-${Date.now()}`;
    const [user] = await db
      .insert(users)
      .values({
        openId: testOpenId,
        name: "Test User",
        email: "test@example.com",
        role: "user",
      })
      .returning();
    
    testUserId = user.id;
  });

  afterAll(async () => {
    // Clean up test user
    const db = await getDb();
    if (!db) return;

    await db.delete(users).where(eq(users.id, testUserId));
  });

  it("should save onboarding data with career profile", async () => {
    const caller = appRouter.createCaller({
      user: {
        id: testUserId,
        openId: testOpenId,
        name: "Test User",
        email: "test@example.com",
        role: "user" as const,
        badge: "none" as const,
      },
      req: {} as any,
      res: {} as any,
    });

    const result = await caller.user.saveOnboarding({
      nickname: "TestNick",
      interests: ["career"],
      relationshipStatus: "single",
      careerProfile: {
        position: "mid",
        direction: "promotion",
        challenge: "recognition",
        timeline: "6mo",
      },
    });

    expect(result.success).toBe(true);
    expect(result.welcomePrediction).toBeDefined();

    // Verify data was saved to database
    const db = await getDb();
    if (!db) throw new Error("Database unavailable");

    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, testUserId));

    expect(user.nickname).toBe("TestNick");
    expect(user.onboardingCompleted).toBe(true);
    expect(user.careerProfile).toBeDefined();
    
    const careerProfile = JSON.parse(user.careerProfile!);
    expect(careerProfile.position).toBe("mid");
    expect(careerProfile.direction).toBe("promotion");
    expect(careerProfile.challenge).toBe("recognition");
    expect(careerProfile.timeline).toBe("6mo");
  });

  it("should save onboarding data with multiple category profiles", async () => {
    // Update test user to reset onboarding
    const db = await getDb();
    if (!db) throw new Error("Database unavailable");

    await db
      .update(users)
      .set({ onboardingCompleted: false })
      .where(eq(users.id, testUserId));

    const caller = appRouter.createCaller({
      user: {
        id: testUserId,
        openId: testOpenId,
        name: "Test User",
        email: "test@example.com",
        role: "user" as const,
        badge: "none" as const,
      },
      req: {} as any,
      res: {} as any,
    });

    const result = await caller.user.saveOnboarding({
      nickname: "MultiProfile",
      interests: ["career", "finance", "love"],
      relationshipStatus: "dating",
      careerProfile: {
        position: "early",
        direction: "new-job",
        challenge: "opportunities",
        timeline: "3mo",
      },
      moneyProfile: {
        stage: "building",
        goal: "income",
        incomeSource: "salary",
        stability: "very-stable",
      },
      loveProfile: {
        goal: "improve",
        patterns: "stable",
        desires: "clarity",
      },
    });

    expect(result.success).toBe(true);

    // Verify all profiles were saved
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, testUserId));

    expect(user.careerProfile).toBeDefined();
    expect(user.moneyProfile).toBeDefined();
    expect(user.loveProfile).toBeDefined();

    const careerProfile = JSON.parse(user.careerProfile!);
    const moneyProfile = JSON.parse(user.moneyProfile!);
    const loveProfile = JSON.parse(user.loveProfile!);

    expect(careerProfile.position).toBe("early");
    expect(moneyProfile.stage).toBe("building");
    expect(loveProfile.goal).toBe("improve");
  });

  it("should generate personalized welcome prediction using profile data", async () => {
    const caller = appRouter.createCaller({
      user: {
        id: testUserId,
        openId: testOpenId,
        name: "Test User",
        email: "test@example.com",
        role: "user" as const,
        badge: "none" as const,
      },
      req: {} as any,
      res: {} as any,
    });

    const result = await caller.user.saveOnboarding({
      nickname: "CareerFocused",
      interests: ["career"],
      relationshipStatus: "single",
      careerProfile: {
        position: "senior",
        direction: "start-business",
        challenge: "time",
        timeline: "immediate",
      },
    });

    expect(result.success).toBe(true);
    expect(result.welcomePrediction).toBeDefined();
    expect(result.confidenceScore).toBeGreaterThan(0);
    expect(result.confidenceScore).toBeLessThanOrEqual(100);

    // Prediction should be substantial (400-500 words ≈ 2000-2500 characters)
    const predictionLength = (result.welcomePrediction as string).length;
    expect(predictionLength).toBeGreaterThan(1000);
  });
});
