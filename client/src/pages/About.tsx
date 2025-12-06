import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Target, Users, Sparkles, Heart } from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 backdrop-blur-sm bg-background/80 sticky top-0 z-50">
        <div className="container flex items-center justify-between h-16">
          <Link href="/">
            <div className="flex items-center gap-2 cursor-pointer">
              <img src="/globe-logo.png" alt="Predicsure AI" className="w-8 h-8" />
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
      <div className="container max-w-4xl py-12 space-y-12">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold">About Predicsure AI</h1>
          <p className="text-xl text-muted-foreground">
            Personalized AI predictions to help you understand what's shifting in your life.
          </p>
        </div>

        <div className="prose prose-invert max-w-none space-y-8">
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <Target className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-semibold">Our Mission</h2>
            </div>
            <p className="text-muted-foreground">
              We believe everyone deserves clarity when facing uncertainty. Whether you're at a crossroads in your career, navigating a relationship shift, or sensing something's about to change—Predicsure AI helps you see the path ahead.
            </p>
            <p className="text-muted-foreground">
              Unlike traditional horoscopes or fortune-telling, we use advanced AI and pattern recognition to provide personalized forecasts based on your unique situation. Our predictions aren't mystical—they're data-driven insights designed to help you move forward with confidence.
            </p>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <Sparkles className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-semibold">What Makes Us Different</h2>
            </div>
            <p className="text-muted-foreground">
              Most prediction services rely on generic zodiac signs or vague platitudes. We take a different approach:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li><strong>Personalized Analysis:</strong> Every prediction is tailored to your specific situation and context</li>
              <li><strong>Pattern Recognition:</strong> Our AI identifies trajectory signals and timing correlations across similar scenarios</li>
              <li><strong>Real-Time Data:</strong> For Sports and Stocks, we integrate live data to enhance accuracy</li>
              <li><strong>Transparent Methodology:</strong> We explain how predictions are generated—no mystical black boxes</li>
              <li><strong>Continuous Improvement:</strong> User feedback helps us refine our models over time</li>
            </ul>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <Users className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-semibold">Who We Serve</h2>
            </div>
            <p className="text-muted-foreground">
              Predicsure AI is for anyone seeking clarity and guidance:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li><strong>Career Seekers:</strong> Navigating job changes, promotions, or entrepreneurial ventures</li>
              <li><strong>Relationship Explorers:</strong> Understanding relationship dynamics and timing</li>
              <li><strong>Financial Planners:</strong> Getting insights on financial trajectories and investment timing</li>
              <li><strong>Sports Enthusiasts:</strong> Exploring team performance trends and match outcomes</li>
              <li><strong>Stock Traders:</strong> Analyzing market patterns and stock movements</li>
              <li><strong>Life Navigators:</strong> Anyone facing uncertainty and wanting a clearer perspective</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">Our Technology</h2>
            <p className="text-muted-foreground">
              Predicsure AI is built on cutting-edge machine learning and natural language processing:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li><strong>Advanced NLP:</strong> Understands the nuances and context of your queries</li>
              <li><strong>Pattern Recognition:</strong> Identifies recurring trajectories and inflection points</li>
              <li><strong>Timing Analysis:</strong> Correlates events with time windows for better forecasting</li>
              <li><strong>API Integration:</strong> Pulls real-time data for Sports (The Sports DB) and Stocks (Alpha Vantage)</li>
              <li><strong>Deep Mode:</strong> Premium tier offers comprehensive multi-section analysis with day-by-day breakdowns</li>
            </ul>
            <p className="text-muted-foreground mt-4">
              Learn more about our approach on our <Link href="/ai-methodology" className="text-primary hover:underline">AI Methodology page</Link>.
            </p>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <Heart className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-semibold">Our Values</h2>
            </div>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li><strong>Transparency:</strong> We're honest about what AI can and cannot predict</li>
              <li><strong>Privacy:</strong> Your data is encrypted, never sold, and always under your control</li>
              <li><strong>Empowerment:</strong> Our goal is to help you make better decisions, not replace your judgment</li>
              <li><strong>Accessibility:</strong> Everyone deserves access to clarity, which is why we offer a free tier</li>
              <li><strong>Continuous Learning:</strong> We're always improving our models based on user feedback</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">Our Commitment to Responsible AI</h2>
            <p className="text-muted-foreground">
              We take our responsibility seriously. Predicsure AI is designed with ethical principles:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li>We never claim 100% accuracy—the future is probabilistic, not deterministic</li>
              <li>We clearly state that predictions are for guidance, not professional advice</li>
              <li>We don't discriminate based on demographics or personal characteristics</li>
              <li>We protect user privacy with enterprise-grade security</li>
              <li>We continuously audit our models for bias and fairness</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">Join Our Community</h2>
            <p className="text-muted-foreground">
              Over 12,400 users trust Predicsure AI to help them navigate life's uncertainties. With an 89% accuracy satisfaction rate and 250,000+ predictions delivered, we're proud to be a trusted resource for clarity and guidance.
            </p>
            <p className="text-muted-foreground mt-4">
              Ready to see what's shifting in your life?
            </p>
            <Button asChild size="lg" className="mt-4">
              <Link href="/onboarding">
                Get Your First Prediction Free
              </Link>
            </Button>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">Contact Us</h2>
            <p className="text-muted-foreground">
              Have questions, feedback, or partnership inquiries? We'd love to hear from you:
            </p>
            <ul className="list-none space-y-2 text-muted-foreground ml-4">
              <li>Email: <a href="mailto:support@predicsure.ai" className="text-primary hover:underline">support@predicsure.ai</a></li>
              <li>Website: <a href="/" className="text-primary hover:underline">predicsure.ai</a></li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
