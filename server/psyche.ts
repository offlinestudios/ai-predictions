import { getDb } from "./db";
import { psycheProfiles, onboardingResponses, users } from "../drizzle/schema";
import { eq } from "drizzle-orm";

// Psyche type definitions with parameters
export const PSYCHE_TYPES = {
  quiet_strategist: {
    displayName: "The Quiet Strategist",
    description: "You make decisions through careful analysis and strategic thinking. You value clarity, timing, and pattern recognition in all aspects of life.",
    coreTraits: [
      "Analytical and methodical",
      "Values data over emotions",
      "Patient and strategic",
      "Risk-aware and calculated"
    ],
    decisionMakingStyle: "You prefer to analyze situations thoroughly before acting, looking for patterns and optimal timing. You trust structure and logic over gut feelings.",
    growthEdge: "Balancing analytical precision with emotional intuition will help you capture opportunities that don't fit neat patterns.",
    parameters: {
      risk_appetite: 0.3,
      emotional_reactivity: 0.3,
      time_consistency: 0.8,
      data_orientation: 0.9,
      tilt_prone: 0.2,
      volatility_tolerance: 0.4,
      loyalty_bias: 0.3,
      change_aversion: 0.6
    }
  },
  intuitive_empath: {
    displayName: "The Intuitive Empath",
    description: "You navigate life through emotional resonance and intuitive understanding. You sense energy shifts and emotional currents that others miss.",
    coreTraits: [
      "Highly emotionally attuned",
      "Trusts intuition deeply",
      "Sensitive to energy shifts",
      "Values emotional clarity"
    ],
    decisionMakingStyle: "You make decisions based on how things feel, trusting your intuition and emotional wisdom over pure logic.",
    growthEdge: "Grounding your intuitive insights with practical structure will help you turn feelings into consistent outcomes.",
    parameters: {
      risk_appetite: 0.5,
      emotional_reactivity: 0.9,
      time_consistency: 0.5,
      data_orientation: 0.3,
      tilt_prone: 0.6,
      volatility_tolerance: 0.5,
      loyalty_bias: 0.7,
      change_aversion: 0.5
    }
  },
  ambitious_builder: {
    displayName: "The Ambitious Builder",
    description: "You're driven by growth, leverage, and forward momentum. You see opportunities where others see obstacles and move decisively toward expansion.",
    coreTraits: [
      "Growth-oriented and bold",
      "Seeks leverage and acceleration",
      "High-energy decision maker",
      "Opportunity-focused"
    ],
    decisionMakingStyle: "You make decisions quickly when you see potential for growth, willing to take calculated risks for disproportionate returns.",
    growthEdge: "Balancing your drive for expansion with sustainable pacing will prevent burnout and increase long-term success.",
    parameters: {
      risk_appetite: 0.7,
      emotional_reactivity: 0.5,
      time_consistency: 0.6,
      data_orientation: 0.6,
      tilt_prone: 0.4,
      volatility_tolerance: 0.7,
      loyalty_bias: 0.4,
      change_aversion: 0.2
    }
  },
  escapist_romantic: {
    displayName: "The Escapist Romantic",
    description: "You seek meaning, emotional depth, and transformative experiences. You're drawn to beauty, intensity, and the poetry of life.",
    coreTraits: [
      "Emotionally explorative",
      "Seeks meaning and beauty",
      "Values intensity over stability",
      "Self-reflective and introspective"
    ],
    decisionMakingStyle: "You make decisions based on emotional resonance and the search for deeper meaning, sometimes avoiding harsh realities.",
    growthEdge: "Grounding your romantic ideals with practical reality will help you build the beautiful life you envision.",
    parameters: {
      risk_appetite: 0.6,
      emotional_reactivity: 0.8,
      time_consistency: 0.4,
      data_orientation: 0.2,
      tilt_prone: 0.7,
      volatility_tolerance: 0.6,
      loyalty_bias: 0.8,
      change_aversion: 0.4
    }
  },
  stabilizer: {
    displayName: "The Stabilizer",
    description: "You value consistency, security, and steady progress. You build your life on solid foundations and prefer predictable paths.",
    coreTraits: [
      "Values stability and security",
      "Prefers gradual change",
      "Reliable and consistent",
      "Risk-averse and cautious"
    ],
    decisionMakingStyle: "You make decisions carefully, preferring safe, proven paths over risky ventures. You value long-term security.",
    growthEdge: "Embracing calculated risks when opportunities arise will accelerate your growth without compromising your foundation.",
    parameters: {
      risk_appetite: 0.2,
      emotional_reactivity: 0.4,
      time_consistency: 0.9,
      data_orientation: 0.6,
      tilt_prone: 0.2,
      volatility_tolerance: 0.3,
      loyalty_bias: 0.8,
      change_aversion: 0.8
    }
  },
  momentum_chaser: {
    displayName: "The Momentum Chaser",
    description: "You thrive on energy, timing, and riding waves of opportunity. You're drawn to hot streaks and exciting movements.",
    coreTraits: [
      "Energized by momentum",
      "Timing-focused",
      "Responsive to hype and trends",
      "Adrenaline-seeking"
    ],
    decisionMakingStyle: "You make decisions based on momentum and timing, jumping on opportunities when energy is high.",
    growthEdge: "Learning to distinguish real momentum from hype will dramatically improve your success rate.",
    parameters: {
      risk_appetite: 0.8,
      emotional_reactivity: 0.7,
      time_consistency: 0.4,
      data_orientation: 0.4,
      tilt_prone: 0.7,
      volatility_tolerance: 0.8,
      loyalty_bias: 0.3,
      change_aversion: 0.2
    }
  },
  emotional_fan: {
    displayName: "The Emotional Fan",
    description: "You lead with your heart, driven by loyalty and passion. Your decisions are colored by deep emotional connections.",
    coreTraits: [
      "Heart-led decision maker",
      "Deeply loyal",
      "Emotionally invested",
      "Values connection over logic"
    ],
    decisionMakingStyle: "You make decisions based on emotional attachment and loyalty, sometimes overlooking objective data.",
    growthEdge: "Balancing emotional loyalty with objective analysis will protect you from self-sabotage.",
    parameters: {
      risk_appetite: 0.5,
      emotional_reactivity: 0.9,
      time_consistency: 0.5,
      data_orientation: 0.3,
      tilt_prone: 0.7,
      volatility_tolerance: 0.4,
      loyalty_bias: 0.9,
      change_aversion: 0.6
    }
  },
  pattern_analyst: {
    displayName: "The Pattern Analyst",
    description: "You see trends, streaks, and patterns that others miss. You trust systematic analysis and repeatable structures.",
    coreTraits: [
      "Pattern recognition expert",
      "Systematic and logical",
      "Data-driven",
      "Consistency-focused"
    ],
    decisionMakingStyle: "You make decisions based on identified patterns and trends, trusting repeatable systems over emotions.",
    growthEdge: "Incorporating emotional intelligence into your pattern analysis will help you catch shifts that data alone can't predict.",
    parameters: {
      risk_appetite: 0.4,
      emotional_reactivity: 0.3,
      time_consistency: 0.8,
      data_orientation: 0.9,
      tilt_prone: 0.2,
      volatility_tolerance: 0.5,
      loyalty_bias: 0.4,
      change_aversion: 0.5
    }
  },
  revenge_bettor: {
    displayName: "The Revenge Bettor",
    description: "You're driven by the need to recover from losses and prove yourself. Emotional surges often drive your decisions.",
    coreTraits: [
      "Loss-reactive",
      "Emotionally volatile",
      "Chase-prone",
      "Needs emotional reset"
    ],
    decisionMakingStyle: "You make impulsive decisions after setbacks, driven by the need to recover quickly and prove yourself.",
    growthEdge: "Learning to pause and reset emotionally after losses will dramatically improve your outcomes.",
    parameters: {
      risk_appetite: 0.8,
      emotional_reactivity: 0.9,
      time_consistency: 0.3,
      data_orientation: 0.3,
      tilt_prone: 0.9,
      volatility_tolerance: 0.7,
      loyalty_bias: 0.4,
      change_aversion: 0.3
    }
  },
  long_term_builder: {
    displayName: "The Long-Term Builder",
    description: "You think in years, not days. You build steadily, compound patiently, and trust the power of time.",
    coreTraits: [
      "Patient and disciplined",
      "Long-term focused",
      "Steady accumulator",
      "Emotionally stable"
    ],
    decisionMakingStyle: "You make decisions with a multi-year horizon, ignoring short-term noise in favor of sustainable growth.",
    growthEdge: "Recognizing tactical opportunities within your long-term strategy will accelerate your compounding.",
    parameters: {
      risk_appetite: 0.4,
      emotional_reactivity: 0.2,
      time_consistency: 0.9,
      data_orientation: 0.7,
      tilt_prone: 0.1,
      volatility_tolerance: 0.6,
      loyalty_bias: 0.7,
      change_aversion: 0.7
    }
  },
  fear_based_seller: {
    displayName: "The Fear-Based Seller",
    description: "You're highly sensitive to risk and volatility. Safety and emotional security drive your decisions.",
    coreTraits: [
      "Risk-averse",
      "Emotionally sensitive",
      "Safety-focused",
      "Panic-prone"
    ],
    decisionMakingStyle: "You make decisions to minimize risk and avoid loss, often exiting too early when volatility spikes.",
    growthEdge: "Building emotional resilience to volatility will help you stay in winning positions longer.",
    parameters: {
      risk_appetite: 0.2,
      emotional_reactivity: 0.9,
      time_consistency: 0.5,
      data_orientation: 0.5,
      tilt_prone: 0.7,
      volatility_tolerance: 0.2,
      loyalty_bias: 0.6,
      change_aversion: 0.8
    }
  },
  risk_addict: {
    displayName: "The Risk Addict",
    description: "You're drawn to volatility, high stakes, and intense swings. You thrive on adrenaline and bold moves.",
    coreTraits: [
      "Thrill-seeking",
      "Volatility-loving",
      "High-risk tolerance",
      "Impulsive"
    ],
    decisionMakingStyle: "You make bold, high-risk decisions quickly, drawn to opportunities with extreme upside and downside.",
    growthEdge: "Adding structure and limits to your risk-taking will help you survive long enough to hit your big wins.",
    parameters: {
      risk_appetite: 0.9,
      emotional_reactivity: 0.7,
      time_consistency: 0.3,
      data_orientation: 0.4,
      tilt_prone: 0.8,
      volatility_tolerance: 0.9,
      loyalty_bias: 0.2,
      change_aversion: 0.1
    }
  },
};

// Mapping of answer options to psyche types
export const QUESTION_MAPPINGS = {
  1: {
    A: ["quiet_strategist", "pattern_analyst", "long_term_builder"],
    B: ["intuitive_empath", "escapist_romantic"],
    C: ["momentum_chaser", "risk_addict"],
    D: ["stabilizer", "long_term_builder"],
    E: ["escapist_romantic", "emotional_fan"]
  },
  2: {
    A: ["quiet_strategist", "long_term_builder"],
    B: ["ambitious_builder", "risk_addict"],
    C: ["intuitive_empath"],
    D: ["emotional_fan", "fear_based_seller"],
    E: ["stabilizer", "long_term_builder"]
  },
  3: {
    A: ["revenge_bettor", "risk_addict"],
    B: ["quiet_strategist", "pattern_analyst"],
    C: ["intuitive_empath", "emotional_fan"],
    D: ["fear_based_seller", "stabilizer"],
    E: ["ambitious_builder"]
  },
  4: {
    A: ["stabilizer", "long_term_builder"],
    B: ["ambitious_builder", "risk_addict"],
    C: ["momentum_chaser", "emotional_fan"],
    D: ["intuitive_empath", "escapist_romantic"],
    E: ["quiet_strategist", "pattern_analyst"]
  },
  5: {
    A: ["pattern_analyst", "long_term_builder"],
    B: ["momentum_chaser", "emotional_fan"],
    C: ["ambitious_builder", "long_term_builder"],
    D: ["escapist_romantic", "emotional_fan"],
    E: ["fear_based_seller", "quiet_strategist"]
  },
  6: {
    A: ["risk_addict", "momentum_chaser"],
    B: ["ambitious_builder", "pattern_analyst"],
    C: ["stabilizer", "long_term_builder"],
    D: ["fear_based_seller", "emotional_fan"],
    E: ["intuitive_empath", "escapist_romantic"]
  },
  7: {
    A: ["quiet_strategist"],
    B: ["escapist_romantic"],
    C: ["stabilizer"],
    D: ["intuitive_empath"],
    E: ["emotional_fan"]
  },
  8: {
    A: ["pattern_analyst", "long_term_builder"],
    B: ["momentum_chaser", "risk_addict"],
    C: ["intuitive_empath", "escapist_romantic"],
    D: ["fear_based_seller", "stabilizer"],
    E: ["ambitious_builder"]
  },
  9: {
    A: ["ambitious_builder", "long_term_builder"],
    B: ["fear_based_seller"],
    C: ["quiet_strategist", "pattern_analyst"],
    D: ["intuitive_empath", "escapist_romantic"],
    E: ["risk_addict"]
  },
  10: {
    A: ["revenge_bettor"],
    B: ["quiet_strategist", "stabilizer"],
    C: ["emotional_fan", "intuitive_empath"],
    D: ["pattern_analyst"],
    E: ["momentum_chaser", "risk_addict"]
  },
  11: {
    A: ["ambitious_builder", "pattern_analyst"],
    B: ["intuitive_empath", "escapist_romantic"],
    C: ["quiet_strategist", "fear_based_seller"],
    D: ["momentum_chaser", "risk_addict"],
    E: ["stabilizer", "long_term_builder"]
  },
  12: {
    A: ["ambitious_builder"],
    B: ["stabilizer", "pattern_analyst"],
    C: ["momentum_chaser", "risk_addict"],
    D: ["fear_based_seller", "quiet_strategist"],
    E: ["intuitive_empath"]
  },
  13: {
    A: ["fear_based_seller"],
    B: ["risk_addict", "ambitious_builder"],
    C: ["pattern_analyst"],
    D: ["intuitive_empath", "escapist_romantic"],
    E: ["stabilizer", "long_term_builder"]
  },
  14: {
    A: ["pattern_analyst", "quiet_strategist"],
    B: ["intuitive_empath"],
    C: ["fear_based_seller"],
    D: ["ambitious_builder"],
    E: ["stabilizer"]
  },
  15: {
    A: ["risk_addict"],
    B: ["intuitive_empath", "emotional_fan"],
    C: ["quiet_strategist"],
    D: ["momentum_chaser"],
    E: ["stabilizer"]
  },
  16: {
    A: ["quiet_strategist"],
    B: ["ambitious_builder"],
    C: ["intuitive_empath"],
    D: ["stabilizer"],
    E: ["risk_addict", "escapist_romantic"]
  }
};

// Calculate psyche type from responses
export function calculatePsycheType(responses: Array<{ questionId: number; selectedOption: string }>): string {
  const scores: Record<string, number> = {};
  
  // Initialize all psyche types with 0
  Object.keys(PSYCHE_TYPES).forEach(type => {
    scores[type] = 0;
  });
  
  // Count occurrences of each psyche type across all answers
  responses.forEach(response => {
    const mapping = QUESTION_MAPPINGS[response.questionId as keyof typeof QUESTION_MAPPINGS];
    if (mapping) {
      const psycheTypes = mapping[response.selectedOption as keyof typeof mapping];
      if (psycheTypes) {
        psycheTypes.forEach(type => {
          scores[type] = (scores[type] || 0) + 1;
        });
      }
    }
  });
  
  // Find the psyche type with the highest score
  let maxScore = 0;
  let dominantType = "quiet_strategist"; // default
  
  Object.entries(scores).forEach(([type, score]) => {
    if (score > maxScore) {
      maxScore = score;
      dominantType = type;
    }
  });
  
  return dominantType;
}

// Save psyche profile to database
export async function savePsycheProfile(userId: number, psycheType: string) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  
  const psycheData = PSYCHE_TYPES[psycheType as keyof typeof PSYCHE_TYPES];
  if (!psycheData) throw new Error("Invalid psyche type");
  
  // Check if profile already exists
  const existing = await db
    .select()
    .from(psycheProfiles)
    .where(eq(psycheProfiles.userId, userId))
    .limit(1);
  
  if (existing.length > 0) {
    // Update existing profile
    await db
      .update(psycheProfiles)
      .set({
        psycheType: psycheType as any,
        displayName: psycheData.displayName,
        description: psycheData.description,
        coreTraits: JSON.stringify(psycheData.coreTraits),
        decisionMakingStyle: psycheData.decisionMakingStyle,
        growthEdge: psycheData.growthEdge,
        psycheParameters: JSON.stringify(psycheData.parameters),
        updatedAt: new Date(),
      })
      .where(eq(psycheProfiles.userId, userId));
  } else {
    // Create new profile
    await db.insert(psycheProfiles).values({
      userId,
      psycheType: psycheType as any,
      displayName: psycheData.displayName,
      description: psycheData.description,
      coreTraits: JSON.stringify(psycheData.coreTraits),
      decisionMakingStyle: psycheData.decisionMakingStyle,
      growthEdge: psycheData.growthEdge,
      psycheParameters: JSON.stringify(psycheData.parameters),
    });
  }
  
  // Update user's onboarding status
  await db
    .update(users)
    .set({
      onboardingCompleted: true,
      updatedAt: new Date(),
    })
    .where(eq(users.id, userId));
  
  return psycheData;
}

// Get user's psyche profile
export async function getUserPsycheProfile(userId: number) {
  const db = await getDb();
  if (!db) return null;
  
  const profiles = await db
    .select()
    .from(psycheProfiles)
    .where(eq(psycheProfiles.userId, userId))
    .limit(1);
  
  return profiles[0] || null;
}

// Save onboarding response
export async function saveOnboardingResponse(
  userId: number,
  questionId: number,
  questionText: string,
  selectedOption: string,
  answerText: string,
  mappedPsycheTypes: string[]
) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  
  await db.insert(onboardingResponses).values({
    userId,
    questionId,
    questionText,
    selectedOption,
    answerText,
    mappedPsycheTypes: JSON.stringify(mappedPsycheTypes),
  });
}
