// Core Universal Questions for Hybrid Onboarding
// These 8 questions measure fundamental psychological traits across all domains

export interface CoreQuestion {
  id: number;
  question: string;
  options: CoreOption[];
  trait: string; // What psychological trait this measures
}

export interface CoreOption {
  id: string;
  text: string;
  indicators: string[]; // Personality types this answer suggests
  parameters: {
    risk_appetite?: number;
    emotional_reactivity?: number;
    time_consistency?: number;
    data_orientation?: number;
    tilt_prone?: number;
    volatility_tolerance?: number;
    loyalty_bias?: number;
    change_aversion?: number;
  };
}

export const CORE_QUESTIONS: CoreQuestion[] = [
  {
    id: 1,
    question: "You have a chance to make a big positive change in your life, but success isn't guaranteed. What's your instinct?",
    trait: "Risk Orientation",
    options: [
      {
        id: "1a",
        text: "Take it if the potential gain is worth the risk",
        indicators: ["ambitious_builder", "momentum_chaser", "risk_addict"],
        parameters: {
          risk_appetite: 0.7,
          emotional_reactivity: 0.5,
        },
      },
      {
        id: "1b",
        text: "Research it thoroughly, then decide based on data",
        indicators: ["quiet_strategist", "pattern_analyst"],
        parameters: {
          risk_appetite: 0.4,
          data_orientation: 0.9,
        },
      },
      {
        id: "1c",
        text: "Go with my gut feeling about whether it's right",
        indicators: ["intuitive_empath", "escapist_romantic"],
        parameters: {
          risk_appetite: 0.5,
          emotional_reactivity: 0.8,
        },
      },
      {
        id: "1d",
        text: "Only if I can minimize the downside first",
        indicators: ["stabilizer", "fear_based_seller"],
        parameters: {
          risk_appetite: 0.2,
          change_aversion: 0.7,
        },
      },
    ],
  },
  {
    id: 2,
    question: "Something you were counting on falls through unexpectedly. What happens next?",
    trait: "Emotional Reactivity",
    options: [
      {
        id: "2a",
        text: "I feel frustrated but bounce back quickly",
        indicators: ["ambitious_builder", "momentum_chaser"],
        parameters: {
          emotional_reactivity: 0.5,
          tilt_prone: 0.3,
        },
      },
      {
        id: "2b",
        text: "I analyze what went wrong to prevent it next time",
        indicators: ["quiet_strategist", "pattern_analyst"],
        parameters: {
          emotional_reactivity: 0.3,
          data_orientation: 0.8,
        },
      },
      {
        id: "2c",
        text: "I need time to process the disappointment",
        indicators: ["intuitive_empath", "escapist_romantic"],
        parameters: {
          emotional_reactivity: 0.8,
          tilt_prone: 0.6,
        },
      },
      {
        id: "2d",
        text: "I immediately look for a backup plan",
        indicators: ["stabilizer", "long_term_builder"],
        parameters: {
          emotional_reactivity: 0.4,
          change_aversion: 0.5,
        },
      },
    ],
  },
  {
    id: 3,
    question: "When making an important decision, what do you trust most?",
    trait: "Decision-Making Style",
    options: [
      {
        id: "3a",
        text: "Data, patterns, and logical analysis",
        indicators: ["quiet_strategist", "pattern_analyst"],
        parameters: {
          data_orientation: 0.9,
          emotional_reactivity: 0.3,
        },
      },
      {
        id: "3b",
        text: "My gut instinct and how it feels",
        indicators: ["intuitive_empath", "emotional_fan"],
        parameters: {
          data_orientation: 0.3,
          emotional_reactivity: 0.8,
        },
      },
      {
        id: "3c",
        text: "A balance of logic and intuition",
        indicators: ["long_term_builder", "ambitious_builder"],
        parameters: {
          data_orientation: 0.6,
          emotional_reactivity: 0.5,
        },
      },
      {
        id: "3d",
        text: "What has worked reliably in the past",
        indicators: ["stabilizer", "fear_based_seller"],
        parameters: {
          data_orientation: 0.5,
          change_aversion: 0.7,
        },
      },
    ],
  },
  {
    id: 4,
    question: "A new opportunity appears that everyone is talking about. When do you act?",
    trait: "Timing Orientation",
    options: [
      {
        id: "4a",
        text: "Right away, before the window closes",
        indicators: ["momentum_chaser", "risk_addict", "ambitious_builder"],
        parameters: {
          risk_appetite: 0.7,
          time_consistency: 0.4,
        },
      },
      {
        id: "4b",
        text: "After I see proof it's working for others",
        indicators: ["stabilizer", "fear_based_seller"],
        parameters: {
          risk_appetite: 0.3,
          time_consistency: 0.7,
        },
      },
      {
        id: "4c",
        text: "When my analysis confirms it's the right move",
        indicators: ["quiet_strategist", "pattern_analyst"],
        parameters: {
          risk_appetite: 0.4,
          time_consistency: 0.8,
        },
      },
      {
        id: "4d",
        text: "When it feels aligned with my values",
        indicators: ["intuitive_empath", "escapist_romantic"],
        parameters: {
          risk_appetite: 0.5,
          time_consistency: 0.5,
        },
      },
    ],
  },
  {
    id: 5,
    question: "After a significant failure or loss, what's your typical response?",
    trait: "Setback Response",
    options: [
      {
        id: "5a",
        text: "Try again immediately with a new approach",
        indicators: ["ambitious_builder", "revenge_bettor"],
        parameters: {
          tilt_prone: 0.5,
          emotional_reactivity: 0.6,
        },
      },
      {
        id: "5b",
        text: "Take a break to reflect and reset",
        indicators: ["intuitive_empath", "escapist_romantic"],
        parameters: {
          tilt_prone: 0.4,
          emotional_reactivity: 0.7,
        },
      },
      {
        id: "5c",
        text: "Study what went wrong to avoid repeating it",
        indicators: ["quiet_strategist", "pattern_analyst"],
        parameters: {
          tilt_prone: 0.2,
          data_orientation: 0.9,
        },
      },
      {
        id: "5d",
        text: "Pull back and focus on safer options",
        indicators: ["stabilizer", "fear_based_seller"],
        parameters: {
          tilt_prone: 0.3,
          change_aversion: 0.7,
        },
      },
    ],
  },
  {
    id: 6,
    question: "Which statement better describes what you value?",
    trait: "Stability vs Novelty",
    options: [
      {
        id: "6a",
        text: "Stability, consistency, and proven methods",
        indicators: ["stabilizer", "long_term_builder", "fear_based_seller"],
        parameters: {
          change_aversion: 0.7,
          volatility_tolerance: 0.3,
        },
      },
      {
        id: "6b",
        text: "Growth, variety, and new experiences",
        indicators: ["ambitious_builder", "momentum_chaser", "risk_addict"],
        parameters: {
          change_aversion: 0.2,
          volatility_tolerance: 0.8,
        },
      },
      {
        id: "6c",
        text: "Meaningful connections and emotional depth",
        indicators: ["intuitive_empath", "escapist_romantic", "emotional_fan"],
        parameters: {
          change_aversion: 0.4,
          loyalty_bias: 0.8,
        },
      },
      {
        id: "6d",
        text: "Understanding patterns and optimizing systems",
        indicators: ["quiet_strategist", "pattern_analyst"],
        parameters: {
          change_aversion: 0.5,
          data_orientation: 0.9,
        },
      },
    ],
  },
  {
    id: 7,
    question: "When you see something gaining momentum (trending up, getting popular), what do you do?",
    trait: "Momentum Reactivity",
    options: [
      {
        id: "7a",
        text: "Jump on it—momentum creates more momentum",
        indicators: ["momentum_chaser", "risk_addict", "emotional_fan"],
        parameters: {
          volatility_tolerance: 0.8,
          tilt_prone: 0.6,
        },
      },
      {
        id: "7b",
        text: "Be cautious—what goes up often comes down",
        indicators: ["stabilizer", "fear_based_seller", "quiet_strategist"],
        parameters: {
          volatility_tolerance: 0.3,
          risk_appetite: 0.3,
        },
      },
      {
        id: "7c",
        text: "Analyze whether the momentum is sustainable",
        indicators: ["pattern_analyst", "long_term_builder"],
        parameters: {
          volatility_tolerance: 0.5,
          data_orientation: 0.8,
        },
      },
      {
        id: "7d",
        text: "Trust my intuition about whether it's real",
        indicators: ["intuitive_empath", "escapist_romantic"],
        parameters: {
          volatility_tolerance: 0.5,
          emotional_reactivity: 0.7,
        },
      },
    ],
  },
  {
    id: 8,
    question: "How do you feel about situations where the outcome is uncertain?",
    trait: "Uncertainty Tolerance",
    options: [
      {
        id: "8a",
        text: "Excited—uncertainty means opportunity",
        indicators: ["ambitious_builder", "risk_addict", "momentum_chaser"],
        parameters: {
          risk_appetite: 0.8,
          volatility_tolerance: 0.8,
        },
      },
      {
        id: "8b",
        text: "Uncomfortable—I prefer clarity and predictability",
        indicators: ["stabilizer", "fear_based_seller"],
        parameters: {
          risk_appetite: 0.2,
          change_aversion: 0.7,
        },
      },
      {
        id: "8c",
        text: "Neutral—I focus on what I can control",
        indicators: ["quiet_strategist", "long_term_builder"],
        parameters: {
          risk_appetite: 0.4,
          time_consistency: 0.8,
        },
      },
      {
        id: "8d",
        text: "Anxious but curious—depends on what's at stake",
        indicators: ["intuitive_empath", "escapist_romantic"],
        parameters: {
          risk_appetite: 0.5,
          emotional_reactivity: 0.7,
        },
      },
    ],
  },
];
