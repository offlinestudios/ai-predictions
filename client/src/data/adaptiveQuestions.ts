// Adaptive Questions for Hybrid Onboarding
// 4 questions per category showing how core traits manifest in specific domains

export interface AdaptiveQuestion {
  id: string;
  category: string;
  question: string;
  options: AdaptiveOption[];
  domainTrait: string; // What domain-specific trait this measures
}

export interface AdaptiveOption {
  id: string;
  text: string;
  indicators: string[];
  domainInsight: string; // Domain-specific behavioral insight
}

export const ADAPTIVE_QUESTIONS: Record<string, AdaptiveQuestion[]> = {
  career: [
    {
      id: "career_1",
      category: "career",
      question: "A high-potential career opportunity comes up, but it requires leaving your current stability. How does your risk style show up?",
      domainTrait: "Career Risk Application",
      options: [
        {
          id: "career_1a",
          text: "I'd take it if the upside is significant",
          indicators: ["ambitious_builder"],
          domainInsight: "High career risk tolerance",
        },
        {
          id: "career_1b",
          text: "I'd research the company/role thoroughly first",
          indicators: ["quiet_strategist"],
          domainInsight: "Data-driven career decisions",
        },
        {
          id: "career_1c",
          text: "I'd trust my gut about whether it's the right fit",
          indicators: ["intuitive_empath"],
          domainInsight: "Values-aligned career moves",
        },
        {
          id: "career_1d",
          text: "I'd only move if I had a safety net",
          indicators: ["stabilizer"],
          domainInsight: "Security-focused career planning",
        },
      ],
    },
    {
      id: "career_2",
      category: "career",
      question: "You get passed over for a promotion you expected. What's your career response?",
      domainTrait: "Career Setback Response",
      options: [
        {
          id: "career_2a",
          text: "Push harder and prove I deserve the next one",
          indicators: ["ambitious_builder", "revenge_bettor"],
          domainInsight: "Competitive career drive",
        },
        {
          id: "career_2b",
          text: "Reflect on what I can improve professionally",
          indicators: ["long_term_builder"],
          domainInsight: "Growth mindset in career",
        },
        {
          id: "career_2c",
          text: "Consider if this company aligns with my values",
          indicators: ["intuitive_empath", "escapist_romantic"],
          domainInsight: "Meaning-driven career decisions",
        },
        {
          id: "career_2d",
          text: "Focus on doing my current job well",
          indicators: ["stabilizer"],
          domainInsight: "Steady career progression",
        },
      ],
    },
    {
      id: "career_3",
      category: "career",
      question: "Your industry is rapidly changing with new trends. How do you respond?",
      domainTrait: "Career Momentum",
      options: [
        {
          id: "career_3a",
          text: "Dive into the new trends immediately",
          indicators: ["momentum_chaser", "ambitious_builder"],
          domainInsight: "Early adopter in career",
        },
        {
          id: "career_3b",
          text: "Wait to see which trends have staying power",
          indicators: ["stabilizer", "quiet_strategist"],
          domainInsight: "Cautious career pivots",
        },
        {
          id: "career_3c",
          text: "Learn the trends but stick to my core skills",
          indicators: ["long_term_builder"],
          domainInsight: "Balanced skill development",
        },
        {
          id: "career_3d",
          text: "Follow what feels authentic to my career path",
          indicators: ["intuitive_empath"],
          domainInsight: "Authentic career navigation",
        },
      ],
    },
    {
      id: "career_4",
      category: "career",
      question: "When making a major career decision, what matters most?",
      domainTrait: "Career Decision Style",
      options: [
        {
          id: "career_4a",
          text: "Growth potential and upward trajectory",
          indicators: ["ambitious_builder"],
          domainInsight: "Growth-maximizing career strategy",
        },
        {
          id: "career_4b",
          text: "Work-life balance and stability",
          indicators: ["stabilizer"],
          domainInsight: "Sustainable career approach",
        },
        {
          id: "career_4c",
          text: "Learning opportunities and skill development",
          indicators: ["pattern_analyst", "long_term_builder"],
          domainInsight: "Learning-focused career",
        },
        {
          id: "career_4d",
          text: "Purpose, meaning, and impact",
          indicators: ["intuitive_empath", "escapist_romantic"],
          domainInsight: "Purpose-driven career",
        },
      ],
    },
  ],
  
  love: [
    {
      id: "love_1",
      category: "love",
      question: "You meet someone who could be amazing, but getting close means being vulnerable. How does your risk style show up?",
      domainTrait: "Relationship Risk Application",
      options: [
        {
          id: "love_1a",
          text: "I open up quickly when I feel potential",
          indicators: ["escapist_romantic", "intuitive_empath"],
          domainInsight: "High emotional risk tolerance",
        },
        {
          id: "love_1b",
          text: "I take time to build trust gradually",
          indicators: ["stabilizer", "long_term_builder"],
          domainInsight: "Cautious relationship building",
        },
        {
          id: "love_1c",
          text: "I observe their patterns before committing",
          indicators: ["quiet_strategist", "pattern_analyst"],
          domainInsight: "Analytical relationship approach",
        },
        {
          id: "love_1d",
          text: "I follow my intuition about whether they're safe",
          indicators: ["intuitive_empath"],
          domainInsight: "Intuition-guided relationships",
        },
      ],
    },
    {
      id: "love_2",
      category: "love",
      question: "After a significant argument with someone you care about, what's your typical response?",
      domainTrait: "Relationship Conflict Response",
      options: [
        {
          id: "love_2a",
          text: "Address it immediately to resolve tension",
          indicators: ["ambitious_builder", "emotional_fan"],
          domainInsight: "Direct conflict resolution",
        },
        {
          id: "love_2b",
          text: "Take space to process my emotions first",
          indicators: ["intuitive_empath", "escapist_romantic"],
          domainInsight: "Reflective conflict processing",
        },
        {
          id: "love_2c",
          text: "Analyze what caused the conflict to prevent repeats",
          indicators: ["quiet_strategist"],
          domainInsight: "Problem-solving in relationships",
        },
        {
          id: "love_2d",
          text: "Try to restore harmony and stability",
          indicators: ["stabilizer"],
          domainInsight: "Peace-seeking in relationships",
        },
      ],
    },
    {
      id: "love_3",
      category: "love",
      question: "In relationships, what do you value most?",
      domainTrait: "Relationship Novelty",
      options: [
        {
          id: "love_3a",
          text: "Excitement, passion, and intensity",
          indicators: ["escapist_romantic", "momentum_chaser"],
          domainInsight: "Novelty-seeking in love",
        },
        {
          id: "love_3b",
          text: "Stability, trust, and consistency",
          indicators: ["stabilizer", "long_term_builder"],
          domainInsight: "Security-focused relationships",
        },
        {
          id: "love_3c",
          text: "Deep emotional connection and understanding",
          indicators: ["intuitive_empath"],
          domainInsight: "Emotional depth in relationships",
        },
        {
          id: "love_3d",
          text: "Compatibility and shared goals",
          indicators: ["quiet_strategist", "pattern_analyst"],
          domainInsight: "Practical relationship priorities",
        },
      ],
    },
    {
      id: "love_4",
      category: "love",
      question: "When deciding whether to commit to a relationship, what guides you?",
      domainTrait: "Relationship Decision Style",
      options: [
        {
          id: "love_4a",
          text: "How they make me feel emotionally",
          indicators: ["intuitive_empath", "escapist_romantic", "emotional_fan"],
          domainInsight: "Emotion-driven relationship decisions",
        },
        {
          id: "love_4b",
          text: "Whether we're compatible long-term",
          indicators: ["quiet_strategist", "long_term_builder"],
          domainInsight: "Strategic relationship evaluation",
        },
        {
          id: "love_4c",
          text: "If the timing and circumstances are right",
          indicators: ["stabilizer"],
          domainInsight: "Practical relationship timing",
        },
        {
          id: "love_4d",
          text: "My gut instinct about our potential",
          indicators: ["intuitive_empath"],
          domainInsight: "Intuitive relationship assessment",
        },
      ],
    },
  ],

  finance: [
    {
      id: "finance_1",
      category: "finance",
      question: "You have $10,000 to invest. How does your risk style show up with money?",
      domainTrait: "Financial Risk Application",
      options: [
        {
          id: "finance_1a",
          text: "Invest in high-growth opportunities",
          indicators: ["ambitious_builder", "risk_addict"],
          domainInsight: "Aggressive wealth building",
        },
        {
          id: "finance_1b",
          text: "Split between safe and growth investments",
          indicators: ["long_term_builder", "quiet_strategist"],
          domainInsight: "Balanced financial strategy",
        },
        {
          id: "finance_1c",
          text: "Keep it safe in low-risk investments",
          indicators: ["stabilizer", "fear_based_seller"],
          domainInsight: "Conservative financial approach",
        },
        {
          id: "finance_1d",
          text: "Invest in what I understand and believe in",
          indicators: ["intuitive_empath"],
          domainInsight: "Values-aligned investing",
        },
      ],
    },
    {
      id: "finance_2",
      category: "finance",
      question: "You lose 20% of your savings in an investment. What's your financial response?",
      domainTrait: "Financial Setback Response",
      options: [
        {
          id: "finance_2a",
          text: "Try to make it back with a better investment",
          indicators: ["revenge_bettor", "momentum_chaser"],
          domainInsight: "Revenge trading tendency",
        },
        {
          id: "finance_2b",
          text: "Accept the loss and stick to my plan",
          indicators: ["long_term_builder", "quiet_strategist"],
          domainInsight: "Disciplined financial recovery",
        },
        {
          id: "finance_2c",
          text: "Pull out and move to safer options",
          indicators: ["fear_based_seller"],
          domainInsight: "Loss-averse financial behavior",
        },
        {
          id: "finance_2d",
          text: "Analyze what went wrong to improve",
          indicators: ["pattern_analyst"],
          domainInsight: "Learning-focused financial approach",
        },
      ],
    },
    {
      id: "finance_3",
      category: "finance",
      question: "An investment you own is up 50% in a short time. What do you do?",
      domainTrait: "Financial Momentum",
      options: [
        {
          id: "finance_3a",
          text: "Hold it—momentum continues",
          indicators: ["momentum_chaser", "risk_addict"],
          domainInsight: "Momentum-based investing",
        },
        {
          id: "finance_3b",
          text: "Sell some to lock in gains",
          indicators: ["quiet_strategist", "long_term_builder"],
          domainInsight: "Profit-taking discipline",
        },
        {
          id: "finance_3c",
          text: "Sell all—what goes up comes down",
          indicators: ["fear_based_seller"],
          domainInsight: "Risk-averse profit taking",
        },
        {
          id: "finance_3d",
          text: "Trust my intuition about whether it's sustainable",
          indicators: ["intuitive_empath"],
          domainInsight: "Intuitive financial decisions",
        },
      ],
    },
    {
      id: "finance_4",
      category: "finance",
      question: "When making financial decisions, what matters most to you?",
      domainTrait: "Financial Decision Style",
      options: [
        {
          id: "finance_4a",
          text: "Maximizing returns and wealth growth",
          indicators: ["ambitious_builder", "risk_addict"],
          domainInsight: "Growth-maximizing financial strategy",
        },
        {
          id: "finance_4b",
          text: "Protecting what I have and minimizing risk",
          indicators: ["stabilizer", "fear_based_seller"],
          domainInsight: "Wealth preservation focus",
        },
        {
          id: "finance_4c",
          text: "Long-term compounding and patience",
          indicators: ["long_term_builder"],
          domainInsight: "Patient wealth building",
        },
        {
          id: "finance_4d",
          text: "Financial independence and freedom",
          indicators: ["ambitious_builder", "escapist_romantic"],
          domainInsight: "Freedom-focused finances",
        },
      ],
    },
  ],

  health: [
    {
      id: "health_1",
      category: "health",
      question: "A new health routine promises big results but requires major lifestyle changes. How does your risk style show up?",
      domainTrait: "Health Risk Application",
      options: [
        {
          id: "health_1a",
          text: "I'd commit fully if the benefits are worth it",
          indicators: ["ambitious_builder"],
          domainInsight: "Aggressive health optimization",
        },
        {
          id: "health_1b",
          text: "I'd research it thoroughly before starting",
          indicators: ["quiet_strategist", "pattern_analyst"],
          domainInsight: "Evidence-based health decisions",
        },
        {
          id: "health_1c",
          text: "I'd try it if it feels right for my body",
          indicators: ["intuitive_empath"],
          domainInsight: "Intuitive health approach",
        },
        {
          id: "health_1d",
          text: "I'd stick with what's already working",
          indicators: ["stabilizer"],
          domainInsight: "Conservative health changes",
        },
      ],
    },
    {
      id: "health_2",
      category: "health",
      question: "You experience a health setback or injury. What's your response?",
      domainTrait: "Health Setback Response",
      options: [
        {
          id: "health_2a",
          text: "Push through and get back to my routine ASAP",
          indicators: ["ambitious_builder", "momentum_chaser"],
          domainInsight: "Aggressive recovery approach",
        },
        {
          id: "health_2b",
          text: "Rest and listen to my body's signals",
          indicators: ["intuitive_empath", "stabilizer"],
          domainInsight: "Intuitive recovery approach",
        },
        {
          id: "health_2c",
          text: "Research the best recovery protocol",
          indicators: ["quiet_strategist", "pattern_analyst"],
          domainInsight: "Systematic recovery planning",
        },
        {
          id: "health_2d",
          text: "Accept it and adjust my expectations",
          indicators: ["long_term_builder"],
          domainInsight: "Adaptive health mindset",
        },
      ],
    },
    {
      id: "health_3",
      category: "health",
      question: "What's your approach to health and wellness?",
      domainTrait: "Health Novelty",
      options: [
        {
          id: "health_3a",
          text: "Try new trends and optimize constantly",
          indicators: ["momentum_chaser", "ambitious_builder"],
          domainInsight: "Novelty-seeking health behavior",
        },
        {
          id: "health_3b",
          text: "Stick to proven, consistent habits",
          indicators: ["stabilizer", "long_term_builder"],
          domainInsight: "Consistency-focused health",
        },
        {
          id: "health_3c",
          text: "Follow what feels good for my body",
          indicators: ["intuitive_empath"],
          domainInsight: "Body-intuitive health approach",
        },
        {
          id: "health_3d",
          text: "Track data and optimize based on results",
          indicators: ["pattern_analyst", "quiet_strategist"],
          domainInsight: "Data-driven health optimization",
        },
      ],
    },
    {
      id: "health_4",
      category: "health",
      question: "When making health decisions, what guides you most?",
      domainTrait: "Health Decision Style",
      options: [
        {
          id: "health_4a",
          text: "Performance and physical results",
          indicators: ["ambitious_builder"],
          domainInsight: "Performance-focused health",
        },
        {
          id: "health_4b",
          text: "Longevity and disease prevention",
          indicators: ["long_term_builder", "stabilizer"],
          domainInsight: "Preventive health focus",
        },
        {
          id: "health_4c",
          text: "Energy, mood, and how I feel",
          indicators: ["intuitive_empath", "escapist_romantic"],
          domainInsight: "Feeling-based health priorities",
        },
        {
          id: "health_4d",
          text: "Scientific evidence and data",
          indicators: ["quiet_strategist", "pattern_analyst"],
          domainInsight: "Evidence-based health approach",
        },
      ],
    },
  ],

  sports: [
    {
      id: "sports_1",
      category: "sports",
      question: "Your favorite team is playing. How does your risk style show up in predictions?",
      domainTrait: "Sports Risk Application",
      options: [
        {
          id: "sports_1a",
          text: "I predict boldly based on potential upside",
          indicators: ["risk_addict", "momentum_chaser"],
          domainInsight: "Aggressive sports predictions",
        },
        {
          id: "sports_1b",
          text: "I analyze stats and matchups carefully",
          indicators: ["pattern_analyst", "quiet_strategist"],
          domainInsight: "Analytical sports predictions",
        },
        {
          id: "sports_1c",
          text: "I trust my gut feel about the game",
          indicators: ["intuitive_empath", "emotional_fan"],
          domainInsight: "Intuitive sports predictions",
        },
        {
          id: "sports_1d",
          text: "I stick to safe, likely outcomes",
          indicators: ["stabilizer"],
          domainInsight: "Conservative sports predictions",
        },
      ],
    },
    {
      id: "sports_2",
      category: "sports",
      question: "Your prediction goes completely wrong. What's your response?",
      domainTrait: "Sports Setback Response",
      options: [
        {
          id: "sports_2a",
          text: "Make another prediction immediately to bounce back",
          indicators: ["revenge_bettor", "momentum_chaser"],
          domainInsight: "Revenge prediction tendency",
        },
        {
          id: "sports_2b",
          text: "Take a break and reset emotionally",
          indicators: ["intuitive_empath", "long_term_builder"],
          domainInsight: "Emotional recovery in sports",
        },
        {
          id: "sports_2c",
          text: "Analyze what I missed in my prediction",
          indicators: ["pattern_analyst", "quiet_strategist"],
          domainInsight: "Learning-focused sports analysis",
        },
        {
          id: "sports_2d",
          text: "Accept it and move on without dwelling",
          indicators: ["stabilizer"],
          domainInsight: "Emotionally detached predictions",
        },
      ],
    },
    {
      id: "sports_3",
      category: "sports",
      question: "When predicting outcomes, what influences you more?",
      domainTrait: "Sports Loyalty vs Analysis",
      options: [
        {
          id: "sports_3a",
          text: "My loyalty to my favorite teams",
          indicators: ["emotional_fan"],
          domainInsight: "Loyalty-biased predictions",
        },
        {
          id: "sports_3b",
          text: "Pure stats and objective analysis",
          indicators: ["pattern_analyst", "quiet_strategist"],
          domainInsight: "Objective sports analysis",
        },
        {
          id: "sports_3c",
          text: "Momentum and recent performance",
          indicators: ["momentum_chaser"],
          domainInsight: "Momentum-based predictions",
        },
        {
          id: "sports_3d",
          text: "Gut instinct about the matchup",
          indicators: ["intuitive_empath"],
          domainInsight: "Intuitive sports reading",
        },
      ],
    },
    {
      id: "sports_4",
      category: "sports",
      question: "What type of sports predictions do you prefer?",
      domainTrait: "Sports Prediction Style",
      options: [
        {
          id: "sports_4a",
          text: "High-risk, high-reward upsets",
          indicators: ["risk_addict", "momentum_chaser"],
          domainInsight: "Upset-seeking predictions",
        },
        {
          id: "sports_4b",
          text: "Safe favorites and likely outcomes",
          indicators: ["stabilizer", "fear_based_seller"],
          domainInsight: "Safe sports predictions",
        },
        {
          id: "sports_4c",
          text: "Value plays based on analysis",
          indicators: ["pattern_analyst", "long_term_builder"],
          domainInsight: "Value-based sports strategy",
        },
        {
          id: "sports_4d",
          text: "Games I'm emotionally invested in",
          indicators: ["emotional_fan"],
          domainInsight: "Emotion-driven predictions",
        },
      ],
    },
  ],

  stocks: [
    {
      id: "stocks_1",
      category: "stocks",
      question: "A stock you're watching drops 10% on no news. How does your risk style show up?",
      domainTrait: "Trading Risk Application",
      options: [
        {
          id: "stocks_1a",
          text: "Buy more—it's a discount opportunity",
          indicators: ["ambitious_builder", "long_term_builder"],
          domainInsight: "Contrarian buying behavior",
        },
        {
          id: "stocks_1b",
          text: "Sell to prevent further losses",
          indicators: ["fear_based_seller"],
          domainInsight: "Loss-averse selling",
        },
        {
          id: "stocks_1c",
          text: "Analyze why it dropped before deciding",
          indicators: ["quiet_strategist", "pattern_analyst"],
          domainInsight: "Analytical trading decisions",
        },
        {
          id: "stocks_1d",
          text: "Hold and trust my original thesis",
          indicators: ["long_term_builder", "stabilizer"],
          domainInsight: "Conviction-based holding",
        },
      ],
    },
    {
      id: "stocks_2",
      category: "stocks",
      question: "You lose money on a trade. What's your trading response?",
      domainTrait: "Trading Setback Response",
      options: [
        {
          id: "stocks_2a",
          text: "Make another trade to recover the loss",
          indicators: ["revenge_bettor", "risk_addict"],
          domainInsight: "Revenge trading behavior",
        },
        {
          id: "stocks_2b",
          text: "Step away and clear my head",
          indicators: ["long_term_builder", "intuitive_empath"],
          domainInsight: "Emotional discipline in trading",
        },
        {
          id: "stocks_2c",
          text: "Review what went wrong systematically",
          indicators: ["pattern_analyst", "quiet_strategist"],
          domainInsight: "Learning-focused trading",
        },
        {
          id: "stocks_2d",
          text: "Stick to my plan and ignore the noise",
          indicators: ["stabilizer", "long_term_builder"],
          domainInsight: "Plan-based trading discipline",
        },
      ],
    },
    {
      id: "stocks_3",
      category: "stocks",
      question: "A stock is up 30% in a week on hype. What do you do?",
      domainTrait: "Market Momentum Response",
      options: [
        {
          id: "stocks_3a",
          text: "Jump in—momentum creates more momentum",
          indicators: ["momentum_chaser", "risk_addict"],
          domainInsight: "Momentum-chasing behavior",
        },
        {
          id: "stocks_3b",
          text: "Stay away—it's probably overvalued",
          indicators: ["fear_based_seller", "quiet_strategist"],
          domainInsight: "Bubble-averse behavior",
        },
        {
          id: "stocks_3c",
          text: "Analyze if fundamentals support the move",
          indicators: ["pattern_analyst", "long_term_builder"],
          domainInsight: "Fundamental analysis focus",
        },
        {
          id: "stocks_3d",
          text: "Trust my instinct about whether it's real",
          indicators: ["intuitive_empath"],
          domainInsight: "Intuitive market reading",
        },
      ],
    },
    {
      id: "stocks_4",
      category: "stocks",
      question: "What's your primary approach to stocks and markets?",
      domainTrait: "Trading Decision Style",
      options: [
        {
          id: "stocks_4a",
          text: "Active trading to maximize short-term gains",
          indicators: ["momentum_chaser", "risk_addict"],
          domainInsight: "Active trading style",
        },
        {
          id: "stocks_4b",
          text: "Long-term buy and hold strategy",
          indicators: ["long_term_builder", "stabilizer"],
          domainInsight: "Passive investing approach",
        },
        {
          id: "stocks_4c",
          text: "Value investing based on fundamentals",
          indicators: ["pattern_analyst", "quiet_strategist"],
          domainInsight: "Value investing philosophy",
        },
        {
          id: "stocks_4d",
          text: "Diversified portfolio for stability",
          indicators: ["stabilizer", "fear_based_seller"],
          domainInsight: "Risk-managed portfolio approach",
        },
      ],
    },
  ],
};
