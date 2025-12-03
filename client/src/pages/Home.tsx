import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getLoginUrl } from "@/const";
import { Link } from "wouter";
import { Zap, Crown, History, ArrowRight, Star, Sparkles, TrendingUp, Users, TrendingUp as TrendingUpIcon } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useEffect, useState } from "react";


const SUBSCRIPTION_TIERS = [
  {
    name: "Free",
    tier: "free" as const,
    price: "$0",
    period: "forever",
    predictions: "3/week",
    icon: Star,
    features: [
      "3 predictions per week",
      "Standard prediction mode",
      "7-day history",
      "Basic features",
    ],
  },
  {
    name: "Plus",
    tier: "plus" as const,
    price: "$9.99",
    period: "per month",
    predictions: "Unlimited",
    icon: Zap,
    features: [
      "Unlimited predictions",
      "30-day trajectory forecasts",
      "Deep Prediction Mode",
      "Advanced confidence scores",
      "Unlimited history",
    ],
    popular: true,
  },
  {
    name: "Pro",
    tier: "pro" as const,
    price: "$19.99",
    period: "per month",
    predictions: "Everything in Plus +",
    icon: Crown,
    features: [
      "90-day trajectory forecasts",
      "Alternate future scenarios",
      "Yearly overview",
      "Prediction tracking dashboard",
      "Priority support",
    ],
  },
  {
    name: "Premium (Yearly)",
    tier: "premium" as const,
    price: "$59",
    period: "per year",
    predictions: "Unlimited",
    icon: Crown,
    features: [
      "Unlimited predictions",
      "Deep Prediction Mode",
      "Tracking dashboard",
      "Batch predictions",
      "Long-term timelines",
      "Early access",
      "Premium crown badge",
    ],
  },
];

export default function Home() {
  const { user, loading, isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border/50 backdrop-blur-sm sticky top-0 z-50 bg-background/80">
        <div className="container py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/globe-logo.png" alt="AI Predictions Logo" className="w-8 h-8 object-contain logo-pulse" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
              AI Predictions
            </h1>
          </div>
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <Link href="/history">
                  <Button variant="ghost" size="sm">
                    <History className="w-4 h-4 mr-2" />
                    History
                  </Button>
                </Link>
                <Link href="/dashboard">
                  <Button variant="default" size="sm">
                    Dashboard
                  </Button>
                </Link>
              </>
            ) : (
              <Button asChild variant="default" size="sm">
                <a href={getLoginUrl()}>Sign In</a>
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-transparent pointer-events-none" />
        <div className="container relative">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <Badge variant="secondary" className="mb-4">
              Powered by Advanced AI
            </Badge>
            <h2 className="text-5xl md:text-6xl font-bold leading-tight">
              See What's{" "}
              <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
                Shifting
              </span>
              {" "}in Your Life Right Now
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Personalized AI predictions about your relationships, career, finances, and internal state. 
              Understand what's coming, when it matters, and how to navigate the next chapter.
            </p>
          </div>
        </div>
      </section>

      {/* Feature Preview Section - Emotional Benefits */}
      <section className="py-20 bg-card/30">
        <div className="container">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold mb-4">See What's Shifting in Your Life</h3>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Personalized AI predictions about your relationships, career, finances, and internal state
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {/* Feature 1: 30-Day Trajectories */}
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                <TrendingUp className="w-8 h-8 text-primary" />
              </div>
              <h4 className="text-xl font-semibold">See Your Next 30 Days</h4>
              <p className="text-muted-foreground">
                Understand what's coming and when key moments will arrive
              </p>
            </div>

            {/* Feature 2: Relationship Insights */}
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-pink-500/10 flex items-center justify-center">
                <Users className="w-8 h-8 text-pink-500" />
              </div>
              <h4 className="text-xl font-semibold">Explore Relationship Trajectories</h4>
              <p className="text-muted-foreground">
                Discover patterns in your connections and upcoming shifts
              </p>
            </div>

            {/* Feature 3: Career Timing */}
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-blue-500/10 flex items-center justify-center">
                <TrendingUpIcon className="w-8 h-8 text-blue-500" />
              </div>
              <h4 className="text-xl font-semibold">Understand Your Career Timing</h4>
              <p className="text-muted-foreground">
                Know when to act, when to wait, and what opportunities are emerging
              </p>
            </div>

            {/* Feature 4: Daily Clarity */}
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-purple-500/10 flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-purple-500" />
              </div>
              <h4 className="text-xl font-semibold">Daily Clarity About Decisions</h4>
              <p className="text-muted-foreground">
                Get insights tailored to your energy patterns and life context
              </p>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center mt-16">
            <Button asChild size="lg" className="text-lg px-12">
              <Link href="/onboarding">
                Get Your First Prediction
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
            <p className="text-sm text-muted-foreground mt-4">
              No credit card required • Start exploring in 2 minutes
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8 bg-card/30">
        <div className="container text-center text-sm text-muted-foreground">
          <p>© 2024 AI Predictions. Powered by advanced artificial intelligence.</p>
        </div>
      </footer>
    </div>
  );
}

function SocialProofStats() {
  const { data: stats, isLoading } = trpc.stats.getGlobal.useQuery();
  const [animatedPredictionsToday, setAnimatedPredictionsToday] = useState(0);
  const [animatedTotalPredictions, setAnimatedTotalPredictions] = useState(0);
  const [animatedTotalUsers, setAnimatedTotalUsers] = useState(0);

  // Animate numbers on load
  useEffect(() => {
    if (!stats) return;

    const duration = 2000; // 2 seconds
    const steps = 60;
    const interval = duration / steps;

    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;

      setAnimatedPredictionsToday(Math.floor(stats.predictionsToday * progress));
      setAnimatedTotalPredictions(Math.floor(stats.totalPredictions * progress));
      setAnimatedTotalUsers(Math.floor(stats.totalUsers * progress));

      if (currentStep >= steps) {
        clearInterval(timer);
        setAnimatedPredictionsToday(stats.predictionsToday);
        setAnimatedTotalPredictions(stats.totalPredictions);
        setAnimatedTotalUsers(stats.totalUsers);
      }
    }, interval);

    return () => clearInterval(timer);
  }, [stats]);

  if (isLoading || !stats) {
    return null;
  }

  return (
    <div className="pt-12 grid grid-cols-3 gap-8 max-w-2xl mx-auto">
      <div className="text-center">
        <div className="flex items-center justify-center mb-2">
          <Sparkles className="w-5 h-5 text-primary mr-2" />
        </div>
        <div className="text-3xl font-bold text-primary">
          {animatedPredictionsToday.toLocaleString()}
        </div>
        <div className="text-sm text-muted-foreground mt-1">Predictions Today</div>
      </div>
      <div className="text-center">
        <div className="flex items-center justify-center mb-2">
          <TrendingUpIcon className="w-5 h-5 text-primary mr-2" />
        </div>
        <div className="text-3xl font-bold text-primary">
          {animatedTotalPredictions.toLocaleString()}
        </div>
        <div className="text-sm text-muted-foreground mt-1">Total Predictions</div>
      </div>
      <div className="text-center">
        <div className="flex items-center justify-center mb-2">
          <Users className="w-5 h-5 text-primary mr-2" />
        </div>
        <div className="text-3xl font-bold text-primary">
          {animatedTotalUsers.toLocaleString()}
        </div>
        <div className="text-sm text-muted-foreground mt-1">Happy Users</div>
      </div>
    </div>
  );
}
