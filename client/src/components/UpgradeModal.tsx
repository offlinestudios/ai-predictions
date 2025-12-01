import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X, Zap, Crown, Sparkles } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { useState } from "react";

interface UpgradeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reason?: "limit_reached" | "feature_locked" | "approaching_limit";
  remainingPredictions?: number;
}

const FEATURES = [
  {
    name: "Daily Predictions",
    free: "3 total",
    pro: "20 per day",
    premium: "100 per day",
  },
  {
    name: "Prediction History",
    free: false,
    pro: true,
    premium: true,
  },
  {
    name: "AI Personalization",
    free: false,
    pro: true,
    premium: true,
  },
  {
    name: "File Attachments",
    free: false,
    pro: true,
    premium: true,
  },
  {
    name: "Priority Support",
    free: false,
    pro: false,
    premium: true,
  },
  {
    name: "Advanced Categories",
    free: false,
    pro: true,
    premium: true,
  },
];

export default function UpgradeModal({ open, onOpenChange, reason = "limit_reached", remainingPredictions = 0 }: UpgradeModalProps) {
  const [isUpgradingPro, setIsUpgradingPro] = useState(false);
  const [isUpgradingPremium, setIsUpgradingPremium] = useState(false);

  const createCheckoutMutation = trpc.subscription.createCheckoutSession.useMutation({
    onSuccess: (data) => {
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      }
    },
    onError: (error) => {
      toast.error("Failed to start checkout: " + error.message);
      setIsUpgradingPro(false);
      setIsUpgradingPremium(false);
    },
  });

  const handleUpgrade = (tier: "pro" | "premium") => {
    if (tier === "pro") {
      setIsUpgradingPro(true);
    } else {
      setIsUpgradingPremium(true);
    }
    createCheckoutMutation.mutate({ tier });
  };

  const getTitle = () => {
    switch (reason) {
      case "limit_reached":
        return "You've Used All Your Free Predictions!";
      case "approaching_limit":
        return `Only ${remainingPredictions} Prediction${remainingPredictions === 1 ? "" : "s"} Left! ⚡`;
      case "feature_locked":
        return "Unlock Premium Features 🌟";
      default:
        return "Upgrade Your Plan";
    }
  };

  const getDescription = () => {
    switch (reason) {
      case "limit_reached":
        return "Upgrade now to continue receiving personalized AI predictions and unlock your full potential.";
      case "approaching_limit":
        return "You're almost out of free predictions! Upgrade now to keep the insights flowing without interruption.";
      case "feature_locked":
        return "This feature is available for Pro and Premium members. Upgrade to unlock unlimited predictions and advanced features.";
      default:
        return "Choose a plan that fits your needs and unlock unlimited predictions.";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            {getTitle()}
          </DialogTitle>
          <DialogDescription className="text-center text-base">
            {getDescription()}
          </DialogDescription>
        </DialogHeader>

        {reason === "limit_reached" && (
          <div className="bg-primary/10 border border-primary/30 rounded-lg p-4 text-center">
            <p className="text-sm font-medium">
              <Sparkles className="w-4 h-4 inline mr-2" />
              Join thousands of users who've unlocked their future with unlimited predictions!
            </p>
          </div>
        )}

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          {/* Pro Plan */}
          <div className="border border-border rounded-lg p-6 hover:border-primary/50 transition-colors relative">
            <Badge className="absolute top-4 right-4 bg-blue-500/20 text-blue-300 border-blue-500/30">
              <Zap className="w-3 h-3 mr-1" />
              Popular
            </Badge>
            <div className="mb-4">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <Zap className="w-5 h-5 text-blue-400" />
                Pro Plan
              </h3>
              <div className="mt-2">
                <span className="text-3xl font-bold">$9.99</span>
                <span className="text-muted-foreground">/month</span>
              </div>
            </div>
            <ul className="space-y-3 mb-6">
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <span className="text-sm">20 predictions per day</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <span className="text-sm">Full prediction history</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <span className="text-sm">AI personalization</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <span className="text-sm">File attachments</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <span className="text-sm">Advanced categories</span>
              </li>
            </ul>
            <Button 
              className="w-full" 
              size="lg"
              onClick={() => handleUpgrade("pro")}
              disabled={isUpgradingPro || isUpgradingPremium}
            >
              {isUpgradingPro ? "Processing..." : "Upgrade to Pro"}
            </Button>
          </div>

          {/* Premium Plan */}
          <div className="border-2 border-primary rounded-lg p-6 relative bg-primary/5">
            <Badge className="absolute top-4 right-4 bg-yellow-500/20 text-yellow-300 border-yellow-500/30">
              <Crown className="w-3 h-3 mr-1" />
              Best Value
            </Badge>
            <div className="mb-4">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <Crown className="w-5 h-5 text-yellow-400" />
                Premium Plan
              </h3>
              <div className="mt-2">
                <span className="text-3xl font-bold">$19.99</span>
                <span className="text-muted-foreground">/month</span>
              </div>
            </div>
            <ul className="space-y-3 mb-6">
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <span className="text-sm font-medium">100 predictions per day</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <span className="text-sm">Everything in Pro</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <span className="text-sm font-medium">Priority support</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <span className="text-sm font-medium">Early access to new features</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <span className="text-sm font-medium">Premium AI models</span>
              </li>
            </ul>
            <Button 
              className="w-full bg-primary hover:bg-primary/90" 
              size="lg"
              onClick={() => handleUpgrade("premium")}
              disabled={isUpgradingPro || isUpgradingPremium}
            >
              {isUpgradingPremium ? "Processing..." : "Upgrade to Premium"}
            </Button>
          </div>
        </div>

        {/* Feature Comparison Table */}
        <div className="mt-8">
          <h4 className="font-semibold mb-4 text-center">Detailed Comparison</h4>
          <div className="border border-border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left p-3 font-medium">Feature</th>
                  <th className="text-center p-3 font-medium">Free</th>
                  <th className="text-center p-3 font-medium">Pro</th>
                  <th className="text-center p-3 font-medium">Premium</th>
                </tr>
              </thead>
              <tbody>
                {FEATURES.map((feature, idx) => (
                  <tr key={idx} className="border-t border-border">
                    <td className="p-3 text-sm">{feature.name}</td>
                    <td className="p-3 text-center text-sm">
                      {typeof feature.free === "boolean" ? (
                        feature.free ? (
                          <Check className="w-4 h-4 text-green-400 mx-auto" />
                        ) : (
                          <X className="w-4 h-4 text-muted-foreground mx-auto" />
                        )
                      ) : (
                        feature.free
                      )}
                    </td>
                    <td className="p-3 text-center text-sm">
                      {typeof feature.pro === "boolean" ? (
                        feature.pro ? (
                          <Check className="w-4 h-4 text-green-400 mx-auto" />
                        ) : (
                          <X className="w-4 h-4 text-muted-foreground mx-auto" />
                        )
                      ) : (
                        feature.pro
                      )}
                    </td>
                    <td className="p-3 text-center text-sm">
                      {typeof feature.premium === "boolean" ? (
                        feature.premium ? (
                          <Check className="w-4 h-4 text-green-400 mx-auto" />
                        ) : (
                          <X className="w-4 h-4 text-muted-foreground mx-auto" />
                        )
                      ) : (
                        feature.premium
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="mt-6 text-center text-sm text-muted-foreground">
          <p>✓ Cancel anytime • ✓ Secure payment • ✓ 30-day money-back guarantee</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
