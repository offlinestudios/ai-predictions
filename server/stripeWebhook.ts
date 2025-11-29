import { Router } from "express";
import { stripe, Stripe } from "./_core/stripe";
import { updateSubscriptionTier } from "./db";

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
        // Could send email notification to user here
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
