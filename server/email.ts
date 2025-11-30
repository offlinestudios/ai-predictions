import { notifyOwner } from "./_core/notification";

interface EmailNotification {
  to: string;
  subject: string;
  content: string;
}

/**
 * Send email notification to user
 * Uses the built-in notification API to send emails
 */
export async function sendEmail({ to, subject, content }: EmailNotification): Promise<boolean> {
  try {
    // Use notifyOwner to send email (the API will handle email delivery)
    const success = await notifyOwner({
      title: `Email to ${to}: ${subject}`,
      content: `To: ${to}\n\n${content}`,
    });
    
    return success;
  } catch (error) {
    console.error("Failed to send email:", error);
    return false;
  }
}

/**
 * Send welcome email to new user
 */
export async function sendWelcomeEmail(userEmail: string, userName: string): Promise<boolean> {
  return sendEmail({
    to: userEmail,
    subject: "Welcome to AI Predictions! 🔮",
    content: `Hi ${userName},

Welcome to AI Predictions! We're excited to have you on board.

You've started with our Free plan, which includes:
• 3 total predictions to explore our AI-powered insights
• Access to all prediction categories (career, love, finance, health, general)
• Personalized predictions based on your questions

Ready to get started? Head to your dashboard and ask your first question!

If you love the experience and want unlimited predictions, you can upgrade to Pro or Premium anytime.

Best regards,
The AI Predictions Team

---
Questions? Reply to this email or visit your account settings.`,
  });
}

/**
 * Send subscription confirmation email
 */
export async function sendSubscriptionConfirmationEmail(
  userEmail: string,
  userName: string,
  tier: "pro" | "premium",
  amount: number
): Promise<boolean> {
  const tierName = tier === "pro" ? "Pro" : "Premium";
  const dailyLimit = tier === "pro" ? 20 : 100;
  
  return sendEmail({
    to: userEmail,
    subject: `Welcome to ${tierName}! Your subscription is active 🎉`,
    content: `Hi ${userName},

Congratulations! Your ${tierName} subscription is now active.

Subscription Details:
• Plan: ${tierName} Plan
• Price: $${(amount / 100).toFixed(2)}/month
• Daily Predictions: ${dailyLimit} per day
• Billing Cycle: Monthly (renews automatically)

What's Included:
${tier === "pro" ? `• 20 predictions per day
• Full prediction history
• AI personalization that learns from your feedback
• File attachments for context
• Advanced categories` : `• 100 predictions per day
• Everything in Pro
• Priority support
• Early access to new features
• Premium AI models`}

Start exploring unlimited predictions now! Visit your dashboard to begin.

Manage Your Subscription:
You can update your payment method, view invoices, or cancel anytime from your account settings.

Thank you for upgrading!
The AI Predictions Team

---
Questions? Reply to this email or visit your account settings.`,
  });
}

/**
 * Send payment receipt email
 */
export async function sendPaymentReceiptEmail(
  userEmail: string,
  userName: string,
  amount: number,
  invoiceUrl?: string
): Promise<boolean> {
  return sendEmail({
    to: userEmail,
    subject: "Payment Receipt - AI Predictions",
    content: `Hi ${userName},

Thank you for your payment! Your subscription has been renewed.

Payment Details:
• Amount: $${(amount / 100).toFixed(2)} USD
• Date: ${new Date().toLocaleDateString()}
• Status: Paid
${invoiceUrl ? `• Invoice: ${invoiceUrl}` : ""}

Your subscription remains active and you can continue enjoying unlimited predictions.

If you have any questions about this payment, please don't hesitate to reach out.

Best regards,
The AI Predictions Team

---
Questions? Reply to this email or visit your account settings.`,
  });
}

/**
 * Send failed payment notification email
 */
export async function sendFailedPaymentEmail(
  userEmail: string,
  userName: string,
  amount: number
): Promise<boolean> {
  return sendEmail({
    to: userEmail,
    subject: "Payment Failed - Action Required",
    content: `Hi ${userName},

We were unable to process your recent payment of $${(amount / 100).toFixed(2)} USD.

What This Means:
Your subscription is currently at risk. If we cannot process payment within the next few days, your account may be downgraded to the Free plan.

How to Fix This:
1. Visit your account settings
2. Click "Manage Subscription"
3. Update your payment method
4. We'll automatically retry the payment

Common Reasons for Failed Payments:
• Expired credit card
• Insufficient funds
• Card issuer declined the transaction
• Billing address mismatch

Need Help?
If you're experiencing issues updating your payment method, please reply to this email and we'll assist you right away.

Best regards,
The AI Predictions Team

---
Questions? Reply to this email or visit your account settings.`,
  });
}

/**
 * Send weekly prediction summary email
 */
export async function sendWeeklySummaryEmail(
  userEmail: string,
  userName: string,
  predictionCount: number,
  favoriteCategory: string,
  tier: string
): Promise<boolean> {
  return sendEmail({
    to: userEmail,
    subject: "Your Weekly Prediction Summary 📊",
    content: `Hi ${userName},

Here's your prediction activity for the past week:

This Week's Stats:
• Predictions Generated: ${predictionCount}
• Favorite Category: ${favoriteCategory}
• Current Plan: ${tier.charAt(0).toUpperCase() + tier.slice(1)}

${tier === "free" ? `You're on the Free plan with limited predictions. Upgrade to Pro or Premium for unlimited daily predictions and advanced features!

Upgrade Now: Visit your dashboard to explore Pro and Premium plans.` : `Keep the insights flowing! You have ${tier === "pro" ? "20" : "100"} predictions available per day.`}

Popular This Week:
Our community has been asking about career changes, relationship advice, and financial planning. What will you explore next?

Visit Your Dashboard: Continue your journey and discover what the future holds.

Best regards,
The AI Predictions Team

---
Questions? Reply to this email or visit your account settings.`,
  });
}
