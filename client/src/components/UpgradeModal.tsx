import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Sparkles } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { useState } from "react";

interface UpgradeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reason?: "limit_reached" | "feature_locked" | "approaching_limit";
  remainingPredictions?: number;
}

export default function UpgradeModal({ open, onOpenChange, reason = "limit_reached", remainingPredictions = 0 }: UpgradeModalProps) {
  const [isUpgradingPlus, setIsUpgradingPlus] = useState(false);
  const [isUpgradingPremium, setIsUpgradingPremium] = useState(false);

  const createCheckoutMutation = trpc.subscription.createCheckoutSession.useMutation({
    onSuccess: (data) => {
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      }
    },
    onError: (error) => {
      toast.error("Failed to start checkout: " + error.message);
      setIsUpgradingPlus(false);
      setIsUpgradingPremium(false);
    },
  });

  const handleUpgrade = (tier: "plus" | "premium") => {
    if (tier === "plus") {
      setIsUpgradingPlus(true);
      // Plus maps to "pro" tier in API with monthly billing
      createCheckoutMutation.mutate({ tier: "pro", interval: "month" });
    } else {
      setIsUpgradingPremium(true);
      // Premium uses yearly billing
      createCheckoutMutation.mutate({ tier: "premium", interval: "year" });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader className="text-center">
          <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
            <Sparkles className="w-6 h-6 text-primary" />
          </div>
          <DialogTitle className="text-2xl font-semibold">
            This thread isn't finished.
          </DialogTitle>
          <DialogDescription className="text-base mt-2">
            There's more to see here. Continue when clarity matters.
          </DialogDescription>
        </DialogHeader>

        {/* Pricing Cards */}
        <div className="space-y-4 mt-6">
          {/* Plus Plan - Primary */}
          <div className="border-2 border-primary rounded-xl p-5 relative bg-primary/5">
            <Badge className="absolute -top-3 left-4 bg-primary text-primary-foreground">
              Most Popular
            </Badge>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold">Plus</h3>
                <p className="text-sm text-muted-foreground">Stay oriented when things are unclear</p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-bold">$9.99</span>
                <span className="text-muted-foreground text-sm">/mo</span>
              </div>
            </div>
            <ul className="space-y-2 mb-4">
              <li className="flex items-center gap-2 text-sm">
                <Check className="w-4 h-4 text-primary flex-shrink-0" />
                <span>Unlimited predictions</span>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Check className="w-4 h-4 text-primary flex-shrink-0" />
                <span>Ongoing guidance as situations unfold</span>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Check className="w-4 h-4 text-primary flex-shrink-0" />
                <span>Cancel anytime</span>
              </li>
            </ul>
            <Button 
              className="w-full" 
              size="lg"
              onClick={() => handleUpgrade("plus")}
              disabled={isUpgradingPlus || isUpgradingPremium}
            >
              {isUpgradingPlus ? "Processing..." : "Continue with Plus"}
            </Button>
          </div>

          {/* Premium Plan - Secondary */}
          <div className="border border-border rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold">Premium</h3>
                <p className="text-sm text-muted-foreground">Clarity without interruption</p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-bold">$59</span>
                <span className="text-muted-foreground text-sm">/year</span>
              </div>
            </div>
            <ul className="space-y-2 mb-4">
              <li className="flex items-center gap-2 text-sm">
                <Check className="w-4 h-4 text-primary flex-shrink-0" />
                <span>Everything in Plus</span>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Check className="w-4 h-4 text-primary flex-shrink-0" />
                <span>One simple plan for the year</span>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Check className="w-4 h-4 text-primary flex-shrink-0" />
                <span>Priority access to new features</span>
              </li>
            </ul>
            <Button 
              variant="outline"
              className="w-full" 
              size="lg"
              onClick={() => handleUpgrade("premium")}
              disabled={isUpgradingPlus || isUpgradingPremium}
            >
              {isUpgradingPremium ? "Processing..." : "Get Premium"}
            </Button>
          </div>
        </div>

        {/* Trust */}
        <div className="mt-4 text-center text-xs text-muted-foreground">
          <p>Cancel anytime · 7-day money-back guarantee</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
