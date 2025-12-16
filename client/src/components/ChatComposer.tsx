import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  Loader2, Paperclip, ArrowUp, X, Plus, Sparkles, Calendar, Lock, Zap,
  MessageCircle, Briefcase, Heart, DollarSign, Activity, Trophy, TrendingUp
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

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

const CATEGORY_OPTIONS: { id: string; label: string; icon: React.ElementType }[] = [
  { id: "general", label: "General", icon: MessageCircle },
  { id: "career", label: "Career", icon: Briefcase },
  { id: "relationships", label: "Relationships", icon: Heart },
  { id: "finance", label: "Finance", icon: DollarSign },
  { id: "health", label: "Health", icon: Activity },
  { id: "sports", label: "Sports", icon: Trophy },
  { id: "stocks", label: "Stocks", icon: TrendingUp },
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
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
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

  const currentCategory = CATEGORY_OPTIONS.find(c => c.id === category);
  const CurrentCategoryIcon = currentCategory?.icon || MessageCircle;
  const currentTrajectory = TRAJECTORY_OPTIONS.find(t => t.id === trajectoryType);

  return (
    <div className={`fixed left-0 right-0 z-40 bg-background/95 backdrop-blur-sm border-t border-border/50 pb-safe bottom-0 transition-all duration-300 ${sidebarCollapsed ? 'lg:left-16' : 'lg:left-80'}`}>
      <div className="container max-w-4xl py-3 md:py-4">
        {/* File Previews */}
        {files.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-2">
            {files.map((file, index) => (
              <div key={index} className="flex items-center gap-2 px-3 py-1.5 bg-accent/50 rounded-full text-sm">
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

        {/* Main Composer */}
        <div className="relative w-full">
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*,.pdf,.doc,.docx"
            onChange={handleFileSelect}
            className="hidden"
          />
          
          {/* Textarea Container */}
          <div className="relative flex items-end rounded-2xl border-2 border-border bg-background focus-within:border-primary/50 transition-colors">
            {/* Left Side: Plus Button + Category Button (inside textarea) */}
            <div className="flex items-center gap-1 pl-2 pb-3">
              {/* Plus Button - Opens Options Popover */}
              <Popover open={showOptions} onOpenChange={setShowOptions}>
                <PopoverTrigger asChild>
                  <button
                    className={cn(
                      "h-8 w-8 rounded-full flex items-center justify-center transition-all hover:bg-accent",
                      showOptions && "bg-accent rotate-45",
                      hasActiveFeatures && "ring-2 ring-primary ring-offset-1 ring-offset-background"
                    )}
                    disabled={isLoading || disabled}
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </PopoverTrigger>
                <PopoverContent 
                  align="start" 
                  side="top" 
                  sideOffset={12}
                  className="w-72 p-0 rounded-xl shadow-xl border border-border/50"
                >
                  {/* Analysis Mode */}
                  <div className="p-3 border-b border-border/50">
                    <div className="text-xs font-medium text-muted-foreground mb-2">Analysis Mode</div>
                    <button
                      onClick={handleDeepModeToggle}
                      className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-accent transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        {canUseDeepMode ? (
                          <Sparkles className="w-4 h-4 text-primary" />
                        ) : (
                          <Lock className="w-4 h-4 text-muted-foreground" />
                        )}
                        <div className="text-left">
                          <div className="font-medium text-sm">Deep Mode</div>
                          <div className="text-xs text-muted-foreground">Detailed analysis & scenarios</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {!canUseDeepMode && (
                          <span className="text-[10px] bg-amber-500/20 text-amber-600 px-1.5 py-0.5 rounded">Plus</span>
                        )}
                        <div className={cn(
                          "w-5 h-5 rounded border-2 flex items-center justify-center transition-colors",
                          deepMode && canUseDeepMode 
                            ? "bg-primary border-primary text-primary-foreground" 
                            : "border-muted-foreground/30"
                        )}>
                          {deepMode && canUseDeepMode && <span className="text-xs">✓</span>}
                        </div>
                      </div>
                    </button>
                  </div>

                  {/* Forecast Timeframe */}
                  <div className="p-3 border-b border-border/50">
                    <div className="text-xs font-medium text-muted-foreground mb-2">Forecast Timeframe</div>
                    <div className="space-y-1">
                      {TRAJECTORY_OPTIONS.map((option) => {
                        const isAvailable = isFeatureAvailable(option.minTier);
                        const isSelected = trajectoryType === option.id;
                        
                        return (
                          <button
                            key={option.id}
                            onClick={() => handleTrajectorySelect(option.id)}
                            className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-accent transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              {isAvailable ? (
                                option.id === "instant" ? <Zap className="w-4 h-4" /> : <Calendar className="w-4 h-4" />
                              ) : (
                                <Lock className="w-4 h-4 text-muted-foreground" />
                              )}
                              <div className="text-left">
                                <div className={cn("font-medium text-sm", !isAvailable && "text-muted-foreground")}>
                                  {option.label}
                                </div>
                                <div className="text-xs text-muted-foreground">{option.description}</div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {!isAvailable && (
                                <span className="text-[10px] bg-amber-500/20 text-amber-600 px-1.5 py-0.5 rounded capitalize">
                                  {option.minTier}
                                </span>
                              )}
                              {isSelected && isAvailable && (
                                <span className="text-primary font-medium">✓</span>
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Attach Files */}
                  <div className="p-3">
                    <button
                      onClick={() => {
                        fileInputRef.current?.click();
                        setShowOptions(false);
                      }}
                      className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-accent transition-colors"
                    >
                      <Paperclip className="w-4 h-4" />
                      <span className="font-medium text-sm">Attach Files</span>
                    </button>
                  </div>
                </PopoverContent>
              </Popover>

              {/* Category Button - Separate Popover */}
              <Popover open={showCategoryPicker} onOpenChange={setShowCategoryPicker}>
                <PopoverTrigger asChild>
                  <button
                    className={cn(
                      "h-8 px-3 rounded-full flex items-center gap-1.5 text-sm font-medium transition-all hover:bg-accent",
                      showCategoryPicker && "bg-accent"
                    )}
                    disabled={isLoading || disabled}
                  >
                    <CurrentCategoryIcon className="w-4 h-4" />
                    <span className="hidden sm:inline">{currentCategory?.label}</span>
                  </button>
                </PopoverTrigger>
                <PopoverContent 
                  align="start" 
                  side="top" 
                  sideOffset={12}
                  className="w-56 p-3 rounded-xl shadow-xl border border-border/50"
                >
                  <div className="text-xs font-medium text-muted-foreground mb-2">Category</div>
                  <div className="grid grid-cols-2 gap-1">
                    {CATEGORY_OPTIONS.map((cat) => {
                      const Icon = cat.icon;
                      const isSelected = category === cat.id;
                      
                      return (
                        <button
                          key={cat.id}
                          onClick={() => {
                            setCategory(cat.id);
                            setShowCategoryPicker(false);
                          }}
                          className={cn(
                            "flex items-center gap-2 p-2 rounded-lg text-sm transition-colors",
                            isSelected 
                              ? "bg-primary text-primary-foreground" 
                              : "hover:bg-accent"
                          )}
                        >
                          <Icon className="w-4 h-4" />
                          <span>{cat.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            {/* Textarea */}
            <Textarea
              ref={textareaRef}
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="What do you want to predict?"
              disabled={isLoading || disabled}
              className="min-h-[52px] max-h-[120px] resize-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 py-4 pr-12 text-base placeholder:text-base bg-transparent"
              rows={1}
            />
            
            {/* Send Button (right side, inside textarea) */}
            <div className="pr-2 pb-3">
              <Button
                onClick={handleSubmit}
                disabled={!question.trim() || isLoading || disabled}
                size="icon"
                className="h-8 w-8 rounded-full"
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

        {/* Minimal Status Text */}
        <p className="text-xs text-muted-foreground mt-2 text-center">
          Press Enter to send
          {hasActiveFeatures && (
            <span className="text-primary ml-2">
              {deepMode && canUseDeepMode && "Deep Mode"}
              {deepMode && canUseDeepMode && trajectoryType !== "instant" && " + "}
              {trajectoryType !== "instant" && currentTrajectory?.label.replace(" Forecast", "")}
            </span>
          )}
        </p>
      </div>
    </div>
  );
}
