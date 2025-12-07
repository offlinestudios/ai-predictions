import { Link } from "wouter";
import { TierBadge } from "@/components/Badge";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";

interface MobileHeaderProps {
  isAuthenticated: boolean;
  userName?: string | null;
  userEmail?: string | null;
  tier?: "free" | "plus" | "pro" | "premium";
}

export default function MobileHeader({ isAuthenticated, userName, userEmail, tier }: MobileHeaderProps) {
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

        {/* User Info & Account Button (if authenticated) */}
        {isAuthenticated ? (
          <div className="flex items-center gap-2">
            {tier && (
              <>
                <span className="text-xs text-muted-foreground max-w-[100px] truncate">
                  {userName || userEmail}
                </span>
                <TierBadge tier={tier} size="sm" />
              </>
            )}
            <Link href="/account">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Settings className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        ) : (
          <Link href="/sign-in">
            <Button variant="default" size="sm">
              Sign In
            </Button>
          </Link>
        )}
      </div>
    </header>
  );
}
