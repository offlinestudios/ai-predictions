import { pgTable, serial, varchar, text, timestamp, boolean, pgEnum, integer } from "drizzle-orm/pg-core";

// Define enums before using them in tables
export const roleEnum = pgEnum("role", ["user", "admin"]);
export const tierEnum = pgEnum("tier", ["free", "plus", "pro", "premium"]);
export const badgeEnum = pgEnum("badge", ["none", "plus", "pro", "premium"]);
export const predictionModeEnum = pgEnum("predictionMode", ["standard", "deep"]);
export const trajectoryTypeEnum = pgEnum("trajectoryType", ["instant", "30day", "90day", "yearly"]);

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = pgTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: serial("id").primaryKey(),
  /** OAuth identifier (Clerk user ID or Manus openId). Unique per user. */
  openId: varchar("openId", { length: 255 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: roleEnum("role").default("user").notNull(),
  /** User badge based on subscription tier */
  badge: badgeEnum("badge").default("none").notNull(),
  /** Onboarding personalization fields */
  nickname: varchar("nickname", { length: 100 }),
  gender: varchar("gender", { length: 20 }),
  relationshipStatus: varchar("relationshipStatus", { length: 50 }),
  interests: text("interests"), // JSON array of selected interests
  onboardingCompleted: boolean("onboardingCompleted").default(false).notNull(),
  /** Category-specific micro-question responses stored as JSON */
  careerProfile: text("careerProfile"), // JSON: position, direction, challenge, timeline, satisfaction
  moneyProfile: text("moneyProfile"), // JSON: stage, goal, incomeSource, stability, milestone
  loveProfile: text("loveProfile"), // JSON: goal, patterns, desires
  healthProfile: text("healthProfile"), // JSON: state, focus, consistency, obstacle
  /** Premium precision data for enhanced predictions */
  ageRange: varchar("ageRange", { length: 20 }), // e.g., "25-34", "35-44"
  location: varchar("location", { length: 100 }), // City or region
  incomeRange: varchar("incomeRange", { length: 50 }), // Income bracket
  industry: varchar("industry", { length: 100 }), // Professional industry/field
  majorTransition: boolean("majorTransition").default(false), // Undergoing major life change
  transitionType: varchar("transitionType", { length: 100 }), // Type of transition if applicable
  premiumDataCompleted: boolean("premiumDataCompleted").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Subscription tiers and user subscription status
 */
export const subscriptions = pgTable("subscriptions", {
  id: serial("id").primaryKey(),
  userId: integer("userId").notNull(),
  tier: tierEnum("tier").default("free").notNull(),
  /** Number of predictions allowed per day based on tier */
  dailyLimit: integer("dailyLimit").notNull().default(3),
  /** Number of predictions used today */
  usedToday: integer("usedToday").notNull().default(0),
  /** Total predictions used (lifetime) - used for free tier limit */
  totalUsed: integer("totalUsed").notNull().default(0),
  /** Last reset date for daily counter (stored as timestamp) */
  lastResetDate: timestamp("lastResetDate").defaultNow().notNull(),
  /** Current prediction streak (consecutive days) */
  currentStreak: integer("currentStreak").notNull().default(0),
  /** Longest prediction streak ever */
  longestStreak: integer("longestStreak").notNull().default(0),
  /** Last prediction date for streak tracking */
  lastPredictionDate: timestamp("lastPredictionDate"),
  /** Billing interval: monthly or yearly */
  billingInterval: varchar("billingInterval", { length: 20 }).default("monthly"),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type Subscription = typeof subscriptions.$inferSelect;
export type InsertSubscription = typeof subscriptions.$inferInsert;

/**
 * User prediction history
 */
export const predictions = pgTable("predictions", {
  id: serial("id").primaryKey(),
  userId: integer("userId").notNull(),
  /** User's input/question for the prediction */
  userInput: text("userInput").notNull(),
  /** AI-generated prediction result */
  predictionResult: text("predictionResult").notNull(),
  /** Category of prediction (career, love, finance, health, general) */
  category: varchar("category", { length: 50 }),
  /** JSON array of uploaded file URLs for context */
  attachmentUrls: text("attachmentUrls"),
  /** User feedback: 'like', 'dislike', or null */
  userFeedback: varchar("userFeedback", { length: 10 }),
  /** Timestamp when feedback was given */
  feedbackAt: timestamp("feedbackAt"),
  /** Unique token for shareable links */
  shareToken: varchar("shareToken", { length: 32 }).unique(),
  /** Confidence score (0-100) - AI's confidence in prediction accuracy */
  confidenceScore: integer("confidenceScore"),
  /** Prediction mode used: standard or deep */
  predictionMode: predictionModeEnum("predictionMode").default("standard").notNull(),
  /** Timeline for prediction (e.g., "1 week", "3 months", "1 year") */
  predictionTimeline: varchar("predictionTimeline", { length: 50 }),
  /** Trajectory type: instant (immediate), 30day, 90day, or yearly forecast */
  trajectoryType: trajectoryTypeEnum("trajectoryType").default("instant").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Prediction = typeof predictions.$inferSelect;
export type InsertPrediction = typeof predictions.$inferInsert;
