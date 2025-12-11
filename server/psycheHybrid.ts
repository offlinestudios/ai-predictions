// Hybrid Onboarding Psyche Calculation
// Handles 8 core + 4 adaptive questions format

import { PSYCHE_TYPES } from "./psyche";

interface CoreResponse {
  questionId: string;
  questionText: string;
  selectedOption: string;
  answerText: string;
  trait: string;
  indicators: string[];
  parameters: Record<string, number>;
}

interface AdaptiveResponse {
  questionId: string;
  questionText: string;
  selectedOption: string;
  answerText: string;
  domainTrait: string;
  indicators: string[];
  domainInsight: string;
}

interface HybridOnboardingData {
  nickname: string;
  primaryInterest: string;
  coreResponses: CoreResponse[];
  adaptiveResponses: AdaptiveResponse[];
}

/**
 * Calculate personality type from hybrid onboarding responses
 * Uses weighted scoring system:
 * - Core questions: +3 points for primary indicator, +1 for secondary
 * - Adaptive questions: +2 points for primary indicator, +1 for secondary
 * - Confidence threshold: Primary type must have >60% of total points
 */
export function calculateHybridPsycheType(data: HybridOnboardingData): {
  psycheType: string;
  confidence: number;
  parameters: Record<string, number>;
  domainInsights: string[];
} {
  const scores: Record<string, number> = {};
  const parameterValues: Record<string, number[]> = {
    risk_appetite: [],
    emotional_reactivity: [],
    time_consistency: [],
    data_orientation: [],
    tilt_prone: [],
    volatility_tolerance: [],
    loyalty_bias: [],
    change_aversion: [],
  };
  const domainInsights: string[] = [];

  // Process core responses (8 questions)
  data.coreResponses.forEach((response) => {
    // Add points for indicators
    if (response.indicators && response.indicators.length > 0) {
      // First indicator is primary (+3 points)
      const primaryIndicator = response.indicators[0];
      scores[primaryIndicator] = (scores[primaryIndicator] || 0) + 3;

      // Remaining indicators are secondary (+1 point each)
      for (let i = 1; i < response.indicators.length; i++) {
        const secondaryIndicator = response.indicators[i];
        scores[secondaryIndicator] = (scores[secondaryIndicator] || 0) + 1;
      }
    }

    // Collect parameter values
    if (response.parameters) {
      Object.entries(response.parameters).forEach(([param, value]) => {
        if (parameterValues[param]) {
          parameterValues[param].push(value);
        }
      });
    }
  });

  // Process adaptive responses (4 questions)
  data.adaptiveResponses.forEach((response) => {
    // Add points for indicators
    if (response.indicators && response.indicators.length > 0) {
      // First indicator is primary (+2 points)
      const primaryIndicator = response.indicators[0];
      scores[primaryIndicator] = (scores[primaryIndicator] || 0) + 2;

      // Remaining indicators are secondary (+1 point each)
      for (let i = 1; i < response.indicators.length; i++) {
        const secondaryIndicator = response.indicators[i];
        scores[secondaryIndicator] = (scores[secondaryIndicator] || 0) + 1;
      }
    }

    // Collect domain insights
    if (response.domainInsight) {
      domainInsights.push(response.domainInsight);
    }
  });

  // Calculate total points
  const totalPoints = Object.values(scores).reduce((sum, score) => sum + score, 0);

  // Find dominant personality type
  let maxScore = 0;
  let dominantType = "quiet_strategist"; // default fallback

  Object.entries(scores).forEach(([type, score]) => {
    if (score > maxScore) {
      maxScore = score;
      dominantType = type;
    }
  });

  // Calculate confidence (percentage of total points)
  const confidence = totalPoints > 0 ? maxScore / totalPoints : 0;

  // Calculate average parameters
  const averagedParameters: Record<string, number> = {};
  Object.entries(parameterValues).forEach(([param, values]) => {
    if (values.length > 0) {
      const average = values.reduce((sum, val) => sum + val, 0) / values.length;
      averagedParameters[param] = Math.round(average * 100) / 100; // Round to 2 decimals
    } else {
      // Use default from personality type if no values collected
      const typeData = PSYCHE_TYPES[dominantType as keyof typeof PSYCHE_TYPES];
      averagedParameters[param] = typeData?.parameters?.[param] || 0.5;
    }
  });

  // If confidence is too low (<60%), assign a balanced type
  if (confidence < 0.6) {
    dominantType = "long_term_builder"; // Most balanced type
  }

  return {
    psycheType: dominantType,
    confidence,
    parameters: averagedParameters,
    domainInsights,
  };
}

/**
 * Format hybrid onboarding data for storage
 */
export function formatHybridOnboardingForStorage(data: HybridOnboardingData) {
  return {
    nickname: data.nickname,
    primaryInterest: data.primaryInterest,
    coreResponses: JSON.stringify(data.coreResponses),
    adaptiveResponses: JSON.stringify(data.adaptiveResponses),
    totalQuestions: data.coreResponses.length + data.adaptiveResponses.length,
  };
}

/**
 * Validate hybrid onboarding data
 */
export function validateHybridOnboardingData(data: any): data is HybridOnboardingData {
  if (!data || typeof data !== "object") return false;
  if (!data.nickname || typeof data.nickname !== "string") return false;
  if (!data.primaryInterest || typeof data.primaryInterest !== "string") return false;
  if (!Array.isArray(data.coreResponses) || data.coreResponses.length !== 8) return false;
  if (!Array.isArray(data.adaptiveResponses) || data.adaptiveResponses.length !== 4) return false;

  // Validate core responses structure
  for (const response of data.coreResponses) {
    if (!response.questionId || !response.selectedOption) return false;
    if (!Array.isArray(response.indicators)) return false;
    if (!response.parameters || typeof response.parameters !== "object") return false;
  }

  // Validate adaptive responses structure
  for (const response of data.adaptiveResponses) {
    if (!response.questionId || !response.selectedOption) return false;
    if (!Array.isArray(response.indicators)) return false;
    if (!response.domainInsight) return false;
  }

  return true;
}
