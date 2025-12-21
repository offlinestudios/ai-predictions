import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Check, Loader2 } from "lucide-react";
import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { useState } from "react";
import { toast } from "sonner";

export default function Pricing() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [, navigate] = useLocation();
  const [loadingTier, setLoadingTier] = useState<string | null>(null);
  
  const createCheckoutMutation = trpc.subscription.createCheckoutSession.useMutation({
    onSuccess: (data) => {
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      }
    },
    onError: (error) => {
      toast.error("Failed to create checkout session: " + error.message);
      setLoadingTier(null);
    },
  });

  const handleUpgrade = (tier: "plus" | "premium") => {
    if (!isAuthenticated) {
      window.location.href = getLoginUrl();
      return;
    }

    setLoadingTier(tier);
    
    // Map tier to the correct format for the API
    // Plus uses "pro" tier in API with monthly billing
    // Premium uses "premium" tier in API with yearly billing
    const apiTier = tier === "plus" ? "pro" : "premium";
    const interval = tier === "premium" ? "year" : "month";
    
    createCheckoutMutation.mutate({
      tier: apiTier as "pro" | "premium",
      interval,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 backdrop-blur-sm bg-background/80 sticky top-0 z-50">
        <div className="container flex items-center justify-between h-16">
          <Link href="/">
            <div className="flex items-center gap-2 cursor-pointer">
              <img src="/logo.svg" alt="Predicsure AI" className="w-8 h-8" />
              <span className="text-lg font-bold">Predicsure AI</span>
            </div>
          </Link>
          <Button asChild variant="ghost" size="sm">
            <Link href="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
          </Button>
        </div>
      </header>

      {/* Content */}
      <div className="container max-w-5xl py-16 space-y-12">
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold">Stay Oriented</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Continue when clarity matters. No interruptions when you need guidance most.
          </p>
        </div>

        {/* Pricing Tiers - 3 columns */}
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {/* Free Tier */}
          <div className="border border-border rounded-2xl p-6 flex flex-col">
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-1 text-muted-foreground">Free</h3>
              <div className="flex items-baseline gap-1 mb-3">
                <span className="text-4xl font-bold">$0</span>
              </div>
              <p className="text-sm text-muted-foreground">A first look into what's shifting</p>
            </div>

            <ul className="space-y-3 mb-8 flex-grow">
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <span className="text-sm">3 predictions</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <span className="text-sm">Short, focused insights</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <span className="text-sm">All life categories</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <span className="text-sm">No commitment</span>
              </li>
            </ul>

            <Button asChild variant="outline" size="lg" className="w-full">
              <Link href="/psyche-onboarding">Get Started</Link>
            </Button>
          </div>

          {/* Plus Tier - Main */}
          <div className="border-2 border-primary rounded-2xl p-6 flex flex-col relative bg-primary/5">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2">
              <span className="bg-primary text-primary-foreground text-xs font-semibold px-4 py-1.5 rounded-full">
                MOST POPULAR
              </span>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-1">Plus</h3>
              <div className="flex items-baseline gap-1 mb-3">
                <span className="text-4xl font-bold">$9.99</span>
                <span className="text-muted-foreground">/month</span>
              </div>
              <p className="text-sm text-muted-foreground">Stay oriented when things are unclear</p>
            </div>

            <ul className="space-y-3 mb-8 flex-grow">
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <span className="text-sm"><strong>Unlimited predictions</strong></span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <span className="text-sm">Ongoing guidance as situations unfold</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <span className="text-sm">See patterns before they repeat</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <span className="text-sm">Deeper readings when it matters</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <span className="text-sm">Cancel anytime</span>
              </li>
            </ul>

            <Button 
              size="lg" 
              className="w-full"
              onClick={() => handleUpgrade("plus")}
              disabled={loadingTier === "plus"}
            >
              {loadingTier === "plus" ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Loading...
                </>
              ) : (
                "Continue with Plus"
              )}
            </Button>
          </div>

          {/* Premium Tier */}
          <div className="border border-border rounded-2xl p-6 flex flex-col">
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-1">Premium</h3>
              <div className="flex items-baseline gap-1 mb-3">
                <span className="text-4xl font-bold">$59</span>
                <span className="text-muted-foreground">/year</span>
              </div>
              <p className="text-sm text-primary font-medium">Clarity without interruption</p>
            </div>

            <ul className="space-y-3 mb-8 flex-grow">
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <span className="text-sm">Everything in Plus</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <span className="text-sm"><strong>No weekly limits — ever</strong></span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <span className="text-sm">Long-range perspective</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <span className="text-sm">Priority access to new features</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <span className="text-sm">One simple plan for the year</span>
              </li>
            </ul>

            <Button 
              variant="outline" 
              size="lg" 
              className="w-full"
              onClick={() => handleUpgrade("premium")}
              disabled={loadingTier === "premium"}
            >
              {loadingTier === "premium" ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Loading...
                </>
              ) : (
                "Get Premium"
              )}
            </Button>
          </div>
        </div>

        {/* Simple FAQ */}
        <div className="max-w-2xl mx-auto">
          <div className="space-y-6 text-center">
            <div>
              <h3 className="text-lg font-semibold mb-2">Can I cancel anytime?</h3>
              <p className="text-muted-foreground">
                Yes. Cancel with one click. You'll keep access until your billing period ends.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">What if it's not for me?</h3>
              <p className="text-muted-foreground">
                7-day money-back guarantee. No questions asked.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <p className="text-muted-foreground mb-6">
            Not sure yet? Start free and see how it feels.
          </p>
          <Button asChild variant="ghost" size="lg">
            <Link href="/psyche-onboarding">
              Try 3 Free Predictions
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
