import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Settings, LogOut, Clock, ChevronRight, Plus, X, ChevronLeft } from "lucide-react";
import { Link } from "wouter";
import { useClerk } from "@clerk/clerk-react";
import { useLocation } from "wouter";
import { TierBadge } from "@/components/Badge";
import { trpc } from "@/lib/trpc";
import { 
  Briefcase, 
  Heart, 
  DollarSign, 
  Activity, 
  Sparkles
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface UnifiedSidebarProps {
  user?: {
    name?: string | null;
    email?: string | null;
  };
  subscription?: {
    tier: "free" | "plus" | "pro" | "premium";
  };
  onSelectPrediction?: (prediction: {
    id: number;
    predictionResult: string;
    shareToken: string | null;
    userFeedback: string | null;
    confidenceScore: number | null;
    trajectoryType: string | null;
  }) => void;
  currentPredictionId?: number | null;
  isAuthenticated: boolean;
  className?: string;
  onNewPrediction?: () => void;
  isCollapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
}

const categoryIcons = {
  career: { icon: Briefcase, color: "text-purple-500", bg: "bg-purple-500/10" },
  love: { icon: Heart, color: "text-purple-500", bg: "bg-purple-500/10" },
  finance: { icon: DollarSign, color: "text-purple-500", bg: "bg-purple-500/10" },
  health: { icon: Activity, color: "text-purple-500", bg: "bg-purple-500/10" },
  general: { icon: Sparkles, color: "text-purple-500", bg: "bg-purple-500/10" },
};

const trajectoryLabels = {
  instant: "Instant",
  "30day": "30-Day",
  "90day": "90-Day",
  yearly: "Yearly",
};

export default function UnifiedSidebar({ 
  user, 
  subscription, 
  onSelectPrediction,
  currentPredictionId,
  isAuthenticated,
  className = "",
  onNewPrediction,
  isCollapsed = false,
  onCollapsedChange
}: UnifiedSidebarProps) {
  const { signOut } = useClerk();
  const [, navigate] = useLocation();
  
  const handleCollapsedChange = (collapsed: boolean) => {
    if (onCollapsedChange) {
      onCollapsedChange(collapsed);
    }
  };

  const handleSignOut = () => {
    signOut(() => navigate("/"));
  };

  const handleNewPrediction = () => {
    if (onNewPrediction) {
      onNewPrediction();
    } else {
      // Reload the page to start fresh
      window.location.reload();
    }
  };

  const { data: historyData, isLoading } = trpc.prediction.getHistory.useQuery(
    { limit: 10 },
    { 
      enabled: isAuthenticated,
      refetchInterval: 30000 
    }
  );

  const predictions = historyData?.predictions || [];

  if (!isAuthenticated) {
    return null;
  }

  if (isCollapsed) {
    return (
      <aside className={`flex flex-col h-full bg-card/50 backdrop-blur-sm border-r border-border/50 w-16 ${className}`}>
        <div className="p-4 border-b border-border/50 flex justify-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleCollapsedChange(false)}
            className="w-8 h-8"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </aside>
    );
  }

  return (
    <aside className={`flex flex-col h-full bg-card/50 backdrop-blur-sm border-r border-border/50 ${className}`}>
      {/* Logo and Title */}
      <div className="p-6 border-b border-border/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo.svg" alt="Predicsure AI" className="w-10 h-10 object-contain" />
            <div>
              <h1 className="text-lg font-bold">Predicsure AI</h1>
              <p className="text-xs text-muted-foreground">AI Predictions</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleCollapsedChange(true)}
            className="h-8 w-8 flex-shrink-0"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* New Prediction Button */}
      <div className="p-4 border-b border-border/50">
        <Button 
          onClick={handleNewPrediction}
          className="w-full justify-start"
          variant="default"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Prediction
        </Button>
      </div>

      {/* Prediction History Section */}
      <div className="flex-1 overflow-hidden flex flex-col">
        <div className="px-4 py-3 border-b border-border/50">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-primary" />
            <h2 className="text-sm font-semibold">Recent Predictions</h2>
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-4 space-y-2">
            {isLoading ? (
              <p className="text-sm text-muted-foreground">Loading...</p>
            ) : predictions.length === 0 ? (
              <p className="text-sm text-muted-foreground">No predictions yet</p>
            ) : (
              predictions.map((pred) => {
                const category = pred.category as keyof typeof categoryIcons || "general";
                const { icon: Icon, color, bg } = categoryIcons[category] || categoryIcons.general;
                const trajectory = pred.trajectoryType as keyof typeof trajectoryLabels || "instant";
                const isActive = pred.id === currentPredictionId;

                return (
                  <button
                    key={pred.id}
                    onClick={() => onSelectPrediction?.(pred)}
                    className={`w-full text-left p-3 rounded-lg border transition-all group ${
                      isActive
                        ? "border-primary bg-primary/5"
                        : "border-border/50 hover:border-primary/50 hover:bg-accent/50"
                    }`}
                  >
                    {/* Category Badge */}
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-secondary/30">
                        <Icon className="w-3 h-3 text-muted-foreground" />
                        <span className="text-[10px] font-medium capitalize text-muted-foreground">{category}</span>
                      </div>
                      <ChevronRight className="w-3 h-3 text-muted-foreground group-hover:text-foreground transition-colors" />
                    </div>

                    {/* Question Text - Prominent */}
                    <p className="text-sm font-medium line-clamp-2 mb-2">
                      {pred.userInput}
                    </p>

                    {/* Timestamp */}
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(pred.createdAt), { addSuffix: true })}
                    </p>
                  </button>
                );
              })
            )}
          </div>
        </ScrollArea>
      </div>

      {/* User Info + Navigation */}
      <div className="border-t border-border/50">
        {/* User Info Section */}
        <div className="p-4 border-b border-border/50">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <span className="text-sm font-semibold text-primary">
                {user?.name?.charAt(0) || user?.email?.charAt(0) || "U"}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user?.name || "User"}</p>
              <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
              {subscription && (
                <div className="mt-2">
                  <TierBadge tier={subscription.tier} size="sm" />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="p-4 space-y-2">
          <Link href="/account">
            <Button variant="ghost" className="w-full justify-start">
              <Settings className="w-4 h-4 mr-3" />
              Account Settings
            </Button>
          </Link>

        <Button
          variant="ghost"
          className="w-full justify-start"
          onClick={handleSignOut}
        >
          <LogOut className="w-4 h-4 mr-3" />
          Logout
        </Button>
        </div>
      </div>
    </aside>
  );
}
