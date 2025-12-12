/**
 * Hybrid Psyche Type Calculation
 * 
 * Calculates psyche type from 12 hybrid onboarding responses:
 * - 8 core questions (universal)
 * - 4 adaptive questions (category-specific)
 */

/**
 * Map new psyche type names to database-compatible values
 * Database expects: quiet_strategist, intuitive_empath, ambitious_builder, etc.
 */
function mapPsycheTypeToDatabase(displayType: string): string {
  const mapping: Record<string, string> = {
    "The Maverick": "risk_addict",
    "The Strategist": "quiet_strategist",
    "The Visionary": "ambitious_builder",
    "The Guardian": "stabilizer",
    "The Pioneer": "long_term_builder",
    "The Pragmatist": "pattern_analyst",
    "The Catalyst": "momentum_chaser",
    "The Adapter": "intuitive_empath"
  };
  
  return mapping[displayType] || "intuitive_empath";
}

export interface HybridResponse {
  questionId: string;
  selectedOptionIndex: number;
  scores: {
    risk: number;
    emotional: number;
    timeHorizon: number;
    decisionStyle: number;
  };
}

export interface PsycheScores {
  risk: number;
  emotional: number;
  timeHorizon: number;
  decisionStyle: number;
}

export interface PsycheType {
  type: string;
  dbType?: string;
  description: string;
  traits: string[];
  strengths: string[];
  challenges: string[];
}

/**
 * Calculate psyche type from hybrid onboarding responses
 */
export function calculateHybridPsycheType(
  responses: HybridResponse[],
  category: string
): { psycheType: PsycheType; scores: PsycheScores } {
  // Aggregate scores from all 12 responses
  const totalScores = responses.reduce(
    (acc, response) => ({
      risk: acc.risk + response.scores.risk,
      emotional: acc.emotional + response.scores.emotional,
      timeHorizon: acc.timeHorizon + response.scores.timeHorizon,
      decisionStyle: acc.decisionStyle + response.scores.decisionStyle
    }),
    { risk: 0, emotional: 0, timeHorizon: 0, decisionStyle: 0 }
  );

  // Normalize scores (12 questions × max score of 3 = 36 max per dimension)
  const normalizedScores: PsycheScores = {
    risk: totalScores.risk / 36,
    emotional: totalScores.emotional / 36,
    timeHorizon: totalScores.timeHorizon / 36,
    decisionStyle: totalScores.decisionStyle / 36
  };

  // Determine psyche type based on dominant traits
  const psycheType = determinePsycheType(normalizedScores, category);
  
  // Add database-compatible type value
  const psycheTypeWithDb = {
    ...psycheType,
    dbType: mapPsycheTypeToDatabase(psycheType.type)
  };

  return { psycheType: psycheTypeWithDb, scores: normalizedScores };
}

/**
 * Determine psyche type from normalized scores
 */
function determinePsycheType(scores: PsycheScores, category: string): PsycheType {
  const { risk, emotional, timeHorizon, decisionStyle } = scores;

  // High risk, high emotional, short time horizon, intuitive decision style
  if (risk > 0.66 && emotional > 0.66 && timeHorizon < 0.34 && decisionStyle > 0.66) {
    return {
      type: "The Maverick",
      description: "Bold, passionate, and driven by instinct. You thrive on taking risks and making quick, decisive moves based on your gut feelings.",
      traits: ["Risk-embracing", "Emotionally expressive", "Present-focused", "Intuitive"],
      strengths: ["Quick decision-making", "High energy", "Adaptable to change", "Passionate commitment"],
      challenges: ["May act impulsively", "Can struggle with patience", "Risk of burnout", "May overlook details"]
    };
  }

  // Low risk, low emotional, long time horizon, analytical decision style
  if (risk < 0.34 && emotional < 0.34 && timeHorizon > 0.66 && decisionStyle < 0.34) {
    return {
      type: "The Strategist",
      description: "Methodical, patient, and data-driven. You excel at long-term planning and making calculated decisions based on thorough analysis.",
      traits: ["Risk-averse", "Emotionally measured", "Future-oriented", "Analytical"],
      strengths: ["Strategic thinking", "Consistent execution", "Risk management", "Long-term vision"],
      challenges: ["May miss time-sensitive opportunities", "Can be overly cautious", "May struggle with uncertainty", "Risk of analysis paralysis"]
    };
  }

  // High risk, low emotional, long time horizon, analytical decision style
  if (risk > 0.66 && emotional < 0.34 && timeHorizon > 0.66 && decisionStyle < 0.34) {
    return {
      type: "The Visionary",
      description: "Bold yet calculated, you take big risks backed by solid research. You balance ambition with strategic thinking for long-term success.",
      traits: ["Calculated risk-taker", "Emotionally controlled", "Future-oriented", "Strategic"],
      strengths: ["Big-picture thinking", "Disciplined execution", "High ambition", "Data-driven risk-taking"],
      challenges: ["May undervalue emotional factors", "Can be overly confident", "May struggle with flexibility", "Risk of overcommitment"]
    };
  }

  // Low risk, high emotional, long time horizon, intuitive decision style
  if (risk < 0.34 && emotional > 0.66 && timeHorizon > 0.66 && decisionStyle > 0.66) {
    return {
      type: "The Guardian",
      description: "Protective, emotionally attuned, and focused on long-term security. You prioritize stability and deep connections over quick wins.",
      traits: ["Risk-cautious", "Emotionally aware", "Future-oriented", "Intuitive"],
      strengths: ["Strong relationships", "Emotional intelligence", "Loyalty and commitment", "Protective instincts"],
      challenges: ["May avoid necessary risks", "Can be overly protective", "May struggle with change", "Risk of missed opportunities"]
    };
  }

  // High risk, high emotional, long time horizon, mixed decision style
  if (risk > 0.66 && emotional > 0.66 && timeHorizon > 0.66) {
    return {
      type: "The Pioneer",
      description: "Passionate and ambitious with a long-term vision. You're willing to take bold risks to achieve your dreams and inspire others.",
      traits: ["Risk-embracing", "Emotionally driven", "Future-oriented", "Visionary"],
      strengths: ["Inspirational leadership", "High motivation", "Long-term commitment", "Bold innovation"],
      challenges: ["May overextend resources", "Can be emotionally volatile", "May struggle with setbacks", "Risk of burnout"]
    };
  }

  // Low risk, low emotional, short time horizon, analytical decision style
  if (risk < 0.34 && emotional < 0.34 && timeHorizon < 0.34 && decisionStyle < 0.34) {
    return {
      type: "The Pragmatist",
      description: "Practical, grounded, and focused on what works right now. You make steady, rational decisions based on current realities.",
      traits: ["Risk-averse", "Emotionally neutral", "Present-focused", "Practical"],
      strengths: ["Reliable execution", "Clear-headed decisions", "Adaptable to current needs", "Efficient problem-solving"],
      challenges: ["May lack long-term vision", "Can be overly conservative", "May miss big opportunities", "Risk of stagnation"]
    };
  }

  // High emotional, mixed risk, short time horizon, intuitive decision style
  if (emotional > 0.66 && timeHorizon < 0.34 && decisionStyle > 0.66) {
    return {
      type: "The Catalyst",
      description: "Energetic, spontaneous, and emotionally expressive. You live in the moment and inspire action through your passion and enthusiasm.",
      traits: ["Emotionally expressive", "Present-focused", "Intuitive", "Action-oriented"],
      strengths: ["High energy", "Inspiring presence", "Quick to act", "Emotionally authentic"],
      challenges: ["May lack long-term planning", "Can be impulsive", "May struggle with consistency", "Risk of emotional overwhelm"]
    };
  }

  // Balanced across all dimensions (default for most users)
  return {
    type: "The Adapter",
    description: "Flexible, balanced, and context-aware. You adjust your approach based on the situation, blending intuition with analysis and caution with boldness.",
    traits: ["Balanced risk approach", "Emotionally flexible", "Adaptable time horizon", "Situational decision-making"],
    strengths: ["Versatile approach", "Context-sensitive", "Balanced perspective", "Adaptive to change"],
    challenges: ["May lack clear identity", "Can struggle with commitment", "May be indecisive at times", "Risk of spreading too thin"]
  };
}

/**
 * Generate personalized insights based on psyche type and category
 */
export function generateCategoryInsights(
  psycheType: PsycheType,
  category: string,
  scores: PsycheScores
): string[] {
  const insights: string[] = [];

  // Category-specific insights based on psyche type
  const categoryInsights: Record<string, Record<string, string[]>> = {
    career: {
      "The Maverick": [
        "You thrive in dynamic, fast-paced work environments where quick decisions are valued.",
        "Consider entrepreneurship or roles with high autonomy and impact.",
        "Your boldness can lead to breakthroughs, but balance it with strategic planning."
      ],
      "The Strategist": [
        "You excel in roles requiring long-term planning and systematic execution.",
        "Consider positions in strategy, operations, or project management.",
        "Your patience is a strength—trust your process even when others rush."
      ],
      "The Visionary": [
        "You're built for leadership roles that require both ambition and strategic thinking.",
        "Consider executive positions or founding your own venture.",
        "Your calculated risk-taking can drive major career breakthroughs."
      ],
      "The Guardian": [
        "You thrive in roles where you can protect, nurture, and build long-term value.",
        "Consider positions in HR, education, healthcare, or team leadership.",
        "Your emotional intelligence is a superpower—use it to build strong teams."
      ],
      "The Pioneer": [
        "You're driven to create lasting impact and inspire others with your vision.",
        "Consider roles in innovation, social impact, or transformational leadership.",
        "Your passion can move mountains, but pace yourself to avoid burnout."
      ],
      "The Pragmatist": [
        "You excel in roles requiring practical problem-solving and reliable execution.",
        "Consider positions in operations, finance, or technical implementation.",
        "Your steady approach builds trust—don't undervalue your consistency."
      ],
      "The Catalyst": [
        "You bring energy and momentum to any team or project you join.",
        "Consider roles in sales, marketing, creative fields, or change management.",
        "Your enthusiasm is contagious—channel it into sustainable action."
      ],
      "The Adapter": [
        "Your versatility makes you valuable in diverse roles and industries.",
        "Consider positions that require cross-functional collaboration.",
        "Your flexibility is a strength—develop deeper expertise to complement it."
      ]
    },
    relationships: {
      "The Maverick": [
        "You bring passion and excitement to relationships, but may need to work on patience.",
        "Look for partners who appreciate spontaneity and can match your energy.",
        "Balance your boldness with vulnerability to deepen connections."
      ],
      "The Strategist": [
        "You build relationships slowly but create deep, lasting bonds over time.",
        "Look for partners who value loyalty, consistency, and long-term commitment.",
        "Don't be afraid to take emotional risks—they're worth it."
      ],
      "The Visionary": [
        "You seek partners who share your ambition and can support your big dreams.",
        "Look for relationships that challenge and inspire you intellectually.",
        "Remember to be present—your future focus can miss current connection."
      ],
      "The Guardian": [
        "You're deeply loyal and protective in relationships, creating safe spaces for loved ones.",
        "Look for partners who appreciate your emotional depth and commitment.",
        "Balance protection with allowing others to take their own risks."
      ],
      "The Pioneer": [
        "You seek relationships that fuel your passion and support your long-term vision.",
        "Look for partners who share your values and can handle your intensity.",
        "Make time for emotional connection amid your ambitious pursuits."
      ],
      "The Pragmatist": [
        "You bring stability and reliability to relationships, building trust through actions.",
        "Look for partners who value consistency and practical partnership.",
        "Don't be afraid to express emotions—vulnerability strengthens bonds."
      ],
      "The Catalyst": [
        "You bring joy, energy, and spontaneity to relationships.",
        "Look for partners who appreciate your enthusiasm and can ground you when needed.",
        "Balance excitement with deeper emotional intimacy over time."
      ],
      "The Adapter": [
        "Your flexibility makes you a supportive, understanding partner.",
        "Look for relationships where you can be your authentic self, not just adaptive.",
        "Define your own needs clearly—don't lose yourself in accommodation."
      ]
    },
    money: {
      "The Maverick": [
        "You're comfortable with high-risk investments and may excel at active trading.",
        "Balance bold moves with a safety net—don't risk money you can't afford to lose.",
        "Your instincts can be profitable, but pair them with basic financial education."
      ],
      "The Strategist": [
        "You excel at long-term wealth building through disciplined saving and investing.",
        "Consider index funds, real estate, or other steady wealth-building strategies.",
        "Your patience is your greatest asset—compound growth rewards time."
      ],
      "The Visionary": [
        "You can build significant wealth through calculated, ambitious investments.",
        "Consider entrepreneurship, growth stocks, or strategic real estate.",
        "Your risk tolerance is high—ensure you have downside protection."
      ],
      "The Guardian": [
        "You prioritize financial security and protecting what you've built.",
        "Consider conservative investments, emergency funds, and insurance.",
        "Your caution protects you—just ensure you're not missing growth opportunities."
      ],
      "The Pioneer": [
        "You're willing to invest aggressively in pursuit of long-term financial freedom.",
        "Consider growth-oriented investments aligned with your values.",
        "Your ambition can build wealth—pace yourself to avoid overextension."
      ],
      "The Pragmatist": [
        "You make practical financial decisions focused on current needs and stability.",
        "Consider balanced portfolios, budgeting tools, and automated savings.",
        "Your reliability builds wealth slowly—consider adding growth strategies."
      ],
      "The Catalyst": [
        "You may make impulsive financial decisions based on excitement or emotion.",
        "Create systems to slow down major purchases and investment decisions.",
        "Your energy is an asset—channel it into learning financial strategies."
      ],
      "The Adapter": [
        "Your flexible approach allows you to adjust strategies as circumstances change.",
        "Consider diversified portfolios that can adapt to different market conditions.",
        "Define clear financial goals to guide your adaptable approach."
      ]
    },
    health: {
      "The Maverick": [
        "You thrive on intense, varied workouts and may excel at competitive sports.",
        "Balance intensity with recovery—your body needs rest to sustain performance.",
        "Your boldness can push limits, but listen to your body to avoid injury."
      ],
      "The Strategist": [
        "You excel with structured fitness plans and long-term health goals.",
        "Consider programs with clear progression and measurable outcomes.",
        "Your consistency is your superpower—trust the process even when progress is slow."
      ],
      "The Visionary": [
        "You set ambitious health goals and are willing to make major lifestyle changes.",
        "Consider transformational programs or training for significant challenges.",
        "Your ambition drives results—ensure your goals are sustainable long-term."
      ],
      "The Guardian": [
        "You prioritize health for longevity and to care for those you love.",
        "Consider holistic approaches that address physical and emotional wellness.",
        "Your protective instincts serve you—remember to care for yourself too."
      ],
      "The Pioneer": [
        "You pursue health with passion and inspire others with your commitment.",
        "Consider challenging goals like marathons or transformational fitness journeys.",
        "Your intensity drives results—pace yourself to avoid burnout or injury."
      ],
      "The Pragmatist": [
        "You focus on practical, sustainable health habits that fit your lifestyle.",
        "Consider simple routines like daily walks, meal prep, and consistent sleep.",
        "Your reliability builds health over time—don't undervalue small habits."
      ],
      "The Catalyst": [
        "You bring energy and enthusiasm to fitness, but may struggle with consistency.",
        "Consider varied workouts that keep you engaged and excited.",
        "Your spontaneity is fun—pair it with a baseline routine for consistency."
      ],
      "The Adapter": [
        "Your flexible approach allows you to adjust health habits as life changes.",
        "Consider versatile fitness options and intuitive eating approaches.",
        "Define core non-negotiables to maintain consistency amid flexibility."
      ]
    },
    sports: {
      "The Maverick": [
        "You thrive on the thrill of bold predictions and high-stakes outcomes.",
        "Balance aggressive plays with bankroll management to sustain long-term play.",
        "Your instincts can be sharp—track results to see when they're most accurate."
      ],
      "The Strategist": [
        "You excel at analytical sports betting with long-term winning strategies.",
        "Consider systematic approaches like value betting or statistical modeling.",
        "Your patience and discipline are rare advantages in sports prediction."
      ],
      "The Visionary": [
        "You can build sophisticated prediction systems and exploit market inefficiencies.",
        "Consider developing proprietary models or focusing on niche markets.",
        "Your ambition can lead to big wins—ensure you have risk controls in place."
      ],
      "The Guardian": [
        "You approach sports predictions cautiously, prioritizing entertainment over profit.",
        "Set strict limits and stick to them—never risk more than you can afford.",
        "Your caution protects you—enjoy the game without chasing losses."
      ],
      "The Pioneer": [
        "You're passionate about sports and willing to invest time in building expertise.",
        "Consider long-term strategies like season-long analysis or futures betting.",
        "Your commitment can build edge—stay disciplined to realize it."
      ],
      "The Pragmatist": [
        "You make practical predictions based on current form and clear logic.",
        "Consider straightforward bets on favorites or simple prop bets.",
        "Your grounded approach avoids big losses—consider adding upside potential."
      ],
      "The Catalyst": [
        "You love the excitement of live betting and spontaneous predictions.",
        "Set pre-game limits to avoid emotional, in-the-moment decisions.",
        "Your enthusiasm makes sports fun—protect it by betting responsibly."
      ],
      "The Adapter": [
        "Your flexible approach allows you to adjust strategies across different sports.",
        "Consider diversifying across sports and bet types to match your versatility.",
        "Define a core strategy to guide your adaptable approach."
      ]
    },
    stocks: {
      "The Maverick": [
        "You're comfortable with volatile stocks and may excel at momentum trading.",
        "Balance aggressive trades with core holdings to manage risk.",
        "Your boldness can capture big moves—use stop losses to protect downside."
      ],
      "The Strategist": [
        "You excel at buy-and-hold investing with quality companies.",
        "Consider value investing, dividend stocks, or index funds.",
        "Your patience allows compound growth—stay the course through volatility."
      ],
      "The Visionary": [
        "You can identify transformational companies and invest for major returns.",
        "Consider growth stocks, emerging sectors, or thematic investing.",
        "Your conviction can drive wealth—diversify to manage concentration risk."
      ],
      "The Guardian": [
        "You prioritize capital preservation and steady, reliable returns.",
        "Consider blue-chip stocks, bonds, or conservative balanced funds.",
        "Your caution protects capital—ensure you're not missing growth opportunities."
      ],
      "The Pioneer": [
        "You're willing to invest aggressively in companies aligned with your vision.",
        "Consider growth stocks, IPOs, or sector-specific funds.",
        "Your passion drives commitment—ensure you're diversified beyond favorites."
      ],
      "The Pragmatist": [
        "You focus on practical investments with clear fundamentals.",
        "Consider broad market ETFs, target-date funds, or robo-advisors.",
        "Your steady approach builds wealth—consider adding growth exposure."
      ],
      "The Catalyst": [
        "You may trade frequently based on news, excitement, or market momentum.",
        "Create rules to slow down decisions and avoid emotional trading.",
        "Your energy can be channeled—focus it on learning rather than overtrading."
      ],
      "The Adapter": [
        "Your flexible approach allows you to adjust strategies as markets change.",
        "Consider core-satellite portfolios with stable base and tactical positions.",
        "Define investment principles to guide your adaptable approach."
      ]
    }
  };

  // Get category-specific insights for this psyche type
  const typeInsights = categoryInsights[category]?.[psycheType.type] || [
    "Your unique approach brings valuable perspective to this area.",
    "Stay true to your natural tendencies while remaining open to growth.",
    "Balance your strengths with awareness of potential blind spots."
  ];

  insights.push(...typeInsights);

  return insights;
}
