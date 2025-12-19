/**
 * Accuracy Calculator
 * 
 * Calculates prediction accuracy based on:
 * 1. User profile completeness (40% weight)
 * 2. Question specificity (30% weight)
 * 3. Category-specific profile data (20% weight)
 * 4. Psyche profile presence (10% weight)
 */

interface UserProfile {
  nickname?: string | null;
  interests?: string | null;
  relationshipStatus?: string | null;
  careerProfile?: string | null;
  moneyProfile?: string | null;
  loveProfile?: string | null;
  healthProfile?: string | null;
  location?: string | null;
  age?: number | null;
  onboardingCompleted?: boolean | null;
}

interface PsycheProfile {
  psycheType?: string | null;
  psycheParams?: string | null;
}

interface AccuracyResult {
  score: number;
  label: "High" | "Moderate" | "Low";
  missingFactors: string[];
  improvementSuggestions: string[];
}

/**
 * Calculate prediction accuracy score based on available context
 */
export function calculateAccuracy(
  userProfile: UserProfile | null,
  psycheProfile: PsycheProfile | null,
  question: string,
  category: string
): AccuracyResult {
  let score = 0;
  const missingFactors: string[] = [];
  const improvementSuggestions: string[] = [];

  // ============================================
  // 1. USER PROFILE COMPLETENESS (40% weight)
  // ============================================
  let profileScore = 0;
  const profileMaxScore = 40;

  if (userProfile) {
    // Nickname (5 points)
    if (userProfile.nickname) {
      profileScore += 5;
    } else {
      missingFactors.push("Your name/nickname");
      improvementSuggestions.push("What should I call you?");
    }

    // Interests (10 points)
    if (userProfile.interests) {
      try {
        const interests = JSON.parse(userProfile.interests);
        if (Array.isArray(interests) && interests.length > 0) {
          profileScore += Math.min(10, interests.length * 3);
        }
      } catch {
        // Invalid JSON, no points
      }
    } else {
      missingFactors.push("Your primary interests");
      improvementSuggestions.push("What areas of life are you most focused on right now?");
    }

    // Relationship status (5 points)
    if (userProfile.relationshipStatus && userProfile.relationshipStatus !== "prefer-not-say") {
      profileScore += 5;
    } else {
      missingFactors.push("Your relationship status");
    }

    // Location (10 points)
    if (userProfile.location) {
      profileScore += 10;
    } else {
      missingFactors.push("Your location/city");
      improvementSuggestions.push("Where are you based?");
    }

    // Age (5 points)
    if (userProfile.age) {
      profileScore += 5;
    } else {
      missingFactors.push("Your age range");
    }

    // Onboarding completed bonus (5 points)
    if (userProfile.onboardingCompleted) {
      profileScore += 5;
    }
  } else {
    missingFactors.push("Basic profile information");
    improvementSuggestions.push("Complete your profile to get more accurate predictions");
  }

  score += Math.min(profileScore, profileMaxScore);

  // ============================================
  // 2. QUESTION SPECIFICITY (30% weight)
  // ============================================
  let questionScore = 0;
  const questionMaxScore = 30;

  const questionLower = question.toLowerCase();
  const wordCount = question.split(/\s+/).length;

  // Length bonus (up to 10 points)
  if (wordCount >= 15) {
    questionScore += 10;
  } else if (wordCount >= 10) {
    questionScore += 7;
  } else if (wordCount >= 5) {
    questionScore += 4;
  } else {
    improvementSuggestions.push("Can you provide more details about your situation?");
  }

  // Specificity indicators (up to 10 points)
  const specificityIndicators = [
    /\b(specific|exactly|precisely|particular)\b/i,
    /\b(when|how long|how much|how many)\b/i,
    /\b(my job|my career|my relationship|my business|my health)\b/i,
    /\b(next week|next month|this year|within \d+)\b/i,
    /\b(should i|will i|can i|is it)\b/i,
  ];

  let specificityCount = 0;
  for (const pattern of specificityIndicators) {
    if (pattern.test(questionLower)) {
      specificityCount++;
    }
  }
  questionScore += Math.min(10, specificityCount * 3);

  // Context indicators (up to 10 points)
  const contextIndicators = [
    /\b(because|since|due to|after|before)\b/i,
    /\b(currently|right now|at the moment)\b/i,
    /\b(i've been|i have been|i am|i'm)\b/i,
    /\b(my situation|my circumstances|my case)\b/i,
  ];

  let contextCount = 0;
  for (const pattern of contextIndicators) {
    if (pattern.test(questionLower)) {
      contextCount++;
    }
  }
  questionScore += Math.min(10, contextCount * 3);

  if (questionScore < 15) {
    improvementSuggestions.push("Adding timeframes and specific details would help");
  }

  score += Math.min(questionScore, questionMaxScore);

  // ============================================
  // 3. CATEGORY-SPECIFIC PROFILE (20% weight)
  // ============================================
  let categoryScore = 0;
  const categoryMaxScore = 20;

  if (userProfile) {
    const categoryProfileMap: Record<string, string | null | undefined> = {
      career: userProfile.careerProfile,
      finance: userProfile.moneyProfile,
      love: userProfile.loveProfile,
      health: userProfile.healthProfile,
    };

    const relevantProfile = categoryProfileMap[category];
    
    if (relevantProfile) {
      try {
        const profileData = JSON.parse(relevantProfile);
        const filledFields = Object.values(profileData).filter(v => v && v !== "").length;
        categoryScore = Math.min(20, filledFields * 5);
      } catch {
        // Invalid JSON
      }
    } else if (category !== "general") {
      missingFactors.push(`Your ${category} profile details`);
      
      const categoryQuestions: Record<string, string> = {
        career: "What's your current job position and career goals?",
        finance: "What's your current financial situation and goals?",
        love: "What are you looking for in relationships?",
        health: "What are your current health goals and challenges?",
      };
      
      if (categoryQuestions[category]) {
        improvementSuggestions.push(categoryQuestions[category]);
      }
    }
  }

  score += Math.min(categoryScore, categoryMaxScore);

  // ============================================
  // 4. PSYCHE PROFILE (10% weight)
  // ============================================
  let psycheScore = 0;
  const psycheMaxScore = 10;

  if (psycheProfile) {
    if (psycheProfile.psycheType) {
      psycheScore += 5;
    }
    if (psycheProfile.psycheParams) {
      try {
        const params = JSON.parse(psycheProfile.psycheParams);
        if (Object.keys(params).length >= 4) {
          psycheScore += 5;
        }
      } catch {
        // Invalid JSON
      }
    }
  } else {
    missingFactors.push("Your personality assessment");
    improvementSuggestions.push("Complete the personality assessment for personalized insights");
  }

  score += Math.min(psycheScore, psycheMaxScore);

  // ============================================
  // FINAL SCORE & LABEL
  // ============================================
  // Ensure score is between 0 and 100
  score = Math.max(0, Math.min(100, Math.round(score)));

  let label: "High" | "Moderate" | "Low";
  if (score >= 75) {
    label = "High";
  } else if (score >= 50) {
    label = "Moderate";
  } else {
    label = "Low";
  }

  return {
    score,
    label,
    missingFactors: missingFactors.slice(0, 5), // Limit to top 5
    improvementSuggestions: improvementSuggestions.slice(0, 3), // Limit to top 3
  };
}

/**
 * Format accuracy info for inclusion in the AI prompt
 */
export function formatAccuracyForPrompt(accuracy: AccuracyResult): string {
  let prompt = `\n\n**PREDICTION ACCURACY CONTEXT:**\n`;
  prompt += `Based on available information, this prediction has a calculated accuracy of ${accuracy.score}% (${accuracy.label}).\n`;
  
  if (accuracy.missingFactors.length > 0) {
    prompt += `\nMissing context that would improve accuracy:\n`;
    for (const factor of accuracy.missingFactors) {
      prompt += `• ${factor}\n`;
    }
  }
  
  prompt += `\n**IMPORTANT:** Use EXACTLY "${accuracy.score}% (${accuracy.label})" as the Prediction Accuracy in your response. Do not make up a different number.\n`;
  
  return prompt;
}
