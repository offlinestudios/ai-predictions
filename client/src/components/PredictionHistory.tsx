import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Briefcase, 
  Heart, 
  DollarSign, 
  Activity, 
  MessageCircle,
  ChevronLeft,
  ChevronRight,
  Clock
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface PredictionHistoryProps {
  onSelectPrediction: (prediction: {
    id: number;
    predictionResult: string;
    shareToken: string | null;
    userFeedback: string | null;
    confidenceScore: number | null;
    trajectoryType: string | null;
  }) => void;
  currentPredictionId: number | null;
  isOpen?: boolean;
  onToggle?: () => void;
}

const categoryIcons = {
  career: { icon: Briefcase, color: "text-blue-500", bg: "bg-blue-500/10" },
  love: { icon: Heart, color: "text-pink-500", bg: "bg-pink-500/10" },
  finance: { icon: DollarSign, color: "text-green-500", bg: "bg-green-500/10" },
  health: { icon: Activity, color: "text-orange-500", bg: "bg-orange-500/10" },
  general: { icon: MessageCircle, color: "text-purple-500", bg: "bg-purple-500/10" },
};

const trajectoryLabels = {
  instant: "Instant",
  "30day": "30-Day",
  "90day": "90-Day",
  yearly: "Yearly",
};

export default function PredictionHistory({ onSelectPrediction, currentPredictionId, isOpen, onToggle }: PredictionHistoryProps) {
  // Use external state if provided, otherwise use internal state
  const [internalCollapsed, setInternalCollapsed] = useState(true);
  const isCollapsed = isOpen !== undefined ? !isOpen : internalCollapsed;
  const toggleCollapsed = onToggle || (() => setInternalCollapsed(!internalCollapsed));

  const { data: historyData, isLoading } = trpc.prediction.getHistory.useQuery(
    { limit: 10 },
    { refetchInterval: 30000 } // Refresh every 30 seconds
  );

  const predictions = historyData?.predictions || [];

  if (isCollapsed) {
    return (
      <div className="fixed right-0 top-20 z-40">
        <Button
          variant="outline"
          size="icon"
          onClick={toggleCollapsed}
          className="rounded-l-lg rounded-r-none border-r-0 shadow-lg"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <Card className="fixed right-4 top-20 z-40 w-80 shadow-2xl">
      <div className="flex items-center justify-between border-b p-4">
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-muted-foreground" />
          <h3 className="font-semibold">Recent Predictions</h3>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleCollapsed}
          className="h-8 w-8"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <ScrollArea className="h-[calc(100vh-12rem)]">
        {isLoading ? (
          <div className="p-4 text-center text-sm text-muted-foreground">
            Loading history...
          </div>
        ) : predictions.length === 0 ? (
          <div className="p-8 text-center">
            <Sparkles className="mx-auto h-12 w-12 text-muted-foreground/50" />
            <p className="mt-4 text-sm text-muted-foreground">
              No predictions yet. Generate your first one!
            </p>
          </div>
        ) : (
          <div className="space-y-2 p-2">
            {predictions.map((pred) => {
              const category = (pred.category || "general") as keyof typeof categoryIcons;
              const { icon: Icon, color, bg } = categoryIcons[category];
              const isActive = pred.id === currentPredictionId;
              const trajectoryLabel = trajectoryLabels[pred.trajectoryType as keyof typeof trajectoryLabels] || "Instant";

              return (
                <button
                  key={pred.id}
                  onClick={() => onSelectPrediction({
                    id: pred.id,
                    predictionResult: pred.predictionResult,
                    shareToken: pred.shareToken,
                    userFeedback: pred.userFeedback,
                    confidenceScore: pred.confidenceScore,
                    trajectoryType: pred.trajectoryType,
                  })}
                  className={`w-full rounded-lg border p-3 text-left transition-all hover:shadow-md ${
                    isActive
                      ? "border-primary bg-primary/5 shadow-sm"
                      : "border-border bg-card hover:border-primary/50"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`rounded-lg p-2 ${bg}`}>
                      <Icon className={`h-4 w-4 ${color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium line-clamp-2">
                        {pred.userInput}
                      </p>
                      <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                        <span className="capitalize">{category}</span>
                        <span>•</span>
                        <span>{trajectoryLabel}</span>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(pred.createdAt), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </ScrollArea>
    </Card>
  );
}
