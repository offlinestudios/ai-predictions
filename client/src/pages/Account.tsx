import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { Loader2, Home, ArrowLeft, Star, Zap, Crown, ExternalLink, CreditCard, Calendar, TrendingUp, Sparkles, Brain, Settings } from "lucide-react";
import { useEffect } from "react";
import PsycheProfileCard from "@/components/PsycheProfileCard";
import { toast } from "sonner";

const TIER_INFO = {
  free: {
    icon: Star,
    name: "Free Plan",
    color: "text-gray-400",
    bgColor: "bg-gray-500/10",
    limit: "3 predictions per week",
  },
  plus: {
    icon: Zap,
    name: "Plus Plan",
    color: "text-purple-400",
    bgColor: "bg-purple-500/10",
    limit: "Unlimited predictions",
  },
  pro: {
    icon: Crown,
    name: "Pro Plan",
    color: "text-yellow-400",
    bgColor: "bg-yellow-500/10",
    limit: "Unlimited + 90-day forecasts",
  },
  premium: {
    icon: Crown,
    name: "Premium Plan",
    color: "text-purple-400",
    bgColor: "bg-purple-500/10",
    limit: "Unlimited predictions",
  },
};

export default function Account() {
  const { user, loading: authLoading, isAuthenticated } = useAuth();

  const { data: subscription, isLoading: subLoading } = trpc.subscription.getCurrent.useQuery(
    undefined,
    { enabled: isAuthenticated }
  );

  const portalMutation = trpc.subscription.createPortalSession.useMutation({
    onSuccess: (data) => {
      if (data.portalUrl) {
        window.open(data.portalUrl, "_blank");
      }
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      window.location.href = getLoginUrl();
    }
  }, [authLoading, isAuthenticated]);

  if (authLoading || !isAuthenticated || subLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const tierInfo = subscription ? TIER_INFO[subscription.tier] : TIER_INFO.free;
  const TierIcon = tierInfo.icon;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/40 bg-card/30 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Link href="/dashboard">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <Settings className="w-6 h-6 text-primary" />
            <h1 className="text-lg font-semibold">Account Settings</h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-6">
          {/* User Profile Card */}
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Your account details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                  <span className="text-2xl font-bold text-primary">
                    {user?.name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || "U"}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-lg">{user?.name || "User"}</p>
                  <p className="text-sm text-muted-foreground">{user?.email}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Psyche Profile Card */}
          <PsycheProfileCard />

          {/* Current Subscription Card */}
          <Card>
            <CardHeader>
              <CardTitle>Current Subscription</CardTitle>
              <CardDescription>Manage your subscription and billing</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Tier Badge */}
              <div className="flex items-center justify-between p-4 rounded-lg border border-border bg-card/50">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-full ${tierInfo.bgColor}`}>
                    <TierIcon className={`w-6 h-6 ${tierInfo.color}`} />
                  </div>
                  <div>
                    <p className="font-semibold text-lg">{tierInfo.name}</p>
                    <p className="text-sm text-muted-foreground">{tierInfo.limit}</p>
                  </div>
                </div>
                <Badge variant={subscription?.tier === "free" ? "secondary" : "default"} className="text-sm px-3 py-1">
                  {subscription?.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>

              {/* Usage Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-lg border border-border bg-muted/30">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-4 h-4 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">Total Used</p>
                  </div>
                  <p className="text-2xl font-bold">{subscription?.totalUsed || 0}</p>
                  <p className="text-xs text-muted-foreground mt-1">All-time predictions</p>
                </div>

                <div className="p-4 rounded-lg border border-border bg-muted/30">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">Today</p>
                  </div>
                  <p className="text-2xl font-bold">
                    {subscription?.tier === "free" 
                      ? `${subscription?.totalUsed || 0} / 3`
                      : `${subscription?.usedToday || 0} / ${subscription?.dailyLimit || 0}`
                    }
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {subscription?.tier === "free" ? "Lifetime limit" : "Daily usage"}
                  </p>
                </div>

                <div className="p-4 rounded-lg border border-border bg-muted/30">
                  <div className="flex items-center gap-2 mb-2">
                    <Star className="w-4 h-4 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">Tier</p>
                  </div>
                  <p className="text-2xl font-bold capitalize">{subscription?.tier || "Free"}</p>
                  <p className="text-xs text-muted-foreground mt-1">Current plan</p>
                </div>
              </div>

              {/* Manage Subscription Button */}
              {subscription?.tier !== "free" && (
                <div className="pt-4 border-t border-border">
                  <Button
                    onClick={() => portalMutation.mutate()}
                    disabled={portalMutation.isPending}
                    className="w-full"
                    size="lg"
                  >
                    {portalMutation.isPending ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <CreditCard className="w-4 h-4 mr-2" />
                    )}
                    Manage Subscription & Billing
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </Button>
                  <p className="text-xs text-muted-foreground text-center mt-2">
                    Update payment method, view invoices, or cancel subscription
                  </p>
                </div>
              )}

              {/* Upgrade CTA for Free Users */}
              {subscription?.tier === "free" && (
                <div className="pt-4 border-t border-border">
                  <div className="p-4 rounded-lg bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20">
                    <p className="font-semibold mb-2">Upgrade for unlimited predictions</p>
                    <p className="text-sm text-muted-foreground mb-4">
                      Get access to daily predictions, full history, and personalized insights.
                    </p>
                    <Link href="/dashboard">
                      <Button className="w-full">
                        <Zap className="w-4 h-4 mr-2" />
                        View Plans
                      </Button>
                    </Link>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Account Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Account Actions</CardTitle>
              <CardDescription>Manage your account settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/history">
                <Button variant="outline" className="w-full justify-start">
                  <Calendar className="w-4 h-4 mr-2" />
                  View Prediction History
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="outline" className="w-full justify-start">
                  <Home className="w-4 h-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
