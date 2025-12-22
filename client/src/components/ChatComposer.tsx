import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  Loader2, Paperclip, ArrowUp, X, Plus, Sparkles
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
  showUpgradeBanner?: boolean;
}

export default function ChatComposer({ 
  onSubmit, 
  isLoading, 
  disabled, 
  sidebarCollapsed = false,
  subscription,
  onUpgradeClick,
  showUpgradeBanner = false,
}: ChatComposerProps) {
  const [question, setQuestion] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [showOptions, setShowOptions] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Check if user has reached free limit (for visual dimming)
  const hasReachedFreeLimit = subscription?.tier === "free" && (subscription?.totalUsed ?? 0) >= 3;

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
    
    // Always pass false for deepMode and "instant" for trajectoryType (features hidden)
    onSubmit(question, files, false, "instant");
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

  return (
    <div className={`fixed left-0 right-0 z-40 bg-background/95 backdrop-blur-sm pb-safe bottom-0 transition-all duration-300 ${sidebarCollapsed ? 'lg:left-16' : 'lg:left-80'}`}>
      <div className="container max-w-4xl py-3 md:py-4">
        {/* Upgrade Banner - Shows only after user has declined the paywall */}
        {showUpgradeBanner && hasReachedFreeLimit && (
          <div className="mb-3 p-4 rounded-2xl bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 border border-primary/20">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-3 text-center sm:text-left">
                <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                  <Sparkles className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-sm">You've used all 3 free predictions</p>
                  <p className="text-xs text-muted-foreground">Upgrade to Plus for unlimited predictions and deeper insights</p>
                </div>
              </div>
              <Button 
                onClick={onUpgradeClick}
                size="sm"
                className="shrink-0 px-6"
              >
                Upgrade to Plus
                <ArrowUp className="w-4 h-4 ml-1.5 rotate-45" />
              </Button>
            </div>
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

        {/* Main Composer - Clean, Simple */}
        <div className="relative w-full">
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*,.pdf,.doc,.docx"
            onChange={handleFileSelect}
            className="hidden"
          />
          
          {/* Composer Container */}
          <div className={cn(
            "flex items-end gap-0 rounded-[20px] border border-border bg-card/80 backdrop-blur-sm p-1.5 shadow-md ring-1 ring-border/20",
            hasReachedFreeLimit && "opacity-60"
          )}>
            {/* Plus Button for file attachments only */}
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
                className="w-56 p-0 rounded-2xl border border-border/60 bg-card shadow-lg"
              >
                {/* Attach Files - Only option now */}
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
                placeholder={hasReachedFreeLimit ? "Upgrade to continue asking..." : "Ask about what's unfolding..."}
                disabled={isLoading || disabled}
                className="min-h-[36px] max-h-[120px] resize-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 py-2 px-3 text-sm placeholder:text-muted-foreground bg-transparent"
                rows={1}
              />
            </div>
            
            {/* Send Button */}
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
