import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Sparkles, ArrowRight, Lock } from "lucide-react";
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
      <DialogContent className="max-w-lg">
        <DialogHeader className="text-center pb-2">
          <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <Sparkles className="w-8 h-8 text-primary" />
          </div>
          <DialogTitle className="text-2xl font-semibold">
            There are two possible patterns here
          </DialogTitle>
          <DialogDescription className="text-base mt-2">
            I need to determine which one applies to you. Your responses suggest a fork in the path — but I can't see which direction you're actually facing.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* The Diagnostic Frame */}
          <Card className="p-5 border border-primary/20 bg-primary/5">
            <p className="text-sm text-muted-foreground leading-relaxed">
              The pattern I'm seeing could unfold in two very different ways. One leads toward what you're hoping for. The other reveals something you might not be ready to see yet.
            </p>
            <p className="text-sm text-foreground mt-3 font-medium">
              To differentiate between them, I need to go deeper.
            </p>
          </Card>

          {/* What Clarity Provides */}
          <div className="space-y-3">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">With deeper clarity, I can show you:</p>
            <div className="space-y-2">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                <div className="w-2 h-2 rounded-full bg-primary"></div>
                <span className="text-sm">Which pattern is actually operating in your situation</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                <div className="w-2 h-2 rounded-full bg-primary"></div>
                <span className="text-sm">The internal shift that determines which path unfolds</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                <div className="w-2 h-2 rounded-full bg-primary"></div>
                <span className="text-sm">Conditional forecasts based on your specific position</span>
              </div>
            </div>
          </div>

          {/* Single Clear CTA */}
          <div className="pt-2">
            <Button asChild className="w-full h-12 text-base" size="lg">
              <Link href="/dashboard?upgrade=plus">
                Continue to Clarity
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
            <p className="text-center text-xs text-muted-foreground mt-3">
              Unlimited predictions · Starting at $9.99/month
            </p>
          </div>

          {/* Dismiss Option - Subtle */}
          <div className="text-center">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => onOpenChange(false)}
              className="text-muted-foreground/60 hover:text-muted-foreground text-xs"
            >
              Not right now
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
