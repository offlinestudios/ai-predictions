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
  
  // Helper function to truncate text with ellipsis at word boundary (Manus/ChatGPT style)
  const truncateText = (text: string, maxLength: number = 38): string => {
    if (text.length <= maxLength) return text;
    // Find the last space before maxLength to truncate at word boundary
    const truncated = text.substring(0, maxLength);
    const lastSpace = truncated.lastIndexOf(' ');
    // If there's a space and it's not too far back, truncate at word boundary
    if (lastSpace > maxLength * 0.6) {
      return truncated.substring(0, lastSpace) + '...';
    }
    return truncated.trim() + '...';
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

  const handleDeleteClick = (predId: number) => {
    setDeletingId(predId);
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
          <div className="px-2 pb-4 space-y-0.5">
            {isLoading ? (
              <p className="text-sm text-muted-foreground px-4 py-2">Loading...</p>
            ) : filteredPredictions.length === 0 ? (
              <p className="text-sm text-muted-foreground px-4 py-2">
                {searchQuery ? "No predictions found" : "No predictions yet"}
              </p>
            ) : (
              filteredPredictions.map((pred) => {
                const isActive = pred.id === currentPredictionId;
                const isRenaming = renamingId === pred.id;

                return (
                  <div
                    key={pred.id}
                    className={`group relative rounded-lg transition-colors ${
                      isActive
                        ? "bg-accent"
                        : "hover:bg-accent/50"
                    }`}
                  >
                    {isRenaming ? (
                      <div className="flex items-center gap-1 px-2 py-1.5">
                        <Input
                          value={renameValue}
                          onChange={(e) => setRenameValue(e.target.value)}
                          className="h-7 text-sm flex-1"
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
                      <div className="flex items-center h-9">
                        <button
                          type="button"
                          onClick={() => onSelectPrediction?.(pred)}
                          className="flex-1 px-3 py-2 text-left"
                        >
                          <span className="text-sm leading-tight">
                            {truncateText(pred.userInput, 38)}
                          </span>
                        </button>

                        <div className="pr-2">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                aria-label="Prediction actions"
                                className="h-6 w-6 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity"
                              >
                                <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
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
                      </div>
                    )}
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
