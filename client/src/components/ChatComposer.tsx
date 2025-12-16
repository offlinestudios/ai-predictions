import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Paperclip, ArrowUp, X, Plus, Sparkles, Calendar, Lock, Zap, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ChatComposerProps {
  onSubmit: (question: string, category: string, files: File[], deepMode: boolean, trajectoryType: string) => void;
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
}

type TrajectoryType = "instant" | "30day" | "90day" | "yearly";

const TRAJECTORY_OPTIONS: { id: TrajectoryType; label: string; description: string; minTier: string }[] = [
  { id: "instant", label: "Instant", description: "Immediate insight", minTier: "free" },
  { id: "30day", label: "30-Day Forecast", description: "Monthly trajectory", minTier: "plus" },
  { id: "90day", label: "90-Day Forecast", description: "Quarterly outlook", minTier: "pro" },
  { id: "yearly", label: "Yearly Forecast", description: "Annual vision", minTier: "premium" },
];

const CATEGORY_OPTIONS = [
  { id: "general", label: "General", icon: "💭" },
  { id: "career", label: "Career", icon: "💼" },
  { id: "relationships", label: "Relationships", icon: "❤️" },
  { id: "finance", label: "Finance", icon: "💰" },
  { id: "health", label: "Health", icon: "🏃" },
  { id: "sports", label: "Sports", icon: "🏆" },
  { id: "stocks", label: "Stocks", icon: "📈" },
];

const TIER_HIERARCHY = ["free", "plus", "pro", "premium"];

export default function ChatComposer({ 
  onSubmit, 
  isLoading, 
  disabled, 
  sidebarCollapsed = false,
  subscription,
  onUpgradeClick
}: ChatComposerProps) {
  const [question, setQuestion] = useState("");
  const [category, setCategory] = useState("relationships");
  const [files, setFiles] = useState<File[]>([]);
  const [deepMode, setDeepMode] = useState(false);
  const [trajectoryType, setTrajectoryType] = useState<TrajectoryType>("instant");
  const [showOptions, setShowOptions] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentTier = subscription?.tier || "free";
  const currentTierIndex = TIER_HIERARCHY.indexOf(currentTier);

  // Check if a feature is available for the current tier
  const isFeatureAvailable = (minTier: string) => {
    const minTierIndex = TIER_HIERARCHY.indexOf(minTier);
    return currentTierIndex >= minTierIndex;
  };

  // Deep mode requires Plus or higher
  const canUseDeepMode = isFeatureAvailable("plus");

  // Check if any premium features are active
  const hasActiveFeatures = (deepMode && canUseDeepMode) || trajectoryType !== "instant";

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [question]);

  const handleSubmit = () => {
    if (!question.trim() || isLoading || disabled) return;
    
    // Check character limit
    if (question.length > 1000) {
      toast.error("Your prediction question is too long. Please keep it under 1000 characters.");
      return;
    }
    
    onSubmit(question, category, files, deepMode && canUseDeepMode, trajectoryType);
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
        action: onUpgradeClick ? {
          label: "Upgrade",
          onClick: onUpgradeClick
        } : undefined
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
        action: onUpgradeClick ? {
          label: "Upgrade",
          onClick: onUpgradeClick
        } : undefined
      });
      return;
    }
    setTrajectoryType(trajectory);
  };

  const currentCategory = CATEGORY_OPTIONS.find(c => c.id === category);
  const currentTrajectory = TRAJECTORY_OPTIONS.find(t => t.id === trajectoryType);

  return (
    <div className={`fixed left-0 right-0 z-40 bg-background/95 backdrop-blur-sm border-t border-border/50 pb-safe bottom-0 transition-all duration-300 ${sidebarCollapsed ? 'lg:left-16' : 'lg:left-80'}`}>
      <div className="container max-w-4xl py-3 md:py-4">
        {/* File Previews */}
        {files.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-2">
            {files.map((file, index) => (
              <div
                key={index}
                className="flex items-center gap-2 px-3 py-1.5 bg-accent/50 rounded-full text-sm"
              >
                <Paperclip className="w-3 h-3" />
                <span className="max-w-[120px] truncate">{file.name}</span>
                <button
                  onClick={() => removeFile(index)}
                  className="hover:text-destructive"
                  disabled={isLoading}
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Active Features Pills - Only show when features are active */}
        {hasActiveFeatures && (
          <div className="flex flex-wrap gap-2 mb-2">
            {deepMode && canUseDeepMode && (
              <button
                onClick={() => setDeepMode(false)}
                className="flex items-center gap-1.5 px-2.5 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium hover:bg-primary/20 transition-colors"
              >
                <Sparkles className="w-3 h-3" />
                Deep Mode
                <X className="w-3 h-3 ml-0.5" />
              </button>
            )}
            {trajectoryType !== "instant" && (
              <button
                onClick={() => setTrajectoryType("instant")}
                className="flex items-center gap-1.5 px-2.5 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium hover:bg-primary/20 transition-colors"
              >
                <Calendar className="w-3 h-3" />
                {currentTrajectory?.label}
                <X className="w-3 h-3 ml-0.5" />
              </button>
            )}
          </div>
        )}

        {/* Composer Bar */}
        <div className="relative w-full">
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*,.pdf,.doc,.docx"
            onChange={handleFileSelect}
            className="hidden"
          />
          
          <div className="relative flex items-end gap-2">
            {/* Plus Button - Opens Options Menu */}
            <DropdownMenu open={showOptions} onOpenChange={setShowOptions}>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "h-10 w-10 rounded-full shrink-0 transition-all",
                    showOptions ? "bg-accent rotate-45" : "hover:bg-accent",
                    hasActiveFeatures && "ring-2 ring-primary ring-offset-2 ring-offset-background"
                  )}
                  disabled={isLoading || disabled}
                >
                  <Plus className="w-5 h-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-64">
                {/* Category Selection */}
                <DropdownMenuLabel className="text-xs text-muted-foreground">Category</DropdownMenuLabel>
                <div className="grid grid-cols-4 gap-1 p-2">
                  {CATEGORY_OPTIONS.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => {
                        setCategory(cat.id);
                      }}
                      className={cn(
                        "flex flex-col items-center gap-1 p-2 rounded-lg text-xs transition-colors",
                        category === cat.id 
                          ? "bg-primary text-primary-foreground" 
                          : "hover:bg-accent"
                      )}
                    >
                      <span className="text-base">{cat.icon}</span>
                      <span className="truncate w-full text-center">{cat.label}</span>
                    </button>
                  ))}
                </div>

                <DropdownMenuSeparator />

                {/* Deep Mode Toggle */}
                <DropdownMenuLabel className="text-xs text-muted-foreground">Analysis Mode</DropdownMenuLabel>
                <DropdownMenuItem
                  onClick={handleDeepModeToggle}
                  className="cursor-pointer"
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-2">
                      {canUseDeepMode ? (
                        <Sparkles className="w-4 h-4 text-primary" />
                      ) : (
                        <Lock className="w-4 h-4 text-muted-foreground" />
                      )}
                      <div>
                        <div className="font-medium">Deep Mode</div>
                        <div className="text-xs text-muted-foreground">Detailed analysis & scenarios</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {!canUseDeepMode && (
                        <span className="text-[10px] bg-amber-500/20 text-amber-600 px-1.5 py-0.5 rounded">Plus</span>
                      )}
                      <div className={cn(
                        "w-4 h-4 rounded border-2 flex items-center justify-center",
                        deepMode && canUseDeepMode ? "bg-primary border-primary" : "border-muted-foreground/30"
                      )}>
                        {deepMode && canUseDeepMode && <span className="text-primary-foreground text-xs">✓</span>}
                      </div>
                    </div>
                  </div>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                {/* Trajectory Options */}
                <DropdownMenuLabel className="text-xs text-muted-foreground">Forecast Timeframe</DropdownMenuLabel>
                {TRAJECTORY_OPTIONS.map((option) => {
                  const isAvailable = isFeatureAvailable(option.minTier);
                  const isSelected = trajectoryType === option.id;
                  
                  return (
                    <DropdownMenuItem
                      key={option.id}
                      onClick={() => handleTrajectorySelect(option.id)}
                      className="cursor-pointer"
                    >
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-2">
                          {isAvailable ? (
                            option.id === "instant" ? <Zap className="w-4 h-4" /> : <Calendar className="w-4 h-4" />
                          ) : (
                            <Lock className="w-4 h-4 text-muted-foreground" />
                          )}
                          <div>
                            <div className={cn("font-medium", !isAvailable && "text-muted-foreground")}>{option.label}</div>
                            <div className="text-xs text-muted-foreground">{option.description}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {!isAvailable && (
                            <span className="text-[10px] bg-amber-500/20 text-amber-600 px-1.5 py-0.5 rounded capitalize">{option.minTier}</span>
                          )}
                          {isSelected && isAvailable && (
                            <span className="text-primary">✓</span>
                          )}
                        </div>
                      </div>
                    </DropdownMenuItem>
                  );
                })}

                <DropdownMenuSeparator />

                {/* File Upload */}
                <DropdownMenuItem
                  onClick={() => {
                    fileInputRef.current?.click();
                    setShowOptions(false);
                  }}
                  className="cursor-pointer"
                >
                  <Paperclip className="w-4 h-4 mr-2" />
                  <span>Attach Files</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Textarea */}
            <div className="relative flex-1">
              <Textarea
                ref={textareaRef}
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="What do you want to predict?"
                disabled={isLoading || disabled}
                className="min-h-[52px] max-h-[120px] resize-none pl-4 pr-12 py-4 w-full rounded-2xl border-2 text-base placeholder:text-base"
                rows={1}
              />
              
              {/* Send Button - Inside textarea */}
              <div className="absolute right-2 bottom-2 top-2 flex items-center">
                <Button
                  onClick={handleSubmit}
                  disabled={!question.trim() || isLoading || disabled}
                  size="icon"
                  className="h-8 w-8 rounded-lg"
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

        {/* Minimal Hint Text */}
        <p className="text-xs text-muted-foreground mt-2 text-center">
          <span className="text-muted-foreground/60">{currentCategory?.icon}</span>
          <span className="ml-1">{currentCategory?.label}</span>
          {hasActiveFeatures && (
            <>
              <span className="mx-2 text-muted-foreground/30">•</span>
              {deepMode && canUseDeepMode && <span className="text-primary">Deep</span>}
              {deepMode && canUseDeepMode && trajectoryType !== "instant" && <span className="mx-1">+</span>}
              {trajectoryType !== "instant" && <span className="text-primary">{currentTrajectory?.label.replace(" Forecast", "")}</span>}
            </>
          )}
        </p>
      </div>
    </div>
  );
}
