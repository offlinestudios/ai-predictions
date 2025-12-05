import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Lock, Sparkles, TrendingUp, Zap } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { useState } from "react";

interface ScrollRevealPaywallProps {
  category: string;
  userTier: string;
}

const TEASER_CONTENT = {
  career: [
    "Day 12: An unexpected opportunity surfaces through a former colleague...",
    "Day 18: A critical decision point emerges that could shift your trajectory by +31%...",
    "Week 3: The convergence of three separate threads creates a rare window...",
    "Day 25: Your preparation in the first phase pays dividends when..."
  ],
  love: [
    "Day 9: A subtle shift in communication patterns reveals...",
    "Day 16: An unexpected encounter during a routine activity sparks...",
    "Week 3: The emotional breakthrough you've been seeking arrives through...",
    "Day 22: A moment of vulnerability creates the opening for..."
  ],
  finance: [
    "Day 11: A market shift creates a 48-hour window for...",
    "Day 17: Your financial discipline in the first two weeks positions you to...",
    "Week 3: Three income streams converge, creating momentum toward...",
    "Day 24: A strategic decision made on this day determines whether..."
  ],
  health: [
    "Day 10: Your body responds to the changes with a noticeable surge in...",
    "Day 15: A pattern becomes clear that connects your energy levels to...",
    "Week 3: The compound effect of small daily choices manifests as...",
    "Day 21: A breakthrough moment where mind and body alignment..."
  ],
  general: [
    "Day 13: Multiple threads from different life areas begin to interweave...",
    "Day 19: A chance encounter leads to insights about...",
    "Week 3: The pattern that's been building reaches a critical inflection point...",
    "Day 26: Everything shifts when you realize..."
  ],
  sports: [
    "Day 8: Team dynamics shift after a key player's performance in...",
    "Day 14: Historical patterns suggest a momentum reversal during...",
    "Week 3: The underdog narrative gains traction as statistics reveal...",
    "Day 20: A critical matchup exposes vulnerabilities that..."
  ],
  stocks: [
    "Day 7: Market sentiment shifts as institutional investors begin...",
    "Day 15: Technical indicators align with a rare pattern last seen in...",
    "Week 3: Earnings season creates volatility that savvy traders leverage by...",
    "Day 23: A sector rotation accelerates, creating opportunities in..."
  ]
};

export default function ScrollRevealPaywall({ category, userTier }: ScrollRevealPaywallProps) {
  const [isUpgrading, setIsUpgrading] = useState(false);
  
  const createCheckoutMutation = trpc.subscription.createCheckoutSession.useMutation({
    onSuccess: (data) => {
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      }
    },
    onError: (error) => {
      toast.error(error.message);
      setIsUpgrading(false);
    },
  });

  const handleUpgrade = () => {
    setIsUpgrading(true);
    createCheckoutMutation.mutate({ tier: "pro" });
  };

  const teasers = TEASER_CONTENT[category as keyof typeof TEASER_CONTENT] || TEASER_CONTENT.general;

  return (
    <Card className="mt-6 overflow-hidden border-2 border-primary/30 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      {/* Header */}
      <div className="p-6 pb-4 border-b border-primary/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Lock className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Extended Prediction Timeline</h3>
              <p className="text-sm text-muted-foreground">Unlock 30-day detailed forecast with Deep Mode analysis</p>
            </div>
          </div>
          <Badge className="bg-gradient-to-r from-primary to-secondary text-primary-foreground">
            <Sparkles className="w-3 h-3 mr-1" />
            Premium
          </Badge>
        </div>
      </div>

      {/* Teaser Content */}
      <div className="p-6 space-y-4 relative">
        {teasers.map((teaser, index) => (
          <div 
            key={index}
            className="relative p-4 rounded-lg bg-card/50 border border-border"
            style={{
              filter: index > 0 ? `blur(${index * 2}px)` : 'none',
              opacity: index > 0 ? Math.max(0.3, 1 - (index * 0.25)) : 1
            }}
          >
            <div className="flex items-start gap-3">
              <TrendingUp className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
              <p className="text-sm">
                {teaser}
                {index === 0 && <span className="ml-2 text-muted-foreground italic">[Preview]</span>}
              </p>
            </div>
          </div>
        ))}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background pointer-events-none" />
      </div>

      {/* CTA Section */}
      <div className="p-6 pt-4 bg-card/30 border-t border-primary/20">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <p className="font-medium mb-1">Unlock the Full 30-Day Prediction</p>
            <p className="text-sm text-muted-foreground">
              Get day-by-day insights, critical decision points, and strategic recommendations
            </p>
          </div>
          <Button 
            size="lg" 
            className="w-full sm:w-auto whitespace-nowrap"
            onClick={handleUpgrade}
            disabled={isUpgrading}
          >
            {isUpgrading ? (
              <>Redirecting...</>
            ) : (
              <>
                <Zap className="w-4 h-4 mr-2" />
                Upgrade to Pro - $9.99/mo
              </>
            )}
          </Button>
        </div>
        
        <div className="mt-4 pt-4 border-t border-border/50">
          <div className="grid grid-cols-3 gap-4 text-center text-xs text-muted-foreground">
            <div>
              <div className="font-semibold text-foreground mb-1">20 predictions/day</div>
              <div>vs 3 total</div>
            </div>
            <div>
              <div className="font-semibold text-foreground mb-1">Deep Mode</div>
              <div>Premium analysis</div>
            </div>
            <div>
              <div className="font-semibold text-foreground mb-1">30-day forecasts</div>
              <div>Extended timeline</div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
