/**
 * Stripe Products and Prices Configuration
 * 
 * Define your subscription tiers here.
 * These will be created in Stripe Dashboard or via API.
 * 
 * Pricing Psychology:
 * - Free: Limited depth, short-term only
 * - Plus: Unlimited predictions + 30-day trajectory
 * - Pro: 90-day trajectory + alternate scenarios
 * - Premium Yearly: Best value, everything + yearly forecasts
 */

export const STRIPE_PRODUCTS = {
  plus: {
    name: "Plus Plan",
    description: "Unlimited predictions with 30-day trajectory insights",
    priceMonthly: 999, // $9.99 in cents
    priceYearly: 9588, // $7.99/month billed yearly (20% off) in cents
    features: [
      "Unlimited predictions",
      "30-day trajectory forecasts",
      "Deep Prediction Mode",
      "Advanced confidence scores",
      "Unlimited prediction history",
      "File upload support",
      "All prediction categories",
      "Plus badge",
    ],
    dailyLimit: -1, // unlimited
    historyDepth: -1, // unlimited
    deepMode: true,
    confidenceScores: true,
    trajectoryAccess: ["instant", "30day"] as const,
    badge: "pro" as const, // Using pro badge for Plus tier
  },
  pro: {
    name: "Pro Plan",
    description: "90-day forecasts with alternate scenario analysis",
    priceMonthly: 1999, // $19.99 in cents
    priceYearly: 19188, // $15.99/month billed yearly (20% off) in cents
    features: [
      "Everything in Plus",
      "90-day trajectory forecasts",
      "Alternate future scenarios",
      "Personalized yearly overview",
      "Chat-based prediction analysis",
      "\"Ask anything\" mode",
      "Prediction tracking dashboard",
      "Priority support",
      "Pro crown badge",
    ],
    dailyLimit: -1, // unlimited
    historyDepth: -1, // unlimited
    deepMode: true,
    confidenceScores: true,
    trajectoryAccess: ["instant", "30day", "90day"] as const,
    alternateScenarios: true,
    trackingDashboard: true,
    yearlyOverview: true,
    chatMode: true,
    badge: "premium" as const, // Using premium badge for Pro tier
  },
  premium: {
    name: "Premium Plan (Yearly)",
    description: "Complete forecasting system with lifetime updates",
    priceMonthly: undefined, // Not available monthly
    priceYearly: 5900, // $59/year in cents
    features: [
      "EVERYTHING in Pro",
      "Yearly macro-reading & forecasts",
      "Major life event predictions",
      "\"What if I choose X?\" scenarios",
      "Relationship compatibility analysis",
      "Lifetime monthly accuracy tuning",
      "All future updates included",
      "VIP support & early access",
      "Premium crown badge",
    ],
    dailyLimit: -1, // unlimited
    historyDepth: -1, // unlimited
    deepMode: true,
    confidenceScores: true,
    trajectoryAccess: ["instant", "30day", "90day", "yearly"] as const,
    alternateScenarios: true,
    trackingDashboard: true,
    yearlyOverview: true,
    yearlyForecasts: true,
    majorLifeEvents: true,
    relationshipCompatibility: true,
    accuracyTuning: true,
    allFutureUpdates: true,
    chatMode: true,
    earlyAccess: true,
    badge: "premium" as const,
  },
} as const;

export const FREE_TIER = {
  name: "Free Plan",
  description: "Try AI predictions with weekly limits",
  features: [
    "3 predictions per week",
    "Short-form insights only",
    "No long-term trajectory",
    "No alternate scenarios",
    "7-day prediction history",
    "Basic features",
  ],
  weeklyLimit: 3,
  historyDepth: 7, // days
  deepMode: false,
  confidenceScores: false,
  trajectoryAccess: ["instant"] as const,
  badge: "none" as const,
} as const;

export type SubscriptionTier = keyof typeof STRIPE_PRODUCTS;
