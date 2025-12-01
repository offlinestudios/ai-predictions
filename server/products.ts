/**
 * Stripe Products and Prices Configuration
 * 
 * Define your subscription tiers here.
 * These will be created in Stripe Dashboard or via API.
 */

export const STRIPE_PRODUCTS = {
  starter: {
    name: "Starter Plan",
    description: "Perfect for casual users exploring AI predictions",
    priceMonthly: 499, // $4.99 in cents
    priceYearly: 4788, // $3.99/month billed yearly (20% off) in cents
    features: [
      "3 predictions per day",
      "Standard prediction mode",
      "Basic confidence scores",
      "30-day prediction history",
      "File upload support",
    ],
    dailyLimit: 3,
    historyDepth: 30, // days
    deepMode: false,
    confidenceScores: true,
    badge: "starter" as const,
  },
  pro: {
    name: "Pro Plan - Smarter Predictions",
    description: "Enhanced AI insights for serious forecasters",
    priceMonthly: 999, // $9.99 in cents
    priceYearly: 9588, // $7.99/month billed yearly (20% off) in cents
    features: [
      "20 predictions per day",
      "Deep Prediction Mode unlocked",
      "Advanced confidence scores",
      "Unlimited prediction history",
      "Category-specific enhancements",
      "File upload support",
      "Priority support",
      "Pro badge & status",
    ],
    dailyLimit: 20,
    historyDepth: -1, // unlimited
    deepMode: true,
    confidenceScores: true,
    badge: "pro" as const,
  },
  premium: {
    name: "Premium Plan - Professional Insights",
    description: "Complete forecasting toolkit for power users",
    priceMonthly: 2999, // $29.99 in cents
    priceYearly: 28788, // $23.99/month billed yearly (20% off) in cents
    features: [
      "Unlimited predictions",
      "Deep Prediction Mode",
      "Expert-level confidence analysis",
      "Prediction tracking dashboard",
      "Batch prediction processing",
      "Long-term timeline predictions",
      "Advanced category insights",
      "Early access to new features",
      "Premium crown badge",
      "VIP support",
    ],
    dailyLimit: -1, // unlimited
    historyDepth: -1, // unlimited
    deepMode: true,
    confidenceScores: true,
    batchPredictions: true,
    trackingDashboard: true,
    longTermTimelines: true,
    earlyAccess: true,
    badge: "premium" as const,
  },
} as const;

export const FREE_TIER = {
  name: "Free Plan",
  description: "Try AI predictions with weekly limits",
  features: [
    "3 predictions per week",
    "Standard prediction mode",
    "7-day prediction history",
    "Basic features",
  ],
  weeklyLimit: 3,
  historyDepth: 7, // days
  deepMode: false,
  confidenceScores: false,
  badge: "none" as const,
} as const;

export type SubscriptionTier = keyof typeof STRIPE_PRODUCTS;
