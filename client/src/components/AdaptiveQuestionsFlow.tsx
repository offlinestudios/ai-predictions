import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { ADAPTIVE_QUESTIONS } from "@/data/adaptiveQuestions";

interface AdaptiveQuestionsFlowProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categories: string[];
  onComplete: (responses: any[]) => void;
}

export default function AdaptiveQuestionsFlow({
  open,
  onOpenChange,
  categories,
  onComplete,
}: AdaptiveQuestionsFlowProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Build question list: 3 questions per category
  const questions = categories.flatMap(category => {
    const categoryQuestions = ADAPTIVE_QUESTIONS[category as keyof typeof ADAPTIVE_QUESTIONS] || [];
    return categoryQuestions.slice(0, 3); // Take first 3 questions
  });

  const totalQuestions = questions.length;
  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;

  const handleAnswer = (option: any) => {
    const response = {
      questionId: currentQuestion.id,
      questionText: currentQuestion.question,
      selectedOption: option.label,
      answerText: option.text,
      category: currentQuestion.category,
      indicators: option.indicators,
      domainInsight: option.domainInsight,
      parameters: option.parameters,
    };

    const newResponses = [...responses, response];
    setResponses(newResponses);

    if (currentQuestionIndex < totalQuestions - 1) {
      // Move to next question
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // All questions answered, submit
      setIsSubmitting(true);
      onComplete(newResponses);
    }
  };

  if (!currentQuestion) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="space-y-6 py-4">
          {/* Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">
                Question {currentQuestionIndex + 1} of {totalQuestions}
              </span>
              <span className="font-medium">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Question */}
          <div>
            <h2 className="text-2xl font-bold mb-2">{currentQuestion.question}</h2>
            {currentQuestion.description && (
              <p className="text-muted-foreground">{currentQuestion.description}</p>
            )}
          </div>

          {/* Options */}
          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => (
              <Card
                key={index}
                className={cn(
                  "cursor-pointer transition-all hover:border-primary/50 hover:bg-primary/5",
                  "border-border"
                )}
                onClick={() => handleAnswer(option)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center font-semibold text-primary">
                      {option.label}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{option.text}</p>
                    </div>
                    <ArrowRight className="flex-shrink-0 h-5 w-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Loading state */}
          {isSubmitting && (
            <div className="flex items-center justify-center gap-2 text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Enhancing your profile...</span>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
