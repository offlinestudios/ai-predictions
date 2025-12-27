import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowLeft, DollarSign, Sparkles, CheckCircle } from "lucide-react";
import { Helmet } from "react-helmet-async";

export default function FinancialFuturePrediction() {
  return (
    <>
      <Helmet>
        <title>Financial Future Prediction | Predicsure AI</title>
        <meta name="description" content="Understand your financial trajectory. Get personalized predictions based on your personality patterns and money mindset." />
        <meta property="og:title" content="Financial Future Prediction | Predicsure AI" />
        <meta property="og:description" content="Understand your financial trajectory. Get personalized predictions based on your personality patterns and money mindset." />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://www.predicsure.com/financial-future-prediction" />
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
              <DollarSign className="w-16 h-16 text-primary" />
            </div>
            <h1 className="text-5xl font-bold tracking-tight">
              What Does Your Financial Future Look Like?
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Financial security isn't just about income.<br />
              It's about understanding your relationship with money.
            </p>
            <Button asChild size="lg" className="text-lg px-8 py-6">
              <Link href="/onboarding">
                Discover your financial trajectory
              </Link>
            </Button>
          </div>
        </section>

        {/* Reassurance Section */}
        <section className="bg-muted/30 py-16">
          <div className="container max-w-4xl space-y-8">
            <h2 className="text-3xl font-semibold text-center">
              Your Financial Future Follows Your Patterns
            </h2>
            <div className="prose prose-invert max-w-none space-y-6">
              <p className="text-lg text-muted-foreground">
                Many people worry about money — whether they'll have enough, whether they're making the right decisions, whether financial security is even possible for them.
              </p>
              <p className="text-lg text-muted-foreground">
                But financial outcomes aren't random. They emerge from consistent patterns in how you think about money, make decisions, and prioritize your resources.
              </p>
              <p className="text-lg text-muted-foreground">
                Understanding these patterns gives you clarity about where you're headed — and how to shape your financial future.
              </p>
            </div>
          </div>
        </section>

        {/* Authority Section */}
        <section className="container max-w-4xl py-16 space-y-8">
          <div className="flex items-center gap-3 justify-center">
            <Sparkles className="w-8 h-8 text-primary" />
            <h2 className="text-3xl font-semibold">
              Predictions Based on Your Money Mindset
            </h2>
          </div>
          <div className="prose prose-invert max-w-none space-y-6">
            <p className="text-lg text-muted-foreground">
              Predicsure doesn't give generic financial advice or investment tips.
            </p>
            <p className="text-lg text-muted-foreground">
              We analyze your personality patterns, decision-making style, and relationship with money to predict your financial trajectory.
            </p>
            <p className="text-lg text-muted-foreground">
              Your financial future isn't determined by luck — it's shaped by the patterns you create through your daily choices and mindset.
            </p>
          </div>
        </section>

        {/* Personalization Bridge */}
        <section className="bg-muted/30 py-16">
          <div className="container max-w-4xl space-y-8">
            <h2 className="text-3xl font-semibold text-center">
              Your Financial Path is Personal
            </h2>
            <div className="prose prose-invert max-w-none space-y-6">
              <p className="text-lg text-muted-foreground">
                Two people with the same income can have completely different financial futures — because outcomes depend on mindset, habits, and decision patterns.
              </p>
              <p className="text-lg text-muted-foreground">
                To predict your financial trajectory accurately, we need to understand your unique relationship with money first.
              </p>
              <p className="text-lg text-muted-foreground">
                That's why we begin with a brief personality assessment that reveals:
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6 mt-8">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold mb-2">Your Money Mindset</h3>
                  <p className="text-sm text-muted-foreground">How you naturally think about and approach finances</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold mb-2">Your Decision Patterns</h3>
                  <p className="text-sm text-muted-foreground">How you make financial choices and prioritize resources</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold mb-2">Your Financial Trajectory</h3>
                  <p className="text-sm text-muted-foreground">Where your patterns are naturally leading you</p>
                </div>
              </div>
            </div>

            <p className="text-lg text-muted-foreground text-center mt-8">
              Once we understand your pattern, we can show you your financial path.
            </p>
          </div>
        </section>

        {/* Primary CTA Section */}
        <section className="container max-w-4xl py-16">
          <div className="text-center space-y-6 bg-primary/10 rounded-2xl p-12 border border-primary/20">
            <h2 className="text-3xl font-semibold">
              See Your Financial Future
            </h2>
            <p className="text-lg text-muted-foreground">
              No credit card required. Takes 3 minutes.
            </p>
            <Button asChild size="lg" className="text-lg px-8 py-6">
              <Link href="/onboarding">
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
                <h3 className="text-xl font-semibold">Will you tell me specific investment strategies?</h3>
                <p className="text-muted-foreground">
                  No. We don't provide financial advice or investment recommendations. Instead, we help you understand your financial personality and the patterns that shape your money decisions. This self-awareness can help you make better choices.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="text-xl font-semibold">Can this predict if I'll be wealthy?</h3>
                <p className="text-muted-foreground">
                  We focus on your financial trajectory based on your patterns, not specific dollar amounts. We can help you understand whether your current patterns are leading toward financial security or if changes might be needed.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="text-xl font-semibold">What if I'm struggling financially right now?</h3>
                <p className="text-muted-foreground">
                  Understanding your financial patterns can be especially valuable during difficult times. Our predictions help you see what's holding you back and what changes might improve your trajectory.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="text-xl font-semibold">Is this based on numerology or astrology?</h3>
                <p className="text-muted-foreground">
                  No. We don't use birth dates, lucky numbers, or planetary alignments. Our predictions are based on personality psychology and behavioral patterns related to money and decision-making.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="text-xl font-semibold">How can personality predict financial outcomes?</h3>
                <p className="text-muted-foreground">
                  Research shows that personality traits strongly influence financial behaviors — from saving habits to risk tolerance to long-term planning. By understanding your personality patterns, we can predict likely financial outcomes.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="container max-w-4xl py-16">
          <div className="text-center space-y-6">
            <Button asChild size="lg" className="text-lg px-8 py-6">
              <Link href="/onboarding">
                Understand your financial path →
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
