import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, TrendingUp } from "lucide-react";
import { Streamdown } from "streamdown";

interface PredictionDisplayProps {
  prediction: string;
  isPremium: boolean;
  confidenceScore?: number | null;
  category?: string;
}

export default function PredictionDisplay({ 
  prediction, 
  isPremium, 
  confidenceScore,
  category 
}: PredictionDisplayProps) {
  
  return (
    <Card className={`p-6 ${isPremium ? 'border-2 border-primary bg-gradient-to-br from-primary/5 via-background to-secondary/5' : 'border-border'}`}>
      {/* Header with mode badge */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          {isPremium ? (
            <>
              <Sparkles className="w-5 h-5 text-primary" />
              <Badge className="bg-gradient-to-r from-primary to-secondary text-primary-foreground">
                Deep Mode
              </Badge>
            </>
          ) : (
            <>
              <TrendingUp className="w-5 h-5 text-muted-foreground" />
              <Badge variant="outline" className="text-muted-foreground">
                Standard Mode
              </Badge>
            </>
          )}
        </div>
        
        {confidenceScore && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Confidence:</span>
            <Badge variant={confidenceScore >= 80 ? "default" : "secondary"}>
              {confidenceScore}%
            </Badge>
          </div>
        )}
      </div>

      {/* Prediction content with markdown support */}
      <div className={`prose prose-sm max-w-none ${isPremium ? 'prose-headings:text-primary' : ''}`}>
        <Streamdown>{prediction}</Streamdown>
      </div>

      {/* Premium footer indicator */}
      {isPremium && (
        <div className="mt-6 pt-4 border-t border-primary/20">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-primary" />
              Enhanced with Deep Mode analysis
            </span>
            {category && (
              <span className="capitalize">{category} Prediction</span>
            )}
          </div>
        </div>
      )}
    </Card>
  );
}
