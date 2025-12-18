import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Settings, LogOut, ChevronRight, ChevronLeft, BarChart3, SquarePen, Search, MoreHorizontal, Share2, Trash2, Check, X } from "lucide-react";
import { Link } from "wouter";
import { useClerk } from "@clerk/clerk-react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

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
  const [renamingId, setRenamingId] = useState<number | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const utils = trpc.useUtils();
  
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

  // Delete mutation
  const deleteMutation = trpc.prediction.delete.useMutation({
    onSuccess: () => {
      toast.success("Prediction deleted");
      utils.prediction.getHistory.invalidate();
      setDeleteDialogOpen(false);
      setDeletingId(null);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete prediction");
    }
  });

  // Rename mutation
  const renameMutation = trpc.prediction.rename.useMutation({
    onSuccess: () => {
      toast.success("Prediction renamed");
      utils.prediction.getHistory.invalidate();
      setRenamingId(null);
      setRenameValue("");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to rename prediction");
    }
  });

  const predictions = historyData?.predictions || [];
  
  // Pure JavaScript text truncation - bypasses CSS entirely
  // 32 chars default - text retracts on hover to show dropdown
  const truncateText = (text: string, maxChars: number = 32): string => {
    if (text.length <= maxChars) return text;
    return text.substring(0, maxChars).trim() + '...';
  };
  
  // Filter predictions based on search query
  const filteredPredictions = predictions.filter(pred =>
    pred.userInput.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleShare = (pred: typeof predictions[0]) => {
    if (pred.shareToken) {
      const shareUrl = `${window.location.origin}/share/${pred.shareToken}`;
      navigator.clipboard.writeText(shareUrl);
      toast.success("Share link copied to clipboard!");
    } else {
      toast.error("Share link not available");
    }
  };

  const handleStartRename = (pred: typeof predictions[0]) => {
    setRenamingId(pred.id);
    setRenameValue(pred.userInput);
  };

  const handleSaveRename = () => {
    if (renamingId && renameValue.trim()) {
      renameMutation.mutate({
        predictionId: renamingId,
        newTitle: renameValue.trim()
      });
    }
  };

  const handleCancelRename = () => {
    setRenamingId(null);
    setRenameValue("");
  };

  const handleDeleteClick = (id: number) => {
    setDeletingId(id);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deletingId) {
      deleteMutation.mutate({ predictionId: deletingId });
    }
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
            className="pl-9 h-9 bg-muted/50"
          />
        </div>
      </div>

      {/* Prediction History - Timeline View */}
      <div className="flex-1 overflow-hidden flex flex-col">
        <div className="px-4 py-3">
          <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Recent Predictions</h2>
        </div>

        <ScrollArea className="flex-1">
          <div className="px-4 pb-4">
            {isLoading ? (
              <p className="text-sm text-muted-foreground py-2">Loading...</p>
            ) : filteredPredictions.length === 0 ? (
              <p className="text-sm text-muted-foreground py-2">
                {searchQuery ? "No predictions found" : "No predictions yet"}
              </p>
            ) : (
              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-[7px] top-3 bottom-3 w-0.5 bg-border" />
                
                {filteredPredictions.map((pred, index) => {
                  const isActive = pred.id === currentPredictionId;
                  const isRenaming = renamingId === pred.id;
                  const predDate = new Date(pred.createdAt);
                  const isToday = new Date().toDateString() === predDate.toDateString();
                  const timeStr = predDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                  const dateStr = isToday ? 'Today' : predDate.toLocaleDateString([], { month: 'short', day: 'numeric' });

                  return (
                    <div
                      key={pred.id}
                      className="relative pl-6 pb-4 last:pb-0 group"
                    >
                      {/* Timeline dot */}
                      <div 
                        className={`absolute left-0 top-1.5 w-4 h-4 rounded-full border-2 transition-colors ${
                          isActive 
                            ? 'bg-primary border-primary' 
                            : 'bg-background border-muted-foreground/30 group-hover:border-primary/50'
                        }`}
                      />
                      
                      {isRenaming ? (
                        <div className="flex items-center gap-1">
                          <Input
                            value={renameValue}
                            onChange={(e) => setRenameValue(e.target.value)}
                            className="h-8 text-sm flex-1"
                            autoFocus
                            onKeyDown={(e) => {
                              if (e.key === "Enter") handleSaveRename();
                              if (e.key === "Escape") handleCancelRename();
                            }}
                          />
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-7 w-7 flex-shrink-0"
                            onClick={handleSaveRename}
                            disabled={renameMutation.isPending}
                          >
                            <Check className="w-3.5 h-3.5 text-green-500" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-7 w-7 flex-shrink-0"
                            onClick={handleCancelRename}
                          >
                            <X className="w-3.5 h-3.5 text-red-500" />
                          </Button>
                        </div>
                      ) : (
                        <div 
                          className={`rounded-lg p-2 cursor-pointer transition-colors ${
                            isActive ? 'bg-accent' : 'hover:bg-accent/50'
                          }`}
                          onClick={() => onSelectPrediction?.(pred)}
                        >
                          {/* Date/Time */}
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs text-muted-foreground">
                              {dateStr} · {timeStr}
                            </span>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  aria-label="Prediction actions"
                                  className="h-6 w-6 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <MoreHorizontal className="w-3.5 h-3.5 text-muted-foreground" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" sideOffset={5} className="w-48 z-50">
                                <DropdownMenuItem onSelect={() => handleShare(pred)}>
                                  <Share2 className="w-4 h-4 mr-2" />
                                  Share
                                </DropdownMenuItem>
                                <DropdownMenuItem onSelect={() => handleStartRename(pred)}>
                                  <SquarePen className="w-4 h-4 mr-2" />
                                  Rename
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  onSelect={() => handleDeleteClick(pred.id)}
                                  className="text-destructive focus:text-destructive"
                                >
                                  <Trash2 className="w-4 h-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                          
                          {/* Prediction text - 2 lines max */}
                          <p className="text-sm line-clamp-2 leading-snug">
                            {pred.userInput}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Bottom Section */}
      <div className="border-t border-border/50 p-4 space-y-2">
        <Link href="/analytics">
          <Button variant="ghost" className="w-full justify-start" size="sm">
            <BarChart3 className="w-4 h-4 mr-3" />
            Analytics
          </Button>
        </Link>
        <Link href="/account">
          <Button variant="ghost" className="w-full justify-start" size="sm">
            <Settings className="w-4 h-4 mr-3" />
            Settings
          </Button>
        </Link>
        <Button 
          variant="ghost" 
          className="w-full justify-start text-muted-foreground hover:text-foreground" 
          size="sm"
          onClick={handleSignOut}
        >
          <LogOut className="w-4 h-4 mr-3" />
          Sign Out
        </Button>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Prediction</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this prediction? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </aside>
  );
}
