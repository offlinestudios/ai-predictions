import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Sparkles, Users, TrendingUp, Lock, Zap } from "lucide-react";

interface SignupGateProps {
  open: boolean;
  predictionCategory?: string;
}

export default function SignupGate({ open, predictionCategory = "general" }: SignupGateProps) {
  const handleSignup = () => {
    window.location.href = "/api/oauth/login";
  };

  return (
    <Dialog open={open} onOpenChange={() => {}} modal>
      <DialogContent 
        className="max-w-2xl"
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
        showCloseButton={false}
      >
        <DialogHeader>
          <div className="flex justify-center mb-4">
            <div className="p-3 rounded-full bg-primary/10">
              <Sparkles className="w-8 h-8 text-primary" />
            </div>
          </div>
          <DialogTitle className="text-2xl font-bold text-center">
            Create Your Free Account to Continue
          </DialogTitle>
          <DialogDescription className="text-center text-base mt-2">
            You've experienced the power of AI predictions. Sign up now to unlock your full potential.
          </DialogDescription>
        </DialogHeader>

        {/* Social Proof */}
        <div className="grid grid-cols-3 gap-4 my-6 p-4 bg-card/50 rounded-lg border border-border">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-2xl font-bold text-primary mb-1">
              <Users className="w-5 h-5" />
              12.4K+
            </div>
            <div className="text-xs text-muted-foreground">Active Users</div>
          </div>
          <div className="text-center border-x border-border">
            <div className="flex items-center justify-center gap-1 text-2xl font-bold text-primary mb-1">
              <TrendingUp className="w-5 h-5" />
              89%
            </div>
            <div className="text-xs text-muted-foreground">Accuracy Rate</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-2xl font-bold text-primary mb-1">
              <Sparkles className="w-5 h-5" />
              250K+
            </div>
            <div className="text-xs text-muted-foreground">Predictions Made</div>
          </div>
        </div>

        {/* Benefits */}
        <div className="space-y-3 mb-6">
          <div className="flex items-start gap-3 p-3 rounded-lg bg-primary/5 border border-primary/20">
            <div className="p-1 rounded-full bg-primary/10 mt-0.5">
              <Check className="w-4 h-4 text-primary" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-sm">Get 3 More Predictions This Week</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Free accounts get 3 predictions per week vs 1 for anonymous users
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-lg bg-primary/5 border border-primary/20">
            <div className="p-1 rounded-full bg-primary/10 mt-0.5">
              <Check className="w-4 h-4 text-primary" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-sm">Save Your Prediction History</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Access all your past predictions anytime, track accuracy over time
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-lg bg-primary/5 border border-primary/20">
            <div className="p-1 rounded-full bg-primary/10 mt-0.5">
              <Check className="w-4 h-4 text-primary" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-sm">Unlock Premium Features</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Upgrade anytime to Deep Mode, 30-day forecasts, and unlimited predictions
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-lg bg-primary/5 border border-primary/20">
            <div className="p-1 rounded-full bg-primary/10 mt-0.5">
              <Check className="w-4 h-4 text-primary" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-sm">Personalized Insights</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Build your profile for more accurate, tailored predictions
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="space-y-3">
          <Button 
            size="lg" 
            className="w-full text-lg py-6"
            onClick={handleSignup}
          >
            <Sparkles className="w-5 h-5 mr-2" />
            Create Free Account - Get 3 More Predictions
          </Button>
          
          <p className="text-center text-xs text-muted-foreground">
            Free forever • No credit card required • Takes 30 seconds
          </p>
        </div>

        {/* Upgrade Teaser */}
        <div className="mt-6 pt-6 border-t border-border">
          <p className="text-center text-sm text-muted-foreground mb-3">
            Want unlimited predictions right away?
          </p>
          <div className="flex items-center justify-center gap-4 text-xs">
            <Badge variant="outline" className="gap-1">
              <Zap className="w-3 h-3" />
              Pro: $9.99/mo
            </Badge>
            <Badge variant="outline" className="gap-1">
              <Lock className="w-3 h-3" />
              Deep Mode Included
            </Badge>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
