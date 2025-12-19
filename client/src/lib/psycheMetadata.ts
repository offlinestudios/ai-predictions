// Extended metadata for psyche personality types
// Uses the new 8 personality types: Maverick, Strategist, Visionary, Guardian, Pioneer, Pragmatist, Catalyst, Adapter

export interface PsycheMetadata {
  rarity: number; // Percentage of users with this type (1-100)
  rarityLabel: string; // e.g., "Rare", "Common", "Uncommon"
  compatibleWith: string[]; // Best matched personality types (using new type keys)
  tensionWith: string[]; // May clash with these types (using new type keys)
  famousExamples: string[]; // Famous people with this personality
  superpower: string; // Their unique superpower
  strengthsTitle: string; // Title for strengths section
  strengths: string[]; // List of strengths
  predictionInsight: string; // How their personality affects predictions
  dailyInsight: string; // Daily tip for this type
  color: string; // Primary color for the type (hex)
}

export const PSYCHE_METADATA: Record<string, PsycheMetadata> = {
  // New personality types (primary)
  maverick: {
    rarity: 5,
    rarityLabel: "Very Rare",
    compatibleWith: ["visionary", "catalyst"],
    tensionWith: ["guardian", "strategist"],
    famousExamples: ["Elon Musk", "Steve Jobs", "Richard Branson"],
    superpower: "Turning uncertainty into opportunity",
    strengthsTitle: "Maverick Superpowers",
    strengths: [
      "Bold decision-making",
      "Instinct-driven action",
      "Thriving in chaos",
      "Inspiring leadership"
    ],
    predictionInsight: "Your predictions are bold and instinct-driven. Verify your gut with one data point for best results.",
    dailyInsight: "Trust your instincts today, but verify with one fact before you leap.",
    color: "#f97316"
  },
  strategist: {
    rarity: 8,
    rarityLabel: "Rare",
    compatibleWith: ["pragmatist", "pioneer"],
    tensionWith: ["maverick", "catalyst"],
    famousExamples: ["Warren Buffett", "Angela Merkel", "Bill Gates"],
    superpower: "Seeing through chaos to find the optimal path",
    strengthsTitle: "Strategic Superpowers",
    strengths: [
      "Exceptional pattern recognition",
      "Calm under pressure",
      "Long-term vision",
      "Disciplined execution"
    ],
    predictionInsight: "Your predictions benefit from careful analysis. You excel at long-term forecasts but may miss fast-moving opportunities.",
    dailyInsight: "Trust your analysis, but don't wait for perfect information—good enough is often good enough.",
    color: "#6366f1"
  },
  visionary: {
    rarity: 10,
    rarityLabel: "Uncommon",
    compatibleWith: ["maverick", "pioneer"],
    tensionWith: ["guardian", "pragmatist"],
    famousExamples: ["Jeff Bezos", "Oprah Winfrey", "Sara Blakely"],
    superpower: "Seeing possibilities others miss",
    strengthsTitle: "Visionary Superpowers",
    strengths: [
      "Big-picture thinking",
      "Calculated risk-taking",
      "Inspiring others",
      "Strategic ambition"
    ],
    predictionInsight: "Your predictions are bold yet calculated. Balance your vision with practical checkpoints.",
    dailyInsight: "Your vision is your compass—but check the map occasionally.",
    color: "#8b5cf6"
  },
  guardian: {
    rarity: 12,
    rarityLabel: "Uncommon",
    compatibleWith: ["pragmatist", "strategist"],
    tensionWith: ["maverick", "catalyst"],
    famousExamples: ["Michelle Obama", "Tom Hanks", "Tim Cook"],
    superpower: "Building unshakeable foundations",
    strengthsTitle: "Guardian Superpowers",
    strengths: [
      "Unwavering consistency",
      "Risk management",
      "Reliable execution",
      "Protective instincts"
    ],
    predictionInsight: "Your predictions favor safety. Consider that calculated risks sometimes offer the best risk-adjusted returns.",
    dailyInsight: "Stability is your strength—but one small stretch today could unlock new possibilities.",
    color: "#10b981"
  },
  pioneer: {
    rarity: 9,
    rarityLabel: "Rare",
    compatibleWith: ["strategist", "visionary"],
    tensionWith: ["catalyst", "adapter"],
    famousExamples: ["Charlie Munger", "Warren Buffett", "Ray Dalio"],
    superpower: "Compounding patience into extraordinary results",
    strengthsTitle: "Pioneer Superpowers",
    strengths: [
      "Long-term vision",
      "Compound thinking",
      "Emotional stability",
      "Disciplined patience"
    ],
    predictionInsight: "Your predictions favor long horizons. You may underestimate short-term volatility.",
    dailyInsight: "Today's small action compounds into tomorrow's big result. Stay the course.",
    color: "#059669"
  },
  pragmatist: {
    rarity: 11,
    rarityLabel: "Uncommon",
    compatibleWith: ["strategist", "guardian"],
    tensionWith: ["adapter", "maverick"],
    famousExamples: ["Nate Silver", "Ray Dalio", "Janet Yellen"],
    superpower: "Seeing the signal through the noise",
    strengthsTitle: "Pragmatist Superpowers",
    strengths: [
      "Data mastery",
      "Practical problem-solving",
      "Systematic thinking",
      "Objective analysis"
    ],
    predictionInsight: "Your predictions are data-driven and reliable. Add emotional context to catch human-driven shifts.",
    dailyInsight: "The patterns are speaking—but remember, humans don't always follow the script.",
    color: "#3b82f6"
  },
  catalyst: {
    rarity: 8,
    rarityLabel: "Rare",
    compatibleWith: ["maverick", "visionary"],
    tensionWith: ["guardian", "pioneer"],
    famousExamples: ["Gary Vaynerchuk", "Richard Branson", "Serena Williams"],
    superpower: "Catching waves at the perfect moment",
    strengthsTitle: "Catalyst Superpowers",
    strengths: [
      "Timing intuition",
      "Energy sensing",
      "Quick adaptation",
      "Trend spotting"
    ],
    predictionInsight: "You're great at catching trends early. Distinguish real momentum from hype by checking fundamentals.",
    dailyInsight: "The wave is building—make sure you're paddling in the right direction.",
    color: "#f59e0b"
  },
  adapter: {
    rarity: 14,
    rarityLabel: "Common",
    compatibleWith: ["guardian", "catalyst"],
    tensionWith: ["pragmatist", "pioneer"],
    famousExamples: ["Oprah Winfrey", "Keanu Reeves", "Princess Diana"],
    superpower: "Reading the emotional undercurrents others miss",
    strengthsTitle: "Adapter Superpowers",
    strengths: [
      "Deep emotional intelligence",
      "Strong gut instincts",
      "Empathetic understanding",
      "Flexible approach"
    ],
    predictionInsight: "Your intuition often catches what data misses. Trust your feelings, but verify with one objective data point.",
    dailyInsight: "Your gut is talking—listen to it, but ask 'why' before you act.",
    color: "#ec4899"
  },
  
  // Legacy type mappings (for backward compatibility)
  // These map to the new types
  quiet_strategist: {
    rarity: 8,
    rarityLabel: "Rare",
    compatibleWith: ["pragmatist", "pioneer"],
    tensionWith: ["maverick", "catalyst"],
    famousExamples: ["Warren Buffett", "Angela Merkel", "Bill Gates"],
    superpower: "Seeing through chaos to find the optimal path",
    strengthsTitle: "Strategic Superpowers",
    strengths: [
      "Exceptional pattern recognition",
      "Calm under pressure",
      "Long-term vision",
      "Disciplined execution"
    ],
    predictionInsight: "Your predictions benefit from careful analysis. You excel at long-term forecasts but may miss fast-moving opportunities.",
    dailyInsight: "Trust your analysis, but don't wait for perfect information—good enough is often good enough.",
    color: "#6366f1"
  },
  risk_addict: {
    rarity: 5,
    rarityLabel: "Very Rare",
    compatibleWith: ["visionary", "catalyst"],
    tensionWith: ["guardian", "strategist"],
    famousExamples: ["Elon Musk", "Steve Jobs", "Richard Branson"],
    superpower: "Turning uncertainty into opportunity",
    strengthsTitle: "Maverick Superpowers",
    strengths: [
      "Bold decision-making",
      "Instinct-driven action",
      "Thriving in chaos",
      "Inspiring leadership"
    ],
    predictionInsight: "Your predictions are bold and instinct-driven. Verify your gut with one data point for best results.",
    dailyInsight: "Trust your instincts today, but verify with one fact before you leap.",
    color: "#f97316"
  },
  ambitious_builder: {
    rarity: 10,
    rarityLabel: "Uncommon",
    compatibleWith: ["maverick", "pioneer"],
    tensionWith: ["guardian", "pragmatist"],
    famousExamples: ["Jeff Bezos", "Oprah Winfrey", "Sara Blakely"],
    superpower: "Seeing possibilities others miss",
    strengthsTitle: "Visionary Superpowers",
    strengths: [
      "Big-picture thinking",
      "Calculated risk-taking",
      "Inspiring others",
      "Strategic ambition"
    ],
    predictionInsight: "Your predictions are bold yet calculated. Balance your vision with practical checkpoints.",
    dailyInsight: "Your vision is your compass—but check the map occasionally.",
    color: "#8b5cf6"
  },
  stabilizer: {
    rarity: 12,
    rarityLabel: "Uncommon",
    compatibleWith: ["pragmatist", "strategist"],
    tensionWith: ["maverick", "catalyst"],
    famousExamples: ["Michelle Obama", "Tom Hanks", "Tim Cook"],
    superpower: "Building unshakeable foundations",
    strengthsTitle: "Guardian Superpowers",
    strengths: [
      "Unwavering consistency",
      "Risk management",
      "Reliable execution",
      "Protective instincts"
    ],
    predictionInsight: "Your predictions favor safety. Consider that calculated risks sometimes offer the best risk-adjusted returns.",
    dailyInsight: "Stability is your strength—but one small stretch today could unlock new possibilities.",
    color: "#10b981"
  },
  long_term_builder: {
    rarity: 9,
    rarityLabel: "Rare",
    compatibleWith: ["strategist", "visionary"],
    tensionWith: ["catalyst", "adapter"],
    famousExamples: ["Charlie Munger", "Warren Buffett", "Ray Dalio"],
    superpower: "Compounding patience into extraordinary results",
    strengthsTitle: "Pioneer Superpowers",
    strengths: [
      "Long-term vision",
      "Compound thinking",
      "Emotional stability",
      "Disciplined patience"
    ],
    predictionInsight: "Your predictions favor long horizons. You may underestimate short-term volatility.",
    dailyInsight: "Today's small action compounds into tomorrow's big result. Stay the course.",
    color: "#059669"
  },
  pattern_analyst: {
    rarity: 11,
    rarityLabel: "Uncommon",
    compatibleWith: ["strategist", "guardian"],
    tensionWith: ["adapter", "maverick"],
    famousExamples: ["Nate Silver", "Ray Dalio", "Janet Yellen"],
    superpower: "Seeing the signal through the noise",
    strengthsTitle: "Pragmatist Superpowers",
    strengths: [
      "Data mastery",
      "Practical problem-solving",
      "Systematic thinking",
      "Objective analysis"
    ],
    predictionInsight: "Your predictions are data-driven and reliable. Add emotional context to catch human-driven shifts.",
    dailyInsight: "The patterns are speaking—but remember, humans don't always follow the script.",
    color: "#3b82f6"
  },
  momentum_chaser: {
    rarity: 8,
    rarityLabel: "Rare",
    compatibleWith: ["maverick", "visionary"],
    tensionWith: ["guardian", "pioneer"],
    famousExamples: ["Gary Vaynerchuk", "Richard Branson", "Serena Williams"],
    superpower: "Catching waves at the perfect moment",
    strengthsTitle: "Catalyst Superpowers",
    strengths: [
      "Timing intuition",
      "Energy sensing",
      "Quick adaptation",
      "Trend spotting"
    ],
    predictionInsight: "You're great at catching trends early. Distinguish real momentum from hype by checking fundamentals.",
    dailyInsight: "The wave is building—make sure you're paddling in the right direction.",
    color: "#f59e0b"
  },
  intuitive_empath: {
    rarity: 14,
    rarityLabel: "Common",
    compatibleWith: ["guardian", "catalyst"],
    tensionWith: ["pragmatist", "pioneer"],
    famousExamples: ["Oprah Winfrey", "Keanu Reeves", "Princess Diana"],
    superpower: "Reading the emotional undercurrents others miss",
    strengthsTitle: "Adapter Superpowers",
    strengths: [
      "Deep emotional intelligence",
      "Strong gut instincts",
      "Empathetic understanding",
      "Flexible approach"
    ],
    predictionInsight: "Your intuition often catches what data misses. Trust your feelings, but verify with one objective data point.",
    dailyInsight: "Your gut is talking—listen to it, but ask 'why' before you act.",
    color: "#ec4899"
  }
};

// Helper function to get metadata for a psyche type
export function getPsycheMetadata(psycheType: string): PsycheMetadata | null {
  // Normalize the type name (handle various formats)
  const normalizedType = psycheType
    .toLowerCase()
    .replace(/^the\s+/i, '')
    .replace(/\s+/g, '_')
    .replace(/-/g, '_');
  
  // Direct match
  if (PSYCHE_METADATA[normalizedType]) {
    return PSYCHE_METADATA[normalizedType];
  }
  
  // Try to find a partial match
  for (const [key, metadata] of Object.entries(PSYCHE_METADATA)) {
    if (normalizedType.includes(key) || key.includes(normalizedType)) {
      return metadata;
    }
  }
  
  // Default fallback
  return PSYCHE_METADATA.strategist;
}

// Get rarity label based on percentage
export function getRarityLabel(rarity: number): string {
  if (rarity <= 5) return "Very Rare";
  if (rarity <= 8) return "Rare";
  if (rarity <= 12) return "Uncommon";
  return "Common";
}

// Get compatible type display names (using new type names)
export function getCompatibleTypes(types: string[]): string[] {
  const displayNames: Record<string, string> = {
    // New types
    maverick: "The Maverick",
    strategist: "The Strategist",
    visionary: "The Visionary",
    guardian: "The Guardian",
    pioneer: "The Pioneer",
    pragmatist: "The Pragmatist",
    catalyst: "The Catalyst",
    adapter: "The Adapter",
    // Legacy types (map to new names)
    quiet_strategist: "The Strategist",
    risk_addict: "The Maverick",
    ambitious_builder: "The Visionary",
    stabilizer: "The Guardian",
    long_term_builder: "The Pioneer",
    pattern_analyst: "The Pragmatist",
    momentum_chaser: "The Catalyst",
    intuitive_empath: "The Adapter"
  };
  
  return types.map(type => displayNames[type] || type);
}
