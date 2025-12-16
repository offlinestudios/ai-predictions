import { useState } from "react";
import { trpc } from "../lib/trpc";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Alert, AlertDescription } from "../components/ui/alert";
import { Loader2, Users, Trash2, CheckCircle, AlertCircle, UserCog, Sparkles, CreditCard, Crown, Zap, Star } from "lucide-react";
import { useLocation } from "wouter";

const SUBSCRIPTION_TIERS = [
  { id: "free", name: "Free", description: "3 predictions/week, basic features", icon: Star, color: "bg-gray-500/10 border-gray-500/30 hover:bg-gray-500/20" },
  { id: "plus", name: "Plus", description: "Unlimited + 30-day forecasts", icon: Zap, color: "bg-blue-500/10 border-blue-500/30 hover:bg-blue-500/20" },
  { id: "pro", name: "Pro", description: "90-day forecasts + scenarios", icon: Crown, color: "bg-purple-500/10 border-purple-500/30 hover:bg-purple-500/20" },
  { id: "premium", name: "Premium", description: "Everything + yearly forecasts", icon: Crown, color: "bg-amber-500/10 border-amber-500/30 hover:bg-amber-500/20" },
] as const;

const PERSONALITY_TYPES = [
  { id: "maverick", name: "The Maverick", description: "Bold risk-taker, driven by instinct", color: "bg-red-500/10 border-red-500/30 hover:bg-red-500/20" },
  { id: "strategist", name: "The Strategist", description: "Methodical, data-driven planner", color: "bg-blue-500/10 border-blue-500/30 hover:bg-blue-500/20" },
  { id: "visionary", name: "The Visionary", description: "Bold yet calculated, big-picture thinker", color: "bg-purple-500/10 border-purple-500/30 hover:bg-purple-500/20" },
  { id: "guardian", name: "The Guardian", description: "Protective, stability-focused", color: "bg-green-500/10 border-green-500/30 hover:bg-green-500/20" },
  { id: "pioneer", name: "The Pioneer", description: "Passionate, long-term visionary", color: "bg-orange-500/10 border-orange-500/30 hover:bg-orange-500/20" },
  { id: "pragmatist", name: "The Pragmatist", description: "Practical, grounded realist", color: "bg-gray-500/10 border-gray-500/30 hover:bg-gray-500/20" },
  { id: "catalyst", name: "The Catalyst", description: "Energetic, spontaneous inspirer", color: "bg-yellow-500/10 border-yellow-500/30 hover:bg-yellow-500/20" },
  { id: "adapter", name: "The Adapter", description: "Flexible, context-aware balancer", color: "bg-teal-500/10 border-teal-500/30 hover:bg-teal-500/20" },
] as const;

export default function Admin() {
  const [, setLocation] = useLocation();
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [currentPersonality, setCurrentPersonality] = useState<string | null>(null);

  // Get current user to check admin status
  const { data: user, isLoading: userLoading, refetch: refetchUser } = trpc.auth.me.useQuery();

  // Get user's psyche profile
  const { data: psycheProfile, refetch: refetchProfile } = trpc.psyche.getProfile.useQuery(undefined, {
    enabled: !!user,
  });

  // Get test users
  const { data: testUsers, isLoading: usersLoading, refetch } = trpc.admin.getTestUsers.useQuery(undefined, {
    enabled: user?.role === "admin",
  });

  // Seed test users mutation
  const seedMutation = trpc.admin.seedTestUsers.useMutation({
    onSuccess: (data) => {
      setMessage({ type: "success", text: data.message });
      refetch();
    },
    onError: (error) => {
      setMessage({ type: "error", text: error.message });
    },
  });

  // Delete test users mutation
  const deleteMutation = trpc.admin.deleteTestUsers.useMutation({
    onSuccess: (data) => {
      setMessage({ type: "success", text: data.message });
      refetch();
    },
    onError: (error) => {
      setMessage({ type: "error", text: error.message });
    },
  });

  // Impersonate personality mutation
  const impersonateMutation = trpc.admin.impersonatePersonality.useMutation({
    onSuccess: (data) => {
      setMessage({ type: "success", text: data.message });
      setCurrentPersonality(data.personality.type);
      refetchProfile();
      refetchUser();
    },
    onError: (error) => {
      setMessage({ type: "error", text: error.message });
    },
  });

  // Get current subscription
  const { data: subscription, refetch: refetchSubscription } = trpc.subscription.getCurrent.useQuery(undefined, {
    enabled: !!user,
  });

  // Change subscription tier mutation
  const changeTierMutation = trpc.admin.changeSubscriptionTier.useMutation({
    onSuccess: (data) => {
      setMessage({ type: "success", text: data.message });
      refetchSubscription();
    },
    onError: (error) => {
      setMessage({ type: "error", text: error.message });
    },
  });

  const handleChangeTier = (tier: typeof SUBSCRIPTION_TIERS[number]["id"]) => {
    setMessage(null);
    changeTierMutation.mutate({ tier });
  };

  const handleSeedUsers = () => {
    setMessage(null);
    seedMutation.mutate();
  };

  const handleDeleteUsers = () => {
    if (window.confirm("Are you sure you want to delete all test users? This cannot be undone.")) {
      setMessage(null);
      deleteMutation.mutate();
    }
  };

  const handleImpersonate = (personalityType: typeof PERSONALITY_TYPES[number]["id"]) => {
    setMessage(null);
    impersonateMutation.mutate({ personalityType });
  };

  // Check if user is admin
  if (userLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-red-600">Access Denied</CardTitle>
            <CardDescription>You do not have permission to access this page.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => setLocation("/dashboard")} className="w-full">
              Go to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground mt-1">Manage test users and system settings</p>
          </div>
          <Button variant="outline" onClick={() => setLocation("/dashboard")}>
            Back to Dashboard
          </Button>
        </div>

        {/* Message Alert */}
        {message && (
          <Alert variant={message.type === "error" ? "destructive" : "default"}>
            {message.type === "success" ? (
              <CheckCircle className="h-4 w-4" />
            ) : (
              <AlertCircle className="h-4 w-4" />
            )}
            <AlertDescription>{message.text}</AlertDescription>
          </Alert>
        )}

        {/* Quick Personality Switcher - Most Important Feature */}
        <Card className="border-2 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCog className="w-5 h-5" />
              Quick Personality Switcher
              <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full">Recommended</span>
            </CardTitle>
            <CardDescription>
              Instantly switch your personality type to test how predictions differ. Your current personality: 
              <strong className="text-foreground ml-1">{psycheProfile?.displayName || "Not set"}</strong>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {PERSONALITY_TYPES.map((personality) => (
                <button
                  key={personality.id}
                  onClick={() => handleImpersonate(personality.id)}
                  disabled={impersonateMutation.isPending}
                  className={`p-4 rounded-lg border-2 text-left transition-all ${personality.color} ${
                    psycheProfile?.displayName === personality.name ? "ring-2 ring-primary ring-offset-2" : ""
                  }`}
                >
                  <div className="font-semibold text-sm">{personality.name}</div>
                  <div className="text-xs text-muted-foreground mt-1">{personality.description}</div>
                  {psycheProfile?.displayName === personality.name && (
                    <div className="flex items-center gap-1 mt-2 text-xs text-primary">
                      <Sparkles className="w-3 h-3" />
                      Current
                    </div>
                  )}
                </button>
              ))}
            </div>
            
            {impersonateMutation.isPending && (
              <div className="flex items-center justify-center py-2">
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                <span className="text-sm">Switching personality...</span>
              </div>
            )}

            <div className="bg-muted/50 p-4 rounded-lg">
              <h4 className="font-semibold text-sm mb-2">How to Test:</h4>
              <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                <li>Click any personality above to switch instantly</li>
                <li>Go to Dashboard and ask a prediction question</li>
                <li>Switch to a different personality and ask the same question</li>
                <li>Compare how the AI responds differently based on personality!</li>
              </ol>
            </div>
          </CardContent>
        </Card>

        {/* Subscription Tier Switcher */}
        <Card className="border-2 border-amber-500/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Subscription Tier Switcher
              <span className="text-xs bg-amber-500/20 text-amber-600 px-2 py-1 rounded-full">Testing</span>
            </CardTitle>
            <CardDescription>
              Switch between subscription tiers to test premium features. Current tier:
              <strong className="text-foreground ml-1 capitalize">{subscription?.tier || "Free"}</strong>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {SUBSCRIPTION_TIERS.map((tier) => {
                const Icon = tier.icon;
                return (
                  <button
                    key={tier.id}
                    onClick={() => handleChangeTier(tier.id)}
                    disabled={changeTierMutation.isPending}
                    className={`p-4 rounded-lg border-2 text-left transition-all ${tier.color} ${
                      subscription?.tier === tier.id ? "ring-2 ring-amber-500 ring-offset-2" : ""
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4" />
                      <span className="font-semibold text-sm">{tier.name}</span>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">{tier.description}</div>
                    {subscription?.tier === tier.id && (
                      <div className="flex items-center gap-1 mt-2 text-xs text-amber-600">
                        <Sparkles className="w-3 h-3" />
                        Current
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
            
            {changeTierMutation.isPending && (
              <div className="flex items-center justify-center py-2">
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                <span className="text-sm">Changing subscription...</span>
              </div>
            )}

            <div className="bg-muted/50 p-4 rounded-lg">
              <h4 className="font-semibold text-sm mb-2">Tier Features:</h4>
              <div className="text-sm text-muted-foreground space-y-1">
                <p><strong>Free:</strong> 3 predictions/week, instant forecasts only</p>
                <p><strong>Plus:</strong> Unlimited + Deep Mode + 30-day forecasts</p>
                <p><strong>Pro:</strong> + 90-day forecasts + Alternate scenarios + Analytics</p>
                <p><strong>Premium:</strong> + Yearly forecasts + All future features</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Test Questions Reference */}
        <Card>
          <CardHeader>
            <CardTitle>Test Prediction Questions</CardTitle>
            <CardDescription>Use these questions to compare predictions across personalities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="p-3 bg-muted/50 rounded-lg">
                  <div className="text-xs font-semibold text-muted-foreground mb-1">CAREER</div>
                  <p className="text-sm">"Should I quit my job and start my own business?"</p>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <div className="text-xs font-semibold text-muted-foreground mb-1">FINANCE</div>
                  <p className="text-sm">"Should I invest $10,000 in cryptocurrency right now?"</p>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <div className="text-xs font-semibold text-muted-foreground mb-1">LOVE</div>
                  <p className="text-sm">"Is my current relationship going to lead to marriage?"</p>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <div className="text-xs font-semibold text-muted-foreground mb-1">HEALTH</div>
                  <p className="text-sm">"Should I try an extreme fasting diet to lose weight?"</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="p-3 bg-muted/50 rounded-lg">
                  <div className="text-xs font-semibold text-muted-foreground mb-1">STOCKS</div>
                  <p className="text-sm">"Will Tesla stock go up or down in the next 6 months?"</p>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <div className="text-xs font-semibold text-muted-foreground mb-1">SPORTS</div>
                  <p className="text-sm">"Will the Lakers win the NBA championship this year?"</p>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <div className="text-xs font-semibold text-muted-foreground mb-1">GENERAL</div>
                  <p className="text-sm">"Should I move to a new city for a fresh start?"</p>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <div className="text-xs font-semibold text-muted-foreground mb-1">HIGH RISK</div>
                  <p className="text-sm">"Should I bet my savings on a startup opportunity?"</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Test Users Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Test Users Management
            </CardTitle>
            <CardDescription>
              Create separate test user accounts (alternative to personality switcher above)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Actions */}
            <div className="flex gap-3">
              <Button
                onClick={handleSeedUsers}
                disabled={seedMutation.isPending}
                variant="outline"
                className="flex-1"
              >
                {seedMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating Users...
                  </>
                ) : (
                  "Seed Test Users"
                )}
              </Button>
              <Button
                onClick={handleDeleteUsers}
                disabled={deleteMutation.isPending || !testUsers || testUsers.length === 0}
                variant="destructive"
                className="flex-1"
              >
                {deleteMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete All Test Users
                  </>
                )}
              </Button>
            </div>

            {/* Test Users List */}
            {usersLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
              </div>
            ) : testUsers && testUsers.length > 0 ? (
              <div className="space-y-2">
                <h3 className="font-semibold text-sm">Test Users ({testUsers.length}):</h3>
                <div className="grid gap-2">
                  {testUsers.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center justify-between p-3 border rounded-lg bg-card"
                    >
                      <div className="flex-1">
                        <p className="font-medium">{user.email}</p>
                        <p className="text-sm text-muted-foreground">{user.personality}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">
                          {user.onboardingCompleted ? "✓ Onboarded" : "⚠ Incomplete"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No test users found</p>
                <p className="text-sm">Click "Seed Test Users" to create them</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
