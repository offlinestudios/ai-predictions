import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Sparkles, TrendingUp, ThumbsUp, ThumbsDown, Upload, Copy, RefreshCw, MoreHorizontal } from "lucide-react";
import { Streamdown } from "streamdown";
import PredictionAccuracy from "@/components/PredictionAccuracy";
import ShareButtons from "@/components/ShareButtons";
import TypingIndicator from "@/components/TypingIndicator";
import { ShareModal } from "@/components/ShareModal";

interface Message {
  id: string;
  type: "user" | "assistant" | "system";
  content: string;
  timestamp: Date;
  accuracy?: {
    score: number;
    label: string;
    potentialScore?: number;
    suggestedDetails?: string[];
  };
  predictionId?: number;
  shareToken?: string | null;
  userInput?: string;
}

interface PredictionThreadProps {
  messages: Message[];
  onRefineRequest?: (messageId: string) => void;
  onFeedback?: (messageId: string, helpful: boolean) => void;
  onRegenerate?: (messageId: string) => void;
  currentPrediction?: {
    id: number;
    userInput: string;
    predictionResult: string;
    shareToken: string | null;
  } | null;
}

export default function PredictionThread({ messages, onRefineRequest, onFeedback, onRegenerate, currentPrediction }: PredictionThreadProps) {
  const [shareModalOpen, setShareModalOpen] = useState(false);

  if (messages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center px-4">
        <img src="/logo.svg" alt="Predicsure AI" className="w-16 h-16 object-contain mb-6" />
        <h3 className="text-xl font-semibold">Start a Prediction</h3>
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-4">
      {messages.map((message) => {
        if (message.type === "user") {
          return (
            <div key={message.id} className="flex justify-end">
              <div className="max-w-[85%] md:max-w-[70%]">
                <Card className="bg-accent/30 border-accent/50 p-3 md:p-4">
                  <p className="text-sm md:text-base whitespace-pre-wrap">{message.content}</p>
                </Card>
                <p className="text-xs text-muted-foreground mt-1 text-right">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          );
        }

        if (message.type === "assistant") {
          return (
            <div key={message.id} className="w-full">
              <div className="w-full px-4 md:px-6 py-6">
                  {/* Prediction Content - Full Width */}
                  <div className="mb-6">
                    <h4 className="font-semibold text-lg mb-4 flex items-center gap-2">
                      <img src="/logo.svg" alt="Predicsure" className="w-6 h-6 object-contain" />
                      Your Prediction
                    </h4>
                    <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
                      <Streamdown>{message.content}</Streamdown>
                    </div>
                  </div>

                  {/* Accuracy Score */}
                  {message.accuracy && (
                    <div className="mt-6 pt-6 border-t border-border/30">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="w-4 h-4 text-primary" />
                          <span className="text-sm font-medium">Prediction Accuracy</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-2xl font-bold text-primary">
                            {message.accuracy.score}%
                          </span>
                          <Badge variant="secondary" className="text-xs">
                            {message.accuracy.label}
                          </Badge>
                        </div>
                      </div>
                      <Progress value={message.accuracy.score} className="h-2 mb-2" />
                      
                      {/* Dynamic Follow-up Questions - Removed generic improvement section */}
                    </div>
                  )}

                  {/* Feedback & Share */}
                  <div className="flex items-center justify-between mt-6 pt-4 border-t border-border/30">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">Was this helpful?</span>
                      {onFeedback && (
                        <>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => onFeedback(message.id, true)}
                          >
                            <ThumbsUp className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => onFeedback(message.id, false)}
                          >
                            <ThumbsDown className="w-4 h-4" />
                          </Button>
                        </>
                      )}
                    </div>
                    {/* Action buttons */}
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => setShareModalOpen(true)}
                        title="Share prediction"
                      >
                        <Upload className="w-4 h-4" />
                      </Button>
                      {onRegenerate && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => onRegenerate(message.id)}
                          title="Regenerate prediction"
                        >
                          <RefreshCw className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                <p className="text-xs text-muted-foreground mt-2">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          );
        }

        // System messages (e.g., "Analyzing your question...")
        return (
          <div key={message.id} className="flex justify-start">
            <TypingIndicator />
          </div>
        );
      })}

      {/* Share Modal */}
      <ShareModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        prediction={currentPrediction}
      />
    </div>
  );
}
