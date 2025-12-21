import { Dialog, DialogDescription, DialogHeader, DialogTitle, DialogOverlay, DialogPortal } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ArrowRight, X, Loader2 } from "lucide-react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { cn } from "@/lib/utils";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { toast } from "sonner";

interface PostPredictionPaywallProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userTier: "free" | "plus" | "pro" | "premium";
  predictionCategory?: string;
  sidebarCollapsed?: boolean;
}

export default function PostPredictionPaywall({ 
  open, 
  onOpenChange,
  userTier,
  predictionCategory = "general",
  sidebarCollapsed = false
}: PostPredictionPaywallProps) {
  const [loadingTier, setLoadingTier] = useState<string | null>(null);
  
  const createCheckoutMutation = trpc.subscription.createCheckoutSession.useMutation({
    onSuccess: (data) => {
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      }
    },
    onError: (error) => {
      toast.error("Failed to create checkout session: " + error.message);
      setLoadingTier(null);
    },
  });

  const handleUpgrade = (tier: "plus" | "premium") => {
    setLoadingTier(tier);
    
    // Map tier to the correct format for the API
    // Plus uses "pro" tier in API with monthly billing
    // Premium uses "premium" tier in API with yearly billing
    const apiTier = tier === "plus" ? "pro" : "premium";
    const interval = tier === "premium" ? "year" : "month";
    
    createCheckoutMutation.mutate({
      tier: apiTier as "pro" | "premium",
      interval,
    });
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogOverlay />
        <DialogPrimitive.Content
          style={{
            // On desktop (lg+), offset left position by half sidebar width
            // This centers the modal in the chat area, not the full viewport
          }}
          className={cn(
            "bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
            "fixed z-50 grid w-full max-w-md gap-4 rounded-lg border p-6 shadow-lg duration-200",
            // Center vertically
            "top-[50%] translate-y-[-50%]",
            // Mobile: center in viewport
            "left-[50%] translate-x-[-50%]",
            // Desktop: offset to account for sidebar (center in chat area)
            sidebarCollapsed 
              ? "lg:left-[calc(50%+32px)]" 
              : "lg:left-[calc(50%+128px)]"
          )}
        >
          <DialogHeader className="text-center pb-2">
            <div className="mx-auto w-14 h-14 flex items-center justify-center mb-4">
              <img src="/logo.svg" alt="Predicsure AI" className="w-14 h-14" />
            </div>
            <DialogTitle className="text-2xl font-semibold text-center">
              This thread isn't finished.
            </DialogTitle>
            <DialogDescription className="text-base mt-2 leading-relaxed">
              There's more unfolding here — something hasn't settled yet, and that's why this still feels open.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 mt-4">
            {/* Simple Value Proposition */}
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Plus lets you continue when things feel unclear — without interruptions.
              </p>
            </div>

            {/* Single Clear CTA - Plus Only */}
            <div className="space-y-3">
              <Button 
                className="w-full h-12 text-base" 
                size="lg"
                onClick={() => handleUpgrade("plus")}
                disabled={loadingTier === "plus"}
              >
                {loadingTier === "plus" ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Loading...
                  </>
                ) : (
                  <>
                    Continue with Plus
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </>
                )}
              </Button>
              <p className="text-center text-xs text-muted-foreground">
                $9.99/month · Unlimited clarity · Cancel anytime
              </p>
            </div>

            {/* Annual Option - Subtle */}
            <div className="text-center pt-2 border-t border-border/50">
              <p className="text-xs text-muted-foreground mb-2">
                Prefer not to carry this uncertainty forward?
              </p>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-primary hover:text-primary/80"
                onClick={() => handleUpgrade("premium")}
                disabled={loadingTier === "premium"}
              >
                {loadingTier === "premium" ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Loading...
                  </>
                ) : (
                  "Get Premium for $59/year →"
                )}
              </Button>
            </div>

            {/* Dismiss Option - Very Subtle */}
            <div className="text-center">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => onOpenChange(false)}
                className="text-muted-foreground/50 hover:text-muted-foreground text-xs"
              >
                Not right now
              </Button>
            </div>
          </div>

          {/* Close button */}
          <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>
        </DialogPrimitive.Content>
      </DialogPortal>
    </Dialog>
  );
}
