import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getLoginUrl } from "@/const";
import { Link } from "wouter";
import { Zap, Crown, History, ArrowRight, Star } from "lucide-react";
import { CrystalBall } from "@/components/CrystalBall";

const SUBSCRIPTION_TIERS = [
  {
    name: "Free",
    tier: "free" as const,
    price: "$0",
    period: "forever",
    predictions: 3,
    icon: Star,
    features: [
      "3 predictions per day",
      "General predictions",
      "Basic AI insights",
    ],
  },
  {
    name: "Pro",
    tier: "pro" as const,
    price: "$9.99",
    period: "per month",
    predictions: 20,
    icon: Zap,
    features: [
      "20 predictions per day",
      "All prediction categories",
      "Advanced AI insights",
      "Priority support",
    ],
    popular: true,
  },
  {
    name: "Premium",
    tier: "premium" as const,
    price: "$29.99",
    period: "per month",
    predictions: 100,
    icon: Crown,
    features: [
      "100 predictions per day",
      "All prediction categories",
      "Premium AI insights",
      "Priority support",
      "Early access to new features",
    ],
  },
];

export default function Home() {
  const { user, loading, isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CrystalBall size="lg" />
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
              {isAuthenticated ? (
                <Button asChild size="lg" className="text-lg px-8">
                  <Link href="/dashboard">
                    Get Your Prediction
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                </Button>
              ) : (
                <Button asChild size="lg" className="text-lg px-8">
                  <a href={getLoginUrl()}>
                    Start Free
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </a>
                </Button>
              )}
            </div>
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
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {SUBSCRIPTION_TIERS.map((tier) => {
              const Icon = tier.icon;
              return (
                <Card 
                  key={tier.tier} 
                  className={`relative ${tier.popular ? 'border-primary shadow-lg shadow-primary/20' : ''}`}
                >
                  {tier.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <Badge className="bg-primary text-primary-foreground">Most Popular</Badge>
                    </div>
                  )}
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <Icon className="w-8 h-8 text-primary" />
                    </div>
                    <CardTitle className="text-2xl">{tier.name}</CardTitle>
                    <CardDescription>
                      <span className="text-3xl font-bold text-foreground">{tier.price}</span>
                      <span className="text-muted-foreground ml-2">{tier.period}</span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-primary font-semibold">
                        <CrystalBall size="sm" />
                        {tier.predictions} predictions/day
                      </div>
                      {tier.features.map((feature, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <span className="text-primary mt-0.5">✓</span>
                          {feature}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter>
                    {isAuthenticated ? (
                      <Button asChild className="w-full" variant={tier.popular ? "default" : "outline"}>
                        <Link href="/dashboard">
                          {tier.tier === "free" ? "Get Started" : "Upgrade Now"}
                        </Link>
                      </Button>
                    ) : (
                      <Button asChild className="w-full" variant={tier.popular ? "default" : "outline"}>
                        <a href={getLoginUrl()}>Get Started</a>
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
      <footer className="border-t border-border/50 py-8">
        <div className="container text-center text-muted-foreground">
          <p>© 2024 AI Predictions. Powered by advanced artificial intelligence.</p>
        </div>
      </footer>
    </div>
  );
}
