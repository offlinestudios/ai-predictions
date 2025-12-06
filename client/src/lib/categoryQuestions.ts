/**
 * Category-specific micro-questions for enhanced prediction accuracy
 * Based on psychological triggers: Identity, Desire, Pain Point, Momentum, Constraint, Timeline
 */

export interface QuestionOption {
  id: string;
  label: string;
}

export interface CategoryQuestion {
  id: string;
  question: string;
  options: QuestionOption[];
  trigger: 'identity' | 'desire' | 'pain' | 'momentum' | 'constraint' | 'timeline';
}

// Career & Success Questions
export const CAREER_QUESTIONS: CategoryQuestion[] = [
  {
    id: 'position',
    question: 'What best describes your career position?',
    trigger: 'identity',
    options: [
      { id: 'early', label: 'Early career' },
      { id: 'mid', label: 'Mid career' },
      { id: 'senior', label: 'Senior/expert' },
      { id: 'founder', label: 'Founder' },
      { id: 'changing', label: 'Changing careers' },
      { id: 'not-working', label: 'Not working currently' },
    ],
  },
  {
    id: 'direction',
    question: 'What direction are you trying to move toward?',
    trigger: 'desire',
    options: [
      { id: 'new-job', label: 'New job' },
      { id: 'promotion', label: 'Promotion' },
      { id: 'start-business', label: 'Starting a business' },
      { id: 'scale-business', label: 'Scaling a business' },
      { id: 'change-field', label: 'Changing fields' },
      { id: 'clarity', label: 'Gaining clarity' },
    ],
  },
  {
    id: 'challenge',
    question: "What's your biggest challenge right now?",
    trigger: 'pain',
    options: [
      { id: 'direction', label: 'Unclear direction' },
      { id: 'motivation', label: 'Motivation' },
      { id: 'skills', label: 'Skills gap' },
      { id: 'opportunities', label: 'Finding opportunities' },
      { id: 'recognition', label: 'Getting recognition' },
      { id: 'income', label: 'Income level' },
      { id: 'time', label: 'Time constraints' },
    ],
  },
  {
    id: 'timeline',
    question: 'How fast do you want a major change?',
    trigger: 'timeline',
    options: [
      { id: 'immediate', label: 'Immediately' },
      { id: '3mo', label: 'Within 3 months' },
      { id: '6mo', label: 'Within 6 months' },
      { id: '12mo', label: 'Within 12 months' },
      { id: 'no-rush', label: 'No rush' },
    ],
  },
];

// Money & Wealth Questions
export const MONEY_QUESTIONS: CategoryQuestion[] = [
  {
    id: 'stage',
    question: 'What best describes your current financial stage?',
    trigger: 'identity',
    options: [
      { id: 'building', label: 'Building savings' },
      { id: 'growing', label: 'Growing income' },
      { id: 'managing', label: 'Managing debt' },
      { id: 'investing', label: 'Investing' },
      { id: 'major-purchase', label: 'Preparing for major purchase' },
      { id: 'scaling', label: 'Scaling a business' },
    ],
  },
  {
    id: 'goal',
    question: "What's your main financial goal right now?",
    trigger: 'desire',
    options: [
      { id: 'income', label: 'Increase income' },
      { id: 'wealth', label: 'Build wealth' },
      { id: 'stability', label: 'Reduce uncertainty/stress' },
      { id: 'debt', label: 'Pay down debt' },
      { id: 'opportunities', label: 'Predict major opportunities' },
    ],
  },
  {
    id: 'incomeSource',
    question: 'What is your primary source of income?',
    trigger: 'constraint',
    options: [
      { id: 'salary', label: 'Salary' },
      { id: 'freelance', label: 'Freelance' },
      { id: 'business', label: 'Business/entrepreneurship' },
      { id: 'investments', label: 'Investments' },
      { id: 'mixed', label: 'Mixed sources' },
    ],
  },
  {
    id: 'stability',
    question: 'How stable is your income month to month?',
    trigger: 'constraint',
    options: [
      { id: 'very-stable', label: 'Very stable' },
      { id: 'some-variation', label: 'Some variation' },
      { id: 'variable', label: 'Highly variable' },
      { id: 'unpredictable', label: 'Unpredictable' },
    ],
  },
];

// Love & Relationships Questions
export const LOVE_QUESTIONS: CategoryQuestion[] = [
  {
    id: 'goal',
    question: 'What is your goal in this area?',
    trigger: 'desire',
    options: [
      { id: 'find-partner', label: 'Find a partner' },
      { id: 'improve', label: 'Improve relationship' },
      { id: 'patterns', label: 'Understand patterns' },
      { id: 'reconnect', label: 'Reconnect with someone' },
      { id: 'move-on', label: 'Move on' },
      { id: 'reduce-stress', label: 'Reduce emotional stress' },
    ],
  },
  {
    id: 'patterns',
    question: 'How would you describe your recent relationship patterns?',
    trigger: 'momentum',
    options: [
      { id: 'consistent', label: 'Consistent' },
      { id: 'uncertain', label: 'Uncertain' },
      { id: 'on-off', label: 'On/off' },
      { id: 'avoidant', label: 'Avoidant' },
      { id: 'stable', label: 'Stable' },
      { id: 'rapid', label: 'Rapid changes' },
      { id: 'figuring-out', label: 'Still figuring it out' },
    ],
  },
  {
    id: 'desires',
    question: 'What do you want more of right now?',
    trigger: 'pain',
    options: [
      { id: 'clarity', label: 'Clarity' },
      { id: 'stability', label: 'Stability' },
      { id: 'passion', label: 'Passion' },
      { id: 'closure', label: 'Closure' },
      { id: 'attraction', label: 'Attraction' },
      { id: 'understanding', label: 'Understanding' },
    ],
  },
];

// Health & Wellness Questions
export const HEALTH_QUESTIONS: CategoryQuestion[] = [
  {
    id: 'state',
    question: 'What best describes your current state?',
    trigger: 'identity',
    options: [
      { id: 'improving', label: 'Improving' },
      { id: 'stable', label: 'Stable' },
      { id: 'struggling', label: 'Struggling' },
      { id: 'high-performance', label: 'High performance' },
      { id: 'fresh-start', label: 'Starting fresh' },
    ],
  },
  {
    id: 'focus',
    question: 'What is your primary focus?',
    trigger: 'desire',
    options: [
      { id: 'energy', label: 'Energy' },
      { id: 'strength', label: 'Strength' },
      { id: 'stress', label: 'Stress reduction' },
      { id: 'weight', label: 'Weight management' },
      { id: 'habits', label: 'Habit building' },
      { id: 'longevity', label: 'Longevity' },
    ],
  },
  {
    id: 'consistency',
    question: 'How consistent are you with health routines?',
    trigger: 'momentum',
    options: [
      { id: 'very', label: 'Very consistent' },
      { id: 'somewhat', label: 'Somewhat consistent' },
      { id: 'on-off', label: 'On/off' },
      { id: 'rarely', label: 'Rarely consistent' },
      { id: 'starting', label: 'Starting now' },
    ],
  },
  {
    id: 'obstacle',
    question: "What's your biggest obstacle?",
    trigger: 'pain',
    options: [
      { id: 'time', label: 'Time' },
      { id: 'motivation', label: 'Motivation' },
      { id: 'knowledge', label: 'Knowledge' },
      { id: 'stress', label: 'Stress' },
      { id: 'consistency', label: 'Consistency' },
      { id: 'injury', label: 'Injury/limitation' },
    ],
  },
];

// Sports Predictions Questions
export const SPORTS_QUESTIONS: CategoryQuestion[] = [
  {
    id: 'sportType',
    question: 'Which sport(s) are you most interested in?',
    trigger: 'identity',
    options: [
      { id: 'football', label: 'Football (Soccer)' },
      { id: 'basketball', label: 'Basketball' },
      { id: 'american-football', label: 'American Football' },
      { id: 'baseball', label: 'Baseball' },
      { id: 'tennis', label: 'Tennis' },
      { id: 'cricket', label: 'Cricket' },
      { id: 'hockey', label: 'Hockey' },
      { id: 'mma-boxing', label: 'MMA / Boxing' },
      { id: 'formula1', label: 'Formula 1' },
      { id: 'multiple', label: 'Multiple / I follow several' },
    ],
  },
  {
    id: 'predictionType',
    question: 'What type of predictions are you looking for?',
    trigger: 'desire',
    options: [
      { id: 'team-performance', label: 'Team performance outlooks' },
      { id: 'player-performance', label: 'Player performance predictions' },
      { id: 'season-tournament', label: 'Season or tournament forecasts' },
      { id: 'game-insights', label: 'Game-to-game insights' },
      { id: 'fantasy-roster', label: 'Fantasy roster advantages' },
      { id: 'upset-probability', label: 'Upset probability' },
      { id: 'momentum-shifts', label: 'Momentum shifts' },
    ],
  },
  {
    id: 'engagement',
    question: 'How do you usually engage with sports?',
    trigger: 'identity',
    options: [
      { id: 'casual-fan', label: "I'm a fan watching casually" },
      { id: 'stats-follower', label: 'I follow stats and performance trends' },
      { id: 'fantasy-player', label: 'I play fantasy leagues' },
      { id: 'deep-analyst', label: 'I analyze games deeply' },
      { id: 'occasional-bettor', label: 'I bet occasionally' },
      { id: 'serious-bettor', label: 'I bet seriously' },
    ],
  },
  {
    id: 'favorite',
    question: 'Which team or player do you care about most right now?',
    trigger: 'desire',
    options: [
      { id: 'specific-team', label: 'I have a specific team' },
      { id: 'specific-player', label: 'I have a specific player' },
      { id: 'multiple-teams', label: 'I follow multiple teams' },
      { id: 'no-preference', label: 'No preference — give me general predictions' },
    ],
  },
  {
    id: 'frequency',
    question: 'How often do you want sports predictions?',
    trigger: 'timeline',
    options: [
      { id: 'daily', label: 'Daily' },
      { id: 'weekly', label: 'Weekly' },
      { id: 'before-events', label: 'Before major events' },
      { id: 'important-only', label: 'Only when something important is coming' },
    ],
  },
];

// Stocks & Markets Questions
export const STOCKS_QUESTIONS: CategoryQuestion[] = [
  {
    id: 'markets',
    question: 'What markets are you most interested in?',
    trigger: 'identity',
    options: [
      { id: 'stocks', label: 'Stocks' },
      { id: 'crypto', label: 'Crypto' },
      { id: 'index-funds', label: 'Index funds' },
      { id: 'forex', label: 'Forex' },
      { id: 'commodities', label: 'Commodities (gold, oil, etc.)' },
      { id: 'not-sure', label: 'Not sure yet' },
    ],
  },
  {
    id: 'investingStyle',
    question: 'What is your investing style?',
    trigger: 'identity',
    options: [
      { id: 'long-term', label: 'Long-term investing' },
      { id: 'swing-trading', label: 'Swing trading / medium-term' },
      { id: 'short-term', label: 'Short-term momentum' },
      { id: 'day-trading', label: 'Day trading' },
      { id: 'learning', label: "I'm learning / beginner" },
    ],
  },
  {
    id: 'riskLevel',
    question: 'What is your risk comfort level?',
    trigger: 'constraint',
    options: [
      { id: 'conservative', label: 'Conservative' },
      { id: 'moderate', label: 'Moderate' },
      { id: 'aggressive', label: 'Aggressive' },
      { id: 'high-risk', label: 'High-risk high-reward' },
    ],
  },
  {
    id: 'financialGoal',
    question: 'What is your primary financial goal right now?',
    trigger: 'desire',
    options: [
      { id: 'grow-wealth', label: 'Grow wealth steadily' },
      { id: 'find-opportunities', label: 'Find new opportunities' },
      { id: 'protect-portfolio', label: 'Protect my portfolio' },
      { id: 'ride-trends', label: 'Ride big trends' },
      { id: 'learn-market', label: 'Learn the market' },
      { id: 'predict-volatility', label: 'Predict volatility' },
    ],
  },
  {
    id: 'focusAssets',
    question: 'Are there any stocks, crypto coins, or sectors you want us to focus on?',
    trigger: 'desire',
    options: [
      { id: 'tech-stocks', label: 'Tech stocks' },
      { id: 'blue-chip', label: 'Blue chip stocks' },
      { id: 'crypto-major', label: 'Major cryptocurrencies (BTC, ETH)' },
      { id: 'crypto-alt', label: 'Altcoins' },
      { id: 'energy-sector', label: 'Energy sector' },
      { id: 'healthcare', label: 'Healthcare' },
      { id: 'trending', label: 'Let the app choose trending assets' },
    ],
  },
  {
    id: 'predictionFrequency',
    question: 'How often do you want market predictions?',
    trigger: 'timeline',
    options: [
      { id: 'daily', label: 'Daily' },
      { id: 'weekly', label: 'Weekly' },
      { id: 'major-moves', label: 'Only during major moves' },
      { id: 'high-volatility', label: 'When volatility is high' },
      { id: 'opportunities', label: 'When opportunities appear' },
    ],
  },
];

// Map category IDs to question sets
export const CATEGORY_QUESTION_MAP: Record<string, CategoryQuestion[]> = {
  career: CAREER_QUESTIONS,
  finance: MONEY_QUESTIONS,
  love: LOVE_QUESTIONS,
  health: HEALTH_QUESTIONS,
  sports: SPORTS_QUESTIONS,
  stocks: STOCKS_QUESTIONS,
};

// Type definitions for profile data
export interface CareerProfile {
  position: string;
  direction: string;
  challenge: string;
  timeline: string;
}

export interface MoneyProfile {
  stage: string;
  goal: string;
  incomeSource: string;
  stability: string;
}

export interface LoveProfile {
  goal: string;
  patterns: string;
  desires: string;
}

export interface HealthProfile {
  state: string;
  focus: string;
  consistency: string;
  obstacle: string;
}

export interface SportsProfile {
  sportType: string;
  predictionType: string;
  engagement: string;
  favorite: string;
  frequency: string;
}

export interface StocksProfile {
  markets: string;
  investingStyle: string;
  riskLevel: string;
  financialGoal: string;
  focusAssets: string;
  predictionFrequency: string;
}
