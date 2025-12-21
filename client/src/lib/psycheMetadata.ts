// Extended metadata for psyche personality types
// Uses 8 personality types: Maverick, Strategist, Visionary, Guardian, Pioneer, Pragmatist, Catalyst, Adapter

export interface PsycheMetadata {
  compatibleWith: string[]; // Best matched personality types
  tensionWith: string[]; // May clash with these types
  famousExamples: string[]; // Famous people with this personality
  superpower: string; // Their unique superpower
  strengthsTitle: string; // Title for strengths section
  strengths: string[]; // List of strengths
  growthAreas: string[]; // Areas for growth/improvement
  relationshipInsights: string[]; // Insights for relationships
  predictionInsight: string; // How their personality affects predictions
  dailyInsight: string; // Daily tip for this type
}

export const PSYCHE_METADATA: Record<string, PsycheMetadata> = {
  maverick: {
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
    growthAreas: [
      "May overlook important details",
      "Can struggle with patience",
      "Risk of burnout from constant action",
      "May dismiss others' concerns too quickly"
    ],
    relationshipInsights: [
      "Your intensity can be magnetic but overwhelming.",
      "Partners need to match your energy or feel left behind.",
      "Learn to slow down for deeper connection."
    ],
    predictionInsight: "Your predictions are bold and instinct-driven. Verify your gut with one data point for best results.",
    dailyInsight: "Trust your instincts today, but verify with one fact before you leap."
  },
  strategist: {
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
    growthAreas: [
      "Can overthink and delay action",
      "May miss emotional nuances",
      "Risk of analysis paralysis",
      "Can seem distant or cold"
    ],
    relationshipInsights: [
      "You show love through planning and problem-solving.",
      "Partners may need more emotional expression from you.",
      "Balance logic with spontaneous moments of connection."
    ],
    predictionInsight: "Your predictions benefit from careful analysis. You excel at long-term forecasts but may miss fast-moving opportunities.",
    dailyInsight: "Trust your analysis, but don't wait for perfect information—good enough is often good enough."
  },
  visionary: {
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
    growthAreas: [
      "May neglect present for future",
      "Can be impatient with details",
      "Risk of overcommitting",
      "May struggle with follow-through"
    ],
    relationshipInsights: [
      "You inspire partners with your vision and ambition.",
      "Remember to be present, not just future-focused.",
      "Share your dreams but also your daily moments."
    ],
    predictionInsight: "Your predictions are bold yet calculated. Balance your vision with practical checkpoints.",
    dailyInsight: "Your vision is your compass—but check the map occasionally."
  },
  guardian: {
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
    growthAreas: [
      "May resist necessary change",
      "Can be overly cautious",
      "Risk of missing opportunities",
      "May struggle with spontaneity"
    ],
    relationshipInsights: [
      "You provide stability and security in relationships.",
      "Partners feel safe with you but may crave more adventure.",
      "Balance protection with allowing room for growth."
    ],
    predictionInsight: "Your predictions favor safety. Consider that calculated risks sometimes offer the best risk-adjusted returns.",
    dailyInsight: "Stability is your strength—but one small stretch today could unlock new possibilities."
  },
  pioneer: {
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
    growthAreas: [
      "May miss short-term opportunities",
      "Can be too rigid in approach",
      "Risk of stubbornness",
      "May undervalue quick wins"
    ],
    relationshipInsights: [
      "You're in it for the long haul and deeply loyal.",
      "Partners appreciate your steadiness but may want more excitement.",
      "Celebrate small milestones, not just the big ones."
    ],
    predictionInsight: "Your predictions favor long horizons. You may underestimate short-term volatility.",
    dailyInsight: "Today's small action compounds into tomorrow's big result. Stay the course."
  },
  pragmatist: {
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
    growthAreas: [
      "May dismiss emotional factors",
      "Can be overly skeptical",
      "Risk of missing intuitive insights",
      "May struggle with ambiguity"
    ],
    relationshipInsights: [
      "You bring clarity and rationality to relationships.",
      "Partners may need more emotional validation from you.",
      "Not everything needs to be solved—sometimes just listen."
    ],
    predictionInsight: "Your predictions are data-driven and reliable. Add emotional context to catch human-driven shifts.",
    dailyInsight: "The patterns are speaking—but remember, humans don't always follow the script."
  },
  catalyst: {
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
    growthAreas: [
      "May chase too many opportunities",
      "Can struggle with commitment",
      "Risk of burnout from constant motion",
      "May confuse hype with substance"
    ],
    relationshipInsights: [
      "You bring excitement and energy to relationships.",
      "Partners may struggle to keep up with your pace.",
      "Learn to be still sometimes—presence is a gift."
    ],
    predictionInsight: "You're great at catching trends early. Distinguish real momentum from hype by checking fundamentals.",
    dailyInsight: "The wave is building—make sure you're paddling in the right direction."
  },
  adapter: {
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
    growthAreas: [
      "May lack clear identity",
      "Can struggle with commitment",
      "May be indecisive at times",
      "Risk of spreading too thin"
    ],
    relationshipInsights: [
      "Your flexibility makes you a supportive, understanding partner.",
      "Look for relationships where you can be your authentic self, not just adaptive.",
      "Define your own needs clearly—don't lose yourself in accommodation."
    ],
    predictionInsight: "Your intuition often catches what data misses. Trust your feelings, but verify with one objective data point.",
    dailyInsight: "Your gut is talking—listen to it, but ask 'why' before you act."
  }
};

// Legacy type to new type mapping (for database migration)
export const LEGACY_TYPE_MAPPING: Record<string, string> = {
  quiet_strategist: "strategist",
  risk_addict: "maverick",
  ambitious_builder: "visionary",
  stabilizer: "guardian",
  long_term_builder: "pioneer",
  pattern_analyst: "pragmatist",
  momentum_chaser: "catalyst",
  intuitive_empath: "adapter"
};

// Helper function to get metadata for a psyche type
export function getPsycheMetadata(psycheType: string): PsycheMetadata | null {
  // Normalize the type name (handle various formats)
  const normalizedType = psycheType
    .toLowerCase()
    .replace(/^the\s+/i, '')
    .replace(/\s+/g, '_')
    .replace(/-/g, '_');
  
  // Check if it's a legacy type and map to new type
  const mappedType = LEGACY_TYPE_MAPPING[normalizedType] || normalizedType;
  
  // Direct match
  if (PSYCHE_METADATA[mappedType]) {
    return PSYCHE_METADATA[mappedType];
  }
  
  // Try to find a partial match
  for (const [key, metadata] of Object.entries(PSYCHE_METADATA)) {
    if (mappedType.includes(key) || key.includes(mappedType)) {
      return metadata;
    }
  }
  
  // Default fallback
  return PSYCHE_METADATA.strategist;
}

// Get the new display name for any psyche type (including legacy)
export function getDisplayName(psycheType: string): string {
  const normalizedType = psycheType
    .toLowerCase()
    .replace(/^the\s+/i, '')
    .replace(/\s+/g, '_')
    .replace(/-/g, '_');
  
  // Map legacy to new type
  const mappedType = LEGACY_TYPE_MAPPING[normalizedType] || normalizedType;
  
  const displayNames: Record<string, string> = {
    maverick: "The Maverick",
    strategist: "The Strategist",
    visionary: "The Visionary",
    guardian: "The Guardian",
    pioneer: "The Pioneer",
    pragmatist: "The Pragmatist",
    catalyst: "The Catalyst",
    adapter: "The Adapter"
  };
  
  return displayNames[mappedType] || "The Strategist";
}

// Get compatible type display names
export function getCompatibleTypes(types: string[]): string[] {
  const displayNames: Record<string, string> = {
    maverick: "The Maverick",
    strategist: "The Strategist",
    visionary: "The Visionary",
    guardian: "The Guardian",
    pioneer: "The Pioneer",
    pragmatist: "The Pragmatist",
    catalyst: "The Catalyst",
    adapter: "The Adapter"
  };
  
  return types.map(type => displayNames[type] || type);
}
