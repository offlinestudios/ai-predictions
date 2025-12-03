import { Card, CardContent } from "./ui/card";
import { Progress } from "./ui/progress";
import { Button } from "./ui/button";
import { TrendingUp, Sparkles } from "lucide-react";

interface PredictionAccuracyProps {
  category: string;
  accuracyPercentage: number;
  missingFields: string[];
  onImproveAccuracy: () => void;
}

const CATEGORY_SUGGESTIONS: Record<string, { fields: string[]; potentialIncrease: number }> = {
  career: {
    fields: ["industry", "years of experience", "current role", "career goals"],
    potentialIncrease: 25
  },
  love: {
    fields: ["relationship timeline", "communication patterns", "past relationship history"],
    potentialIncrease: 30
  },
  finance: {
    fields: ["income range", "financial goals", "investment experience", "risk tolerance"],
    potentialIncrease: 20
  },
  health: {
    fields: ["current fitness level", "health goals", "lifestyle habits", "medical history"],
    potentialIncrease: 22
  },
  general: {
    fields: ["age range", "location", "life stage", "major life transitions"],
    potentialIncrease: 18
  }
};

export default function PredictionAccuracy({ 
  category, 
  accuracyPercentage, 
  missingFields,
  onImproveAccuracy 
}: PredictionAccuracyProps) {
  const suggestions = CATEGORY_SUGGESTIONS[category] || CATEGORY_SUGGESTIONS.general;
  const potentialAccuracy = Math.min(accuracyPercentage + suggestions.potentialIncrease, 98);
  
  // Determine accuracy level and color
  const getAccuracyLevel = (percentage: number) => {
    if (percentage >= 85) return { label: "Excellent", color: "text-green-500" };
    if (percentage >= 70) return { label: "Good", color: "text-blue-500" };
    if (percentage >= 55) return { label: "Moderate", color: "text-yellow-500" };
    return { label: "Basic", color: "text-orange-500" };
  };
  
  const accuracyLevel = getAccuracyLevel(accuracyPercentage);
  
  return (
    <Card className="border-border/50 bg-card/50">
      <CardContent className="pt-6 space-y-4">
        {/* Accuracy Percentage Display */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            <div>
              <p className="text-sm font-medium">Prediction Accuracy</p>
              <p className="text-xs text-muted-foreground">Based on provided information</p>
            </div>
          </div>
          <div className="text-right">
            <p className={`text-2xl font-bold ${accuracyLevel.color}`}>
              {accuracyPercentage}%
            </p>
            <p className="text-xs text-muted-foreground">{accuracyLevel.label}</p>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="space-y-2">
          <Progress value={accuracyPercentage} className="h-2" />
          <p className="text-xs text-muted-foreground text-center">
            {accuracyPercentage < 85 && `Potential accuracy: ${potentialAccuracy}% with more details`}
          </p>
        </div>
        
        {/* Improvement Suggestion */}
        {missingFields.length > 0 && accuracyPercentage < 85 && (
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 space-y-3">
            <div className="flex items-start gap-2">
              <Sparkles className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium mb-2">
                  Improve Your Prediction Accuracy by {suggestions.potentialIncrease}%
                </p>
                <p className="text-xs text-muted-foreground mb-3">
                  Providing these details will help generate a more precise, personalized prediction:
                </p>
                <ul className="text-xs text-muted-foreground space-y-1 mb-3">
                  {missingFields.slice(0, 3).map((field: string, index: number) => (
                    <li key={index} className="flex items-center gap-2">
                      <span className="w-1 h-1 rounded-full bg-primary"></span>
                      <span className="capitalize">{field}</span>
                    </li>
                  ))}
                  {missingFields.length > 3 && (
                    <li className="text-xs text-muted-foreground/70">
                      + {missingFields.length - 3} more details
                    </li>
                  )}
                </ul>
                <Button 
                  onClick={onImproveAccuracy}
                  size="sm"
                  className="w-full"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Refine My Prediction
                </Button>
              </div>
            </div>
          </div>
        )}
        
        {/* High Accuracy Message */}
        {accuracyPercentage >= 85 && (
          <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3 text-center">
            <p className="text-sm text-green-600 dark:text-green-400 font-medium">
              ✨ Your prediction is highly accurate based on comprehensive data!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
