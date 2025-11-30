import { pgTable, serial, varchar, text, timestamp, boolean, pgEnum, integer } from "drizzle-orm/pg-core";

// Define enums before using them in tables
export const roleEnum = pgEnum("role", ["user", "admin"]);
export const tierEnum = pgEnum("tier", ["free", "pro", "premium"]);

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
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Prediction = typeof predictions.$inferSelect;
export type InsertPrediction = typeof predictions.$inferInsert;
