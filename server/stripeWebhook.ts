import { Router } from "express";
import { stripe, Stripe } from "./_core/stripe";
import { updateSubscriptionTier } from "./db";
import { sendSubscriptionConfirmationEmail, sendPaymentReceiptEmail, sendFailedPaymentEmail } from "./email";

const router = Router();

// Stripe webhook endpoint - MUST use raw body for signature verification
router.post("/api/stripe/webhook", async (req, res) => {
  const sig = req.headers["stripe-signature"];

  if (!sig) {
    console.error("[Stripe Webhook] No signature found");
    return res.status(400).send("No signature");
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error("[Stripe Webhook] Signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle test events
  if (event.id.startsWith("evt_test_")) {
    console.log("[Stripe Webhook] Test event detected, returning verification response");
    return res.json({
      verified: true,
    });
  }

  console.log(`[Stripe Webhook] Received event: ${event.type}`);

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        console.log("[Stripe Webhook] Checkout completed:", session.id);

        // Extract user info from metadata
        const userId = session.metadata?.user_id;
        const tier = session.metadata?.tier as "pro" | "premium";

        if (userId && tier) {
          // Update user subscription in database
          await updateSubscriptionTier(parseInt(userId), tier);
          console.log(`[Stripe Webhook] Updated user ${userId} to ${tier} tier`);
          
          // Send subscription confirmation email
          const userEmail = session.customer_details?.email || session.metadata?.user_email;
          const userName = session.customer_details?.name || session.metadata?.user_name || "there";
          const amount = session.amount_total || 0;
          
          if (userEmail) {
            await sendSubscriptionConfirmationEmail(userEmail, userName, tier, amount);
            console.log(`[Stripe Webhook] Sent subscription confirmation email to ${userEmail}`);
          }
        }
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        console.log("[Stripe Webhook] Subscription updated:", subscription.id);
        
        // Handle subscription status changes (active, canceled, etc.)
        if (subscription.status === "canceled" || subscription.status === "unpaid") {
          const userId = subscription.metadata?.user_id;
          if (userId) {
            await updateSubscriptionTier(parseInt(userId), "free");
            console.log(`[Stripe Webhook] Downgraded user ${userId} to free tier`);
          }
        }
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        console.log("[Stripe Webhook] Subscription deleted:", subscription.id);
        
        const userId = subscription.metadata?.user_id;
        if (userId) {
          await updateSubscriptionTier(parseInt(userId), "free");
          console.log(`[Stripe Webhook] Downgraded user ${userId} to free tier`);
        }
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        console.log("[Stripe Webhook] Payment failed for invoice:", invoice.id);
        
        // Send failed payment email
        const customerEmail = invoice.customer_email;
        const amount = invoice.amount_due;
        
        if (customerEmail) {
          await sendFailedPaymentEmail(customerEmail, "there", amount);
          console.log(`[Stripe Webhook] Sent failed payment email to ${customerEmail}`);
        }
        break;
      }
      
      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice;
        console.log("[Stripe Webhook] Payment succeeded for invoice:", invoice.id);
        
        // Send payment receipt email (skip for first invoice as confirmation email covers it)
        if (invoice.billing_reason !== "subscription_create") {
          const customerEmail = invoice.customer_email;
          const amount = invoice.amount_paid;
          const invoiceUrl = invoice.hosted_invoice_url;
          
          if (customerEmail) {
            await sendPaymentReceiptEmail(customerEmail, "there", amount, invoiceUrl || undefined);
            console.log(`[Stripe Webhook] Sent payment receipt email to ${customerEmail}`);
          }
        }
        break;
      }

      default:
        console.log(`[Stripe Webhook] Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error("[Stripe Webhook] Error processing event:", error);
    res.status(500).json({ error: "Webhook processing failed" });
  }
});

export default router;
