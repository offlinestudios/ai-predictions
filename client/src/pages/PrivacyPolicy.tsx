import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPolicy() {
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
          <h1 className="text-4xl font-bold">Privacy Policy</h1>
          <p className="text-muted-foreground">Last updated: December 5, 2024</p>
        </div>

        <div className="prose prose-invert max-w-none space-y-6">
          <section className="space-y-3">
            <h2 className="text-2xl font-semibold">1. Introduction</h2>
            <p className="text-muted-foreground">
              Predicsure AI ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our AI prediction platform.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold">2. Information We Collect</h2>
            <h3 className="text-xl font-medium">2.1 Information You Provide</h3>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li>Account information (name, email address)</li>
              <li>Prediction queries and context you provide</li>
              <li>Optional profile information (interests, preferences)</li>
              <li>Payment information (processed securely through Stripe)</li>
            </ul>

            <h3 className="text-xl font-medium mt-4">2.2 Automatically Collected Information</h3>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li>Device information (browser type, operating system)</li>
              <li>Usage data (pages visited, features used, time spent)</li>
              <li>IP address and general location data</li>
              <li>Cookies and similar tracking technologies</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold">3. How We Use Your Information</h2>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li>Generate personalized AI predictions based on your queries</li>
              <li>Improve and optimize our prediction algorithms</li>
              <li>Provide customer support and respond to inquiries</li>
              <li>Process payments and manage subscriptions</li>
              <li>Send important service updates and security alerts</li>
              <li>Analyze usage patterns to enhance user experience</li>
              <li>Prevent fraud and ensure platform security</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold">4. Data Security</h2>
            <p className="text-muted-foreground">
              We implement enterprise-grade security measures to protect your data:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li>End-to-end encryption for all data transmission</li>
              <li>Encrypted storage of sensitive information</li>
              <li>Regular security audits and penetration testing</li>
              <li>Secure payment processing through Stripe (PCI DSS compliant)</li>
              <li>Access controls and authentication protocols</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold">5. Data Sharing and Disclosure</h2>
            <p className="text-muted-foreground">
              We do not sell your personal information. We may share data only in these limited circumstances:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li><strong>Service Providers:</strong> Third-party services that help us operate (e.g., Stripe for payments, hosting providers)</li>
              <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
              <li><strong>Business Transfers:</strong> In the event of a merger, acquisition, or sale of assets</li>
              <li><strong>With Your Consent:</strong> When you explicitly authorize us to share information</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold">6. Your Rights and Choices</h2>
            <p className="text-muted-foreground">You have the right to:</p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li><strong>Access:</strong> Request a copy of your personal data</li>
              <li><strong>Correction:</strong> Update or correct inaccurate information</li>
              <li><strong>Deletion:</strong> Request deletion of your account and data</li>
              <li><strong>Opt-Out:</strong> Unsubscribe from marketing communications</li>
              <li><strong>Data Portability:</strong> Export your prediction history</li>
            </ul>
            <p className="text-muted-foreground mt-4">
              To exercise these rights, contact us at <a href="mailto:support@predicsure.com" className="text-primary hover:underline">support@predicsure.com</a>
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold">7. Data Retention</h2>
            <p className="text-muted-foreground">
              We retain your information for as long as your account is active or as needed to provide services. After account deletion, we may retain certain data for legal compliance, fraud prevention, and dispute resolution purposes.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold">8. Children's Privacy</h2>
            <p className="text-muted-foreground">
              Our service is not intended for users under 18 years of age. We do not knowingly collect information from children. If you believe we have inadvertently collected data from a minor, please contact us immediately.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold">9. International Data Transfers</h2>
            <p className="text-muted-foreground">
              Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place to protect your data in accordance with this Privacy Policy.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold">10. Changes to This Policy</h2>
            <p className="text-muted-foreground">
              We may update this Privacy Policy periodically. We will notify you of significant changes via email or through our platform. Continued use of our service after changes constitutes acceptance of the updated policy.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold">11. Contact Us</h2>
            <p className="text-muted-foreground">
              If you have questions about this Privacy Policy or our data practices, please contact us:
            </p>
            <ul className="list-none space-y-2 text-muted-foreground ml-4">
              <li>Email: <a href="mailto:support@predicsure.com" className="text-primary hover:underline">support@predicsure.com</a></li>
              <li>Website: <a href="/" className="text-primary hover:underline">predicsure.ai</a></li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
