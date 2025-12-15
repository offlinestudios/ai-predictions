import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Settings, LogOut, ChevronRight, ChevronLeft, BarChart3, SquarePen, Search, MoreHorizontal, Share2, Star, ExternalLink, Trash2 } from "lucide-react";
import { Link } from "wouter";
import { useClerk } from "@clerk/clerk-react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { 
  Briefcase, 
  Heart, 
  DollarSign, 
  Activity, 
  MessageCircle
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";

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
  general: { icon: MessageCircle, color: "text-purple-500", bg: "bg-purple-500/10" },
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
  const [searchQuery, setSearchQuery] = useState("");
  
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
      window.location.reload();
    }
  };

  const { data: historyData, isLoading } = trpc.prediction.getHistory.useQuery(
    { limit: 50 },
    { 
      enabled: isAuthenticated,
      refetchInterval: 30000 
    }
  );

  const predictions = historyData?.predictions || [];
  
  // Filter predictions based on search query
  const filteredPredictions = predictions.filter(pred =>
    pred.userInput.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleShare = (predId: number) => {
    // TODO: Implement share functionality
    console.log("Share prediction:", predId);
  };

  const handleRename = (predId: number) => {
    // TODO: Implement rename functionality
    console.log("Rename prediction:", predId);
  };

  const handleAddToFavorites = (predId: number) => {
    // TODO: Implement favorites functionality
    console.log("Add to favorites:", predId);
  };

  const handleOpenInNewTab = (predId: number) => {
    window.open(`/prediction/${predId}`, '_blank');
  };

  const handleDelete = (predId: number) => {
    // TODO: Implement delete functionality
    console.log("Delete prediction:", predId);
  };

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
          {onCollapsedChange && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleCollapsedChange(true)}
              className="h-8 w-8 flex-shrink-0 hidden lg:flex"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      {/* New Prediction Button - Manus Style */}
      <div className="p-4 border-b border-border/50">
        <Button 
          onClick={handleNewPrediction}
          className="w-full justify-start"
          variant="ghost"
          size="lg"
        >
          <SquarePen className="w-4 h-4 mr-3" />
          <span className="text-base">New Prediction</span>
        </Button>
      </div>

      {/* Search Bar */}
      <div className="px-4 py-3 border-b border-border/50">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search predictions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9"
          />
        </div>
      </div>

      {/* Prediction History Section */}
      <div className="flex-1 overflow-hidden flex flex-col">
        <div className="px-4 py-3">
          <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Recent Predictions</h2>
        </div>

        <ScrollArea className="flex-1">
          <div className="px-2 pb-4 space-y-1">
            {isLoading ? (
              <p className="text-sm text-muted-foreground px-4 py-2">Loading...</p>
            ) : filteredPredictions.length === 0 ? (
              <p className="text-sm text-muted-foreground px-4 py-2">
                {searchQuery ? "No predictions found" : "No predictions yet"}
              </p>
            ) : (
              filteredPredictions.map((pred) => {
                const category = pred.category as keyof typeof categoryIcons || "general";
                const { icon: Icon } = categoryIcons[category] || categoryIcons.general;
                const isActive = pred.id === currentPredictionId;

                return (
                  <div
                    key={pred.id}
                    className={`group relative flex items-center gap-2 px-2 py-1.5 rounded-lg transition-colors ${
                      isActive
                        ? "bg-accent"
                        : "hover:bg-accent/50"
                    }`}
                  >
                    {/* Main clickable row (icon + truncated text) */}
                    <button
                      type="button"
                      onClick={() => onSelectPrediction?.(pred)}
                      className="flex w-full min-w-0 items-center gap-2 text-left pr-9"
                    >
                      <Icon className="w-4 h-4 flex-shrink-0 text-muted-foreground" />
                      <span className="truncate text-sm flex-1">
                        {pred.userInput}
                      </span>
                    </button>

                    {/* Context Menu (3-dot) - Absolutely positioned */}
                    <div className="absolute right-1 top-1/2 -translate-y-1/2">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            aria-label="Prediction actions"
                            className="h-7 w-7 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 focus:opacity-100 transition-opacity"
                          >
                            <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem onClick={() => handleShare(pred.id)}>
                            <Share2 className="w-4 h-4 mr-2" />
                            Share
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleRename(pred.id)}>
                            <SquarePen className="w-4 h-4 mr-2" />
                            Rename
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleAddToFavorites(pred.id)}>
                            <Star className="w-4 h-4 mr-2" />
                            Add to favorites
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleOpenInNewTab(pred.id)}>
                            <ExternalLink className="w-4 h-4 mr-2" />
                            Open in new tab
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleDelete(pred.id)}
                            className="text-destructive focus:text-destructive"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Navigation Buttons */}
      <div className="border-t border-border/50">
        <div className="p-2 space-y-1">
          {subscription && ['pro', 'premium'].includes(subscription.tier) && (
            <Link href="/analytics">
              <Button variant="ghost" className="w-full justify-start" size="sm">
                <BarChart3 className="w-4 h-4 mr-3" />
                Analytics
              </Button>
            </Link>
          )}
          
          <Link href="/account">
            <Button variant="ghost" className="w-full justify-start" size="sm">
              <Settings className="w-4 h-4 mr-3" />
              Account Settings
            </Button>
          </Link>

          <Button
            variant="ghost"
            className="w-full justify-start"
            size="sm"
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
