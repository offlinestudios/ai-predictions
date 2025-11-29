/**
 * Stripe Products and Prices Configuration
 * 
 * Define your subscription tiers here.
 * These will be created in Stripe Dashboard or via API.
 */

export const STRIPE_PRODUCTS = {
  pro: {
    name: "Pro Plan",
    description: "20 predictions per day with full history access",
    priceMonthly: 999, // $9.99 in cents
    priceYearly: 9900, // $99/year in cents
    features: [
      "20 predictions per day",
      "Full prediction history",
      "File upload support",
      "Priority support",
    ],
  },
  premium: {
    name: "Premium Plan",
    description: "100 predictions per day with premium features",
    priceMonthly: 1999, // $19.99 in cents
    priceYearly: 19900, // $199/year in cents
    features: [
      "100 predictions per day",
      "Full prediction history",
      "File upload support",
      "Priority support",
      "Advanced AI models",
      "Custom categories",
    ],
  },
} as const;

export type SubscriptionTier = keyof typeof STRIPE_PRODUCTS;
