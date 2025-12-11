/**
 * Core Questions for Hybrid Onboarding
 * 
 * These 8 universal questions measure fundamental psychological traits
 * that apply across all life domains. They eliminate duplication by
 * measuring each trait once in a domain-agnostic way.
 */

export interface CoreQuestion {
  id: string;
  question: string;
  options: {
    text: string;
    scores: {
      risk: number;
      emotional: number;
      timeHorizon: number;
      decisionStyle: number;
    };
  }[];
}

export const coreQuestions: CoreQuestion[] = [
  {
    id: "core_1_decision_style",
    question: "When making an important decision, what's your typical approach?",
    options: [
      {
        text: "I analyze all available data and wait for clear patterns",
        scores: { risk: 1, emotional: 1, timeHorizon: 3, decisionStyle: 1 }
      },
      {
        text: "I trust my gut feeling and move quickly",
        scores: { risk: 3, emotional: 3, timeHorizon: 1, decisionStyle: 3 }
      },
      {
        text: "I seek advice from trusted people before deciding",
        scores: { risk: 2, emotional: 2, timeHorizon: 2, decisionStyle: 2 }
      },
      {
        text: "I make a plan but stay flexible as things unfold",
        scores: { risk: 2, emotional: 2, timeHorizon: 2, decisionStyle: 2 }
      }
    ]
  },
  {
    id: "core_2_opportunity_response",
    question: "A rare opportunity appears, but it requires immediate action. What do you do?",
    options: [
      {
        text: "Jump on it immediately before it's gone",
        scores: { risk: 3, emotional: 3, timeHorizon: 1, decisionStyle: 3 }
      },
      {
        text: "Take a day to research and then decide",
        scores: { risk: 2, emotional: 2, timeHorizon: 2, decisionStyle: 1 }
      },
      {
        text: "Let it pass—if it's meant to be, it'll come back",
        scores: { risk: 1, emotional: 1, timeHorizon: 3, decisionStyle: 1 }
      },
      {
        text: "Quickly assess the basics and trust my instinct",
        scores: { risk: 3, emotional: 2, timeHorizon: 1, decisionStyle: 2 }
      }
    ]
  },
  {
    id: "core_3_setback_recovery",
    question: "Something you invested time and energy into doesn't work out. How do you react?",
    options: [
      {
        text: "I feel it deeply but eventually move forward",
        scores: { risk: 2, emotional: 3, timeHorizon: 2, decisionStyle: 2 }
      },
      {
        text: "I analyze what went wrong to avoid repeating mistakes",
        scores: { risk: 1, emotional: 1, timeHorizon: 3, decisionStyle: 1 }
      },
      {
        text: "I bounce back quickly and try something new",
        scores: { risk: 3, emotional: 1, timeHorizon: 1, decisionStyle: 3 }
      },
      {
        text: "I take time to process before making my next move",
        scores: { risk: 1, emotional: 2, timeHorizon: 3, decisionStyle: 1 }
      }
    ]
  },
  {
    id: "core_4_risk_tolerance",
    question: "How do you feel about taking risks in areas that matter to you?",
    options: [
      {
        text: "I embrace calculated risks when the potential payoff is high",
        scores: { risk: 3, emotional: 2, timeHorizon: 2, decisionStyle: 1 }
      },
      {
        text: "I prefer steady, predictable progress over big swings",
        scores: { risk: 1, emotional: 1, timeHorizon: 3, decisionStyle: 1 }
      },
      {
        text: "I take risks when my intuition says it's right",
        scores: { risk: 3, emotional: 3, timeHorizon: 1, decisionStyle: 3 }
      },
      {
        text: "I balance safety with occasional bold moves",
        scores: { risk: 2, emotional: 2, timeHorizon: 2, decisionStyle: 2 }
      }
    ]
  },
  {
    id: "core_5_relationship_approach",
    question: "In your closest relationships, how do you typically show up?",
    options: [
      {
        text: "I'm deeply invested and wear my heart on my sleeve",
        scores: { risk: 3, emotional: 3, timeHorizon: 1, decisionStyle: 3 }
      },
      {
        text: "I'm loyal and steady, building trust over time",
        scores: { risk: 1, emotional: 1, timeHorizon: 3, decisionStyle: 1 }
      },
      {
        text: "I'm supportive but maintain my independence",
        scores: { risk: 2, emotional: 2, timeHorizon: 2, decisionStyle: 2 }
      },
      {
        text: "I adapt my approach based on the person and situation",
        scores: { risk: 2, emotional: 2, timeHorizon: 2, decisionStyle: 2 }
      }
    ]
  },
  {
    id: "core_6_timing_style",
    question: "When do you prefer to act on your goals and plans?",
    options: [
      {
        text: "Right now—I don't like waiting",
        scores: { risk: 3, emotional: 3, timeHorizon: 1, decisionStyle: 3 }
      },
      {
        text: "When I've thoroughly prepared and the timing is right",
        scores: { risk: 1, emotional: 1, timeHorizon: 3, decisionStyle: 1 }
      },
      {
        text: "When I feel a strong pull or sense of readiness",
        scores: { risk: 2, emotional: 3, timeHorizon: 2, decisionStyle: 3 }
      },
      {
        text: "I set deadlines and stick to them",
        scores: { risk: 2, emotional: 1, timeHorizon: 2, decisionStyle: 1 }
      }
    ]
  },
  {
    id: "core_7_identity_source",
    question: "What drives your sense of purpose and identity?",
    options: [
      {
        text: "Achieving goals and seeing measurable progress",
        scores: { risk: 2, emotional: 1, timeHorizon: 2, decisionStyle: 1 }
      },
      {
        text: "Deep connections and meaningful relationships",
        scores: { risk: 2, emotional: 3, timeHorizon: 2, decisionStyle: 3 }
      },
      {
        text: "Personal growth and self-understanding",
        scores: { risk: 1, emotional: 2, timeHorizon: 3, decisionStyle: 1 }
      },
      {
        text: "New experiences and exciting challenges",
        scores: { risk: 3, emotional: 2, timeHorizon: 1, decisionStyle: 3 }
      }
    ]
  },
  {
    id: "core_8_information_processing",
    question: "When learning something new or solving a problem, you tend to:",
    options: [
      {
        text: "Dive deep into details and research thoroughly",
        scores: { risk: 1, emotional: 1, timeHorizon: 3, decisionStyle: 1 }
      },
      {
        text: "Get the big picture and figure out the rest as I go",
        scores: { risk: 3, emotional: 2, timeHorizon: 1, decisionStyle: 3 }
      },
      {
        text: "Learn by doing and adjusting based on results",
        scores: { risk: 2, emotional: 2, timeHorizon: 1, decisionStyle: 2 }
      },
      {
        text: "Seek patterns and connections to things I already know",
        scores: { risk: 2, emotional: 1, timeHorizon: 2, decisionStyle: 1 }
      }
    ]
  }
];
