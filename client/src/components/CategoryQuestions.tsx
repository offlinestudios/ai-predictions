import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { 
  CATEGORY_QUESTION_MAP, 
  type CategoryQuestion,
  type CareerProfile,
  type MoneyProfile,
  type LoveProfile,
  type HealthProfile,
} from "@/lib/categoryQuestions";

interface CategoryQuestionsProps {
  categories: string[]; // Selected interest categories
  onComplete: (profiles: CategoryProfiles) => void;
  onBack: () => void;
}

export interface CategoryProfiles {
  careerProfile?: CareerProfile;
  moneyProfile?: MoneyProfile;
  loveProfile?: LoveProfile;
  healthProfile?: HealthProfile;
}

export default function CategoryQuestions({ categories, onComplete, onBack }: CategoryQuestionsProps) {
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, Record<string, string>>>({});

  const currentCategory = categories[currentCategoryIndex];
  const questions = CATEGORY_QUESTION_MAP[currentCategory] || [];
  const currentQuestion = questions[currentQuestionIndex];

  const handleAnswer = (answerId: string) => {
    // Save answer
    const newAnswers = {
      ...answers,
      [currentCategory]: {
        ...(answers[currentCategory] || {}),
        [currentQuestion.id]: answerId,
      },
    };
    setAnswers(newAnswers);

    // Move to next question or category
    if (currentQuestionIndex < questions.length - 1) {
      // Next question in same category
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else if (currentCategoryIndex < categories.length - 1) {
      // Next category
      setCurrentCategoryIndex(currentCategoryIndex + 1);
      setCurrentQuestionIndex(0);
    } else {
      // All done - format and return profiles
      const profiles = formatProfiles(newAnswers, categories);
      onComplete(profiles);
    }
  };

  const handleBackButton = () => {
    if (currentQuestionIndex > 0) {
      // Go back to previous question in same category
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    } else if (currentCategoryIndex > 0) {
      // Go back to previous category's last question
      setCurrentCategoryIndex(currentCategoryIndex - 1);
      const prevCategoryQuestions = CATEGORY_QUESTION_MAP[categories[currentCategoryIndex - 1]] || [];
      setCurrentQuestionIndex(prevCategoryQuestions.length - 1);
    } else {
      // Go back to interest selection
      onBack();
    }
  };

  // Calculate progress
  const totalQuestions = categories.reduce((sum, cat) => {
    return sum + (CATEGORY_QUESTION_MAP[cat]?.length || 0);
  }, 0);
  const answeredQuestions = Object.values(answers).reduce((sum, catAnswers) => {
    return sum + Object.keys(catAnswers).length;
  }, 0);
  const progress = totalQuestions > 0 ? (answeredQuestions / totalQuestions) * 100 : 0;

  if (!currentQuestion) {
    return null;
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-center text-sm text-muted-foreground mt-2">
          {answeredQuestions} of {totalQuestions} questions
        </p>
      </div>

      {/* Question Card */}
      <Card>
        <CardHeader>
          <div className="text-xs font-medium text-primary uppercase tracking-wide mb-2">
            {getCategoryLabel(currentCategory)}
          </div>
          <CardTitle className="text-xl">
            {currentQuestion.question}
          </CardTitle>
          <CardDescription>
            Choose the option that best describes you
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {currentQuestion.options.map((option) => {
            const isSelected = answers[currentCategory]?.[currentQuestion.id] === option.id;
            return (
              <button
                key={option.id}
                onClick={() => handleAnswer(option.id)}
                className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                  isSelected
                    ? "border-primary bg-primary/10"
                    : "border-border hover:border-primary/50 hover:bg-accent/50"
                }`}
              >
                <span className="font-medium">{option.label}</span>
              </button>
            );
          })}

          {/* Navigation Buttons */}
          <div className="flex gap-3 pt-4">
            <Button 
              onClick={handleBackButton} 
              variant="outline" 
              className="flex-1"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Helper function to get category label
function getCategoryLabel(categoryId: string): string {
  const labels: Record<string, string> = {
    career: "Career & Success",
    finance: "Money & Wealth",
    love: "Love & Relationships",
    health: "Health & Wellness",
  };
  return labels[categoryId] || categoryId;
}

// Helper function to format answers into typed profiles
function formatProfiles(
  answers: Record<string, Record<string, string>>,
  categories: string[]
): CategoryProfiles {
  const profiles: CategoryProfiles = {};

  if (categories.includes("career") && answers.career) {
    profiles.careerProfile = {
      position: answers.career.position || "",
      direction: answers.career.direction || "",
      challenge: answers.career.challenge || "",
      timeline: answers.career.timeline || "",
    };
  }

  if (categories.includes("finance") && answers.finance) {
    profiles.moneyProfile = {
      stage: answers.finance.stage || "",
      goal: answers.finance.goal || "",
      incomeSource: answers.finance.incomeSource || "",
      stability: answers.finance.stability || "",
    };
  }

  if (categories.includes("love") && answers.love) {
    profiles.loveProfile = {
      goal: answers.love.goal || "",
      patterns: answers.love.patterns || "",
      desires: answers.love.desires || "",
    };
  }

  if (categories.includes("health") && answers.health) {
    profiles.healthProfile = {
      state: answers.health.state || "",
      focus: answers.health.focus || "",
      consistency: answers.health.consistency || "",
      obstacle: answers.health.obstacle || "",
    };
  }

  return profiles;
}
