import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { getLoginUrl } from "@/const";
import { Link } from "wouter";
import { Zap, Crown, History, ArrowRight, Star, Sparkles, TrendingUp, Users, TrendingUp as TrendingUpIcon, Menu, X } from "lucide-react";
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border/50 backdrop-blur-sm sticky top-0 z-50 bg-background/80">
        <div className="container py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/globe-logo.png" alt="Predicsure AI Logo" className="w-8 h-8 object-contain transition-all duration-300 hover:scale-110 hover:drop-shadow-[0_0_8px_rgba(168,85,247,0.6)]" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
              Predicsure AI
            </h1>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4">
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
              <Button asChild variant="default" size="sm" className="relative animate-pulse-glow">
                <a href={getLoginUrl()}>Sign In</a>
              </Button>
            )}
          </div>
          
          {/* Mobile Hamburger */}
          <button
            className="md:hidden p-2 hover:bg-accent rounded-md transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
        
        {/* Mobile Menu Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border/50 bg-background/95 backdrop-blur-sm">
            <div className="container py-4 flex flex-col gap-3">
              {isAuthenticated ? (
                <>
                  <Link href="/history" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="ghost" size="sm" className="w-full justify-start">
                      <History className="w-4 h-4 mr-2" />
                      History
                    </Button>
                  </Link>
                  <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="default" size="sm" className="w-full">
                      Dashboard
                    </Button>
                  </Link>
                </>
              ) : (
                <Button asChild variant="default" size="sm" className="w-full animate-pulse-glow">
                  <a href={getLoginUrl()}>Sign In</a>
                </Button>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-12">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-transparent pointer-events-none" />
        <div className="container relative">
          <div className="max-w-3xl mx-auto text-center space-y-8">
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
            <p className="text-base text-muted-foreground/80 max-w-xl mx-auto italic">
              AI-powered forecasts based on behavioral patterns — not horoscopes.
            </p>
            
            {/* CTA Button */}
            <div className="pt-4">
              <Button asChild size="lg" className="text-lg px-12">
                <Link href="/onboarding">
                  Get Your First Prediction
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <p className="text-sm text-muted-foreground mt-4">
                No credit card required • Start exploring in 2 minutes
              </p>
              
              {/* Trust Indicators */}
              <div className="flex flex-wrap items-center justify-center gap-6 mt-8 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Users className="w-4 h-4 text-primary" />
                  <span>Trusted by 12,400+ users</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <TrendingUpIcon className="w-4 h-4 text-primary" />
                  <span>89% accuracy rate</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <span>Private & Secure</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works - 3-Step Visual Flow */}
      <section className="py-16 bg-card/10">
        <div className="container">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold mb-3">How It Works</h3>
            <p className="text-muted-foreground">Get personalized insights in three simple steps</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {/* Step 1 */}
            <div className="text-center space-y-4 relative">
              <div className="w-20 h-20 mx-auto rounded-full bg-primary/20 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-primary/30 flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-primary" />
                </div>
              </div>
              <div className="absolute top-10 left-[60%] hidden md:block">
                <ArrowRight className="w-6 h-6 text-primary/40" />
              </div>
              <div className="space-y-2">
                <div className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-2">
                  Step 1
                </div>
                <h4 className="text-lg font-semibold">Share Your Situation</h4>
                <p className="text-sm text-muted-foreground">
                  Tell us what area of life you want clarity on—career, love, finances, or personal growth
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="text-center space-y-4 relative">
              <div className="w-20 h-20 mx-auto rounded-full bg-blue-500/20 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-blue-500/30 flex items-center justify-center">
                  <Zap className="w-8 h-8 text-blue-500" />
                </div>
              </div>
              <div className="absolute top-10 left-[60%] hidden md:block">
                <ArrowRight className="w-6 h-6 text-primary/40" />
              </div>
              <div className="space-y-2">
                <div className="inline-block px-3 py-1 rounded-full bg-blue-500/10 text-blue-500 text-xs font-semibold mb-2">
                  Step 2
                </div>
                <h4 className="text-lg font-semibold">AI Analyzes Patterns</h4>
                <p className="text-sm text-muted-foreground">
                  Advanced AI processes your context and identifies emerging patterns and timing
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="text-center space-y-4">
              <div className="w-20 h-20 mx-auto rounded-full bg-green-500/20 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-green-500/30 flex items-center justify-center">
                  <Star className="w-8 h-8 text-green-500" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="inline-block px-3 py-1 rounded-full bg-green-500/10 text-green-500 text-xs font-semibold mb-2">
                  Step 3
                </div>
                <h4 className="text-lg font-semibold">Get Your Forecast</h4>
                <p className="text-sm text-muted-foreground">
                  Receive a detailed timeline showing what's coming, when it matters, and how to navigate it
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof - Testimonials */}
      <section className="py-20 bg-card/20">
        <div className="container">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold mb-3">What People Are Discovering</h3>
            <p className="text-muted-foreground">Real insights from those navigating their paths</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Testimonial 1 */}
            <div className="bg-card/50 border border-border/50 rounded-lg p-6 space-y-4">
              <div className="flex gap-1 text-yellow-500">
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
              </div>
              <p className="text-sm text-muted-foreground italic">
                "The 30-day trajectory showed me exactly when to have that difficult conversation. Two weeks later, everything unfolded just as predicted. I'm still amazed."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-sm font-semibold">
                  SM
                </div>
                <div>
                  <p className="text-sm font-medium">Sarah M.</p>
                  <p className="text-xs text-muted-foreground">Marketing Director</p>
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-card/50 border border-border/50 rounded-lg p-6 space-y-4">
              <div className="flex gap-1 text-yellow-500">
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
              </div>
              <p className="text-sm text-muted-foreground italic">
                "I was skeptical at first, but the career timing prediction was eerily accurate. Got the job offer exactly when it said I would. This isn't your typical horoscope."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-sm font-semibold">
                  JC
                </div>
                <div>
                  <p className="text-sm font-medium">James C.</p>
                  <p className="text-xs text-muted-foreground">Software Engineer</p>
                </div>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-card/50 border border-border/50 rounded-lg p-6 space-y-4">
              <div className="flex gap-1 text-yellow-500">
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
              </div>
              <p className="text-sm text-muted-foreground italic">
                "The relationship trajectory helped me understand patterns I couldn't see on my own. Knowing what was coming gave me the clarity to make better choices."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-pink-500/20 flex items-center justify-center text-sm font-semibold">
                  ER
                </div>
                <div>
                  <p className="text-sm font-medium">Emily R.</p>
                  <p className="text-xs text-muted-foreground">Entrepreneur</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20">
        <div className="container">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold mb-3">Frequently Asked Questions</h3>
            <p className="text-muted-foreground">Everything you need to know about Predicsure AI</p>
          </div>
          
          <Accordion type="single" collapsible className="max-w-3xl mx-auto space-y-4">
            <AccordionItem value="item-1" className="bg-card/30 border border-border/50 rounded-lg px-6">
              <AccordionTrigger className="text-left font-semibold hover:no-underline">
                How is this different from horoscopes or astrology?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Unlike traditional horoscopes that rely on birth dates and celestial positions, our AI analyzes your specific situation, context, and patterns using advanced machine learning. We focus on personalized insights based on your unique circumstances, not generalized zodiac predictions.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2" className="bg-card/30 border border-border/50 rounded-lg px-6">
              <AccordionTrigger className="text-left font-semibold hover:no-underline">
                How accurate are the predictions?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Our AI identifies patterns and likely trajectories based on your input and contextual analysis. While we can't guarantee specific outcomes (the future isn't fixed), users consistently report that our timing predictions and pattern insights align remarkably well with real-world events. Think of it as a sophisticated pattern recognition tool, not fortune-telling.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3" className="bg-card/30 border border-border/50 rounded-lg px-6">
              <AccordionTrigger className="text-left font-semibold hover:no-underline">
                Is my data private and secure?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Absolutely. Your predictions and personal information are encrypted and never shared with third parties. We use enterprise-grade security to protect your data. You can delete your account and all associated data at any time from your account settings.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4" className="bg-card/30 border border-border/50 rounded-lg px-6">
              <AccordionTrigger className="text-left font-semibold hover:no-underline">
                What's the difference between Free and paid tiers?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Free users get instant predictions with basic insights. Plus members unlock 30-day trajectory forecasts with weekly breakdowns. Pro members get 90-day and yearly forecasts plus Deep Mode for more detailed analysis. Premium includes unlimited predictions and priority AI processing.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5" className="bg-card/30 border border-border/50 rounded-lg px-6">
              <AccordionTrigger className="text-left font-semibold hover:no-underline">
                Can I cancel my subscription anytime?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Yes! You can cancel your subscription at any time from your account settings. You'll continue to have access to paid features until the end of your current billing period, and you can always resubscribe later.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-6" className="bg-card/30 border border-border/50 rounded-lg px-6">
              <AccordionTrigger className="text-left font-semibold hover:no-underline">
                How do I get the most accurate predictions?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Be specific and provide context in your questions. Instead of "What will happen in my career?", try "I'm considering a job change in the next 3 months—what timing and patterns should I watch for?" The more context you provide, the more personalized and relevant your predictions will be.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-16 mt-16 bg-card/30">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {/* Brand Column */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <img src="/globe-logo.png" alt="Predicsure AI" className="w-8 h-8" />
                <span className="text-lg font-bold">Predicsure AI</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Personalized AI predictions to help you understand what's shifting in your life.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#hero" className="hover:text-foreground transition-colors">Home</a></li>
                <li><a href="#how-it-works" className="hover:text-foreground transition-colors">How It Works</a></li>
                <li><a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a></li>
                <li><a href="#faq" className="hover:text-foreground transition-colors">FAQ</a></li>
                <li><Link href="/dashboard" className="hover:text-foreground transition-colors">Sign In</Link></li>
              </ul>
            </div>

            {/* Legal & Safety */}
            <div>
              <h3 className="font-semibold mb-4">Legal & Safety</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Data Security</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">AI Methodology</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Disclaimer</a></li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">About</a></li>
                <li><a href="mailto:support@predicsure.ai" className="hover:text-foreground transition-colors">Contact: support@predicsure.ai</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">LinkedIn</a></li>
              </ul>
            </div>
          </div>

          {/* Trust Badges */}
          <div className="border-t border-border/50 pt-8 mb-8">
            <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span>Secure Payments by Stripe</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span>Data Encrypted – We Never Sell Your Information</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                <span>Powered by Manus + Advanced AI Models</span>
              </div>
            </div>
          </div>

          {/* Copyright & Disclaimer */}
          <div className="text-center space-y-4">
            <p className="text-xs text-muted-foreground max-w-3xl mx-auto">
              Predictions are for guidance only. They are based on pattern analysis and should not replace professional advice. 
              Predicsure AI does not provide medical, legal, or financial advice.
            </p>
            <p className="text-sm text-muted-foreground">
              © 2025 Predicsure AI. All rights reserved.
            </p>
          </div>
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
