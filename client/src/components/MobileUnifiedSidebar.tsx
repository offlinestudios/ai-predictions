import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import UnifiedSidebar from "@/components/UnifiedSidebar";

interface MobileUnifiedSidebarProps {
  user?: {
    name?: string | null;
    email?: string | null;
  };
  subscription?: {
    tier: "free" | "plus" | "pro" | "premium";
  };
  onSelectPrediction?: (prediction: {
    id: number;
    predictionResult: string;
    shareToken: string | null;
    userFeedback: string | null;
    confidenceScore: number | null;
    trajectoryType: string | null;
  }) => void;
  currentPredictionId?: number | null;
  isAuthenticated: boolean;
}

export default function MobileUnifiedSidebar({ 
  user, 
  subscription, 
  onSelectPrediction,
  currentPredictionId,
  isAuthenticated 
}: MobileUnifiedSidebarProps) {
  const [open, setOpen] = useState(false);

  const handleSelectPrediction = (prediction: any) => {
    onSelectPrediction?.(prediction);
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden">
          <Menu className="w-6 h-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[320px] sm:w-[380px] p-0">
        <UnifiedSidebar
          user={user}
          subscription={subscription}
          onSelectPrediction={handleSelectPrediction}
          currentPredictionId={currentPredictionId}
          isAuthenticated={isAuthenticated}
          className="h-full"
        />
      </SheetContent>
    </Sheet>
  );
}
