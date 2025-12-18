// Extended metadata for psyche personality types
// Includes icons, rarity, compatibility, famous examples, superpowers, and prediction insights

export interface PsycheMetadata {
  icon: string; // Emoji icon for the type
  rarity: number; // Percentage of users with this type (1-100)
  rarityLabel: string; // e.g., "Rare", "Common", "Uncommon"
  compatibleWith: string[]; // Best matched personality types
  tensionWith: string[]; // May clash with these types
  famousExamples: string[]; // Famous people with this personality
  superpower: string; // Their unique superpower
  strengthsTitle: string; // Title for strengths section
  strengths: string[]; // List of strengths
  predictionInsight: string; // How their personality affects predictions
  dailyInsight: string; // Daily tip for this type
  color: string; // Primary color for the type (hex)
}

export const PSYCHE_METADATA: Record<string, PsycheMetadata> = {
  quiet_strategist: {
    icon: "🎯",
    rarity: 8,
    rarityLabel: "Rare",
    compatibleWith: ["pattern_analyst", "long_term_builder"],
    tensionWith: ["risk_addict", "momentum_chaser"],
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
  intuitive_empath: {
    icon: "🌙",
    rarity: 12,
    rarityLabel: "Uncommon",
    compatibleWith: ["escapist_romantic", "emotional_fan"],
    tensionWith: ["pattern_analyst", "quiet_strategist"],
    famousExamples: ["Oprah Winfrey", "Princess Diana", "Keanu Reeves"],
    superpower: "Reading the emotional undercurrents others miss",
    strengthsTitle: "Intuitive Superpowers",
    strengths: [
      "Deep emotional intelligence",
      "Strong gut instincts",
      "Empathetic understanding",
      "Sensing shifts before they happen"
    ],
    predictionInsight: "Your intuition often catches what data misses. Trust your feelings, but verify with one objective data point.",
    dailyInsight: "Your gut is talking—listen to it, but ask 'why' before you act.",
    color: "#8b5cf6"
  },
  ambitious_builder: {
    icon: "🚀",
    rarity: 15,
    rarityLabel: "Common",
    compatibleWith: ["momentum_chaser", "risk_addict"],
    tensionWith: ["stabilizer", "fear_based_seller"],
    famousExamples: ["Elon Musk", "Sara Blakely", "Jeff Bezos"],
    superpower: "Turning obstacles into stepping stones",
    strengthsTitle: "Builder Superpowers",
    strengths: [
      "Relentless drive",
      "Opportunity spotting",
      "Quick decision-making",
      "Inspiring others to action"
    ],
    predictionInsight: "You see potential everywhere. Your predictions are bold—temper optimism with realistic timelines.",
    dailyInsight: "Big moves require big energy. Make sure today's push serves tomorrow's vision.",
    color: "#f59e0b"
  },
  escapist_romantic: {
    icon: "🦋",
    rarity: 9,
    rarityLabel: "Rare",
    compatibleWith: ["intuitive_empath", "emotional_fan"],
    tensionWith: ["pattern_analyst", "stabilizer"],
    famousExamples: ["Taylor Swift", "Johnny Depp", "Lana Del Rey"],
    superpower: "Finding beauty and meaning in the mundane",
    strengthsTitle: "Romantic Superpowers",
    strengths: [
      "Creative vision",
      "Emotional depth",
      "Transformative thinking",
      "Inspiring authenticity"
    ],
    predictionInsight: "Your predictions are colored by hope and meaning. Ground your visions with practical checkpoints.",
    dailyInsight: "Dream big, but build one small bridge to reality today.",
    color: "#ec4899"
  },
  stabilizer: {
    icon: "🏔️",
    rarity: 14,
    rarityLabel: "Common",
    compatibleWith: ["long_term_builder", "quiet_strategist"],
    tensionWith: ["risk_addict", "momentum_chaser"],
    famousExamples: ["Tom Hanks", "Michelle Obama", "Tim Cook"],
    superpower: "Building unshakeable foundations",
    strengthsTitle: "Stability Superpowers",
    strengths: [
      "Unwavering consistency",
      "Risk management",
      "Reliable execution",
      "Long-term thinking"
    ],
    predictionInsight: "Your predictions favor safety. Consider that calculated risks sometimes offer the best risk-adjusted returns.",
    dailyInsight: "Stability is your strength—but one small stretch today could unlock new possibilities.",
    color: "#10b981"
  },
  momentum_chaser: {
    icon: "⚡",
    rarity: 11,
    rarityLabel: "Uncommon",
    compatibleWith: ["ambitious_builder", "risk_addict"],
    tensionWith: ["stabilizer", "long_term_builder"],
    famousExamples: ["Gary Vaynerchuk", "Richard Branson", "Serena Williams"],
    superpower: "Catching waves at the perfect moment",
    strengthsTitle: "Momentum Superpowers",
    strengths: [
      "Timing intuition",
      "Energy sensing",
      "Quick adaptation",
      "Trend spotting"
    ],
    predictionInsight: "You're great at catching trends early. Distinguish real momentum from hype by checking fundamentals.",
    dailyInsight: "The wave is building—make sure you're paddling in the right direction.",
    color: "#f97316"
  },
  emotional_fan: {
    icon: "❤️",
    rarity: 13,
    rarityLabel: "Common",
    compatibleWith: ["intuitive_empath", "escapist_romantic"],
    tensionWith: ["pattern_analyst", "quiet_strategist"],
    famousExamples: ["Drake", "Taylor Lautner", "Ariana Grande"],
    superpower: "Unwavering loyalty that inspires others",
    strengthsTitle: "Loyalty Superpowers",
    strengths: [
      "Deep commitment",
      "Emotional investment",
      "Passionate advocacy",
      "Authentic connections"
    ],
    predictionInsight: "Your heart leads your predictions. Balance loyalty with objectivity for better accuracy.",
    dailyInsight: "Your passion is powerful—channel it toward what truly deserves your energy.",
    color: "#ef4444"
  },
  pattern_analyst: {
    icon: "📊",
    rarity: 7,
    rarityLabel: "Rare",
    compatibleWith: ["quiet_strategist", "long_term_builder"],
    tensionWith: ["intuitive_empath", "escapist_romantic"],
    famousExamples: ["Nate Silver", "Ray Dalio", "Sherlock Holmes"],
    superpower: "Seeing the signal through the noise",
    strengthsTitle: "Analytical Superpowers",
    strengths: [
      "Data mastery",
      "Trend identification",
      "Systematic thinking",
      "Objective analysis"
    ],
    predictionInsight: "Your predictions are data-driven and reliable. Add emotional context to catch human-driven shifts.",
    dailyInsight: "The patterns are speaking—but remember, humans don't always follow the script.",
    color: "#3b82f6"
  },
  revenge_bettor: {
    icon: "🔥",
    rarity: 6,
    rarityLabel: "Rare",
    compatibleWith: ["risk_addict", "momentum_chaser"],
    tensionWith: ["stabilizer", "long_term_builder"],
    famousExamples: ["Michael Jordan", "Conor McGregor", "Kobe Bryant"],
    superpower: "Channeling setbacks into explosive comebacks",
    strengthsTitle: "Comeback Superpowers",
    strengths: [
      "Resilience under fire",
      "Competitive drive",
      "Emotional fuel",
      "Proving doubters wrong"
    ],
    predictionInsight: "Your predictions may be influenced by recent outcomes. Pause after losses before making new predictions.",
    dailyInsight: "Your fire is your fuel—but controlled burns build more than wildfires.",
    color: "#dc2626"
  },
  long_term_builder: {
    icon: "🌳",
    rarity: 10,
    rarityLabel: "Uncommon",
    compatibleWith: ["quiet_strategist", "stabilizer"],
    tensionWith: ["momentum_chaser", "revenge_bettor"],
    famousExamples: ["Jeff Bezos", "Charlie Munger", "Berkshire Hathaway"],
    superpower: "Compounding patience into extraordinary results",
    strengthsTitle: "Builder Superpowers",
    strengths: [
      "Decade-long vision",
      "Compound thinking",
      "Emotional stability",
      "Disciplined patience"
    ],
    predictionInsight: "Your predictions favor long horizons. You may underestimate short-term volatility.",
    dailyInsight: "Today's small action compounds into tomorrow's big result. Stay the course.",
    color: "#059669"
  },
  fear_based_seller: {
    icon: "🛡️",
    rarity: 8,
    rarityLabel: "Rare",
    compatibleWith: ["stabilizer", "quiet_strategist"],
    tensionWith: ["risk_addict", "ambitious_builder"],
    famousExamples: ["Nassim Taleb", "Howard Marks", "Seth Klarman"],
    superpower: "Sensing danger before it arrives",
    strengthsTitle: "Protection Superpowers",
    strengths: [
      "Risk radar",
      "Capital preservation",
      "Downside awareness",
      "Survival instinct"
    ],
    predictionInsight: "Your predictions are cautious and protective. Consider that some risks are worth taking.",
    dailyInsight: "Your caution protects you—but don't let fear steal opportunities meant for you.",
    color: "#6b7280"
  },
  risk_addict: {
    icon: "🎲",
    rarity: 5,
    rarityLabel: "Very Rare",
    compatibleWith: ["momentum_chaser", "ambitious_builder"],
    tensionWith: ["stabilizer", "fear_based_seller"],
    famousExamples: ["Elon Musk", "Felix Baumgartner", "Richard Branson"],
    superpower: "Thriving where others fear to tread",
    strengthsTitle: "Risk Superpowers",
    strengths: [
      "Bold action",
      "Volatility comfort",
      "High-stakes clarity",
      "Asymmetric opportunity spotting"
    ],
    predictionInsight: "Your predictions embrace volatility. Add position limits to survive long enough for your big wins.",
    dailyInsight: "The thrill is calling—make sure the reward justifies the risk today.",
    color: "#7c3aed"
  },
  // Add "The Maverick" as an alias for ambitious_builder or create a new one
  maverick: {
    icon: "🔥",
    rarity: 6,
    rarityLabel: "Rare",
    compatibleWith: ["ambitious_builder", "risk_addict"],
    tensionWith: ["stabilizer", "fear_based_seller"],
    famousExamples: ["Elon Musk", "Steve Jobs", "Richard Branson"],
    superpower: "Turning uncertainty into opportunity",
    strengthsTitle: "Maverick Superpowers",
    strengths: [
      "Bold decision-making",
      "Instinct-driven action",
      "Inspiring leadership",
      "Thriving in chaos"
    ],
    predictionInsight: "Your predictions are bold and instinct-driven. Verify your gut with one data point for best results.",
    dailyInsight: "Trust your instincts today, but verify with one fact before you leap.",
    color: "#f97316"
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
  return PSYCHE_METADATA.quiet_strategist;
}

// Get rarity label based on percentage
export function getRarityLabel(rarity: number): string {
  if (rarity <= 5) return "Very Rare";
  if (rarity <= 8) return "Rare";
  if (rarity <= 12) return "Uncommon";
  return "Common";
}

// Get compatible type display names
export function getCompatibleTypes(types: string[]): string[] {
  const displayNames: Record<string, string> = {
    quiet_strategist: "The Quiet Strategist",
    intuitive_empath: "The Intuitive Empath",
    ambitious_builder: "The Ambitious Builder",
    escapist_romantic: "The Escapist Romantic",
    stabilizer: "The Stabilizer",
    momentum_chaser: "The Momentum Chaser",
    emotional_fan: "The Emotional Fan",
    pattern_analyst: "The Pattern Analyst",
    revenge_bettor: "The Revenge Bettor",
    long_term_builder: "The Long-Term Builder",
    fear_based_seller: "The Fear-Based Seller",
    risk_addict: "The Risk Addict",
    maverick: "The Maverick"
  };
  
  return types.map(type => displayNames[type] || type);
}
