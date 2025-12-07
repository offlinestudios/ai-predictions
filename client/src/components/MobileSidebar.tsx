import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Menu, History, Settings, LogOut } from "lucide-react";
import { Link } from "wouter";
import { useClerk } from "@clerk/clerk-react";
import { useLocation } from "wouter";
import { TierBadge } from "@/components/Badge";

interface MobileSidebarProps {
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

export default function MobileSidebar({ user, subscription, onHistoryClick, isAuthenticated }: MobileSidebarProps) {
  const [open, setOpen] = useState(false);
  const { signOut } = useClerk();
  const [, navigate] = useLocation();

  const handleSignOut = () => {
    signOut(() => navigate("/"));
    setOpen(false);
  };

  const handleHistoryClick = () => {
    onHistoryClick?.();
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden">
          <Menu className="w-6 h-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[300px] sm:w-[350px]">
        <SheetHeader className="border-b border-border/50 pb-4 mb-4">
          <SheetTitle className="flex items-center gap-2">
            <img src="/logo.svg" alt="Predicsure AI" className="w-8 h-8 object-contain" />
            <span>Predicsure AI</span>
          </SheetTitle>
          {isAuthenticated && user && (
            <div className="flex items-center gap-2 pt-2">
              <span className="text-sm text-muted-foreground">{user.name || user.email}</span>
              {subscription && <TierBadge tier={subscription.tier} size="sm" />}
            </div>
          )}
        </SheetHeader>

        <div className="flex flex-col gap-2">
          {isAuthenticated && (
            <>
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={handleHistoryClick}
              >
                <History className="w-4 h-4 mr-3" />
                Prediction History
              </Button>

              <Link href="/account">
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => setOpen(false)}
                >
                  <Settings className="w-4 h-4 mr-3" />
                  Account Settings
                </Button>
              </Link>

              <div className="border-t border-border/50 my-2" />

              <Button
                variant="ghost"
                className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={handleSignOut}
              >
                <LogOut className="w-4 h-4 mr-3" />
                Logout
              </Button>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
