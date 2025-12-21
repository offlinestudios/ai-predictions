import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  Loader2, Paperclip, ArrowUp, X, Plus, Sparkles, Calendar, Lock, Zap
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface ChatComposerProps {
  onSubmit: (question: string, files: File[], deepMode: boolean, trajectoryType: string) => void;
  isLoading: boolean;
  disabled?: boolean;
  sidebarCollapsed?: boolean;
  subscription?: {
    tier: string;
    dailyLimit: number;
    usedToday: number;
    totalUsed: number;
  } | null;
  onUpgradeClick?: () => void;
  actualPredictionCount?: number; // Accurate count of root predictions (not follow-ups)
  isDataLoaded?: boolean; // Whether prediction history has loaded
}

type TrajectoryType = "instant" | "30day" | "90day" | "yearly";

const TRAJECTORY_OPTIONS: { id: TrajectoryType; label: string; description: string; minTier: string }[] = [
  { id: "instant", label: "Instant", description: "Immediate insight", minTier: "free" },
  { id: "30day", label: "30-Day Forecast", description: "Monthly trajectory", minTier: "plus" },
  { id: "90day", label: "90-Day Forecast", description: "Quarterly outlook", minTier: "pro" },
  { id: "yearly", label: "Yearly Forecast", description: "Annual vision", minTier: "premium" },
];

const TIER_HIERARCHY = ["free", "plus", "pro", "premium"];

export default function ChatComposer({ 
  onSubmit, 
  isLoading, 
  disabled, 
  sidebarCollapsed = false,
  subscription,
  onUpgradeClick,
  actualPredictionCount = 0,
  isDataLoaded = false
}: ChatComposerProps) {
  const [question, setQuestion] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [deepMode, setDeepMode] = useState(false);
  const [trajectoryType, setTrajectoryType] = useState<TrajectoryType>("instant");
  const [showOptions, setShowOptions] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentTier = subscription?.tier || "free";
  const currentTierIndex = TIER_HIERARCHY.indexOf(currentTier);

  const isFeatureAvailable = (minTier: string) => {
    const minTierIndex = TIER_HIERARCHY.indexOf(minTier);
    return currentTierIndex >= minTierIndex;
  };

  const canUseDeepMode = isFeatureAvailable("plus");
  const hasActiveFeatures = (deepMode && canUseDeepMode) || trajectoryType !== "instant";

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [question]);

  const handleSubmit = () => {
    if (!question.trim() || isLoading || disabled) return;
    
    if (question.length > 1000) {
      toast.error("Your prediction question is too long. Please keep it under 1000 characters.");
      return;
    }
    
    onSubmit(question, files, deepMode && canUseDeepMode, trajectoryType);
    setQuestion("");
    setFiles([]);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleDeepModeToggle = () => {
    if (!canUseDeepMode) {
      toast.info("Deep Mode requires Plus subscription", {
        action: onUpgradeClick ? { label: "Upgrade", onClick: onUpgradeClick } : undefined
      });
      return;
    }
    setDeepMode(!deepMode);
  };

  const handleTrajectorySelect = (trajectory: TrajectoryType) => {
    const option = TRAJECTORY_OPTIONS.find(t => t.id === trajectory);
    if (!option) return;

    if (!isFeatureAvailable(option.minTier)) {
      const tierName = option.minTier.charAt(0).toUpperCase() + option.minTier.slice(1);
      toast.info(`${option.label} requires ${tierName} subscription`, {
        action: onUpgradeClick ? { label: "Upgrade", onClick: onUpgradeClick } : undefined
      });
      return;
    }
    setTrajectoryType(trajectory);
  };

  const currentTrajectory = TRAJECTORY_OPTIONS.find(t => t.id === trajectoryType);
  
  // Check if free tier limit reached - only when data is loaded AND count >= 3
  const hasReachedFreeLimit = subscription?.tier === "free" && isDataLoaded && actualPredictionCount >= 3;

  return (
    <div className={`fixed left-0 right-0 z-40 bg-background/95 backdrop-blur-sm pb-safe bottom-0 transition-all duration-300 ${sidebarCollapsed ? 'lg:left-16' : 'lg:left-80'}`}>
      <div className="container max-w-4xl py-3 md:py-4">
        {/* Free Limit Reached Message */}
        {hasReachedFreeLimit && (
          <div className="mb-3 p-4 rounded-xl bg-primary/10 border border-primary/20 text-center">
            <p className="text-sm text-muted-foreground mb-2">
              You've used all 3 free predictions
            </p>
            <Button
              onClick={onUpgradeClick}
              size="sm"
              className="bg-primary hover:bg-primary/90"
            >
              <Zap className="w-4 h-4 mr-2" />
              Unlock Unlimited Predictions
            </Button>
          </div>
        )}
        {/* File Previews */}
        {files.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {files.map((file, index) => (
              <div key={index} className="flex items-center gap-2 px-3 py-1.5 bg-muted rounded-full text-sm">
                <Paperclip className="w-3 h-3" />
                <span className="max-w-[120px] truncate">{file.name}</span>
                <button onClick={() => removeFile(index)} className="hover:text-destructive" disabled={isLoading}>
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Active Features Pills */}
        {hasActiveFeatures && (
          <div className="flex flex-wrap gap-2 mb-3">
            {deepMode && canUseDeepMode && (
              <button
                onClick={() => setDeepMode(false)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/15 text-primary rounded-full text-xs font-medium hover:bg-primary/25 transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Deep Mode
                <X className="w-3 h-3 ml-1 opacity-60" />
              </button>
            )}
            {trajectoryType !== "instant" && (
              <button
                onClick={() => setTrajectoryType("instant")}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/15 text-primary rounded-full text-xs font-medium hover:bg-primary/25 transition-colors"
              >
                <Calendar className="w-3.5 h-3.5" />
                {currentTrajectory?.label}
                <X className="w-3 h-3 ml-1 opacity-60" />
              </button>
            )}
          </div>
        )}

        {/* Main Composer - Manus Style */}
        <div className="relative w-full">
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*,.pdf,.doc,.docx"
            onChange={handleFileSelect}
            className="hidden"
          />
          
          {/* Composer Container - Single rounded border like Manus */}
          <div className="flex items-end gap-0 rounded-[20px] border border-border bg-card/80 backdrop-blur-sm p-1.5 shadow-md ring-1 ring-border/20">
            {/* Plus Button - Manus style: circle with border */}
            <Popover open={showOptions} onOpenChange={setShowOptions}>
              <PopoverTrigger asChild>
                <button
                  className={cn(
                    "h-9 w-9 rounded-full flex items-center justify-center border border-border/60 transition-all shrink-0",
                    "hover:bg-accent hover:border-border",
                    showOptions && "bg-accent border-border rotate-45"
                  )}
                  disabled={isLoading || disabled}
                >
                  <Plus className="w-4 h-4" />
                </button>
              </PopoverTrigger>
              <PopoverContent 
                align="start" 
                side="top" 
                sideOffset={8}
                className="w-64 p-0 rounded-2xl border border-border/60 bg-card shadow-lg"
              >
                {/* Deep Mode */}
                <div className="p-3">
                  <button
                    onClick={() => {
                      handleDeepModeToggle();
                      if (canUseDeepMode) setShowOptions(false);
                    }}
                    className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-accent transition-colors"
                  >
                    <div className={cn(
                      "h-8 w-8 rounded-lg flex items-center justify-center",
                      deepMode && canUseDeepMode ? "bg-primary text-primary-foreground" : "bg-muted"
                    )}>
                      {canUseDeepMode ? (
                        <Sparkles className="w-4 h-4" />
                      ) : (
                        <Lock className="w-4 h-4 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex-1 text-left">
                      <div className="font-medium text-sm">Deep Mode</div>
                      <div className="text-xs text-muted-foreground">Detailed analysis</div>
                    </div>
                    {!canUseDeepMode && (
                      <span className="text-[10px] bg-primary/20 text-primary px-2 py-0.5 rounded-full font-medium">Plus</span>
                    )}
                    {deepMode && canUseDeepMode && (
                      <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                        <span className="text-primary-foreground text-xs">✓</span>
                      </div>
                    )}
                  </button>
                </div>

                <div className="h-px bg-border/60 mx-3" />

                {/* Forecast Timeframe */}
                <div className="p-3">
                  <div className="text-xs font-medium text-muted-foreground mb-2 px-2">Forecast</div>
                  {TRAJECTORY_OPTIONS.map((option) => {
                    const isAvailable = isFeatureAvailable(option.minTier);
                    const isSelected = trajectoryType === option.id;
                    
                    return (
                      <button
                        key={option.id}
                        onClick={() => {
                          handleTrajectorySelect(option.id);
                          if (isAvailable) setShowOptions(false);
                        }}
                        className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-accent transition-colors"
                      >
                        <div className={cn(
                          "h-8 w-8 rounded-lg flex items-center justify-center",
                          isSelected && isAvailable ? "bg-primary text-primary-foreground" : "bg-muted"
                        )}>
                          {isAvailable ? (
                            option.id === "instant" ? <Zap className="w-4 h-4" /> : <Calendar className="w-4 h-4" />
                          ) : (
                            <Lock className="w-4 h-4 text-muted-foreground" />
                          )}
                        </div>
                        <div className="flex-1 text-left">
                          <div className={cn("font-medium text-sm", !isAvailable && "text-muted-foreground")}>
                            {option.label}
                          </div>
                        </div>
                        {!isAvailable && (
                          <span className="text-[10px] bg-primary/20 text-primary px-2 py-0.5 rounded-full font-medium capitalize">
                            {option.minTier}
                          </span>
                        )}
                        {isSelected && isAvailable && (
                          <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                            <span className="text-primary-foreground text-xs">✓</span>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>

                <div className="h-px bg-border/60 mx-3" />

                {/* Attach Files */}
                <div className="p-3">
                  <button
                    onClick={() => {
                      fileInputRef.current?.click();
                      setShowOptions(false);
                    }}
                    className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-accent transition-colors"
                  >
                    <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center">
                      <Paperclip className="w-4 h-4" />
                    </div>
                    <span className="font-medium text-sm">Attach Files</span>
                  </button>
                </div>
              </PopoverContent>
            </Popover>

            {/* Textarea */}
            <div className="flex-1 min-w-0 ml-1.5">
              <Textarea
                ref={textareaRef}
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Predict anything"
                disabled={isLoading || disabled}
                className="min-h-[36px] max-h-[120px] resize-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 py-2 px-3 text-sm placeholder:text-muted-foreground bg-transparent"
                rows={1}
              />
            </div>
            
            {/* Send Button - Manus style: solid purple circle */}
            <Button
              onClick={handleSubmit}
              disabled={!question.trim() || isLoading || disabled}
              size="icon"
              className="h-9 w-9 rounded-full shrink-0"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <ArrowUp className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
