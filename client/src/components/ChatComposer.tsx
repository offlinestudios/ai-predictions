import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Paperclip, Send, X, MessageCircle, Briefcase, Heart, DollarSign, Activity, Trophy, TrendingUp } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

interface ChatComposerProps {
  onSubmit: (question: string, category: string, files: File[]) => void;
  isLoading: boolean;
  disabled?: boolean;
}

export default function ChatComposer({ onSubmit, isLoading, disabled }: ChatComposerProps) {
  const [question, setQuestion] = useState("");
  const [category, setCategory] = useState("relationships");
  const [files, setFiles] = useState<File[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    
    onSubmit(question, category, files);
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
    <div className="fixed left-0 right-0 z-40 bg-background/95 backdrop-blur-sm border-t border-border/50 pb-safe bottom-0">
      {/* On mobile (<lg), positioned 64px from bottom to sit above bottom nav */}
      <div className="container max-w-4xl py-3 md:py-4">
        {/* Category Selector - Mobile Optimized */}
        <div className="mb-2 md:mb-3">
          <Select value={category} onValueChange={setCategory} disabled={isLoading || disabled}>
            <SelectTrigger className="w-full md:w-48 h-9 text-sm">
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
              className="min-h-[44px] max-h-[120px] resize-none pl-4 pr-24 py-3 w-full rounded-2xl border-2 text-sm placeholder:text-sm"
              rows={1}
            />
            
            {/* Inline buttons (right side) */}
            <div className="absolute right-2 bottom-2 flex items-center gap-1">
              {/* File Upload Button */}
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 hover:bg-accent"
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
                className="h-8 w-8"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                    )}
              </Button>
            </div>
          </div>
        </div>

        {/* Hint Text */}
        <p className="text-xs text-muted-foreground mt-2 text-center">
          Press Enter to send, Shift+Enter for new line
        </p>
      </div>
    </div>
  );
}
