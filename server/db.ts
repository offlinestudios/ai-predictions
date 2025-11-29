import { eq, desc, and, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { InsertUser, users, subscriptions, predictions, InsertSubscription, InsertPrediction } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      const client = postgres(process.env.DATABASE_URL);
      _db = drizzle(client);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    // Always update lastSignedIn and updatedAt on duplicate key
    updateSet.lastSignedIn = values.lastSignedIn;
    updateSet.updatedAt = new Date();

    await db.insert(users).values(values).onConflictDoUpdate({
      target: users.openId,
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Subscription helpers
export async function getOrCreateSubscription(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const existing = await db.select().from(subscriptions).where(eq(subscriptions.userId, userId)).limit(1);
  
  if (existing.length > 0) {
    return existing[0];
  }

  // Create free tier subscription for new users
  const newSub: InsertSubscription = {
    userId,
    tier: "free",
    dailyLimit: 3,
    usedToday: 0,
    isActive: true,
  };

  await db.insert(subscriptions).values(newSub);
  const created = await db.select().from(subscriptions).where(eq(subscriptions.userId, userId)).limit(1);
  return created[0]!;
}

export async function updateSubscriptionTier(userId: number, tier: "free" | "pro" | "premium") {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const dailyLimits = {
    free: 3,
    pro: 20,
    premium: 100,
  };

  await db.update(subscriptions)
    .set({ 
      tier, 
      dailyLimit: dailyLimits[tier],
      updatedAt: new Date(),
    })
    .where(eq(subscriptions.userId, userId));

  return getOrCreateSubscription(userId);
}

export async function checkAndResetDailyLimit(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const sub = await getOrCreateSubscription(userId);
  const now = new Date();
  const lastReset = new Date(sub.lastResetDate);
  
  // For free tier, use total limit instead of daily limit
  if (sub.tier === "free") {
    // Free tier has a lifetime limit of 3 predictions
    return sub;
  }
  
  // For paid tiers (pro, premium), reset daily
  const needsReset = now.getDate() !== lastReset.getDate() || 
                     now.getMonth() !== lastReset.getMonth() || 
                     now.getFullYear() !== lastReset.getFullYear();

  if (needsReset) {
    await db.update(subscriptions)
      .set({ 
        usedToday: 0, 
        lastResetDate: now,
        updatedAt: now,
      })
      .where(eq(subscriptions.userId, userId));
    
    return { ...sub, usedToday: 0, lastResetDate: now };
  }

  return sub;
}

export async function incrementPredictionUsage(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(subscriptions)
    .set({ 
      usedToday: sql`${subscriptions.usedToday} + 1`,
      totalUsed: sql`${subscriptions.totalUsed} + 1`,
      updatedAt: new Date(),
    })
    .where(eq(subscriptions.userId, userId));
}

// Prediction helpers
export async function createPrediction(data: InsertPrediction) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.insert(predictions).values(data);
}

export async function getUserPredictions(userId: number, limit: number = 50) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db.select()
    .from(predictions)
    .where(eq(predictions.userId, userId))
    .orderBy(desc(predictions.createdAt))
    .limit(limit);
}
