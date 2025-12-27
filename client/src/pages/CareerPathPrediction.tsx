import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Briefcase, Sparkles, CheckCircle } from "lucide-react";
import { Helmet } from "react-helmet-async";

export default function CareerPathPrediction() {
  return (
    <>
      <Helmet>
        <title>Career Path Prediction | Predicsure AI</title>
        <meta name="description" content="Discover your ideal career path. Get personalized predictions based on your personality, strengths, and professional trajectory." />
        <meta property="og:title" content="Career Path Prediction | Predicsure AI" />
        <meta property="og:description" content="Discover your ideal career path. Get personalized predictions based on your personality, strengths, and professional trajectory." />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://www.predicsure.com/career-path-prediction" />
      </Helmet>

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

        {/* Hero Section */}
        <section className="container max-w-4xl py-16 space-y-8">
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <Briefcase className="w-16 h-16 text-primary" />
            </div>
            <h1 className="text-5xl font-bold tracking-tight">
              Are You On the Right Career Path?
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Professional fulfillment isn't about finding the "perfect" job.<br />
              It's about aligning your work with who you are.
            </p>
            <Button asChild size="lg" className="text-lg px-8 py-6">
              <Link href="/psyche-onboarding">
                Discover your career trajectory
              </Link>
            </Button>
          </div>
        </section>

        {/* Reassurance Section */}
        <section className="bg-muted/30 py-16">
          <div className="container max-w-4xl space-y-8">
            <h2 className="text-3xl font-semibold text-center">
              Feeling Uncertain About Your Career? You're Not Alone
            </h2>
            <div className="prose prose-invert max-w-none space-y-6">
              <p className="text-lg text-muted-foreground">
                Many people wonder if they're in the right field, if they should make a change, or if they're wasting their potential.
              </p>
              <p className="text-lg text-muted-foreground">
                But career satisfaction isn't about luck or guessing. It emerges from understanding your natural strengths, work style, and what truly motivates you.
              </p>
              <p className="text-lg text-muted-foreground">
                The clearer you are about your patterns, the more confidently you can navigate your professional future.
              </p>
            </div>
          </div>
        </section>

        {/* Authority Section */}
        <section className="container max-w-4xl py-16 space-y-8">
          <div className="flex items-center gap-3 justify-center">
            <Sparkles className="w-8 h-8 text-primary" />
            <h2 className="text-3xl font-semibold">
              Career Predictions Based on Your Strengths
            </h2>
          </div>
          <div className="prose prose-invert max-w-none space-y-6">
            <p className="text-lg text-muted-foreground">
              Predicsure doesn't give generic career advice or vague suggestions.
            </p>
            <p className="text-lg text-muted-foreground">
              We analyze your personality type, decision-making style, and natural talents to predict which career paths will bring you fulfillment.
            </p>
            <p className="text-lg text-muted-foreground">
              Your professional trajectory isn't random — it follows the patterns you create through your choices, preferences, and strengths.
            </p>
          </div>
        </section>

        {/* Personalization Bridge */}
        <section className="bg-muted/30 py-16">
          <div className="container max-w-4xl space-y-8">
            <h2 className="text-3xl font-semibold text-center">
              Your Career Path is Unique to You
            </h2>
            <div className="prose prose-invert max-w-none space-y-6">
              <p className="text-lg text-muted-foreground">
                What works for someone else might not work for you. Career fulfillment depends on your specific personality, values, and work preferences.
              </p>
              <p className="text-lg text-muted-foreground">
                To predict your professional future accurately, we need to understand your unique profile first.
              </p>
              <p className="text-lg text-muted-foreground">
                That's why we begin with a brief personality assessment that reveals:
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6 mt-8">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold mb-2">Your Natural Strengths</h3>
                  <p className="text-sm text-muted-foreground">The skills and talents you naturally excel at</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold mb-2">Your Work Style</h3>
                  <p className="text-sm text-muted-foreground">How you prefer to work and make decisions</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold mb-2">Your Professional Path</h3>
                  <p className="text-sm text-muted-foreground">Where your patterns naturally lead you</p>
                </div>
              </div>
            </div>

            <p className="text-lg text-muted-foreground text-center mt-8">
              Once we understand your pattern, we can map your career trajectory.
            </p>
          </div>
        </section>

        {/* Primary CTA Section */}
        <section className="container max-w-4xl py-16">
          <div className="text-center space-y-6 bg-primary/10 rounded-2xl p-12 border border-primary/20">
            <h2 className="text-3xl font-semibold">
              Discover Your Career Path
            </h2>
            <p className="text-lg text-muted-foreground">
              No credit card required. Takes 3 minutes.
            </p>
            <Button asChild size="lg" className="text-lg px-8 py-6">
              <Link href="/psyche-onboarding">
                Start your personal reading
              </Link>
            </Button>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="bg-muted/30 py-16">
          <div className="container max-w-4xl space-y-8">
            <h2 className="text-3xl font-semibold text-center mb-12">
              Frequently Asked Questions
            </h2>
            
            <div className="space-y-8">
              <div className="space-y-3">
                <h3 className="text-xl font-semibold">Will you tell me exactly what job to pursue?</h3>
                <p className="text-muted-foreground">
                  We don't prescribe specific job titles. Instead, we help you understand what types of work align with your personality, strengths, and values. This gives you clarity to make your own informed career decisions.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="text-xl font-semibold">What if I'm thinking about changing careers?</h3>
                <p className="text-muted-foreground">
                  Our predictions can help you understand whether a career change aligns with your natural patterns and strengths. We'll show you what types of work are likely to bring you fulfillment based on who you are.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="text-xl font-semibold">Can this help me if I'm just starting my career?</h3>
                <p className="text-muted-foreground">
                  Absolutely. Understanding your personality patterns early in your career can help you make better choices about which paths to pursue and which to avoid. Many people wish they'd had this clarity sooner.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="text-xl font-semibold">How is this different from career aptitude tests?</h3>
                <p className="text-muted-foreground">
                  Traditional aptitude tests focus on skills. We focus on personality patterns and how they shape your professional trajectory. We look at how you naturally work, decide, and find meaning — not just what you're capable of doing.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="text-xl font-semibold">What if I'm already successful but unfulfilled?</h3>
                <p className="text-muted-foreground">
                  Success and fulfillment are different. Our predictions help you understand whether your current path aligns with your deeper patterns and values — or if there's a better fit for who you are.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="container max-w-4xl py-16">
          <div className="text-center space-y-6">
            <Button asChild size="lg" className="text-lg px-8 py-6">
              <Link href="/psyche-onboarding">
                Find your career path →
              </Link>
            </Button>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-border/50 py-8">
          <div className="container text-center text-sm text-muted-foreground">
            <p>© 2025 Predicsure AI. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </>
  );
}
