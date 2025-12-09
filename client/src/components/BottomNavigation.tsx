import { Link, useLocation } from "wouter";
import { Home, SquarePen, Settings, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface BottomNavigationProps {
  isAuthenticated: boolean;
  tier?: string;
}

export default function BottomNavigation({ isAuthenticated, tier }: BottomNavigationProps) {
  const [location] = useLocation();

  const navItems = [
    {
      href: "/",
      icon: Home,
      label: "Home",
      show: true,
    },
    {
      href: "/dashboard",
      icon: null, // Will use logo image instead
      label: "Predict",
      show: true,
    },
    {
      href: "/dashboard?new=true",
      icon: SquarePen,
      label: "New",
      show: isAuthenticated,
      isAction: true,
    },
    {
      href: "/account",
      icon: Settings,
      label: "Account",
      show: isAuthenticated,
    },
  ];

  const visibleItems = navItems.filter(item => item.show);

  return (
    <nav className="block lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-t border-border/50">
      <div className="flex items-center justify-around h-16 px-2">
        {visibleItems.map((item) => {
          const Icon = item.icon;
          const isActive = location === item.href;
          
          return (
            <Link key={item.href} href={item.href}>
              <button
                className={cn(
                  "flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-lg transition-all",
                  "min-w-[64px] min-h-[48px]", // Touch target size
                  isActive 
                    ? "text-primary bg-primary/10" 
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                )}
              >
                {Icon ? (
                  <Icon className={cn("w-5 h-5", isActive && "scale-110")} />
                ) : (
                  <img 
                    src="/logo.svg" 
                    alt="Predict" 
                    className={cn("w-5 h-5 object-contain", isActive && "scale-110")} 
                  />
                )}
                <span className="text-xs font-medium">{item.label}</span>
              </button>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
