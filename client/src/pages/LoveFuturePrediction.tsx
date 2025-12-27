import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Heart, Sparkles, CheckCircle } from "lucide-react";
import { Helmet } from "react-helmet-async";

export default function LoveFuturePrediction() {
  return (
    <>
      <Helmet>
        <title>Love Future Prediction | Predicsure AI</title>
        <meta name="description" content="Discover what your love future holds. Get personalized predictions based on your personality patterns and relationship trajectory." />
        <meta property="og:title" content="Love Future Prediction | Predicsure AI" />
        <meta property="og:description" content="Discover what your love future holds. Get personalized predictions based on your personality patterns and relationship trajectory." />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://www.predicsure.com/love-future-prediction" />
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
              What Does Your Love Future Hold?
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Your romantic path isn't random.<br />
              It follows the patterns you create.
            </p>
            <Button asChild size="lg" className="text-lg px-8 py-6">
              <Link href="/psyche-onboarding">
                Discover your love trajectory
              </Link>
            </Button>
          </div>
        </section>

        {/* Reassurance Section */}
        <section className="bg-muted/30 py-16">
          <div className="container max-w-4xl space-y-8">
            <h2 className="text-3xl font-semibold text-center">
              Love Isn't About Luck — It's About Understanding
            </h2>
            <div className="prose prose-invert max-w-none space-y-6">
              <p className="text-lg text-muted-foreground">
                Many people wonder when love will arrive, or if they've already missed their chance.
              </p>
              <p className="text-lg text-muted-foreground">
                But lasting relationships aren't accidents. They emerge from consistent patterns in how you connect, communicate, and choose partners.
              </p>
              <p className="text-lg text-muted-foreground">
                Understanding these patterns gives you clarity about where your love life is headed — and how to shape it.
              </p>
            </div>
          </div>
        </section>

        {/* Authority Section */}
        <section className="container max-w-4xl py-16 space-y-8">
          <div className="flex items-center gap-3 justify-center">
            <Sparkles className="w-8 h-8 text-primary" />
            <h2 className="text-3xl font-semibold">
              Pattern-Based Predictions, Not Fortune Telling
            </h2>
          </div>
          <div className="prose prose-invert max-w-none space-y-6">
            <p className="text-lg text-muted-foreground">
              Predicsure doesn't rely on crystal balls or vague horoscopes.
            </p>
            <p className="text-lg text-muted-foreground">
              We analyze your personality traits, decision-making patterns, and relationship tendencies to forecast your romantic trajectory.
            </p>
            <p className="text-lg text-muted-foreground">
              The same patterns that shaped your past relationships are actively shaping your future ones. We help you see them clearly.
            </p>
          </div>
        </section>

        {/* Personalization Bridge */}
        <section className="bg-muted/30 py-16">
          <div className="container max-w-4xl space-y-8">
            <h2 className="text-3xl font-semibold text-center">
              Your Love Future is Personal to You
            </h2>
            <div className="prose prose-invert max-w-none space-y-6">
              <p className="text-lg text-muted-foreground">
                Generic love predictions can't account for who you are — your values, your communication style, your attachment patterns.
              </p>
              <p className="text-lg text-muted-foreground">
                To predict your romantic future accurately, we need to understand your unique personality first.
              </p>
              <p className="text-lg text-muted-foreground">
                That's why we begin with a brief personality assessment that reveals:
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6 mt-8">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold mb-2">How You Connect</h3>
                  <p className="text-sm text-muted-foreground">Your natural approach to intimacy and vulnerability</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold mb-2">What You Seek</h3>
                  <p className="text-sm text-muted-foreground">The relationship qualities that matter most to you</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold mb-2">Where You're Headed</h3>
                  <p className="text-sm text-muted-foreground">The romantic trajectory your patterns create</p>
                </div>
              </div>
            </div>

            <p className="text-lg text-muted-foreground text-center mt-8">
              Once we understand your pattern, we can show you where it leads.
            </p>
          </div>
        </section>

        {/* Primary CTA Section */}
        <section className="container max-w-4xl py-16">
          <div className="text-center space-y-6 bg-primary/10 rounded-2xl p-12 border border-primary/20">
            <h2 className="text-3xl font-semibold">
              See Your Love Future
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
                <h3 className="text-xl font-semibold">How far into the future can you predict?</h3>
                <p className="text-muted-foreground">
                  Our predictions focus on your trajectory and likely outcomes over the next 6-12 months. We can identify patterns that suggest where your love life is headed, but we emphasize understanding over specific timelines.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="text-xl font-semibold">Can predictions change based on my actions?</h3>
                <p className="text-muted-foreground">
                  Absolutely. Our predictions show you the path you're currently on based on your patterns. Understanding these patterns empowers you to make different choices if you want to change your trajectory.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="text-xl font-semibold">What if I'm already in a relationship?</h3>
                <p className="text-muted-foreground">
                  Our predictions work whether you're single or partnered. We can help you understand where your current relationship is headed, what challenges might arise, and how your patterns influence your romantic future.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="text-xl font-semibold">Is this based on astrology?</h3>
                <p className="text-muted-foreground">
                  No. We don't use zodiac signs, birth charts, or planetary alignments. Our predictions are based on personality psychology, behavioral patterns, and relationship science.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="text-xl font-semibold">What makes this different from other love predictions?</h3>
                <p className="text-muted-foreground">
                  Most love predictions are generic and apply to everyone. Ours are personalized to your specific personality type, relationship patterns, and life trajectory. We focus on patterns, not mysticism.
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
                Discover your love trajectory →
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
