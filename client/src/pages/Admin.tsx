import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { Loader2, ArrowLeft, Users, TrendingUp, DollarSign, Heart, Share2, Activity } from "lucide-react";
import { useAuth } from "@clerk/clerk-react";

export default function Admin() {
  const { isSignedIn, isLoaded } = useAuth();
  const { data: analytics, isLoading, error } = trpc.admin.getAnalytics.useQuery();

  // Loading state
  if (!isLoaded || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-purple-400" />
      </div>
    );
  }

  // Not logged in
  if (!isSignedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 flex items-center justify-center p-4">
        <Card className="max-w-md w-full bg-slate-900/50 border-slate-800">
          <CardHeader>
            <CardTitle>Admin Access Required</CardTitle>
            <CardDescription>You must be signed in as the project owner to view analytics.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button asChild className="w-full">
              <a href={getLoginUrl()}>Sign In</a>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link href="/">Back to Home</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Error or forbidden
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 flex items-center justify-center p-4">
        <Card className="max-w-md w-full bg-slate-900/50 border-slate-800">
          <CardHeader>
            <CardTitle className="text-red-400">Access Denied</CardTitle>
            <CardDescription>{error.message || "Only the project owner can access this page."}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline" className="w-full">
              <Link href="/dashboard">Back to Dashboard</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!analytics) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button asChild variant="ghost" size="sm">
              <Link href="/dashboard">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Link>
            </Button>
            <h1 className="text-2xl font-bold text-white">Admin Analytics</h1>
          </div>
          <Badge variant="outline" className="bg-purple-500/20 text-purple-300 border-purple-500/30">
            Owner Dashboard
          </Badge>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Users */}
          <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.userStats.total}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {analytics.recentActivity.newUsers} new in last 30 days
              </p>
            </CardContent>
          </Card>

          {/* MRR */}
          <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${analytics.revenueMetrics.mrr}</div>
              <p className="text-xs text-muted-foreground mt-1">
                ${analytics.revenueMetrics.arr} ARR
              </p>
            </CardContent>
          </Card>

          {/* Total Predictions */}
          <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Predictions</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.predictionStats.total}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {analytics.recentActivity.newPredictions} in last 30 days
              </p>
            </CardContent>
          </Card>

          {/* Conversion Rate */}
          <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.conversionRates.overallConversionRate}%</div>
              <p className="text-xs text-muted-foreground mt-1">
                Free to paid conversion
              </p>
            </CardContent>
          </Card>
        </div>

        {/* User Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader>
              <CardTitle>User Breakdown by Tier</CardTitle>
              <CardDescription>Distribution of users across subscription tiers</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-slate-500/20 text-slate-300 border-slate-500/30">
                    Free
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {analytics.userStats.total > 0 
                      ? ((analytics.userStats.free / analytics.userStats.total) * 100).toFixed(1)
                      : 0}%
                  </span>
                </div>
                <span className="text-2xl font-bold">{analytics.userStats.free}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                    Pro
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {analytics.userStats.total > 0 
                      ? ((analytics.userStats.pro / analytics.userStats.total) * 100).toFixed(1)
                      : 0}%
                  </span>
                </div>
                <span className="text-2xl font-bold">{analytics.userStats.pro}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                    Premium
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {analytics.userStats.total > 0 
                      ? ((analytics.userStats.premium / analytics.userStats.total) * 100).toFixed(1)
                      : 0}%
                  </span>
                </div>
                <span className="text-2xl font-bold">{analytics.userStats.premium}</span>
              </div>
            </CardContent>
          </Card>

          {/* Predictions by Category */}
          <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader>
              <CardTitle>Predictions by Category</CardTitle>
              <CardDescription>Most popular prediction categories</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {analytics.predictionStats.byCategory.slice(0, 5).map((cat) => (
                <div key={cat.category} className="flex items-center justify-between">
                  <span className="text-sm capitalize">{cat.category}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-purple-500"
                        style={{
                          width: `${(cat.count / analytics.predictionStats.total) * 100}%`,
                        }}
                      />
                    </div>
                    <span className="text-sm font-medium w-12 text-right">{cat.count}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Engagement & Sharing */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-pink-400" />
                User Feedback
              </CardTitle>
              <CardDescription>Prediction feedback distribution</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {analytics.predictionStats.byFeedback.map((fb) => (
                <div key={fb.feedback} className="flex items-center justify-between">
                  <Badge
                    variant="outline"
                    className={
                      fb.feedback === "like"
                        ? "bg-green-500/20 text-green-300 border-green-500/30"
                        : "bg-red-500/20 text-red-300 border-red-500/30"
                    }
                  >
                    {fb.feedback === "like" ? "👍 Liked" : "👎 Disliked"}
                  </Badge>
                  <span className="text-xl font-bold">{fb.count}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Share2 className="w-5 h-5 text-blue-400" />
                Sharing Stats
              </CardTitle>
              <CardDescription>Viral potential and sharing activity</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total Shareable Predictions</span>
                <span className="text-2xl font-bold">{analytics.sharingStats.totalShared}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Most Liked (Viral Potential)</span>
                <span className="text-2xl font-bold">{analytics.sharingStats.mostLiked.length}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Most Liked Predictions */}
        {analytics.sharingStats.mostLiked.length > 0 && (
          <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader>
              <CardTitle>Top Liked Predictions</CardTitle>
              <CardDescription>Predictions with highest engagement (potential viral content)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analytics.sharingStats.mostLiked.map((pred) => (
                  <div
                    key={pred.id}
                    className="flex items-start justify-between p-3 rounded-lg bg-slate-800/50 border border-slate-700"
                  >
                    <div className="flex-1">
                      <p className="text-sm font-medium">{pred.userInput}</p>
                      {pred.category && (
                        <Badge variant="outline" className="mt-2 text-xs">
                          {pred.category}
                        </Badge>
                      )}
                    </div>
                    {pred.shareToken && (
                      <Button asChild variant="ghost" size="sm">
                        <Link href={`/share/${pred.shareToken}`}>View</Link>
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
