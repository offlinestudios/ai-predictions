import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Sparkles, ArrowRight, Lock, Zap, Crown } from "lucide-react";
import { Link } from "wouter";

interface DepthPaywallProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onContinueFree: () => void;
  rootQuestion?: string | null;
}

export default function DepthPaywall({ 
  open, 
  onOpenChange,
  onContinueFree,
  rootQuestion
}: DepthPaywallProps) {
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">
            <span className="text-foreground">
              I can see two patterns here...
            </span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-2">
          {/* Pattern Differentiation Message */}
          <div className="space-y-4">
            <p className="text-muted-foreground leading-relaxed">
              Based on what you've shared, there are <span className="text-foreground font-medium">two possible patterns</span> operating — and they lead to <span className="text-foreground font-medium">very different outcomes</span>.
            </p>
            
            {/* Locked Patterns Preview */}
            <Card className="p-4 border border-purple-500/20 bg-purple-500/5">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-full bg-purple-500/10 shrink-0">
                  <Lock className="w-4 h-4 text-purple-400" />
                </div>
                <div className="flex-1 space-y-2">
                  <p className="text-sm text-muted-foreground blur-[2px] select-none">
                    Pattern A: The situation resolves through...
                  </p>
                  <p className="text-sm text-muted-foreground blur-[2px] select-none">
                    Pattern B: Without a shift, the trajectory leads to...
                  </p>
                </div>
              </div>
            </Card>

            <p className="text-sm text-muted-foreground">
              To tell you <span className="text-foreground">which pattern applies to you</span> — and where each path leads — I need to go deeper.
            </p>
          </div>

          {/* Upgrade Options */}
          <div className="space-y-3">
            {/* Plus Tier - Primary CTA */}
            <Card className="p-5 border-2 border-purple-500/40 bg-purple-500/5 hover:border-purple-500/60 transition-all">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-purple-400" />
                  <h3 className="text-lg font-semibold">Unlock Full Analysis</h3>
                </div>
                <span className="text-sm text-muted-foreground">$9.99/mo</span>
              </div>
              <ul className="space-y-1.5 mb-4 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                  <span>See which pattern applies to you</span>
                </li>
                <li className="flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                  <span>Get conditional forecasts with timing</span>
                </li>
                <li className="flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                  <span>Unlimited predictions</span>
                </li>
              </ul>
              <Button asChild className="w-full bg-purple-600 hover:bg-purple-700">
                <Link href="/dashboard?upgrade=plus">
                  Reveal My Pattern
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
            </Card>

            {/* Pro Tier - Secondary */}
            <Card className="p-4 border border-border/50 hover:border-primary/30 transition-all">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Crown className="w-4 h-4 text-primary" />
                  <span className="font-medium">Pro</span>
                  <span className="text-xs text-muted-foreground">$19.99/mo</span>
                </div>
                <Button asChild variant="outline" size="sm">
                  <Link href="/dashboard?upgrade=pro">
                    Full Journey
                    <ArrowRight className="ml-1 w-3 h-3" />
                  </Link>
                </Button>
              </div>
            </Card>
          </div>

          {/* Continue Free Option */}
          <div className="text-center pt-2 border-t border-border/30">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => {
                onContinueFree();
                onOpenChange(false);
              }}
              className="text-muted-foreground hover:text-foreground text-xs"
            >
              Continue with surface-level insights
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
