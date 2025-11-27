import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import { Link, useLocation } from "wouter";
import { Circle, Loader2, Home, History, Zap, Crown, ArrowLeft } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Streamdown } from "streamdown";

const TIER_ICONS = {
  free: Circle,
  pro: Zap,
  premium: Crown,
};

export default function Dashboard() {
  const { user, loading: authLoading, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const [userInput, setUserInput] = useState("");
  const [category, setCategory] = useState<"career" | "love" | "finance" | "health" | "general">("general");
  const [prediction, setPrediction] = useState<string | null>(null);

  const { data: subscription, isLoading: subLoading, refetch: refetchSub } = trpc.subscription.getCurrent.useQuery(
    undefined,
    { enabled: isAuthenticated }
  );

  const generateMutation = trpc.prediction.generate.useMutation({
    onSuccess: (data) => {
      setPrediction(data.prediction);
      toast.success(`Prediction generated! ${data.remainingToday} predictions remaining today.`);
      refetchSub();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const upgradeMutation = trpc.subscription.upgrade.useMutation({
    onSuccess: () => {
      toast.success("Subscription upgraded successfully!");
      refetchSub();
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

  if (authLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const handleGenerate = () => {
    if (!userInput.trim()) {
      toast.error("Please enter your question or topic");
      return;
    }
    setPrediction(null);
    generateMutation.mutate({ userInput, category });
  };

  const usagePercent = subscription ? (subscription.usedToday / subscription.dailyLimit) * 100 : 0;
  const TierIcon = subscription ? TIER_ICONS[subscription.tier] : Circle;

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border/50 backdrop-blur-sm sticky top-0 z-50 bg-background/80">
        <div className="container py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Home
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <div className="relative w-6 h-6">
                <Circle className="w-6 h-6 text-primary fill-primary/20" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-secondary" />
                </div>
              </div>
              <h1 className="text-xl font-bold">Dashboard</h1>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/history">
              <Button variant="ghost" size="sm">
                <History className="w-4 h-4 mr-2" />
                History
              </Button>
            </Link>
            <div className="text-sm text-muted-foreground">
              {user?.name || user?.email}
            </div>
          </div>
        </div>
      </header>

      <div className="container py-8 max-w-6xl">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Subscription Status */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  {TierIcon && <TierIcon className="w-5 h-5 text-primary" />}
                  <CardTitle className="capitalize">{subscription?.tier} Plan</CardTitle>
                </div>
                <CardDescription>Your current subscription</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Daily Usage</span>
                    <span className="font-medium">
                      {subscription?.usedToday} / {subscription?.dailyLimit}
                    </span>
                  </div>
                  <Progress value={usagePercent} className="h-2" />
                </div>
                
                {subscription?.tier === "free" && (
                  <div className="space-y-2 pt-4 border-t border-border">
                    <p className="text-sm text-muted-foreground">Upgrade for more predictions</p>
                    <Button
                      onClick={() => upgradeMutation.mutate({ tier: "pro" })}
                      disabled={upgradeMutation.isPending}
                      className="w-full"
                      size="sm"
                    >
                      {upgradeMutation.isPending ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          <Zap className="w-4 h-4 mr-2" />
                          Upgrade to Pro
                        </>
                      )}
                    </Button>
                    <Button
                      onClick={() => upgradeMutation.mutate({ tier: "premium" })}
                      disabled={upgradeMutation.isPending}
                      variant="outline"
                      className="w-full"
                      size="sm"
                    >
                      {upgradeMutation.isPending ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          <Crown className="w-4 h-4 mr-2" />
                          Upgrade to Premium
                        </>
                      )}
                    </Button>
                  </div>
                )}

                {subscription?.tier === "pro" && (
                  <div className="space-y-2 pt-4 border-t border-border">
                    <p className="text-sm text-muted-foreground">Want more predictions?</p>
                    <Button
                      onClick={() => upgradeMutation.mutate({ tier: "premium" })}
                      disabled={upgradeMutation.isPending}
                      className="w-full"
                      size="sm"
                    >
                      {upgradeMutation.isPending ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          <Crown className="w-4 h-4 mr-2" />
                          Upgrade to Premium
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Prediction Generator */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Generate Prediction</CardTitle>
                <CardDescription>
                  Ask a question or describe what you'd like to know about
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Category</label>
                  <Select value={category} onValueChange={(val) => setCategory(val as any)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">General</SelectItem>
                      <SelectItem value="career">Career</SelectItem>
                      <SelectItem value="love">Love & Relationships</SelectItem>
                      <SelectItem value="finance">Finance</SelectItem>
                      <SelectItem value="health">Health & Wellness</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Your Question</label>
                  <Textarea
                    placeholder="What would you like to know? Be specific for better predictions..."
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    rows={4}
                    maxLength={1000}
                  />
                  <div className="text-xs text-muted-foreground mt-1 text-right">
                    {userInput.length} / 1000
                  </div>
                </div>

                <Button
                  onClick={handleGenerate}
                  disabled={generateMutation.isPending || !userInput.trim()}
                  className="w-full"
                  size="lg"
                >
                  {generateMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Circle className="w-4 h-4 mr-2 fill-primary/20" />
                      Generate Prediction
                    </>
                  )}
                </Button>

                {prediction && (
                  <div className="mt-6 p-6 bg-card border border-primary/20 rounded-lg shadow-lg shadow-primary/10">
                    <div className="flex items-center gap-2 mb-4">
                      <Circle className="w-5 h-5 text-primary fill-primary/20" />
                      <h3 className="font-semibold text-lg">Your Prediction</h3>
                    </div>
                    <div className="prose prose-invert max-w-none">
                      <Streamdown>{prediction}</Streamdown>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
