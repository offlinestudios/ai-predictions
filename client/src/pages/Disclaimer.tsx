import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowLeft, AlertTriangle } from "lucide-react";

export default function Disclaimer() {
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
            <AlertTriangle className="w-10 h-10 text-yellow-500" />
            <h1 className="text-4xl font-bold">Disclaimer</h1>
          </div>
          <p className="text-xl text-muted-foreground">
            Important information about using Predicsure AI predictions and forecasts.
          </p>
        </div>

        <div className="prose prose-invert max-w-none space-y-6">
          <section className="space-y-3">
            <h2 className="text-2xl font-semibold">General Disclaimer</h2>
            <p className="text-muted-foreground">
              Predicsure AI provides AI-generated predictions and forecasts for informational and entertainment purposes only. Our predictions are based on pattern recognition, contextual analysis, and probabilistic modeling, but they are not guarantees of future outcomes.
            </p>
            <p className="text-muted-foreground font-semibold mt-4">
              By using our Service, you acknowledge that the future is inherently uncertain and that predictions should be used as guidance, not as absolute truth.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold">Not Professional Advice</h2>
            <p className="text-muted-foreground">
              Predicsure AI does not provide professional advice of any kind. Our predictions should NOT be used as a substitute for:
            </p>

            <h3 className="text-xl font-medium mt-4">Medical Advice</h3>
            <p className="text-muted-foreground">
              We do not provide medical diagnoses, treatment recommendations, or health advice. Always consult qualified healthcare professionals for medical concerns. Do not delay seeking medical attention based on our predictions.
            </p>

            <h3 className="text-xl font-medium mt-4">Financial Advice</h3>
            <p className="text-muted-foreground">
              Our predictions about finances, investments, or stocks are not financial advice. We are not licensed financial advisors, and our predictions should not be used as the sole basis for investment decisions. Consult a certified financial planner or investment advisor before making financial commitments.
            </p>

            <h3 className="text-xl font-medium mt-4">Legal Advice</h3>
            <p className="text-muted-foreground">
              We do not provide legal counsel or recommendations. For legal matters, always consult a licensed attorney in your jurisdiction.
            </p>

            <h3 className="text-xl font-medium mt-4">Relationship or Mental Health Counseling</h3>
            <p className="text-muted-foreground">
              While we may provide insights about relationships or personal situations, we are not therapists or counselors. If you're experiencing mental health challenges, please seek help from a licensed mental health professional.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold">Accuracy and Reliability</h2>
            <p className="text-muted-foreground">
              While we strive for high-quality predictions, we cannot guarantee accuracy or specific outcomes. Predictions are probabilistic estimates based on patterns and available data. Factors that can affect accuracy include:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li>Incomplete or inaccurate information provided by users</li>
              <li>Unexpected events or circumstances (black swan events)</li>
              <li>Human free will and decision-making</li>
              <li>Limitations of AI models and data sources</li>
              <li>Rapidly changing external conditions</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold">Sports and Stocks Predictions</h2>
            <p className="text-muted-foreground">
              Our Sports and Stocks predictions integrate real-time data from third-party APIs (The Sports DB and Alpha Vantage). However:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li>Data may be delayed or incomplete</li>
              <li>Past performance does not guarantee future results</li>
              <li>Sports outcomes are inherently unpredictable</li>
              <li>Stock market predictions are speculative and carry financial risk</li>
            </ul>
            <p className="text-muted-foreground mt-4 font-semibold">
              Never bet money or make investment decisions based solely on our predictions. You are responsible for your own financial decisions.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold">Personal Responsibility</h2>
            <p className="text-muted-foreground">
              You are solely responsible for your actions and decisions. Predicsure AI provides information to help you think through situations, but ultimately:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li>You must use your own judgment and critical thinking</li>
              <li>You should consult multiple sources of information</li>
              <li>You bear full responsibility for outcomes of your decisions</li>
              <li>We are not liable for consequences resulting from following predictions</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold">No Guarantees</h2>
            <p className="text-muted-foreground">
              We make no warranties or guarantees about:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li>The accuracy, completeness, or reliability of predictions</li>
              <li>The suitability of predictions for your specific situation</li>
              <li>The achievement of any particular outcome or result</li>
              <li>Uninterrupted or error-free service availability</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold">Third-Party Data Sources</h2>
            <p className="text-muted-foreground">
              Our predictions may incorporate data from third-party sources (APIs, databases, public information). We are not responsible for:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li>Accuracy or timeliness of third-party data</li>
              <li>Availability or reliability of external APIs</li>
              <li>Changes to third-party data sources</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold">Age Restriction</h2>
            <p className="text-muted-foreground">
              Our Service is intended for users 18 years of age and older. If you are under 18, you must have parental consent to use the Service. Parents and guardians should supervise minors' use of prediction services.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold">Entertainment Value</h2>
            <p className="text-muted-foreground">
              While our AI uses sophisticated technology, predictions should be viewed as a tool for reflection and exploration, not as definitive answers. Think of our Service as:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li>A way to consider different perspectives on your situation</li>
              <li>A prompt for self-reflection and planning</li>
              <li>An entertaining exploration of possibilities</li>
              <li>One input among many for decision-making</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold">Limitation of Liability</h2>
            <p className="text-muted-foreground">
              To the fullest extent permitted by law, Predicsure AI and its affiliates shall not be liable for any damages arising from:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li>Reliance on predictions or forecasts</li>
              <li>Financial losses from investment or betting decisions</li>
              <li>Emotional distress or disappointment</li>
              <li>Missed opportunities or unfavorable outcomes</li>
              <li>Service interruptions or technical errors</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold">Changes to Disclaimer</h2>
            <p className="text-muted-foreground">
              We may update this Disclaimer periodically. Continued use of the Service after changes constitutes acceptance of the updated Disclaimer.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold">Questions?</h2>
            <p className="text-muted-foreground">
              If you have questions about this Disclaimer, contact us:
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
