// Progressive Deepening Logic
// Handles adding interest categories after initial onboarding

import { getDb } from "./db";
import { users, psycheProfiles, onboardingResponses } from "../drizzle/schema";
import { eq, sql } from "drizzle-orm";

interface DeepeningResponse {
  questionId: string;
  questionText: string;
  selectedOption: string;
  answerText: string;
  category: string;
  indicators: string[];
  domainInsight: string;
  parameters?: Record<string, number>;
}

/**
 * Check if user should see the progressive deepening prompt
 */
export async function shouldShowDeepeningPrompt(userId: number): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;

  const userResult = await db
    .select()
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  if (userResult.length === 0) return false;
  const user = userResult[0];

  // Parse current interests
  const currentInterests = user.interests ? JSON.parse(user.interests) : [];
  
  // Don't show if user has all 6 categories
  if (currentInterests.length >= 6) return false;
  
  // Don't show if dismissed 3 times (handle missing column)
  const dismissedCount = (user as any).deepeningDismissedCount || 0;
  if (dismissedCount >= 3) return false;
  
  // Don't show if prompted in last 24 hours (handle missing column)
  const promptedAt = (user as any).deepeningPromptedAt;
  if (promptedAt) {
    const hoursSincePrompt = (Date.now() - new Date(promptedAt).getTime()) / (1000 * 60 * 60);
    if (hoursSincePrompt < 24) return false;
  }
  
  // Show after 3 predictions for first deepening (handle missing column)
  const predictionCount = (user as any).predictionCount || 0;
  if (currentInterests.length === 1 && predictionCount >= 3) return true;
  
  // Show after 5 more predictions for subsequent deepenings
  const predictionsNeeded = currentInterests.length * 5;
  if (currentInterests.length > 1 && predictionCount >= predictionsNeeded) return true;
  
  return false;
}

/**
 * Get available categories for user to add
 */
export async function getAvailableCategories(userId: number): Promise<string[]> {
  const db = await getDb();
  if (!db) return [];

  const userResult = await db
    .select()
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  if (userResult.length === 0) return [];
  const user = userResult[0];

  const allCategories = ["career", "love", "finance", "health", "sports", "stocks"];
  const currentInterests = user.interests ? JSON.parse(user.interests) : [];
  
  return allCategories.filter(cat => !currentInterests.includes(cat));
}

/**
 * Calculate cross-domain insights from responses across multiple categories
 */
export function calculateCrossDomainInsights(
  responses: DeepeningResponse[],
  existingInsights: string[] = []
): string[] {
  const insights: string[] = [...existingInsights];
  
  // Group responses by category
  const categoriesInvolved = [...new Set(responses.map(r => r.category))];
  
  if (categoriesInvolved.length < 2) {
    // Not enough categories for cross-domain insights yet
    return insights;
  }
  
  // Count indicator occurrences across categories
  const indicatorCounts: Record<string, Set<string>> = {};
  
  responses.forEach(response => {
    response.indicators.forEach(indicator => {
      if (!indicatorCounts[indicator]) {
        indicatorCounts[indicator] = new Set();
      }
      indicatorCounts[indicator].add(response.category);
    });
  });
  
  // Generate insights for indicators appearing in multiple categories
  Object.entries(indicatorCounts).forEach(([indicator, categories]) => {
    if (categories.size >= 2) {
      const insight = generateCrossDomainInsight(indicator, Array.from(categories));
      if (insight && !insights.includes(insight)) {
        insights.push(insight);
      }
    }
  });
  
  return insights;
}

/**
 * Generate human-readable cross-domain insight text
 */
function generateCrossDomainInsight(indicator: string, categories: string[]): string {
  const categoryNames: Record<string, string> = {
    career: "Career",
    love: "Relationships",
    finance: "Financial",
    health: "Health",
    sports: "Sports",
    stocks: "Investment",
  };
  
  const categoryLabels = categories.map(c => categoryNames[c] || c);
  const categoryText = categoryLabels.length === 2
    ? `${categoryLabels[0]} and ${categoryLabels[1]}`
    : `${categoryLabels.slice(0, -1).join(", ")}, and ${categoryLabels[categoryLabels.length - 1]}`;
  
  const insightTemplates: Record<string, string> = {
    ambitious_builder: `You bring growth-oriented thinking to ${categoryText} decisions`,
    quiet_strategist: `You apply analytical precision across ${categoryText}`,
    intuitive_empath: `You trust emotional wisdom in both ${categoryText} contexts`,
    momentum_chaser: `You seek quick wins and immediate feedback in ${categoryText}`,
    stabilizer: `You prioritize security and consistency across ${categoryText}`,
    escapist_romantic: `You seek meaning and depth in ${categoryText} choices`,
    emotional_fan: `You make emotionally-driven decisions in ${categoryText}`,
    pattern_analyst: `You identify patterns and trends across ${categoryText}`,
    revenge_bettor: `You respond emotionally to setbacks in ${categoryText}`,
    long_term_builder: `You take a patient, long-term view of ${categoryText}`,
    fear_based_seller: `You tend toward caution and risk-aversion in ${categoryText}`,
    risk_addict: `You embrace high-risk opportunities in ${categoryText}`,
  };
  
  return insightTemplates[indicator] || `Consistent ${indicator} pattern across ${categoryText}`;
}

/**
 * Add interest categories and update user profile
 */
export async function addInterestCategories(
  userId: number,
  newCategories: string[],
  responses: DeepeningResponse[]
): Promise<{
  success: boolean;
  updatedInterests: string[];
  crossDomainInsights: string[];
  profileCompleteness: number;
}> {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");

  // Get current user data
  const userResult = await db
    .select()
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  if (userResult.length === 0) throw new Error("User not found");
  const user = userResult[0];

  // Parse current interests
  const currentInterests = user.interests ? JSON.parse(user.interests) : [];
  const updatedInterests = [...currentInterests, ...newCategories];

  // Update user interests
  await db
    .update(users)
    .set({
      interests: JSON.stringify(updatedInterests),
      updatedAt: new Date(),
    })
    .where(eq(users.id, userId));

  // Save responses to onboarding_responses table
  for (const response of responses) {
    await db.insert(onboardingResponses).values({
      userId,
      questionId: 2000 + parseInt(response.questionId.split("_")[1] || "0"),
      questionText: response.questionText,
      selectedOption: response.selectedOption,
      answerText: response.answerText,
      mappedPsycheTypes: JSON.stringify(response.indicators),
    });
  }

  // Get existing profile
  const profileResult = await db
    .select()
    .from(psycheProfiles)
    .where(eq(psycheProfiles.userId, userId))
    .limit(1);

  if (profileResult.length === 0) throw new Error("Profile not found");
  const profile = profileResult[0];

  // Calculate cross-domain insights (handle missing column)
  const existingInsights = (profile as any).crossDomainInsights
    ? JSON.parse((profile as any).crossDomainInsights)
    : [];
  const crossDomainInsights = calculateCrossDomainInsights(responses, existingInsights);

  // Calculate profile completeness (each category = 16.67%, rounded)
  const profileCompleteness = Math.round((updatedInterests.length / 6) * 100);

  // Update psyche profile (handle missing columns)
  try {
    await db
      .update(psycheProfiles)
      .set({
        secondaryInterests: JSON.stringify(newCategories),
        crossDomainInsights: JSON.stringify(crossDomainInsights),
        profileCompleteness,
        updatedAt: new Date(),
      })
      .where(eq(psycheProfiles.userId, userId));
  } catch (error) {
    // Columns don't exist yet, just update the interests in users table
    console.log('[addInterestCategories] Profile columns not yet migrated, skipping profile update');
  }

  return {
    success: true,
    updatedInterests,
    crossDomainInsights,
    profileCompleteness,
  };
}

/**
 * Record that user dismissed the deepening prompt
 */
export async function dismissDeepeningPrompt(userId: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");

  // Check if columns exist before updating
  try {
    await db
      .update(users)
      .set({
        deepeningPromptedAt: new Date(),
        deepeningDismissedCount: sql`COALESCE(${users.deepeningDismissedCount}, 0) + 1`,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId));
  } catch (error) {
    // Columns don't exist yet, silently fail
    console.log('[dismissDeepeningPrompt] Columns not yet migrated, skipping');
  }
}

/**
 * Increment user's prediction count
 */
export async function incrementPredictionCount(userId: number): Promise<void> {
  const db = await getDb();
  if (!db) return;

  // Check if predictionCount column exists before updating
  try {
    await db
      .update(users)
      .set({
        predictionCount: sql`COALESCE(${users.predictionCount}, 0) + 1`,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId));
  } catch (error) {
    // Column doesn't exist yet, silently fail
    console.log('[incrementPredictionCount] Column not yet migrated, skipping');
  }
}
