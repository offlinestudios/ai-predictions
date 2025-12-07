import { useState } from "react";
import { useSwipeable } from "react-swipeable";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X, History, ChevronRight, TrendingUp } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { formatDistanceToNow } from "date-fns";

interface PredictionHistorySidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPrediction: (prediction: any) => void;
}

const getCategoryIcon = (category: string) => {
  const icons: Record<string, string> = {
    general: "💬",
    career: "💼",
    relationships: "❤️",
    finance: "💰",
    health: "🏥",
    sports: "⚽",
    stocks: "📈"
  };
  return icons[category] || "💬";
};

const getCategoryLabel = (category: string) => {
  const labels: Record<string, string> = {
    general: "General",
    career: "Career",
    relationships: "Relationships",
    love: "Relationships",
    finance: "Finance",
    health: "Health",
    sports: "Sports",
    stocks: "Stocks & Markets"
  };
  return labels[category] || category;
};

const getAccuracyColor = (score: number | null) => {
  if (!score) return "text-muted-foreground";
  if (score >= 80) return "text-green-500";
  if (score >= 60) return "text-yellow-500";
  return "text-orange-500";
};

const getAccuracyLabel = (score: number | null) => {
  if (!score) return "N/A";
  if (score >= 80) return "High";
  if (score >= 60) return "Moderate";
  return "Low";
};

export default function PredictionHistorySidebar({ 
  isOpen, 
  onClose, 
  onSelectPrediction 
}: PredictionHistorySidebarProps) {
  const { data: predictions, isLoading } = trpc.prediction.getHistory.useQuery(
    { limit: 50 },
    { enabled: isOpen }
  );

  // Swipe gesture handlers
  const swipeHandlers = useSwipeable({
    onSwipedRight: () => {
      if (isOpen) onClose();
    },
    trackMouse: false,
    preventScrollOnSwipe: true,
  });

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        {...swipeHandlers}
        className={`
          fixed top-0 right-0 h-full w-80 bg-background border-l border-border z-50
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}
          lg:sticky lg:top-0 lg:h-screen ${isOpen ? 'lg:w-72 xl:w-80' : 'lg:w-0 lg:border-0'}
        `}
      >
        <div className={`flex flex-col h-full ${!isOpen ? 'lg:hidden' : ''}`}>
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <div className="flex items-center gap-2">
              <History className="w-5 h-5 text-primary" />
              <h2 className="font-semibold">Recent Predictions</h2>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Predictions List */}
          <ScrollArea className="flex-1">
            <div className="p-3 space-y-2">
              {isLoading && (
                <div className="text-center py-8 text-muted-foreground text-sm">
                  Loading predictions...
                </div>
              )}

              {!isLoading && (!predictions || predictions.predictions.length === 0) && (
                <div className="text-center py-8 px-4">
                  <div className="w-12 h-12 rounded-full bg-accent/50 flex items-center justify-center mx-auto mb-3">
                    <History className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    No predictions yet. Start by asking a question!
                  </p>
                </div>
              )}

              {predictions?.predictions.map((prediction) => (
                <Card
                  key={prediction.id}
                  className="p-3 cursor-pointer hover:bg-accent/50 transition-colors group"
                  onClick={() => {
                    onSelectPrediction(prediction);
                    onClose();
                  }}
                >
                  {/* Category Badge */}
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="secondary" className="text-xs">
                      {getCategoryIcon(prediction.category || "general")} {getCategoryLabel(prediction.category || "general")}
                    </Badge>
                    <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                  </div>

                  {/* Question Preview */}
                  <p className="text-sm font-medium line-clamp-2 mb-2">
                    {prediction.userInput}
                  </p>

                  {/* Accuracy Score */}
                  {prediction.confidenceScore && (
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className={`w-3 h-3 ${getAccuracyColor(prediction.confidenceScore)}`} />
                      <span className={`text-xs font-semibold ${getAccuracyColor(prediction.confidenceScore)}`}>
                        {prediction.confidenceScore}% {getAccuracyLabel(prediction.confidenceScore)}
                      </span>
                    </div>
                  )}

                  {/* Timestamp */}
                  <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(prediction.createdAt), { addSuffix: true })}
                  </p>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </div>
      </aside>
    </>
  );
}
