import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Compass, Sparkles, CheckCircle } from "lucide-react";
import { Helmet } from "react-helmet-async";

export default function LifePurposePrediction() {
  return (
    <>
      <Helmet>
        <title>Life Purpose Prediction | Predicsure AI</title>
        <meta name="description" content="Discover your life purpose and direction. Get personalized predictions based on your personality patterns and natural trajectory." />
        <meta property="og:title" content="Life Purpose Prediction | Predicsure AI" />
        <meta property="og:description" content="Discover your life purpose and direction. Get personalized predictions based on your personality patterns and natural trajectory." />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://www.predicsure.com/life-purpose-prediction" />
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
              <Compass className="w-16 h-16 text-primary" />
            </div>
            <h1 className="text-5xl font-bold tracking-tight">
              What Is Your Life Purpose?
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Purpose isn't something you find.<br />
              It's something you recognize in your patterns.
            </p>
            <Button asChild size="lg" className="text-lg px-8 py-6">
              <Link href="/psyche-onboarding">
                Discover your life direction
              </Link>
            </Button>
          </div>
        </section>

        {/* Reassurance Section */}
        <section className="bg-muted/30 py-16">
          <div className="container max-w-4xl space-y-8">
            <h2 className="text-3xl font-semibold text-center">
              Feeling Lost or Directionless? That's Normal
            </h2>
            <div className="prose prose-invert max-w-none space-y-6">
              <p className="text-lg text-muted-foreground">
                Many people struggle to identify their purpose — wondering if they're on the right path, if they're wasting their potential, or if there's something more meaningful they should be doing.
              </p>
              <p className="text-lg text-muted-foreground">
                But purpose isn't a mystery you have to solve. It's already present in your natural patterns — how you think, what you value, and what brings you alive.
              </p>
              <p className="text-lg text-muted-foreground">
                Understanding these patterns gives you clarity about your direction and what you're naturally meant to pursue.
              </p>
            </div>
          </div>
        </section>

        {/* Authority Section */}
        <section className="container max-w-4xl py-16 space-y-8">
          <div className="flex items-center gap-3 justify-center">
            <Sparkles className="w-8 h-8 text-primary" />
            <h2 className="text-3xl font-semibold">
              Your Purpose Lives in Your Patterns
            </h2>
          </div>
          <div className="prose prose-invert max-w-none space-y-6">
            <p className="text-lg text-muted-foreground">
              Predicsure doesn't rely on vague spiritual concepts or generic life advice.
            </p>
            <p className="text-lg text-muted-foreground">
              We analyze your personality traits, natural strengths, and decision-making patterns to reveal what gives your life meaning and direction.
            </p>
            <p className="text-lg text-muted-foreground">
              Your purpose isn't something external you need to discover — it's already embedded in who you are and how you move through life.
            </p>
          </div>
        </section>

        {/* Personalization Bridge */}
        <section className="bg-muted/30 py-16">
          <div className="container max-w-4xl space-y-8">
            <h2 className="text-3xl font-semibold text-center">
              Your Purpose is Unique to You
            </h2>
            <div className="prose prose-invert max-w-none space-y-6">
              <p className="text-lg text-muted-foreground">
                Generic purpose statements don't work because everyone's path is different. What brings meaning to one person might feel empty to another.
              </p>
              <p className="text-lg text-muted-foreground">
                To reveal your life purpose accurately, we need to understand your unique personality and what naturally drives you.
              </p>
              <p className="text-lg text-muted-foreground">
                That's why we begin with a brief personality assessment that reveals:
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6 mt-8">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold mb-2">What Motivates You</h3>
                  <p className="text-sm text-muted-foreground">The values and drives that naturally energize you</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold mb-2">Your Natural Strengths</h3>
                  <p className="text-sm text-muted-foreground">The talents and abilities you're meant to use</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold mb-2">Your Life Direction</h3>
                  <p className="text-sm text-muted-foreground">Where your patterns naturally lead you</p>
                </div>
              </div>
            </div>

            <p className="text-lg text-muted-foreground text-center mt-8">
              Once we understand your pattern, we can reveal your purpose.
            </p>
          </div>
        </section>

        {/* Primary CTA Section */}
        <section className="container max-w-4xl py-16">
          <div className="text-center space-y-6 bg-primary/10 rounded-2xl p-12 border border-primary/20">
            <h2 className="text-3xl font-semibold">
              Discover Your Life Purpose
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
                <h3 className="text-xl font-semibold">Will you tell me exactly what my purpose is?</h3>
                <p className="text-muted-foreground">
                  We help you understand the patterns that point to your purpose — your natural strengths, what motivates you, and what brings you meaning. The specific expression of that purpose is yours to define.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="text-xl font-semibold">What if I don't believe I have a purpose?</h3>
                <p className="text-muted-foreground">
                  Purpose doesn't have to be grandiose or world-changing. It's simply about understanding what gives your life direction and meaning based on who you naturally are. Everyone has patterns that point toward fulfillment.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="text-xl font-semibold">Can my purpose change over time?</h3>
                <p className="text-muted-foreground">
                  Your core patterns tend to remain consistent, but how you express them can evolve. Understanding your foundational patterns helps you adapt your purpose as your life circumstances change.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="text-xl font-semibold">Is this based on spiritual or religious concepts?</h3>
                <p className="text-muted-foreground">
                  No. We don't rely on spiritual frameworks or religious teachings. Our approach is based on personality psychology and understanding what naturally drives human fulfillment and meaning.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="text-xl font-semibold">What if I'm already successful but feel unfulfilled?</h3>
                <p className="text-muted-foreground">
                  Success and purpose aren't the same. Many successful people feel empty because their achievements don't align with their natural patterns. We help you understand what would bring genuine fulfillment based on who you are.
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
                Find your life direction →
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
