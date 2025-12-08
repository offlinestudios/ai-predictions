import { Button } from "@/components/ui/button";
import { History, Settings, LogOut } from "lucide-react";
import { Link } from "wouter";
import { useClerk } from "@clerk/clerk-react";
import { useLocation } from "wouter";
import { TierBadge } from "@/components/Badge";

interface DesktopSidebarProps {
  user?: {
    name?: string | null;
    email?: string | null;
  };
  subscription?: {
    tier: "free" | "plus" | "pro" | "premium";
  };
  onHistoryClick?: () => void;
  isAuthenticated: boolean;
}

export default function DesktopSidebar({ user, subscription, onHistoryClick, isAuthenticated }: DesktopSidebarProps) {
  const { signOut } = useClerk();
  const [, navigate] = useLocation();

  const handleSignOut = () => {
    signOut(() => navigate("/"));
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <aside className="hidden lg:flex fixed left-0 top-0 h-screen w-64 border-r border-border/50 bg-card/50 backdrop-blur-sm flex-col z-40">
      {/* Logo and Title */}
      <div className="p-6 border-b border-border/50">
        <div className="flex items-center gap-3">
          <img src="/logo.svg" alt="Predicsure AI" className="w-10 h-10 object-contain" />
          <div>
            <h1 className="text-lg font-bold">Predicsure AI</h1>
            <p className="text-xs text-muted-foreground">AI Predictions</p>
          </div>
        </div>
      </div>

      {/* User Info */}
      <div className="p-4 border-b border-border/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-sm font-semibold text-primary">
              {user?.name?.charAt(0) || user?.email?.charAt(0) || "U"}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user?.name || "User"}</p>
            <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
          </div>
        </div>
        {subscription && (
          <div className="mt-3">
            <TierBadge tier={subscription.tier} size="md" />
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        <Button
          variant="ghost"
          className="w-full justify-start"
          onClick={onHistoryClick}
        >
          <History className="w-4 h-4 mr-3" />
          Prediction History
        </Button>

        <Link href="/account">
          <Button variant="ghost" className="w-full justify-start">
            <Settings className="w-4 h-4 mr-3" />
            Account Settings
          </Button>
        </Link>
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-border/50">
        <Button
          variant="ghost"
          className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
          onClick={handleSignOut}
        >
          <LogOut className="w-4 h-4 mr-3" />
          Logout
        </Button>
      </div>
    </aside>
  );
}
