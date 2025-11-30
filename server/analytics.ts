import { getDb } from "./db";
import { users, subscriptions, predictions } from "../drizzle/schema";
import { eq, sql, and, gte, desc } from "drizzle-orm";

/**
 * Get total user count and breakdown by tier
 */
export async function getUserStats() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  // Total users
  const totalResult = await db.select({ count: sql<number>`count(*)` }).from(users);
  const total = Number(totalResult[0]?.count || 0);

  // Users by tier
  const tierStats = await db
    .select({
      tier: subscriptions.tier,
      count: sql<number>`count(*)`,
    })
    .from(subscriptions)
    .groupBy(subscriptions.tier);

  const tierCounts = {
    free: 0,
    pro: 0,
    premium: 0,
  };

  tierStats.forEach((stat) => {
    tierCounts[stat.tier as keyof typeof tierCounts] = Number(stat.count);
  });

  return {
    total,
    ...tierCounts,
  };
}

/**
 * Get prediction stats
 */
export async function getPredictionStats() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  // Total predictions
  const totalResult = await db.select({ count: sql<number>`count(*)` }).from(predictions);
  const total = Number(totalResult[0]?.count || 0);

  // Predictions by category
  const categoryStats = await db
    .select({
      category: predictions.category,
      count: sql<number>`count(*)`,
    })
    .from(predictions)
    .groupBy(predictions.category);

  // Predictions with feedback
  const feedbackStats = await db
    .select({
      feedback: predictions.userFeedback,
      count: sql<number>`count(*)`,
    })
    .from(predictions)
    .where(sql`${predictions.userFeedback} IS NOT NULL`)
    .groupBy(predictions.userFeedback);

  return {
    total,
    byCategory: categoryStats.map((s) => ({ category: s.category || "unknown", count: Number(s.count) })),
    byFeedback: feedbackStats.map((s) => ({ feedback: s.feedback || "none", count: Number(s.count) })),
  };
}

/**
 * Get sharing stats
 */
export async function getSharingStats() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  // Total shared predictions (those with shareToken)
  const sharedResult = await db
    .select({ count: sql<number>`count(*)` })
    .from(predictions)
    .where(sql`${predictions.shareToken} IS NOT NULL`);

  const totalShared = Number(sharedResult[0]?.count || 0);

  // Most liked predictions (potential viral content)
  const mostLiked = await db
    .select({
      id: predictions.id,
      userInput: predictions.userInput,
      category: predictions.category,
      shareToken: predictions.shareToken,
    })
    .from(predictions)
    .where(eq(predictions.userFeedback, "like"))
    .orderBy(desc(predictions.createdAt))
    .limit(10);

  return {
    totalShared,
    mostLiked,
  };
}

/**
 * Get revenue metrics (estimated based on subscription tiers)
 */
export async function getRevenueMetrics() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const tierCounts = await db
    .select({
      tier: subscriptions.tier,
      count: sql<number>`count(*)`,
    })
    .from(subscriptions)
    .where(eq(subscriptions.isActive, true))
    .groupBy(subscriptions.tier);

  // Pricing: Pro = $9.99, Premium = $19.99
  let mrr = 0;
  tierCounts.forEach((stat) => {
    const count = Number(stat.count);
    if (stat.tier === "pro") mrr += count * 9.99;
    if (stat.tier === "premium") mrr += count * 19.99;
  });

  return {
    mrr: Math.round(mrr * 100) / 100,
    arr: Math.round(mrr * 12 * 100) / 100,
  };
}

/**
 * Get conversion rates
 */
export async function getConversionRates() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const stats = await getUserStats();

  const freeToProRate = stats.free > 0 ? ((stats.pro / (stats.free + stats.pro + stats.premium)) * 100).toFixed(2) : "0.00";
  const freeToPremiumRate = stats.free > 0 ? ((stats.premium / (stats.free + stats.pro + stats.premium)) * 100).toFixed(2) : "0.00";
  const overallConversionRate = stats.total > 0 ? (((stats.pro + stats.premium) / stats.total) * 100).toFixed(2) : "0.00";

  return {
    freeToProRate: parseFloat(freeToProRate),
    freeToPremiumRate: parseFloat(freeToPremiumRate),
    overallConversionRate: parseFloat(overallConversionRate),
  };
}

/**
 * Get recent activity (last 30 days)
 */
export async function getRecentActivity() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  // New users in last 30 days
  const newUsersResult = await db
    .select({ count: sql<number>`count(*)` })
    .from(users)
    .where(gte(users.createdAt, thirtyDaysAgo));

  // New predictions in last 30 days
  const newPredictionsResult = await db
    .select({ count: sql<number>`count(*)` })
    .from(predictions)
    .where(gte(predictions.createdAt, thirtyDaysAgo));

  return {
    newUsers: Number(newUsersResult[0]?.count || 0),
    newPredictions: Number(newPredictionsResult[0]?.count || 0),
  };
}
