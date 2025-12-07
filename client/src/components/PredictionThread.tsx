import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Sparkles, TrendingUp, ThumbsUp, ThumbsDown } from "lucide-react";
import { Streamdown } from "streamdown";
import PredictionAccuracy from "@/components/PredictionAccuracy";
import ShareButtons from "@/components/ShareButtons";

interface Message {
  id: string;
  type: "user" | "assistant" | "system";
  content: string;
  category?: string;
  timestamp: Date;
  accuracy?: {
    score: number;
    label: string;
    potentialScore?: number;
    suggestedDetails?: string[];
  };
}

interface PredictionThreadProps {
  messages: Message[];
  onRefineRequest?: (messageId: string) => void;
  onFeedback?: (messageId: string, helpful: boolean) => void;
}

export default function PredictionThread({ messages, onRefineRequest, onFeedback }: PredictionThreadProps) {
  if (messages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center px-4">
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
          <img src="/logo.svg" alt="Predicsure AI" className="w-12 h-12 object-contain" />
        </div>
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
                  {message.category && (
                    <Badge variant="secondary" className="mt-2 text-xs">
                      {message.category}
                    </Badge>
                  )}
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
            <div key={message.id} className="flex justify-start">
              <div className="max-w-[85%] md:max-w-[70%] w-full">
                <Card className="bg-accent/50 p-3 md:p-4">
                  {/* Prediction Content */}
                  <div className="flex items-start gap-2 mb-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <Sparkles className="w-4 h-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm mb-1">Your Prediction</h4>
                      <div className="prose prose-sm dark:prose-invert max-w-none">
                        <Streamdown>{message.content}</Streamdown>
                      </div>
                    </div>
                  </div>

                  {/* Accuracy Score */}
                  {message.accuracy && (
                    <div className="mt-4 pt-4 border-t border-border/50">
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
                      
                      {/* Improvement Suggestion */}
                      {message.accuracy.potentialScore && message.accuracy.suggestedDetails && (
                        <div className="mt-3 p-3 bg-primary/5 rounded-lg border border-primary/20">
                          <div className="flex items-start gap-2 mb-2">
                            <Sparkles className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                            <div className="flex-1">
                              <p className="text-sm font-medium mb-1">
                                Improve Your Prediction Accuracy by {message.accuracy.potentialScore - message.accuracy.score}%
                              </p>
                              <p className="text-xs text-muted-foreground mb-2">
                                Providing these details will help generate a more precise, personalized prediction:
                              </p>
                              <ul className="text-xs space-y-1 mb-3">
                                {message.accuracy.suggestedDetails.map((detail, idx) => (
                                  <li key={idx} className="flex items-center gap-2">
                                    <span className="w-1 h-1 rounded-full bg-primary" />
                                    {detail}
                                  </li>
                                ))}
                              </ul>
                              <p className="text-xs text-muted-foreground">
                                Potential accuracy: <span className="font-semibold text-primary">{message.accuracy.potentialScore}%</span> with more details
                              </p>
                            </div>
                          </div>
                          {onRefineRequest && (
                            <Button
                              onClick={() => onRefineRequest(message.id)}
                              size="sm"
                              className="w-full mt-2"
                            >
                              <Sparkles className="w-4 h-4 mr-2" />
                              Refine My Prediction
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Feedback & Share */}
                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-border/50">
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
                    {/* ShareButtons requires shareToken - will be added when implementing share functionality */}
                  </div>
                </Card>
                <p className="text-xs text-muted-foreground mt-1">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          );
        }

        // System messages (e.g., "Analyzing your question...")
        return (
          <div key={message.id} className="flex justify-center">
            <div className="max-w-md">
              <p className="text-xs text-center text-muted-foreground bg-accent/30 px-3 py-1.5 rounded-full">
                {message.content}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
