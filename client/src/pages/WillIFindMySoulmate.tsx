import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Heart, Sparkles, CheckCircle } from "lucide-react";
import { Helmet } from "react-helmet-async";

export default function WillIFindMySoulmate() {
  return (
    <>
      <Helmet>
        <title>Will I Find My Soulmate? | Predicsure AI</title>
        <meta name="description" content="Get personalized insights about your love path. Complete a short personality assessment to understand your relationship patterns and trajectory." />
        <meta property="og:title" content="Will I Find My Soulmate? | Predicsure AI" />
        <meta property="og:description" content="Get personalized insights about your love path. Complete a short personality assessment to understand your relationship patterns and trajectory." />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://www.predicsure.com/will-i-find-my-soulmate" />
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
              <Heart className="w-16 h-16 text-primary" />
            </div>
            <h1 className="text-5xl font-bold tracking-tight">
              Will You Find Your Soulmate?
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Some relationships happen by chance.<br />
              The ones that last follow patterns.
            </p>
            <Button asChild size="lg" className="text-lg px-8 py-6">
              <Link href="/psyche-onboarding">
                Get clarity about your love path
              </Link>
            </Button>
          </div>
        </section>

        {/* Reassurance Section */}
        <section className="bg-muted/30 py-16">
          <div className="container max-w-4xl space-y-8">
            <h2 className="text-3xl font-semibold text-center">
              You're Not Behind — You're On Your Own Timeline
            </h2>
            <div className="prose prose-invert max-w-none space-y-6">
              <p className="text-lg text-muted-foreground">
                Many people feel they're "behind" in love — or that they've missed something important.
              </p>
              <p className="text-lg text-muted-foreground">
                In reality, timing, traits, and decision patterns matter more than luck.
              </p>
              <p className="text-lg text-muted-foreground">
                The question isn't whether you'll find love. It's understanding the patterns that lead you there.
              </p>
            </div>
          </div>
        </section>

        {/* Authority Section */}
        <section className="container max-w-4xl py-16 space-y-8">
          <div className="flex items-center gap-3 justify-center">
            <Sparkles className="w-8 h-8 text-primary" />
            <h2 className="text-3xl font-semibold">
              Predictions Based on Patterns, Not Guesses
            </h2>
          </div>
          <div className="prose prose-invert max-w-none space-y-6">
            <p className="text-lg text-muted-foreground">
              Predicsure doesn't rely on mysticism or generic horoscopes.
            </p>
            <p className="text-lg text-muted-foreground">
              Our predictions emerge from consistent personality patterns, preferences, and life trajectories.
            </p>
            <p className="text-lg text-muted-foreground">
              We analyze how you move through the world — and where that trajectory naturally leads.
            </p>
          </div>
        </section>

        {/* Personalization Bridge */}
        <section className="bg-muted/30 py-16">
          <div className="container max-w-4xl space-y-8">
            <h2 className="text-3xl font-semibold text-center">
              Why Personalization Matters
            </h2>
            <div className="prose prose-invert max-w-none space-y-6">
              <p className="text-lg text-muted-foreground">
                Two people can ask the same question and receive completely different answers — because the answer depends on who they are.
              </p>
              <p className="text-lg text-muted-foreground">
                To understand your trajectory, we need to understand <strong>you</strong> first.
              </p>
              <p className="text-lg text-muted-foreground">
                That's why we start with a short personality assessment.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6 mt-8">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold mb-2">Your Decision Patterns</h3>
                  <p className="text-sm text-muted-foreground">How you naturally approach relationships and connection</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold mb-2">Your Relationship Tendencies</h3>
                  <p className="text-sm text-muted-foreground">The patterns that shape your romantic trajectory</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold mb-2">Your Natural Strengths</h3>
                  <p className="text-sm text-muted-foreground">What you bring to meaningful connections</p>
                </div>
              </div>
            </div>

            <p className="text-lg text-muted-foreground text-center mt-8">
              Once we understand your pattern, we can map your path forward.
            </p>
          </div>
        </section>

        {/* Primary CTA Section */}
        <section className="container max-w-4xl py-16">
          <div className="text-center space-y-6 bg-primary/10 rounded-2xl p-12 border border-primary/20">
            <h2 className="text-3xl font-semibold">
              Start Your Personal Reading
            </h2>
            <p className="text-lg text-muted-foreground">
              No credit card required. Takes 3 minutes.
            </p>
            <Button asChild size="lg" className="text-lg px-8 py-6">
              <Link href="/psyche-onboarding">
                Reveal your personal pattern
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
                <h3 className="text-xl font-semibold">How accurate are the predictions?</h3>
                <p className="text-muted-foreground">
                  Our predictions are based on established personality psychology and behavioral patterns. While no prediction can be 100% certain, understanding your patterns gives you clarity about likely outcomes and helps you make more informed decisions about your love life.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="text-xl font-semibold">Is this like a horoscope?</h3>
                <p className="text-muted-foreground">
                  No. We don't use astrology or birth dates. Our approach is based on your actual personality traits, preferences, and decision patterns. Think of it as modern psychology meeting predictive insights.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="text-xl font-semibold">What happens after the assessment?</h3>
                <p className="text-muted-foreground">
                  You'll receive insights about your personality type, followed by personalized predictions about your love trajectory. You can explore deeper predictions and get ongoing guidance with a paid subscription.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="text-xl font-semibold">How long does the personality assessment take?</h3>
                <p className="text-muted-foreground">
                  About 3 minutes. We ask a series of questions to understand your decision-making patterns, relationship tendencies, and natural strengths. The assessment is designed to be quick but insightful.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="text-xl font-semibold">Can I trust these predictions?</h3>
                <p className="text-muted-foreground">
                  Our predictions are based on consistent patterns observed across thousands of personality profiles. While we can't guarantee specific outcomes, we can help you understand the trajectory you're on and the factors that influence your romantic path.
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
                Start Your Personal Reading →
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
