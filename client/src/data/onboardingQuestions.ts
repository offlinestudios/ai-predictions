export interface OnboardingQuestion {
  id: number;
  question: string;
  options: {
    value: string;
    label: string;
  }[];
}

// 12 core psychological questions for personality assessment
// Removed sports/stocks-specific questions, kept universal decision-making patterns
export const ONBOARDING_QUESTIONS: OnboardingQuestion[] = [
  {
    id: 1,
    question: "When you're making an important decision, what do you rely on most?",
    options: [
      { value: "A", label: "Data, patterns, evidence" },
      { value: "B", label: "My gut feeling" },
      { value: "C", label: "Momentum and timing — I feel it when it's 'right'" },
      { value: "D", label: "Stability and long-term safety" },
      { value: "E", label: "Emotions and how the choice aligns with my relationships" },
    ],
  },
  {
    id: 2,
    question: "What best describes your reaction to sudden opportunities?",
    options: [
      { value: "A", label: "I analyze them carefully before acting" },
      { value: "B", label: "I jump in — rare chances must be seized" },
      { value: "C", label: "I follow my intuition" },
      { value: "D", label: "I get excited but cautious" },
      { value: "E", label: "I prefer predictable paths over surprises" },
    ],
  },
  {
    id: 3,
    question: "How do you typically respond after a loss or setback?",
    options: [
      { value: "A", label: "I double down to recover quickly" },
      { value: "B", label: "I withdraw and analyze what went wrong" },
      { value: "C", label: "I get emotional and need time to regain balance" },
      { value: "D", label: "I take it as a sign to adjust slowly and cautiously" },
      { value: "E", label: "I use it as fuel to push even harder" },
    ],
  },
  {
    id: 4,
    question: "How often do you change your decisions at the last minute?",
    options: [
      { value: "A", label: "Rarely — I don't like instability" },
      { value: "B", label: "Often — I react to new information fast" },
      { value: "C", label: "Sometimes — if the momentum shifts" },
      { value: "D", label: "Very often — my intuition changes constantly" },
      { value: "E", label: "Almost never — I stick to data-based plans" },
    ],
  },
  {
    id: 5,
    question: "What best describes your risk tolerance?",
    options: [
      { value: "A", label: "High — I enjoy volatility and swings" },
      { value: "B", label: "Moderate — I take risks with strategy" },
      { value: "C", label: "Low — I prefer safety and predictability" },
      { value: "D", label: "Very low — losses affect me strongly" },
      { value: "E", label: "It depends on my emotional state" },
    ],
  },
  {
    id: 6,
    question: "In relationships, you tend to…",
    options: [
      { value: "A", label: "Analyze before opening up" },
      { value: "B", label: "Seek emotional intensity and passion" },
      { value: "C", label: "Focus on loyalty and consistency" },
      { value: "D", label: "Follow your intuition and vibes" },
      { value: "E", label: "Chase connection but get reactive during conflict" },
    ],
  },
  {
    id: 7,
    question: "What frustrates you the most about predictions?",
    options: [
      { value: "A", label: "When they're too vague or emotional" },
      { value: "B", label: "When they ignore timing and momentum" },
      { value: "C", label: "When they don't acknowledge my feelings" },
      { value: "D", label: "When they encourage risk" },
      { value: "E", label: "When they limit bold possibilities" },
    ],
  },
  {
    id: 8,
    question: "What motivates you to seek predictions?",
    options: [
      { value: "A", label: "To optimize and improve outcomes" },
      { value: "B", label: "To understand emotional or relational dynamics" },
      { value: "C", label: "To manage risk better" },
      { value: "D", label: "For entertainment and adrenaline" },
      { value: "E", label: "For long-term personal direction" },
    ],
  },
  {
    id: 9,
    question: "Your timing style is…",
    options: [
      { value: "A", label: "I prefer early entry (anticipatory)" },
      { value: "B", label: "I enter at confirmation (safe)" },
      { value: "C", label: "I react quickly when I feel momentum" },
      { value: "D", label: "I wait longer than most to feel confident" },
      { value: "E", label: "Depends on emotional clarity" },
    ],
  },
  {
    id: 10,
    question: "Which statement describes you best?",
    options: [
      { value: "A", label: "\"I avoid losses.\"" },
      { value: "B", label: "\"I chase wins.\"" },
      { value: "C", label: "\"I look for patterns.\"" },
      { value: "D", label: "\"I seek emotional meaning.\"" },
      { value: "E", label: "\"I want stability over chaos.\"" },
    ],
  },
  {
    id: 11,
    question: "How do you handle information overload?",
    options: [
      { value: "A", label: "Break it into logic and structure" },
      { value: "B", label: "Follow intuition" },
      { value: "C", label: "Seek reassurance" },
      { value: "D", label: "Act quickly to avoid paralysis" },
      { value: "E", label: "Avoid the noise and return to routine" },
    ],
  },
  {
    id: 12,
    question: "When life becomes uncertain, you typically…",
    options: [
      { value: "A", label: "Retreat and analyze" },
      { value: "B", label: "Accelerate and take bold action" },
      { value: "C", label: "Become emotional and introspective" },
      { value: "D", label: "Stick to what's familiar" },
      { value: "E", label: "Seek intensity or distraction" },
    ],
  },
];
