import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Paperclip, ArrowUp, X, MessageCircle, Briefcase, Heart, DollarSign, Activity, Trophy, TrendingUp, Sparkles, Calendar, Lock, Zap } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

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
  { id: "30day", label: "30-Day", description: "Monthly forecast", minTier: "plus" },
  { id: "90day", label: "90-Day", description: "Quarterly outlook", minTier: "pro" },
  { id: "yearly", label: "Yearly", description: "Annual vision", minTier: "premium" },
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
      toast.info("Deep Mode requires Plus subscription or higher", {
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
      toast.info(`${option.label} forecasts require ${tierName} subscription`, {
        action: onUpgradeClick ? {
          label: "Upgrade",
          onClick: onUpgradeClick
        } : undefined
      });
      return;
    }
    setTrajectoryType(trajectory);
  };

  return (
    <div className={`fixed left-0 right-0 z-40 bg-background/95 backdrop-blur-sm border-t border-border/50 pb-safe bottom-0 transition-all duration-300 ${sidebarCollapsed ? 'lg:left-16' : 'lg:left-80'}`}>
      {/* On mobile (<lg), positioned 64px from bottom to sit above bottom nav */}
      <div className="container max-w-4xl py-3 md:py-4">
        {/* Top Row: Category + Premium Features */}
        <div className="flex flex-wrap items-center gap-2 mb-2 md:mb-3">
          {/* Category Selector */}
          <Select value={category} onValueChange={setCategory} disabled={isLoading || disabled}>
            <SelectTrigger className="w-full sm:w-40 h-9 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="general">
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4 text-primary" />
                  <span>General</span>
                </div>
              </SelectItem>
              <SelectItem value="career">
                <div className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-primary" />
                  <span>Career</span>
                </div>
              </SelectItem>
              <SelectItem value="relationships">
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-primary" />
                  <span>Relationships</span>
                </div>
              </SelectItem>
              <SelectItem value="finance">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-primary" />
                  <span>Finance</span>
                </div>
              </SelectItem>
              <SelectItem value="health">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-primary" />
                  <span>Health</span>
                </div>
              </SelectItem>
              <SelectItem value="sports">
                <div className="flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-primary" />
                  <span>Sports</span>
                </div>
              </SelectItem>
              <SelectItem value="stocks">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-primary" />
                  <span>Stocks & Markets</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>

          {/* Deep Mode Toggle */}
          <button
            onClick={handleDeepModeToggle}
            disabled={isLoading || disabled}
            className={cn(
              "flex items-center gap-1.5 px-3 h-9 rounded-lg border text-sm font-medium transition-all",
              deepMode && canUseDeepMode
                ? "bg-primary text-primary-foreground border-primary"
                : canUseDeepMode
                  ? "bg-background hover:bg-accent border-border"
                  : "bg-muted/50 text-muted-foreground border-border/50 cursor-not-allowed"
            )}
          >
            {canUseDeepMode ? (
              <Sparkles className="w-4 h-4" />
            ) : (
              <Lock className="w-3.5 h-3.5" />
            )}
            <span>Deep Mode</span>
            {!canUseDeepMode && (
              <span className="text-[10px] bg-amber-500/20 text-amber-600 px-1.5 py-0.5 rounded-full ml-1">Plus</span>
            )}
          </button>

          {/* Trajectory Selector */}
          <div className="flex items-center gap-1 bg-muted/50 rounded-lg p-1">
            {TRAJECTORY_OPTIONS.map((option) => {
              const isAvailable = isFeatureAvailable(option.minTier);
              const isSelected = trajectoryType === option.id;
              
              return (
                <button
                  key={option.id}
                  onClick={() => handleTrajectorySelect(option.id)}
                  disabled={isLoading || disabled}
                  className={cn(
                    "flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all",
                    isSelected && isAvailable
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : isAvailable
                        ? "hover:bg-accent text-foreground"
                        : "text-muted-foreground cursor-not-allowed"
                  )}
                  title={!isAvailable ? `Requires ${option.minTier.charAt(0).toUpperCase() + option.minTier.slice(1)}` : option.description}
                >
                  {!isAvailable && <Lock className="w-3 h-3" />}
                  {option.id === "instant" && isAvailable && <Zap className="w-3 h-3" />}
                  {option.id !== "instant" && isAvailable && <Calendar className="w-3 h-3" />}
                  <span className="hidden sm:inline">{option.label}</span>
                  <span className="sm:hidden">{option.id === "instant" ? "Now" : option.label.replace("-Day", "d")}</span>
                </button>
              );
            })}
          </div>
        </div>

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

        {/* Composer Bar - Full Width with Inline Buttons */}
        <div className="relative w-full">
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*,.pdf,.doc,.docx"
            onChange={handleFileSelect}
            className="hidden"
          />
          
          {/* Textarea with inline buttons */}
          <div className="relative">
            <Textarea
              ref={textareaRef}
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="What do you want to predict?"
              disabled={isLoading || disabled}
              className="min-h-[52px] max-h-[120px] resize-none pl-6 pr-[100px] py-4 w-full rounded-2xl border-2 text-base placeholder:text-base"
              rows={1}
            />
            
            {/* Inline buttons (right side) */}
            <div className="absolute right-2 bottom-2 top-2 flex items-center gap-1.5">
              {/* File Upload Button */}
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 hover:bg-accent rounded-lg"
                onClick={() => fileInputRef.current?.click()}
                disabled={isLoading || disabled}
              >
                <Paperclip className="w-4 h-4" />
              </Button>
              
              {/* Send Button */}
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

        {/* Hint Text */}
        <p className="text-xs text-muted-foreground mt-2 text-center">
          Press Enter to send, Shift+Enter for new line
          {deepMode && canUseDeepMode && (
            <span className="ml-2 text-primary">• Deep Mode active</span>
          )}
          {trajectoryType !== "instant" && (
            <span className="ml-2 text-primary">• {TRAJECTORY_OPTIONS.find(t => t.id === trajectoryType)?.label} forecast</span>
          )}
        </p>
      </div>
    </div>
  );
}
