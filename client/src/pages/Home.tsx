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
              Unlock Your Future with{" "}
              <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
                AI-Powered Predictions
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Get personalized insights about your career, love life, finances, and health. 
              Our advanced AI analyzes your questions and provides meaningful predictions tailored just for you.
            </p>
            <div className="flex gap-4 justify-center pt-4">
              <Button asChild size="lg" className="text-lg px-8">
                <Link href="/dashboard">
                  Start Free
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
            </div>
            
            {/* Social Proof Stats */}
            <SocialProofStats />
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-card/30">
        <div className="container">
          <div className="text-center mb-12">
            <h3 className="text-4xl font-bold mb-4">Choose Your Plan</h3>
            <p className="text-xl text-muted-foreground">
              Select the perfect plan for your prediction needs
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {SUBSCRIPTION_TIERS.map((tier) => {
              const Icon = tier.icon;
              return (
                <Card 
                  key={tier.tier} 
                  className={`relative ${tier.popular ? 'border-primary shadow-lg shadow-primary/20 scale-105' : ''}`}
                >
                  {tier.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <Badge className="bg-primary text-primary-foreground px-4 py-1">
                        Most Popular
                      </Badge>
                    </div>
                  )}
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <Icon className="w-8 h-8 text-primary" />
                      {tier.tier !== "free" && (
                        <Badge variant="outline" className="text-xs">
                          {tier.predictions}
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="text-2xl">{tier.name}</CardTitle>
                    <div className="mt-4">
                      <span className="text-4xl font-bold">{tier.price}</span>
                      <span className="text-muted-foreground ml-2">{tier.period}</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {tier.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <Sparkles className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter>
                    {isAuthenticated ? (
                      <Button asChild className="w-full" variant={tier.popular ? "default" : "outline"}>
                        <Link href="/dashboard">
                          {tier.tier === "free" ? "Current Plan" : "Upgrade"}
                        </Link>
                      </Button>
                    ) : (
                      <Button asChild className="w-full" variant={tier.popular ? "default" : "outline"}>
                        <Link href="/dashboard">
                          Get Started
                        </Link>
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              );
            })}
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
