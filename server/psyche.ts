import { getDb } from "./db";
import { psycheProfiles, onboardingResponses, users } from "../drizzle/schema";
import { eq, desc } from "drizzle-orm";

// Psyche type definitions with parameters - using new archetype names
export const PSYCHE_TYPES = {
  maverick: {
    displayName: "The Maverick",
    description: "You're drawn to volatility, high stakes, and bold moves. You thrive on turning uncertainty into opportunity.",
    coreTraits: [
      "Bold decision-making",
      "Instinct-driven action",
      "Thriving in chaos",
      "Inspiring leadership"
    ],
    decisionMakingStyle: "You make bold, high-risk decisions quickly, trusting your instincts and drawn to opportunities with extreme upside.",
    growthEdge: "Adding structure and patience to your risk-taking will help you survive long enough to hit your big wins.",
    parameters: {
      risk_appetite: 0.9,
      emotional_reactivity: 0.7,
      time_consistency: 0.4,
      data_orientation: 0.4,
      volatility_tolerance: 0.9
    }
  },
  strategist: {
    displayName: "The Strategist",
    description: "You make decisions through careful analysis and strategic thinking. You value clarity, timing, and pattern recognition in all aspects of life.",
    coreTraits: [
      "Exceptional pattern recognition",
      "Calm under pressure",
      "Long-term vision",
      "Disciplined execution"
    ],
    decisionMakingStyle: "You prefer to analyze situations thoroughly before acting, looking for patterns and optimal timing. You trust structure and logic over gut feelings.",
    growthEdge: "Balancing analytical precision with emotional intuition will help you capture opportunities that don't fit neat patterns.",
    parameters: {
      risk_appetite: 0.3,
      emotional_reactivity: 0.3,
      time_consistency: 0.8,
      data_orientation: 0.9,
      volatility_tolerance: 0.4
    }
  },
  visionary: {
    displayName: "The Visionary",
    description: "You're driven by growth, leverage, and forward momentum. You see opportunities where others see obstacles and move decisively toward expansion.",
    coreTraits: [
      "Big-picture thinking",
      "Calculated risk-taking",
      "Inspiring others",
      "Strategic ambition"
    ],
    decisionMakingStyle: "You make decisions quickly when you see potential for growth, willing to take calculated risks for disproportionate returns.",
    growthEdge: "Balancing your drive for expansion with sustainable pacing will prevent burnout and increase long-term success.",
    parameters: {
      risk_appetite: 0.7,
      emotional_reactivity: 0.5,
      time_consistency: 0.6,
      data_orientation: 0.6,
      volatility_tolerance: 0.7
    }
  },
  guardian: {
    displayName: "The Guardian",
    description: "You value consistency, security, and steady progress. You build your life on solid foundations and prefer predictable paths.",
    coreTraits: [
      "Unwavering consistency",
      "Risk management",
      "Reliable execution",
      "Protective instincts"
    ],
    decisionMakingStyle: "You make decisions carefully, preferring safe, proven paths over risky ventures. You value long-term security.",
    growthEdge: "Embracing calculated risks when opportunities arise will accelerate your growth without compromising your foundation.",
    parameters: {
      risk_appetite: 0.2,
      emotional_reactivity: 0.4,
      time_consistency: 0.9,
      data_orientation: 0.6,
      volatility_tolerance: 0.3
    }
  },
  pioneer: {
    displayName: "The Pioneer",
    description: "You think in years, not days. You build steadily, compound patiently, and trust the power of time.",
    coreTraits: [
      "Long-term vision",
      "Compound thinking",
      "Emotional stability",
      "Disciplined patience"
    ],
    decisionMakingStyle: "You make decisions with a multi-year horizon, ignoring short-term noise in favor of sustainable growth.",
    growthEdge: "Recognizing tactical opportunities within your long-term strategy will accelerate your compounding.",
    parameters: {
      risk_appetite: 0.4,
      emotional_reactivity: 0.2,
      time_consistency: 0.9,
      data_orientation: 0.7,
      volatility_tolerance: 0.6
    }
  },
  pragmatist: {
    displayName: "The Pragmatist",
    description: "You see trends, streaks, and patterns that others miss. You trust systematic analysis and repeatable structures.",
    coreTraits: [
      "Data mastery",
      "Practical problem-solving",
      "Systematic thinking",
      "Objective analysis"
    ],
    decisionMakingStyle: "You make decisions based on identified patterns and trends, trusting repeatable systems over emotions.",
    growthEdge: "Incorporating emotional intelligence into your pattern analysis will help you catch shifts that data alone can't predict.",
    parameters: {
      risk_appetite: 0.4,
      emotional_reactivity: 0.3,
      time_consistency: 0.8,
      data_orientation: 0.9,
      volatility_tolerance: 0.5
    }
  },
  catalyst: {
    displayName: "The Catalyst",
    description: "You thrive on energy, timing, and riding waves of opportunity. You're drawn to hot streaks and exciting movements.",
    coreTraits: [
      "Timing intuition",
      "Energy sensing",
      "Quick adaptation",
      "Trend spotting"
    ],
    decisionMakingStyle: "You make decisions based on momentum and timing, jumping on opportunities when energy is high.",
    growthEdge: "Learning to distinguish real momentum from hype will dramatically improve your success rate.",
    parameters: {
      risk_appetite: 0.8,
      emotional_reactivity: 0.7,
      time_consistency: 0.4,
      data_orientation: 0.4,
      volatility_tolerance: 0.8
    }
  },
  adapter: {
    displayName: "The Adapter",
    description: "You navigate life through emotional resonance and intuitive understanding. You sense energy shifts and emotional currents that others miss.",
    coreTraits: [
      "Deep emotional intelligence",
      "Strong gut instincts",
      "Empathetic understanding",
      "Flexible approach"
    ],
    decisionMakingStyle: "You make decisions based on how things feel, trusting your intuition and emotional wisdom over pure logic.",
    growthEdge: "Grounding your intuitive insights with practical structure will help you turn feelings into consistent outcomes.",
    parameters: {
      risk_appetite: 0.5,
      emotional_reactivity: 0.9,
      time_consistency: 0.5,
      data_orientation: 0.3,
      volatility_tolerance: 0.5
    }
  }
};

// Legacy type mapping for database compatibility
export const LEGACY_TYPE_MAPPING: Record<string, string> = {
  quiet_strategist: "strategist",
  risk_addict: "maverick",
  ambitious_builder: "visionary",
  stabilizer: "guardian",
  long_term_builder: "pioneer",
  pattern_analyst: "pragmatist",
  momentum_chaser: "catalyst",
  intuitive_empath: "adapter",
  // Also handle some edge cases
  escapist_romantic: "adapter",
  emotional_fan: "adapter",
  revenge_bettor: "maverick",
  fear_based_seller: "guardian"
};

// Get the new type key from any legacy or new type
export function normalizeTypeKey(typeKey: string): string {
  const normalized = typeKey.toLowerCase().replace(/\s+/g, '_').replace(/-/g, '_');
  return LEGACY_TYPE_MAPPING[normalized] || normalized;
}

// Question mappings for different categories
export const CATEGORY_QUESTIONS = {
  A: ["strategist", "pragmatist", "pioneer"],
  B: ["adapter", "catalyst"],
  C: ["maverick", "visionary", "guardian"],
  D: ["catalyst", "adapter"],
  E: ["pragmatist", "strategist"],
  F: ["guardian", "pioneer"]
};

// Calculate psyche type from onboarding responses
export function calculatePsycheType(responses: Record<string, string>): string {
  const scores: Record<string, number> = {};
  
  // Initialize scores for all types
  Object.keys(PSYCHE_TYPES).forEach(type => {
    scores[type] = 0;
  });

  // Score based on responses
  Object.entries(responses).forEach(([questionId, answer]) => {
    const category = questionId.charAt(0).toUpperCase();
    const relevantTypes = CATEGORY_QUESTIONS[category as keyof typeof CATEGORY_QUESTIONS] || [];
    
    relevantTypes.forEach(type => {
      // Simple scoring: each relevant answer adds to the type's score
      if (answer === 'A' || answer === 'B') {
        scores[type] += answer === 'A' ? 2 : 1;
      }
    });
  });

  // Find the type with the highest score
  let maxScore = 0;
  let dominantType = 'adapter'; // Default fallback
  
  Object.entries(scores).forEach(([type, score]) => {
    if (score > maxScore) {
      maxScore = score;
      dominantType = type;
    }
  });

  return dominantType;
}

// Get psyche profile for a user
export async function getPsycheProfile(userId: number) {
  const db = await getDb();
  if (!db) return null;
  
  const results = await db.select().from(psycheProfiles).where(eq(psycheProfiles.userId, userId)).limit(1);
  const profile = results[0];

  if (!profile) {
    return null;
  }

  // Normalize the type key to handle legacy types
  const normalizedType = normalizeTypeKey(profile.psycheType);
  const typeData = PSYCHE_TYPES[normalizedType as keyof typeof PSYCHE_TYPES] || PSYCHE_TYPES.adapter;

  // Return the database record with normalized type and fallback to typeData for missing fields
  return {
    ...profile,
    psycheType: normalizedType,
    displayName: typeData.displayName, // Always use new display name
    description: profile.description || typeData.description,
    coreTraits: profile.coreTraits || JSON.stringify(typeData.coreTraits),
    decisionMakingStyle: profile.decisionMakingStyle || typeData.decisionMakingStyle,
    growthEdge: profile.growthEdge || typeData.growthEdge,
    psycheParameters: profile.psycheParameters || JSON.stringify(typeData.parameters),
  };
}

// Create or update psyche profile
export async function upsertPsycheProfile(
  userId: number, 
  psycheType: string, 
  parameters?: Record<string, number>
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  // Normalize the type key
  const normalizedType = normalizeTypeKey(psycheType);
  const typeData = PSYCHE_TYPES[normalizedType as keyof typeof PSYCHE_TYPES] || PSYCHE_TYPES.adapter;
  
  const existingResults = await db.select().from(psycheProfiles).where(eq(psycheProfiles.userId, userId)).limit(1);
  const existingProfile = existingResults[0];

  const profileData = {
    psycheType: normalizedType,
    displayName: typeData.displayName,
    description: typeData.description,
    coreTraits: typeData.coreTraits,
    decisionMakingStyle: typeData.decisionMakingStyle,
    growthEdge: typeData.growthEdge,
    parameters: parameters || typeData.parameters
  };

  if (existingProfile) {
    await db.update(psycheProfiles)
      .set({
        ...profileData,
        updatedAt: new Date()
      })
      .where(eq(psycheProfiles.userId, userId));
  } else {
    await db.insert(psycheProfiles).values({
      userId,
      ...profileData,
      createdAt: new Date(),
      updatedAt: new Date()
    });
  }

  return profileData;
}

// Save onboarding responses
export async function saveOnboardingResponses(
  userId: number,
  responses: Record<string, string>,
  category: string
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.insert(onboardingResponses).values({
    userId,
    responses,
    category,
    createdAt: new Date()
  });
}

// Get user's onboarding responses
export async function getOnboardingResponses(userId: number) {
  const db = await getDb();
  if (!db) return null;
  
  const results = await db.select()
    .from(onboardingResponses)
    .where(eq(onboardingResponses.userId, userId))
    .orderBy(desc(onboardingResponses.createdAt))
    .limit(1);
  
  return results[0] || null;
}
