import { Link } from "wouter";
import { TierBadge } from "@/components/Badge";
import { Button } from "@/components/ui/button";
import MobileUnifiedSidebar from "@/components/MobileUnifiedSidebar";
import { History } from "lucide-react";

interface MobileHeaderProps {
  isAuthenticated: boolean;
  userName?: string | null;
  userEmail?: string | null;
  tier?: "free" | "plus" | "pro" | "premium";
  onSelectPrediction?: (prediction: any) => void;
  currentPredictionId?: number | null;
  onHistoryClick?: () => void;
}

export default function MobileHeader({ isAuthenticated, userName, userEmail, tier, onSelectPrediction, currentPredictionId, onHistoryClick }: MobileHeaderProps) {
  return (
    <header className="lg:hidden border-b border-border/50 backdrop-blur-sm sticky top-0 z-40 bg-background/95">
      <div className="container py-3 flex items-center justify-between">
        {/* Logo */}
        <Link href="/">
          <div className="flex items-center gap-2">
            <img src="/logo.svg" alt="Predicsure AI Logo" className="w-7 h-7 object-contain" />
            <span className="text-lg font-bold">Predicsure AI</span>
          </div>
        </Link>

        {/* Right-side controls */}
        <div className="flex items-center gap-2">
          {isAuthenticated && onHistoryClick && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onHistoryClick}
              aria-label="Toggle history"
            >
              <History className="w-5 h-5" />
            </Button>
          )}
          <MobileUnifiedSidebar
            user={{ name: userName, email: userEmail }}
            subscription={tier ? { tier } : undefined}
            onSelectPrediction={onSelectPrediction}
            currentPredictionId={currentPredictionId}
            isAuthenticated={isAuthenticated}
          />
        </div>
      </div>
    </header>
  );
}
