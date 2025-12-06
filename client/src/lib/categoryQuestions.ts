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

// Map category IDs to question sets
export const CATEGORY_QUESTION_MAP: Record<string, CategoryQuestion[]> = {
  career: CAREER_QUESTIONS,
  finance: MONEY_QUESTIONS,
  love: LOVE_QUESTIONS,
  health: HEALTH_QUESTIONS,
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
