import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Shield, Lock, Server, Eye, Key, FileCheck } from "lucide-react";

export default function DataSecurity() {
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
            <Shield className="w-10 h-10 text-primary" />
            <h1 className="text-4xl font-bold">Data Security</h1>
          </div>
          <p className="text-xl text-muted-foreground">
            Your privacy and security are our top priorities. Learn how we protect your data.
          </p>
        </div>

        <div className="prose prose-invert max-w-none space-y-8">
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <Lock className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-semibold">Encryption</h2>
            </div>
            <p className="text-muted-foreground">
              All data transmitted between your device and our servers is protected using industry-standard TLS 1.3 encryption. This ensures that your predictions, personal information, and payment details cannot be intercepted during transmission.
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li><strong>In Transit:</strong> TLS 1.3 encryption for all API requests and responses</li>
              <li><strong>At Rest:</strong> AES-256 encryption for stored data in our databases</li>
              <li><strong>End-to-End:</strong> Your predictions are encrypted from the moment you submit them</li>
            </ul>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <Server className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-semibold">Secure Infrastructure</h2>
            </div>
            <p className="text-muted-foreground">
              Our platform is hosted on enterprise-grade cloud infrastructure with multiple layers of security:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li><strong>Redundancy:</strong> Multi-region data replication for disaster recovery</li>
              <li><strong>Firewalls:</strong> Advanced network security to block unauthorized access</li>
              <li><strong>DDoS Protection:</strong> Automated defense against distributed denial-of-service attacks</li>
              <li><strong>Monitoring:</strong> 24/7 real-time security monitoring and alerting</li>
              <li><strong>Backups:</strong> Automated daily backups with 30-day retention</li>
            </ul>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <Key className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-semibold">Authentication & Access Control</h2>
            </div>
            <p className="text-muted-foreground">
              We implement strict access controls to ensure only authorized users can access your data:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li><strong>OAuth 2.0:</strong> Secure authentication through Manus OAuth</li>
              <li><strong>Session Management:</strong> Encrypted session tokens with automatic expiration</li>
              <li><strong>Role-Based Access:</strong> Internal team members have limited access based on job function</li>
              <li><strong>Audit Logs:</strong> All data access is logged and monitored for suspicious activity</li>
            </ul>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <Eye className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-semibold">Privacy by Design</h2>
            </div>
            <p className="text-muted-foreground">
              We follow privacy-first principles in everything we build:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li><strong>Data Minimization:</strong> We only collect information necessary to provide the Service</li>
              <li><strong>No Third-Party Sharing:</strong> We never sell your data to advertisers or brokers</li>
              <li><strong>Anonymization:</strong> Analytics data is aggregated and anonymized</li>
              <li><strong>User Control:</strong> You can export or delete your data at any time</li>
            </ul>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <FileCheck className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-semibold">Compliance & Certifications</h2>
            </div>
            <p className="text-muted-foreground">
              We adhere to industry standards and regulations:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li><strong>GDPR:</strong> Compliant with EU General Data Protection Regulation</li>
              <li><strong>CCPA:</strong> Compliant with California Consumer Privacy Act</li>
              <li><strong>PCI DSS:</strong> Payment processing through Stripe (Level 1 PCI DSS certified)</li>
              <li><strong>SOC 2:</strong> Infrastructure hosted on SOC 2 Type II certified providers</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">Payment Security</h2>
            <p className="text-muted-foreground">
              All payment transactions are processed through Stripe, a PCI DSS Level 1 certified payment processor. We never store your full credit card numbers on our servers. Stripe uses:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li>Tokenization to protect card data</li>
              <li>3D Secure authentication for fraud prevention</li>
              <li>Machine learning fraud detection</li>
              <li>Bank-level encryption</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">Incident Response</h2>
            <p className="text-muted-foreground">
              In the unlikely event of a security breach, we have a comprehensive incident response plan:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li><strong>Detection:</strong> Automated alerts for suspicious activity</li>
              <li><strong>Containment:</strong> Immediate isolation of affected systems</li>
              <li><strong>Notification:</strong> Affected users notified within 72 hours</li>
              <li><strong>Remediation:</strong> Root cause analysis and security improvements</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">Your Responsibilities</h2>
            <p className="text-muted-foreground">
              While we implement robust security measures, you also play a role in protecting your account:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li>Use a strong, unique password</li>
              <li>Never share your account credentials</li>
              <li>Log out from shared devices</li>
              <li>Report suspicious activity immediately</li>
              <li>Keep your email account secure (used for password resets)</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">Security Questions?</h2>
            <p className="text-muted-foreground">
              If you have questions about our security practices or want to report a vulnerability, please contact us:
            </p>
            <ul className="list-none space-y-2 text-muted-foreground ml-4">
              <li>Email: <a href="mailto:support@predicsure.ai" className="text-primary hover:underline">support@predicsure.ai</a></li>
              <li>Security Issues: <a href="mailto:security@predicsure.ai" className="text-primary hover:underline">security@predicsure.ai</a></li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
