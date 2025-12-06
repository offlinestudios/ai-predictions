import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function TermsOfService() {
  return (
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

      {/* Content */}
      <div className="container max-w-4xl py-12 space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold">Terms of Service</h1>
          <p className="text-muted-foreground">Last updated: December 5, 2024</p>
        </div>

        <div className="prose prose-invert max-w-none space-y-6">
          <section className="space-y-3">
            <h2 className="text-2xl font-semibold">1. Acceptance of Terms</h2>
            <p className="text-muted-foreground">
              By accessing or using Predicsure AI ("the Service"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, please do not use the Service.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold">2. Description of Service</h2>
            <p className="text-muted-foreground">
              Predicsure AI provides AI-powered prediction and forecasting services based on user-provided information and contextual analysis. Our predictions are generated using advanced machine learning algorithms and pattern recognition technology.
            </p>
            <p className="text-muted-foreground font-semibold mt-4">
              Important: Predictions are for informational and entertainment purposes only and should not be considered professional advice.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold">3. User Accounts</h2>
            <h3 className="text-xl font-medium">3.1 Account Creation</h3>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li>You must be at least 18 years old to create an account</li>
              <li>You must provide accurate and complete information</li>
              <li>You are responsible for maintaining account security</li>
              <li>You may not share your account credentials</li>
            </ul>

            <h3 className="text-xl font-medium mt-4">3.2 Account Termination</h3>
            <p className="text-muted-foreground">
              We reserve the right to suspend or terminate accounts that violate these Terms, engage in fraudulent activity, or misuse the Service.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold">4. Subscription and Payments</h2>
            <h3 className="text-xl font-medium">4.1 Subscription Tiers</h3>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li><strong>Free:</strong> Limited predictions with basic insights</li>
              <li><strong>Plus ($9.99/month):</strong> 30-day forecasts and enhanced features</li>
              <li><strong>Pro ($19.99/month):</strong> 90-day and yearly forecasts, Deep Mode analysis</li>
              <li><strong>Premium ($59/year):</strong> Unlimited predictions and priority processing</li>
            </ul>

            <h3 className="text-xl font-medium mt-4">4.2 Billing</h3>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li>Subscriptions automatically renew unless canceled</li>
              <li>Payments are processed securely through Stripe</li>
              <li>All fees are non-refundable except as required by law or our 7-day money-back guarantee</li>
              <li>We reserve the right to change pricing with 30 days' notice</li>
            </ul>

            <h3 className="text-xl font-medium mt-4">4.3 Refund Policy</h3>
            <p className="text-muted-foreground">
              We offer a 7-day money-back guarantee on all paid subscriptions. To request a refund within the first 7 days, contact <a href="mailto:support@predicsure.ai" className="text-primary hover:underline">support@predicsure.ai</a>.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold">5. Acceptable Use</h2>
            <p className="text-muted-foreground">You agree NOT to:</p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li>Use the Service for illegal purposes or to violate any laws</li>
              <li>Attempt to reverse engineer, hack, or compromise the Service</li>
              <li>Submit false, misleading, or malicious information</li>
              <li>Scrape, copy, or redistribute our content without permission</li>
              <li>Abuse, harass, or harm other users</li>
              <li>Use automated systems (bots) to access the Service</li>
              <li>Resell or commercialize predictions without authorization</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold">6. Intellectual Property</h2>
            <p className="text-muted-foreground">
              All content, features, and functionality of the Service (including but not limited to algorithms, software, text, graphics, logos) are owned by Predicsure AI and protected by copyright, trademark, and other intellectual property laws.
            </p>
            <p className="text-muted-foreground mt-4">
              You retain ownership of the information you provide, but grant us a license to use it to generate predictions and improve our Service.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold">7. Disclaimers and Limitations</h2>
            <h3 className="text-xl font-medium">7.1 No Guarantees</h3>
            <p className="text-muted-foreground">
              Predictions are based on pattern recognition and probabilistic analysis. We do not guarantee accuracy, completeness, or specific outcomes. The future is inherently uncertain, and predictions should be used as guidance, not certainty.
            </p>

            <h3 className="text-xl font-medium mt-4">7.2 Not Professional Advice</h3>
            <p className="text-muted-foreground">
              Our Service does not provide medical, legal, financial, or professional advice. Always consult qualified professionals for important decisions.
            </p>

            <h3 className="text-xl font-medium mt-4">7.3 Service Availability</h3>
            <p className="text-muted-foreground">
              We strive for 99.9% uptime but do not guarantee uninterrupted access. The Service may be temporarily unavailable for maintenance, updates, or unforeseen issues.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold">8. Limitation of Liability</h2>
            <p className="text-muted-foreground">
              To the fullest extent permitted by law, Predicsure AI shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of the Service, including but not limited to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li>Decisions made based on predictions</li>
              <li>Loss of profits, data, or opportunities</li>
              <li>Service interruptions or errors</li>
              <li>Unauthorized access to your account</li>
            </ul>
            <p className="text-muted-foreground mt-4">
              Our total liability shall not exceed the amount you paid for the Service in the past 12 months.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold">9. Indemnification</h2>
            <p className="text-muted-foreground">
              You agree to indemnify and hold harmless Predicsure AI from any claims, damages, or expenses arising from your use of the Service, violation of these Terms, or infringement of any third-party rights.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold">10. Changes to Terms</h2>
            <p className="text-muted-foreground">
              We may modify these Terms at any time. We will notify users of significant changes via email or platform notification. Continued use of the Service after changes constitutes acceptance of the updated Terms.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold">11. Governing Law</h2>
            <p className="text-muted-foreground">
              These Terms shall be governed by and construed in accordance with the laws of the jurisdiction in which Predicsure AI operates, without regard to conflict of law principles.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold">12. Contact Information</h2>
            <p className="text-muted-foreground">
              For questions about these Terms, please contact us:
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
