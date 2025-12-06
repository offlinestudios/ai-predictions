import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Brain, TrendingUp, Database, Sparkles } from "lucide-react";

export default function AIMethodology() {
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
      <div className="container max-w-4xl py-12 space-y-8">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Brain className="w-10 h-10 text-primary" />
            <h1 className="text-4xl font-bold">AI Methodology</h1>
          </div>
          <p className="text-xl text-muted-foreground">
            Understanding how our AI generates personalized predictions and forecasts.
          </p>
        </div>

        <div className="prose prose-invert max-w-none space-y-8">
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">How It Works</h2>
            <p className="text-muted-foreground">
              Predicsure AI uses advanced machine learning and natural language processing to analyze your situation, identify patterns, and generate personalized forecasts. Unlike traditional horoscopes or fortune-telling, our predictions are based on:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li>Contextual analysis of your specific situation</li>
              <li>Pattern recognition across similar scenarios</li>
              <li>Timing correlations and trajectory signals</li>
              <li>Real-time data integration (for Sports and Stocks predictions)</li>
            </ul>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <Sparkles className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-semibold">Natural Language Processing</h2>
            </div>
            <p className="text-muted-foreground">
              Our AI uses state-of-the-art NLP models to understand the nuances of your query:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li><strong>Intent Recognition:</strong> Identifies what you're asking about (career, relationships, finances, etc.)</li>
              <li><strong>Context Extraction:</strong> Pulls key details from your description (timeframes, emotions, circumstances)</li>
              <li><strong>Sentiment Analysis:</strong> Understands the emotional tone and urgency of your situation</li>
              <li><strong>Entity Recognition:</strong> Identifies important people, places, and events in your query</li>
            </ul>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-semibold">Pattern Recognition</h2>
            </div>
            <p className="text-muted-foreground">
              The AI identifies recurring patterns and trajectory signals by analyzing:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li><strong>Behavioral Patterns:</strong> Common sequences of events in similar situations</li>
              <li><strong>Timing Correlations:</strong> When certain outcomes tend to occur</li>
              <li><strong>Inflection Points:</strong> Critical moments where trajectories shift</li>
              <li><strong>Convergence Signals:</strong> When multiple factors align to create opportunities or challenges</li>
            </ul>
            <p className="text-muted-foreground mt-4">
              Think of it like an experienced advisor who has seen thousands of similar situations and can recognize patterns that aren't immediately obvious.
            </p>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <Database className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-semibold">Real-Time Data Integration</h2>
            </div>
            <p className="text-muted-foreground">
              For Sports and Stocks predictions, we enhance accuracy by integrating live data:
            </p>
            
            <h3 className="text-xl font-medium mt-4">Sports Predictions</h3>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li>Team statistics and recent performance (via The Sports DB API)</li>
              <li>Match results and head-to-head records</li>
              <li>Player information and key injuries</li>
              <li>Home/away performance trends</li>
            </ul>

            <h3 className="text-xl font-medium mt-4">Stocks Predictions</h3>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li>Real-time stock prices and market data (via Alpha Vantage API)</li>
              <li>Company fundamentals and financial metrics</li>
              <li>Market sentiment indicators</li>
              <li>Historical price patterns and volatility</li>
            </ul>

            <p className="text-muted-foreground mt-4">
              This data is cached for 4 hours to balance accuracy with API rate limits, ensuring predictions reflect current conditions without excessive API calls.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">Prediction Tiers</h2>
            <p className="text-muted-foreground">
              We offer different prediction modes tailored to your needs:
            </p>

            <h3 className="text-xl font-medium mt-4">Standard Mode (Free)</h3>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li>Instant predictions with basic insights (150-250 words)</li>
              <li>General timing guidance</li>
              <li>Key pattern identification</li>
            </ul>

            <h3 className="text-xl font-medium mt-4">Deep Mode (Pro/Premium)</h3>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li>Comprehensive analysis (400-600 words)</li>
              <li>Multi-section breakdown with emojis for easy scanning</li>
              <li>Day-by-day timeline projections</li>
              <li>Pattern analysis and inflection points</li>
              <li>Strategic recommendations</li>
              <li>Confidence scoring</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">Accuracy and Limitations</h2>
            <p className="text-muted-foreground">
              While our AI is sophisticated, it's important to understand what it can and cannot do:
            </p>

            <h3 className="text-xl font-medium mt-4">What We Can Do</h3>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li>Identify likely trajectories based on patterns</li>
              <li>Highlight timing windows for key events</li>
              <li>Recognize inflection points and convergence signals</li>
              <li>Provide context-aware guidance</li>
            </ul>

            <h3 className="text-xl font-medium mt-4">What We Cannot Do</h3>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li>Guarantee specific outcomes (the future isn't fixed)</li>
              <li>Predict random or unprecedented events</li>
              <li>Replace professional advice (medical, legal, financial)</li>
              <li>Account for free will and unexpected decisions</li>
            </ul>

            <p className="text-muted-foreground mt-4">
              Our predictions are probabilistic, not deterministic. Think of them as weather forecasts for your life—useful for planning, but not absolute certainties.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">Continuous Improvement</h2>
            <p className="text-muted-foreground">
              We continuously refine our AI models through:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li><strong>Feedback Loops:</strong> User accuracy ratings help us improve predictions</li>
              <li><strong>Model Updates:</strong> Regular retraining with new data and techniques</li>
              <li><strong>A/B Testing:</strong> Comparing different prediction approaches</li>
              <li><strong>Quality Assurance:</strong> Manual review of edge cases and anomalies</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">Ethical AI Principles</h2>
            <p className="text-muted-foreground">
              We are committed to responsible AI development:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li><strong>Transparency:</strong> We explain how predictions are generated</li>
              <li><strong>Fairness:</strong> No discrimination based on demographics</li>
              <li><strong>Privacy:</strong> Your data is never shared or sold</li>
              <li><strong>Accountability:</strong> We acknowledge limitations and don't overpromise</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">Questions About Our AI?</h2>
            <p className="text-muted-foreground">
              If you have technical questions about our methodology or want to learn more, contact us:
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
