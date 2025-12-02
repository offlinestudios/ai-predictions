import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Sparkles, TrendingUp, BarChart3, Crown, Zap, Lock, ArrowRight } from "lucide-react";
import { Link } from "wouter";

interface PostPredictionPaywallProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userTier: "free" | "plus" | "pro" | "premium";
  predictionCategory?: string;
}

export default function PostPredictionPaywall({ 
  open, 
  onOpenChange,
  userTier,
  predictionCategory = "life"
}: PostPredictionPaywallProps) {
  
  const teaserContent = {
    career: {
      title: "Your Career Breakthrough Moment",
      preview: "Day 17: A key conversation shifts everything...",
      locked: ["Week 2: Major opportunity window opens", "Week 3: Decision point that shapes next quarter", "Week 4: Unexpected alliance forms"]
    },
    love: {
      title: "Your Relationship Turning Point",
      preview: "Day 12: An emotional breakthrough changes the dynamic...",
      locked: ["Week 2: A pattern becomes clear", "Week 3: Communication deepens significantly", "Week 4: New level of understanding emerges"]
    },
    finance: {
      title: "Your Financial Opportunity Window",
      preview: "Day 9: A lucrative opportunity appears...",
      locked: ["Week 2: Strategic timing for major decision", "Week 3: Unexpected financial shift", "Week 4: Long-term pattern becomes visible"]
    },
    health: {
      title: "Your Wellness Transformation",
      preview: "Day 14: Energy levels shift dramatically...",
      locked: ["Week 2: New habit takes root", "Week 3: Physical breakthrough moment", "Week 4: Mental clarity peaks"]
    },
    general: {
      title: "Your Life's Next Chapter",
      preview: "Day 11: Something clicks into place...",
      locked: ["Week 2: A hidden pattern reveals itself", "Week 3: Major shift in perspective", "Week 4: New direction becomes clear"]
    }
  };

  const teaser = teaserContent[predictionCategory as keyof typeof teaserContent] || teaserContent.general;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Want to See Your Full 30-Day Path?
            </span>
          </DialogTitle>
          <DialogDescription className="text-base">
            You've just scratched the surface. Unlock your complete trajectory with week-by-week insights, turning points, and precise timing.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Teaser Preview */}
          <Card className="p-6 border-2 border-primary/20 bg-primary/5">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-lg mb-2">{teaser.title}</h4>
                <p className="text-muted-foreground">{teaser.preview}</p>
              </div>
            </div>
          </Card>

          {/* Locked Content Preview */}
          <div className="space-y-3">
            <p className="text-sm font-medium text-muted-foreground">🔒 Locked Insights:</p>
            {teaser.locked.map((item, index) => (
              <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 relative overflow-hidden">
                <Lock className="w-4 h-4 text-muted-foreground shrink-0" />
                <span className="text-sm text-muted-foreground blur-sm select-none">{item}</span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-background/50 to-background pointer-events-none" />
              </div>
            ))}
          </div>

          {/* Upgrade Options */}
          <div className="grid md:grid-cols-2 gap-4 pt-4">
            {/* Plus Tier */}
            <Card className="p-6 border-2 border-amber-500/30 bg-amber-500/5 hover:border-amber-500/50 transition-all">
              <div className="flex items-center gap-2 mb-4">
                <Zap className="w-6 h-6 text-amber-500" />
                <h3 className="text-xl font-bold">Plus</h3>
              </div>
              <div className="mb-4">
                <span className="text-3xl font-bold">$9.99</span>
                <span className="text-muted-foreground">/month</span>
              </div>
              <ul className="space-y-2 mb-6 text-sm">
                <li className="flex items-start gap-2">
                  <TrendingUp className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <span>Unlimited predictions</span>
                </li>
                <li className="flex items-start gap-2">
                  <TrendingUp className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <span>30-day trajectory forecasts</span>
                </li>
                <li className="flex items-start gap-2">
                  <TrendingUp className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <span>Deep prediction mode</span>
                </li>
              </ul>
              <Button asChild className="w-full bg-amber-500 hover:bg-amber-600">
                <Link href="/dashboard?upgrade=plus">
                  Unlock 30-Day Path
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
            </Card>

            {/* Pro Tier */}
            <Card className="p-6 border-2 border-primary bg-primary/5 hover:border-primary/70 transition-all relative">
              <div className="absolute -top-3 right-4">
                <span className="bg-primary text-primary-foreground text-xs px-3 py-1 rounded-full font-semibold">
                  Best Value
                </span>
              </div>
              <div className="flex items-center gap-2 mb-4">
                <Crown className="w-6 h-6 text-primary" />
                <h3 className="text-xl font-bold">Pro</h3>
              </div>
              <div className="mb-4">
                <span className="text-3xl font-bold">$19.99</span>
                <span className="text-muted-foreground">/month</span>
              </div>
              <ul className="space-y-2 mb-6 text-sm">
                <li className="flex items-start gap-2">
                  <BarChart3 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span>Everything in Plus</span>
                </li>
                <li className="flex items-start gap-2">
                  <BarChart3 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span>90-day & yearly forecasts</span>
                </li>
                <li className="flex items-start gap-2">
                  <BarChart3 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span>Priority AI processing</span>
                </li>
              </ul>
              <Button asChild className="w-full">
                <Link href="/dashboard?upgrade=pro">
                  Unlock Full Journey
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
            </Card>
          </div>

          {/* Continue Free Option */}
          <div className="text-center pt-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => onOpenChange(false)}
              className="text-muted-foreground hover:text-foreground"
            >
              Continue with free predictions
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
