// Micro-Feedback Messages for Hybrid Onboarding
// These messages appear after questions 4, 8, and 12 to create engagement

export interface FeedbackMessage {
  id: string;
  trigger: "after_question_4" | "after_question_8" | "after_question_12";
  messages: string[];
}

export const MICRO_FEEDBACK: FeedbackMessage[] = [
  {
    id: "mid_core",
    trigger: "after_question_4",
    messages: [
      "We're detecting your decision-making patterns...",
      "Your personality profile is taking shape...",
      "Interesting—you show strong analytical tendencies...",
      "Interesting—you show strong intuitive tendencies...",
      "Interesting—you show balanced decision-making traits...",
      "Your risk profile is emerging...",
    ],
  },
  {
    id: "end_core",
    trigger: "after_question_8",
    messages: [
      "Your core personality traits are clear...",
      "Now let's see how this shows up in {category}...",
      "Almost there—just 4 more questions...",
      "Great! Now we'll explore your {category} style...",
    ],
  },
  {
    id: "end_adaptive",
    trigger: "after_question_12",
    messages: [
      "Perfect! Your complete profile is ready...",
      "Analyzing your unique personality type...",
      "Generating your personalized insights...",
      "Creating your prediction profile...",
    ],
  },
];

// Function to get random feedback message for a trigger point
export function getFeedbackMessage(
  trigger: "after_question_4" | "after_question_8" | "after_question_12",
  category?: string
): string {
  const feedbackGroup = MICRO_FEEDBACK.find((f) => f.trigger === trigger);
  if (!feedbackGroup) return "";

  const messages = feedbackGroup.messages;
  const randomMessage = messages[Math.floor(Math.random() * messages.length)];

  // Replace {category} placeholder if present
  if (category) {
    return randomMessage.replace("{category}", category);
  }

  return randomMessage;
}
