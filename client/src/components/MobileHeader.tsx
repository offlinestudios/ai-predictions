import { Link } from "wouter";
import { TierBadge } from "@/components/Badge";
import { Button } from "@/components/ui/button";
import MobileSidebar from "@/components/MobileSidebar";

interface MobileHeaderProps {
  isAuthenticated: boolean;
  userName?: string | null;
  userEmail?: string | null;
  tier?: "free" | "plus" | "pro" | "premium";
  onHistoryClick?: () => void;
}

export default function MobileHeader({ isAuthenticated, userName, userEmail, tier, onHistoryClick }: MobileHeaderProps) {
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

        {/* Hamburger Menu */}
        <div className="flex items-center gap-2">
          <MobileSidebar
            user={{ name: userName, email: userEmail }}
            subscription={tier ? { tier } : undefined}
            onHistoryClick={onHistoryClick}
            isAuthenticated={isAuthenticated}
          />
        </div>
      </div>
    </header>
  );
}
