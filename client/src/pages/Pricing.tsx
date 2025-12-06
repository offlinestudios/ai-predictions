import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Check } from "lucide-react";
import { getLoginUrl } from "@/const";

export default function Pricing() {
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
      <div className="container max-w-7xl py-16 space-y-12">
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold">Choose Your Plan</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Get personalized AI predictions to understand what's shifting in your life. Start free, upgrade anytime.
          </p>
        </div>

        {/* Pricing Tiers */}
        <div className="grid md:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {/* Free Tier */}
          <div className="border border-border rounded-lg p-6 flex flex-col">
            <div className="mb-6">
              <h3 className="text-2xl font-bold mb-2">Free</h3>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-4xl font-bold">$0</span>
                <span className="text-muted-foreground">/month</span>
              </div>
              <p className="text-sm text-muted-foreground">Perfect for trying out predictions</p>
            </div>

            <ul className="space-y-3 mb-8 flex-grow">
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <span className="text-sm">3 predictions per week</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <span className="text-sm">Instant predictions</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <span className="text-sm">All 7 categories</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <span className="text-sm">Basic insights</span>
              </li>
            </ul>

            <Button asChild variant="outline" size="lg" className="w-full">
              <Link href="/onboarding">Get Started Free</Link>
            </Button>
          </div>

          {/* Plus Tier */}
          <div className="border border-primary/50 rounded-lg p-6 flex flex-col relative">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2">
              <span className="bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full">
                POPULAR
              </span>
            </div>

            <div className="mb-6">
              <h3 className="text-2xl font-bold mb-2">Plus</h3>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-4xl font-bold">$9.99</span>
                <span className="text-muted-foreground">/month</span>
              </div>
              <p className="text-sm text-muted-foreground">For regular insight seekers</p>
            </div>

            <ul className="space-y-3 mb-8 flex-grow">
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <span className="text-sm">Unlimited predictions</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <span className="text-sm"><strong>30-day trajectory forecasts</strong></span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <span className="text-sm">Deep Mode analysis</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <span className="text-sm">Prediction history</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <span className="text-sm">Priority support</span>
              </li>
            </ul>

            <Button asChild size="lg" className="w-full">
              <a href={getLoginUrl()}>Upgrade to Plus</a>
            </Button>
          </div>

          {/* Pro Tier */}
          <div className="border border-border rounded-lg p-6 flex flex-col">
            <div className="mb-6">
              <h3 className="text-2xl font-bold mb-2">Pro</h3>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-4xl font-bold">$19.99</span>
                <span className="text-muted-foreground">/month</span>
              </div>
              <p className="text-sm text-muted-foreground">For serious forecasters</p>
            </div>

            <ul className="space-y-3 mb-8 flex-grow">
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <span className="text-sm">Everything in Plus</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <span className="text-sm"><strong>90-day trajectory forecasts</strong></span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <span className="text-sm"><strong>Yearly overview predictions</strong></span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <span className="text-sm">Alternate scenario analysis</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <span className="text-sm">Advanced analytics dashboard</span>
              </li>
            </ul>

            <Button asChild variant="outline" size="lg" className="w-full">
              <a href={getLoginUrl()}>Upgrade to Pro</a>
            </Button>
          </div>

          {/* Premium Tier */}
          <div className="border border-secondary/50 rounded-lg p-6 flex flex-col bg-card/30">
            <div className="mb-6">
              <h3 className="text-2xl font-bold mb-2">Premium</h3>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-4xl font-bold">$59</span>
                <span className="text-muted-foreground">/year</span>
              </div>
              <p className="text-sm text-secondary">Save 75% - Best value!</p>
            </div>

            <ul className="space-y-3 mb-8 flex-grow">
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <span className="text-sm">Everything in Pro</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <span className="text-sm"><strong>Annual billing (save $180/year)</strong></span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <span className="text-sm">Premium badge & status</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <span className="text-sm">Early access to new features</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <span className="text-sm">VIP support</span>
              </li>
            </ul>

            <Button asChild variant="secondary" size="lg" className="w-full">
              <a href={getLoginUrl()}>Upgrade to Premium</a>
            </Button>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto pt-12">
          <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Can I cancel anytime?</h3>
              <p className="text-muted-foreground">
                Yes! All subscriptions can be canceled at any time. You'll retain access until the end of your billing period.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">What's your refund policy?</h3>
              <p className="text-muted-foreground">
                We offer a 7-day money-back guarantee. If you're not satisfied within the first week, contact us for a full refund.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Can I upgrade or downgrade my plan?</h3>
              <p className="text-muted-foreground">
                Absolutely! You can change your plan at any time from your Account settings. Upgrades take effect immediately, and downgrades apply at the next billing cycle.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">What payment methods do you accept?</h3>
              <p className="text-muted-foreground">
                We accept all major credit cards (Visa, Mastercard, American Express) through our secure payment processor, Stripe.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Is my data secure?</h3>
              <p className="text-muted-foreground">
                Yes. All data is encrypted in transit and at rest. We never sell your information. Learn more on our{" "}
                <Link href="/data-security" className="text-primary hover:underline">Data Security page</Link>.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center pt-12">
          <h2 className="text-3xl font-bold mb-4">Ready to see what's shifting?</h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Start with a free prediction today. No credit card required.
          </p>
          <Button asChild size="lg" className="text-lg px-12">
            <Link href="/onboarding">
              Get Your First Prediction Free
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
