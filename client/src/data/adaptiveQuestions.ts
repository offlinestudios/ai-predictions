/**
 * Adaptive Questions for Hybrid Onboarding
 * 
 * These questions are specific to each interest category.
 * Users answer 4 questions for their selected primary interest.
 */

export interface AdaptiveQuestion {
  id: string;
  category: string;
  question: string;
  options: {
    text: string;
    scores: {
      risk: number;
      emotional: number;
      timeHorizon: number;
      decisionStyle: number;
    };
    insight?: string;
  }[];
}

export const adaptiveQuestionsByCategory: Record<string, AdaptiveQuestion[]> = {
  career: [
    {
      id: "career_1",
      category: "career",
      question: "What matters most to you in your career?",
      options: [
        {
          text: "Climbing the ladder and achieving recognition",
          scores: { risk: 3, emotional: 2, timeHorizon: 2, decisionStyle: 1 },
          insight: "achievement_driven"
        },
        {
          text: "Stability and work-life balance",
          scores: { risk: 1, emotional: 1, timeHorizon: 3, decisionStyle: 1 },
          insight: "stability_focused"
        },
        {
          text: "Doing work that feels meaningful and impactful",
          scores: { risk: 2, emotional: 3, timeHorizon: 2, decisionStyle: 3 },
          insight: "purpose_driven"
        },
        {
          text: "Learning new skills and growing professionally",
          scores: { risk: 2, emotional: 2, timeHorizon: 3, decisionStyle: 1 },
          insight: "growth_oriented"
        }
      ]
    },
    {
      id: "career_2",
      category: "career",
      question: "You're offered a promotion with more responsibility but uncertain outcomes. What do you do?",
      options: [
        {
          text: "Take it—I thrive on new challenges",
          scores: { risk: 3, emotional: 2, timeHorizon: 1, decisionStyle: 3 },
          insight: "risk_embracing"
        },
        {
          text: "Negotiate for clearer expectations before accepting",
          scores: { risk: 2, emotional: 1, timeHorizon: 2, decisionStyle: 1 },
          insight: "calculated_mover"
        },
        {
          text: "Decline—I'm happy where I am",
          scores: { risk: 1, emotional: 1, timeHorizon: 3, decisionStyle: 1 },
          insight: "contentment_focused"
        },
        {
          text: "Ask for time to think it through",
          scores: { risk: 1, emotional: 2, timeHorizon: 2, decisionStyle: 1 },
          insight: "deliberate_decider"
        }
      ]
    },
    {
      id: "career_3",
      category: "career",
      question: "When facing a setback at work, you typically:",
      options: [
        {
          text: "Push harder to prove myself",
          scores: { risk: 3, emotional: 3, timeHorizon: 1, decisionStyle: 3 },
          insight: "resilience_fighter"
        },
        {
          text: "Reflect on what I can learn and improve",
          scores: { risk: 1, emotional: 2, timeHorizon: 3, decisionStyle: 1 },
          insight: "reflective_learner"
        },
        {
          text: "Seek feedback and adjust my approach",
          scores: { risk: 2, emotional: 2, timeHorizon: 2, decisionStyle: 1 },
          insight: "adaptive_improver"
        },
        {
          text: "Consider if this role is still the right fit",
          scores: { risk: 2, emotional: 2, timeHorizon: 2, decisionStyle: 2 },
          insight: "alignment_seeker"
        }
      ]
    },
    {
      id: "career_4",
      category: "career",
      question: "How do you approach career planning?",
      options: [
        {
          text: "I have a clear 5-10 year plan",
          scores: { risk: 1, emotional: 1, timeHorizon: 3, decisionStyle: 1 },
          insight: "strategic_planner"
        },
        {
          text: "I follow opportunities as they arise",
          scores: { risk: 3, emotional: 2, timeHorizon: 1, decisionStyle: 3 },
          insight: "opportunistic_mover"
        },
        {
          text: "I set general goals but stay flexible",
          scores: { risk: 2, emotional: 2, timeHorizon: 2, decisionStyle: 2 },
          insight: "flexible_navigator"
        },
        {
          text: "I focus on the present and trust the path will unfold",
          scores: { risk: 2, emotional: 3, timeHorizon: 1, decisionStyle: 3 },
          insight: "present_focused"
        }
      ]
    }
  ],

  relationships: [
    {
      id: "relationships_1",
      category: "relationships",
      question: "What do you value most in romantic relationships?",
      options: [
        {
          text: "Deep emotional connection and intimacy",
          scores: { risk: 2, emotional: 3, timeHorizon: 2, decisionStyle: 3 },
          insight: "intimacy_seeker"
        },
        {
          text: "Trust, loyalty, and long-term commitment",
          scores: { risk: 1, emotional: 1, timeHorizon: 3, decisionStyle: 1 },
          insight: "commitment_focused"
        },
        {
          text: "Excitement, passion, and chemistry",
          scores: { risk: 3, emotional: 3, timeHorizon: 1, decisionStyle: 3 },
          insight: "passion_driven"
        },
        {
          text: "Partnership and shared goals",
          scores: { risk: 2, emotional: 2, timeHorizon: 3, decisionStyle: 1 },
          insight: "partnership_oriented"
        }
      ]
    },
    {
      id: "relationships_2",
      category: "relationships",
      question: "When you're interested in someone, how do you typically proceed?",
      options: [
        {
          text: "I make my interest clear early on",
          scores: { risk: 3, emotional: 3, timeHorizon: 1, decisionStyle: 3 },
          insight: "direct_pursuer"
        },
        {
          text: "I take time to get to know them first",
          scores: { risk: 1, emotional: 1, timeHorizon: 3, decisionStyle: 1 },
          insight: "cautious_connector"
        },
        {
          text: "I wait for clear signs they're interested too",
          scores: { risk: 1, emotional: 2, timeHorizon: 2, decisionStyle: 1 },
          insight: "reciprocity_waiter"
        },
        {
          text: "I follow my gut and see where it goes",
          scores: { risk: 2, emotional: 3, timeHorizon: 1, decisionStyle: 3 },
          insight: "intuitive_explorer"
        }
      ]
    },
    {
      id: "relationships_3",
      category: "relationships",
      question: "How do you handle conflict in close relationships?",
      options: [
        {
          text: "I address it head-on immediately",
          scores: { risk: 3, emotional: 3, timeHorizon: 1, decisionStyle: 3 },
          insight: "direct_confronter"
        },
        {
          text: "I need time to cool down before discussing",
          scores: { risk: 1, emotional: 2, timeHorizon: 2, decisionStyle: 1 },
          insight: "reflective_processor"
        },
        {
          text: "I try to understand their perspective first",
          scores: { risk: 2, emotional: 2, timeHorizon: 2, decisionStyle: 1 },
          insight: "empathetic_mediator"
        },
        {
          text: "I prefer to let things settle naturally",
          scores: { risk: 1, emotional: 1, timeHorizon: 3, decisionStyle: 1 },
          insight: "passive_resolver"
        }
      ]
    },
    {
      id: "relationships_4",
      category: "relationships",
      question: "What's your biggest fear in relationships?",
      options: [
        {
          text: "Being betrayed or lied to",
          scores: { risk: 1, emotional: 3, timeHorizon: 3, decisionStyle: 1 },
          insight: "trust_protector"
        },
        {
          text: "Losing my independence",
          scores: { risk: 2, emotional: 2, timeHorizon: 2, decisionStyle: 2 },
          insight: "autonomy_guardian"
        },
        {
          text: "Not being truly seen or understood",
          scores: { risk: 2, emotional: 3, timeHorizon: 2, decisionStyle: 3 },
          insight: "validation_seeker"
        },
        {
          text: "Settling for less than I deserve",
          scores: { risk: 3, emotional: 2, timeHorizon: 2, decisionStyle: 1 },
          insight: "standards_holder"
        }
      ]
    }
  ],

  money: [
    {
      id: "money_1",
      category: "money",
      question: "What's your primary financial goal right now?",
      options: [
        {
          text: "Building wealth and growing my net worth",
          scores: { risk: 3, emotional: 1, timeHorizon: 3, decisionStyle: 1 },
          insight: "wealth_builder"
        },
        {
          text: "Achieving financial security and stability",
          scores: { risk: 1, emotional: 1, timeHorizon: 3, decisionStyle: 1 },
          insight: "security_focused"
        },
        {
          text: "Enjoying life now while saving for the future",
          scores: { risk: 2, emotional: 2, timeHorizon: 2, decisionStyle: 2 },
          insight: "balanced_enjoyer"
        },
        {
          text: "Financial freedom to pursue my passions",
          scores: { risk: 2, emotional: 3, timeHorizon: 2, decisionStyle: 3 },
          insight: "freedom_seeker"
        }
      ]
    },
    {
      id: "money_2",
      category: "money",
      question: "How do you feel about investing and financial risk?",
      options: [
        {
          text: "I'm comfortable with high-risk, high-reward opportunities",
          scores: { risk: 3, emotional: 2, timeHorizon: 1, decisionStyle: 3 },
          insight: "aggressive_investor"
        },
        {
          text: "I prefer safe, predictable returns",
          scores: { risk: 1, emotional: 1, timeHorizon: 3, decisionStyle: 1 },
          insight: "conservative_saver"
        },
        {
          text: "I balance risk with diversification",
          scores: { risk: 2, emotional: 1, timeHorizon: 3, decisionStyle: 1 },
          insight: "strategic_allocator"
        },
        {
          text: "I invest in what I understand and believe in",
          scores: { risk: 2, emotional: 2, timeHorizon: 2, decisionStyle: 2 },
          insight: "conviction_investor"
        }
      ]
    },
    {
      id: "money_3",
      category: "money",
      question: "When you experience a financial setback, you:",
      options: [
        {
          text: "Feel stressed but quickly make a recovery plan",
          scores: { risk: 2, emotional: 3, timeHorizon: 1, decisionStyle: 1 },
          insight: "resilient_planner"
        },
        {
          text: "Analyze what went wrong to avoid repeating it",
          scores: { risk: 1, emotional: 1, timeHorizon: 3, decisionStyle: 1 },
          insight: "analytical_learner"
        },
        {
          text: "Cut back immediately and rebuild cautiously",
          scores: { risk: 1, emotional: 2, timeHorizon: 3, decisionStyle: 1 },
          insight: "defensive_recoverer"
        },
        {
          text: "Stay optimistic and look for new opportunities",
          scores: { risk: 3, emotional: 2, timeHorizon: 1, decisionStyle: 3 },
          insight: "opportunistic_bouncer"
        }
      ]
    },
    {
      id: "money_4",
      category: "money",
      question: "How do you make major financial decisions?",
      options: [
        {
          text: "I research extensively and run the numbers",
          scores: { risk: 1, emotional: 1, timeHorizon: 3, decisionStyle: 1 },
          insight: "data_driven_decider"
        },
        {
          text: "I trust my gut after a quick assessment",
          scores: { risk: 3, emotional: 3, timeHorizon: 1, decisionStyle: 3 },
          insight: "intuitive_mover"
        },
        {
          text: "I consult with financial advisors or experts",
          scores: { risk: 1, emotional: 1, timeHorizon: 2, decisionStyle: 1 },
          insight: "advice_seeker"
        },
        {
          text: "I weigh pros and cons but ultimately follow my instinct",
          scores: { risk: 2, emotional: 2, timeHorizon: 2, decisionStyle: 2 },
          insight: "balanced_decider"
        }
      ]
    }
  ],

  health: [
    {
      id: "health_1",
      category: "health",
      question: "What motivates you most about health and wellness?",
      options: [
        {
          text: "Looking and feeling my best",
          scores: { risk: 2, emotional: 2, timeHorizon: 2, decisionStyle: 1 },
          insight: "appearance_motivated"
        },
        {
          text: "Preventing illness and living longer",
          scores: { risk: 1, emotional: 1, timeHorizon: 3, decisionStyle: 1 },
          insight: "longevity_focused"
        },
        {
          text: "Having energy for the things I love",
          scores: { risk: 2, emotional: 3, timeHorizon: 2, decisionStyle: 3 },
          insight: "vitality_driven"
        },
        {
          text: "Achieving fitness goals and personal records",
          scores: { risk: 3, emotional: 2, timeHorizon: 2, decisionStyle: 1 },
          insight: "performance_oriented"
        }
      ]
    },
    {
      id: "health_2",
      category: "health",
      question: "How do you approach health and fitness routines?",
      options: [
        {
          text: "I follow a structured plan and track my progress",
          scores: { risk: 1, emotional: 1, timeHorizon: 3, decisionStyle: 1 },
          insight: "systematic_tracker"
        },
        {
          text: "I do what feels good in the moment",
          scores: { risk: 2, emotional: 3, timeHorizon: 1, decisionStyle: 3 },
          insight: "intuitive_mover"
        },
        {
          text: "I'm consistent with basics but flexible overall",
          scores: { risk: 2, emotional: 2, timeHorizon: 2, decisionStyle: 2 },
          insight: "balanced_maintainer"
        },
        {
          text: "I go all-in for a while, then take breaks",
          scores: { risk: 3, emotional: 3, timeHorizon: 1, decisionStyle: 3 },
          insight: "intensity_cycler"
        }
      ]
    },
    {
      id: "health_3",
      category: "health",
      question: "When you fall off track with health goals, you:",
      options: [
        {
          text: "Beat myself up but get back on track quickly",
          scores: { risk: 2, emotional: 3, timeHorizon: 1, decisionStyle: 3 },
          insight: "self_critical_recoverer"
        },
        {
          text: "Reassess my approach and make adjustments",
          scores: { risk: 1, emotional: 1, timeHorizon: 2, decisionStyle: 1 },
          insight: "adaptive_strategist"
        },
        {
          text: "Accept it and restart without judgment",
          scores: { risk: 2, emotional: 2, timeHorizon: 2, decisionStyle: 2 },
          insight: "compassionate_restarter"
        },
        {
          text: "Question if the goal was right for me",
          scores: { risk: 2, emotional: 2, timeHorizon: 2, decisionStyle: 2 },
          insight: "goal_evaluator"
        }
      ]
    },
    {
      id: "health_4",
      category: "health",
      question: "How do you make decisions about your health?",
      options: [
        {
          text: "I research and follow evidence-based approaches",
          scores: { risk: 1, emotional: 1, timeHorizon: 3, decisionStyle: 1 },
          insight: "science_follower"
        },
        {
          text: "I listen to my body and trust what it tells me",
          scores: { risk: 2, emotional: 3, timeHorizon: 2, decisionStyle: 3 },
          insight: "body_intuitive"
        },
        {
          text: "I try different things and see what works",
          scores: { risk: 3, emotional: 2, timeHorizon: 1, decisionStyle: 3 },
          insight: "experimental_tester"
        },
        {
          text: "I consult with health professionals",
          scores: { risk: 1, emotional: 1, timeHorizon: 2, decisionStyle: 1 },
          insight: "expert_reliant"
        }
      ]
    }
  ],

  sports: [
    {
      id: "sports_1",
      category: "sports",
      question: "What draws you to sports predictions?",
      options: [
        {
          text: "The thrill of being right and winning",
          scores: { risk: 3, emotional: 3, timeHorizon: 1, decisionStyle: 3 },
          insight: "thrill_chaser"
        },
        {
          text: "Testing my knowledge and analysis skills",
          scores: { risk: 2, emotional: 1, timeHorizon: 2, decisionStyle: 1 },
          insight: "analyst_mindset"
        },
        {
          text: "It makes watching games more exciting",
          scores: { risk: 2, emotional: 3, timeHorizon: 1, decisionStyle: 3 },
          insight: "entertainment_enhancer"
        },
        {
          text: "Building a long-term winning strategy",
          scores: { risk: 1, emotional: 1, timeHorizon: 3, decisionStyle: 1 },
          insight: "strategic_builder"
        }
      ]
    },
    {
      id: "sports_2",
      category: "sports",
      question: "How do you make sports predictions?",
      options: [
        {
          text: "I analyze stats, trends, and matchups thoroughly",
          scores: { risk: 1, emotional: 1, timeHorizon: 2, decisionStyle: 1 },
          insight: "data_analyzer"
        },
        {
          text: "I go with my gut and team loyalty",
          scores: { risk: 3, emotional: 3, timeHorizon: 1, decisionStyle: 3 },
          insight: "emotional_bettor"
        },
        {
          text: "I look for value and exploit market inefficiencies",
          scores: { risk: 2, emotional: 1, timeHorizon: 3, decisionStyle: 1 },
          insight: "value_hunter"
        },
        {
          text: "I follow expert picks and consensus",
          scores: { risk: 1, emotional: 1, timeHorizon: 2, decisionStyle: 1 },
          insight: "consensus_follower"
        }
      ]
    },
    {
      id: "sports_3",
      category: "sports",
      question: "When your prediction loses, how do you react?",
      options: [
        {
          text: "I immediately want to make another prediction to win it back",
          scores: { risk: 3, emotional: 3, timeHorizon: 1, decisionStyle: 3 },
          insight: "revenge_predictor"
        },
        {
          text: "I review what went wrong and adjust my strategy",
          scores: { risk: 1, emotional: 1, timeHorizon: 3, decisionStyle: 1 },
          insight: "learning_adapter"
        },
        {
          text: "I accept it as part of the game and move on",
          scores: { risk: 2, emotional: 2, timeHorizon: 2, decisionStyle: 2 },
          insight: "even_keeled"
        },
        {
          text: "I take a break to avoid emotional decisions",
          scores: { risk: 1, emotional: 2, timeHorizon: 2, decisionStyle: 1 },
          insight: "disciplined_pauser"
        }
      ]
    },
    {
      id: "sports_4",
      category: "sports",
      question: "What's your prediction style?",
      options: [
        {
          text: "I make frequent small predictions",
          scores: { risk: 2, emotional: 2, timeHorizon: 1, decisionStyle: 3 },
          insight: "volume_player"
        },
        {
          text: "I wait for high-confidence opportunities",
          scores: { risk: 1, emotional: 1, timeHorizon: 3, decisionStyle: 1 },
          insight: "selective_sniper"
        },
        {
          text: "I chase big payoffs with risky parlays",
          scores: { risk: 3, emotional: 3, timeHorizon: 1, decisionStyle: 3 },
          insight: "longshot_chaser"
        },
        {
          text: "I stick to favorites and safe predictions",
          scores: { risk: 1, emotional: 1, timeHorizon: 2, decisionStyle: 1 },
          insight: "conservative_predictor"
        }
      ]
    }
  ],

  stocks: [
    {
      id: "stocks_1",
      category: "stocks",
      question: "What's your investment philosophy?",
      options: [
        {
          text: "Buy and hold quality companies long-term",
          scores: { risk: 1, emotional: 1, timeHorizon: 3, decisionStyle: 1 },
          insight: "long_term_holder"
        },
        {
          text: "Trade actively to capitalize on market movements",
          scores: { risk: 3, emotional: 2, timeHorizon: 1, decisionStyle: 3 },
          insight: "active_trader"
        },
        {
          text: "Follow momentum and ride trends",
          scores: { risk: 3, emotional: 3, timeHorizon: 1, decisionStyle: 3 },
          insight: "momentum_trader"
        },
        {
          text: "Value investing—buy undervalued assets",
          scores: { risk: 2, emotional: 1, timeHorizon: 3, decisionStyle: 1 },
          insight: "value_investor"
        }
      ]
    },
    {
      id: "stocks_2",
      category: "stocks",
      question: "How do you research stock investments?",
      options: [
        {
          text: "Deep fundamental analysis of financials",
          scores: { risk: 1, emotional: 1, timeHorizon: 3, decisionStyle: 1 },
          insight: "fundamental_analyst"
        },
        {
          text: "Technical analysis and chart patterns",
          scores: { risk: 2, emotional: 1, timeHorizon: 1, decisionStyle: 1 },
          insight: "technical_trader"
        },
        {
          text: "I follow market sentiment and news",
          scores: { risk: 3, emotional: 3, timeHorizon: 1, decisionStyle: 3 },
          insight: "sentiment_follower"
        },
        {
          text: "I invest in what I know and use",
          scores: { risk: 2, emotional: 2, timeHorizon: 2, decisionStyle: 2 },
          insight: "conviction_buyer"
        }
      ]
    },
    {
      id: "stocks_3",
      category: "stocks",
      question: "When a stock you own drops 20%, what do you do?",
      options: [
        {
          text: "Buy more—it's on sale",
          scores: { risk: 3, emotional: 1, timeHorizon: 3, decisionStyle: 1 },
          insight: "contrarian_buyer"
        },
        {
          text: "Sell to cut my losses",
          scores: { risk: 1, emotional: 3, timeHorizon: 1, decisionStyle: 3 },
          insight: "loss_avoider"
        },
        {
          text: "Hold and wait for recovery",
          scores: { risk: 2, emotional: 2, timeHorizon: 3, decisionStyle: 1 },
          insight: "patient_holder"
        },
        {
          text: "Reassess the thesis and decide",
          scores: { risk: 2, emotional: 1, timeHorizon: 2, decisionStyle: 1 },
          insight: "rational_evaluator"
        }
      ]
    },
    {
      id: "stocks_4",
      category: "stocks",
      question: "What's your biggest challenge with investing?",
      options: [
        {
          text: "Staying disciplined and not overtrading",
          scores: { risk: 3, emotional: 3, timeHorizon: 1, decisionStyle: 3 },
          insight: "impulse_manager"
        },
        {
          text: "Overcoming fear and taking enough risk",
          scores: { risk: 1, emotional: 3, timeHorizon: 2, decisionStyle: 1 },
          insight: "fear_battler"
        },
        {
          text: "Finding the time to research properly",
          scores: { risk: 2, emotional: 1, timeHorizon: 2, decisionStyle: 1 },
          insight: "time_constrained"
        },
        {
          text: "Dealing with losses emotionally",
          scores: { risk: 2, emotional: 3, timeHorizon: 2, decisionStyle: 3 },
          insight: "emotional_processor"
        }
      ]
    }
  ]
};

export function getAdaptiveQuestions(category: string): AdaptiveQuestion[] {
  return adaptiveQuestionsByCategory[category.toLowerCase()] || [];
}
