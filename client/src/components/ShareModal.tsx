import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Copy, Twitter, Linkedin, Facebook, Link2, AlertCircle, Check } from "lucide-react";
import { toast } from "sonner";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  prediction: {
    id: number;
    userInput: string;
    predictionResult: string;
    shareToken: string | null;
  } | null;
}

export function ShareModal({ isOpen, onClose, prediction }: ShareModalProps) {
  const [copied, setCopied] = useState(false);

  if (!prediction) return null;

  const shareUrl = prediction.shareToken 
    ? `${window.location.origin}/share/${prediction.shareToken}`
    : null;

  const truncatedTitle = prediction.userInput.length > 50 
    ? prediction.userInput.substring(0, 50) + "..." 
    : prediction.userInput;

  const handleCopyLink = async () => {
    if (shareUrl) {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success("Link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } else {
      toast.error("Share link not available");
    }
  };

  const handleShareTwitter = () => {
    if (shareUrl) {
      const text = encodeURIComponent(`Check out my AI prediction: "${truncatedTitle}"`);
      window.open(`https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(shareUrl)}`, '_blank');
    } else {
      toast.error("Share link not available");
    }
  };

  const handleShareLinkedIn = () => {
    if (shareUrl) {
      window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`, '_blank');
    } else {
      toast.error("Share link not available");
    }
  };

  const handleShareFacebook = () => {
    if (shareUrl) {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank');
    } else {
      toast.error("Share link not available");
    }
  };

  // Truncate prediction result for preview
  const previewText = prediction.predictionResult.length > 300
    ? prediction.predictionResult.substring(0, 300) + "..."
    : prediction.predictionResult;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-lg bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold pr-8">
            {truncatedTitle}
          </DialogTitle>
        </DialogHeader>

        {/* Privacy Warning */}
        <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 border border-border">
          <AlertCircle className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium">This prediction may include personal information.</p>
            <p className="text-xs text-muted-foreground">Take a moment to check the content before sharing the link.</p>
          </div>
        </div>

        {/* Prediction Preview */}
        <div className="rounded-lg border border-border bg-background p-4 max-h-48 overflow-y-auto">
          <div className="space-y-3">
            {/* User Question */}
            <div className="flex justify-end">
              <div className="bg-primary/10 rounded-lg px-3 py-2 max-w-[85%]">
                <p className="text-sm">{prediction.userInput}</p>
              </div>
            </div>
            
            {/* AI Response Preview */}
            <div className="flex justify-start">
              <div className="bg-muted rounded-lg px-3 py-2 max-w-[85%]">
                <p className="text-sm text-muted-foreground">{previewText}</p>
                <p className="text-xs text-primary mt-2 font-medium">Predicsure AI</p>
              </div>
            </div>
          </div>
        </div>

        {/* Social Share Buttons */}
        <div className="flex items-center justify-center gap-4 pt-2">
          <button
            onClick={handleCopyLink}
            className="flex flex-col items-center gap-2 p-3 rounded-full hover:bg-muted transition-colors"
            disabled={!shareUrl}
          >
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors">
              {copied ? (
                <Check className="w-5 h-5 text-green-500" />
              ) : (
                <Link2 className="w-5 h-5 text-foreground" />
              )}
            </div>
            <span className="text-xs text-muted-foreground">Copy link</span>
          </button>

          <button
            onClick={handleShareTwitter}
            className="flex flex-col items-center gap-2 p-3 rounded-full hover:bg-muted transition-colors"
            disabled={!shareUrl}
          >
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors">
              <Twitter className="w-5 h-5 text-foreground" />
            </div>
            <span className="text-xs text-muted-foreground">X</span>
          </button>

          <button
            onClick={handleShareLinkedIn}
            className="flex flex-col items-center gap-2 p-3 rounded-full hover:bg-muted transition-colors"
            disabled={!shareUrl}
          >
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors">
              <Linkedin className="w-5 h-5 text-foreground" />
            </div>
            <span className="text-xs text-muted-foreground">LinkedIn</span>
          </button>

          <button
            onClick={handleShareFacebook}
            className="flex flex-col items-center gap-2 p-3 rounded-full hover:bg-muted transition-colors"
            disabled={!shareUrl}
          >
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors">
              <Facebook className="w-5 h-5 text-foreground" />
            </div>
            <span className="text-xs text-muted-foreground">Facebook</span>
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
