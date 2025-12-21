import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
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
  predictionCategory = "general"
}: PostPredictionPaywallProps) {
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md mx-auto">
        <DialogHeader className="text-center pb-2">
          <div className="mx-auto w-14 h-14 flex items-center justify-center mb-4">
            <img src="/logo.svg" alt="Predicsure AI" className="w-14 h-14" />
          </div>
          <DialogTitle className="text-2xl font-semibold">
            This thread isn't finished.
          </DialogTitle>
          <DialogDescription className="text-base mt-2 leading-relaxed">
            There's more unfolding here — something hasn't settled yet, and that's why this still feels open.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Simple Value Proposition */}
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Plus lets you continue when things feel unclear — without interruptions.
            </p>
          </div>

          {/* Single Clear CTA - Plus Only */}
          <div className="space-y-3">
            <Button asChild className="w-full h-12 text-base" size="lg">
              <Link href="/dashboard?upgrade=plus">
                Continue with Plus
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
            <p className="text-center text-xs text-muted-foreground">
              $9.99/month · Unlimited clarity · Cancel anytime
            </p>
          </div>

          {/* Annual Option - Subtle */}
          <div className="text-center pt-2 border-t border-border/50">
            <p className="text-xs text-muted-foreground mb-2">
              Prefer not to carry this uncertainty forward?
            </p>
            <Button asChild variant="ghost" size="sm" className="text-primary hover:text-primary/80">
              <Link href="/dashboard?upgrade=premium">
                Get Premium for $59/year →
              </Link>
            </Button>
          </div>

          {/* Dismiss Option - Very Subtle */}
          <div className="text-center">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => onOpenChange(false)}
              className="text-muted-foreground/50 hover:text-muted-foreground text-xs"
            >
              Not right now
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
