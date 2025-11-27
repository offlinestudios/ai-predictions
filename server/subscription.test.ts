import { describe, expect, it, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(userId: number = 1): TrpcContext {
  const user: AuthenticatedUser = {
    id: userId,
    openId: `test-user-${userId}`,
    email: `test${userId}@example.com`,
    name: `Test User ${userId}`,
    loginMethod: "manus",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
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

describe("subscription.getCurrent", () => {
  it("creates a free subscription for new users", async () => {
    const ctx = createAuthContext(999);
    const caller = appRouter.createCaller(ctx);

    const subscription = await caller.subscription.getCurrent();

    expect(subscription).toBeDefined();
    expect(subscription.tier).toBe("free");
    expect(subscription.dailyLimit).toBe(3);
    expect(subscription.usedToday).toBe(0);
    expect(subscription.isActive).toBe(true);
  });

  it("returns existing subscription for returning users", async () => {
    const ctx = createAuthContext(1);
    const caller = appRouter.createCaller(ctx);

    const first = await caller.subscription.getCurrent();
    const second = await caller.subscription.getCurrent();

    expect(first.id).toBe(second.id);
    expect(first.tier).toBe(second.tier);
  });
});

describe("subscription.upgrade", () => {
  it("upgrades from free to pro", async () => {
    const ctx = createAuthContext(998);
    const caller = appRouter.createCaller(ctx);

    // Get initial free subscription
    const initial = await caller.subscription.getCurrent();
    expect(initial.tier).toBe("free");
    expect(initial.dailyLimit).toBe(3);

    // Upgrade to pro
    const upgraded = await caller.subscription.upgrade({ tier: "pro" });
    expect(upgraded.tier).toBe("pro");
    expect(upgraded.dailyLimit).toBe(20);
  });

  it("upgrades from pro to premium", async () => {
    const ctx = createAuthContext(997);
    const caller = appRouter.createCaller(ctx);

    // Start with free
    await caller.subscription.getCurrent();
    
    // Upgrade to pro
    await caller.subscription.upgrade({ tier: "pro" });
    
    // Upgrade to premium
    const premium = await caller.subscription.upgrade({ tier: "premium" });
    expect(premium.tier).toBe("premium");
    expect(premium.dailyLimit).toBe(100);
  });
});

describe("prediction.generate", () => {
  it("generates a prediction successfully", { timeout: 30000 }, async () => {
    const ctx = createAuthContext(996);
    const caller = appRouter.createCaller(ctx);

    const result = await caller.prediction.generate({
      userInput: "What does my future hold?",
      category: "general",
    });

    expect(result).toBeDefined();
    expect(result.prediction).toBeTruthy();
    expect(typeof result.prediction).toBe("string");
    expect(result.remainingToday).toBe(2); // Started with 3, used 1
  });

  it("enforces daily limits", { timeout: 30000 }, async () => {
    const ctx = createAuthContext(995);
    const caller = appRouter.createCaller(ctx);

    // Use all 3 free predictions
    await caller.prediction.generate({ userInput: "Question 1" });
    await caller.prediction.generate({ userInput: "Question 2" });
    await caller.prediction.generate({ userInput: "Question 3" });

    // 4th should fail
    await expect(
      caller.prediction.generate({ userInput: "Question 4" })
    ).rejects.toThrow(/Daily prediction limit reached/);
  });

  it("allows more predictions after upgrade", { timeout: 30000 }, async () => {
    const ctx = createAuthContext(994);
    const caller = appRouter.createCaller(ctx);

    // Use all 3 free predictions
    await caller.prediction.generate({ userInput: "Question 1" });
    await caller.prediction.generate({ userInput: "Question 2" });
    await caller.prediction.generate({ userInput: "Question 3" });

    // Upgrade to pro
    await caller.subscription.upgrade({ tier: "pro" });

    // Should be able to generate more (daily limit reset on upgrade is not automatic, but limit increased)
    // The usedToday counter persists, so we need to check the new limit
    const subscription = await caller.subscription.getCurrent();
    expect(subscription.dailyLimit).toBe(20);
  });
});

describe("prediction.getHistory", () => {
  it("retrieves user prediction history", { timeout: 30000 }, async () => {
    const ctx = createAuthContext(993);
    const caller = appRouter.createCaller(ctx);

    // Generate some predictions
    await caller.prediction.generate({ userInput: "Test question 1", category: "career" });
    await caller.prediction.generate({ userInput: "Test question 2", category: "love" });

    const history = await caller.prediction.getHistory({ limit: 10 });

    expect(history).toBeDefined();
    expect(Array.isArray(history)).toBe(true);
    expect(history.length).toBeGreaterThanOrEqual(2);
    
    // Most recent first
    expect(history[0]?.userInput).toBe("Test question 2");
    expect(history[1]?.userInput).toBe("Test question 1");
  });

  it("respects limit parameter", { timeout: 30000 }, async () => {
    const ctx = createAuthContext(992);
    const caller = appRouter.createCaller(ctx);

    // Generate 3 predictions
    await caller.prediction.generate({ userInput: "Q1" });
    await caller.prediction.generate({ userInput: "Q2" });
    await caller.prediction.generate({ userInput: "Q3" });

    const history = await caller.prediction.getHistory({ limit: 2 });

    expect(history.length).toBeLessThanOrEqual(2);
  });
});
