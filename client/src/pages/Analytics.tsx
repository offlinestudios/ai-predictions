import { useState } from "react";
import { useAuth as useClerkAuth, useUser } from "@clerk/clerk-react";
import { trpc } from "../lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Link } from "wouter";
import { ArrowLeft, TrendingUp, Target, Zap, ThumbsUp, ThumbsDown, BarChart3, PieChart, Calendar, Download, Crown } from "lucide-react";

export default function Analytics() {
  const { isSignedIn } = useClerkAuth();
  const { user } = useUser();
  const isAuthenticated = isSignedIn;
  const [dateRange, setDateRange] = useState<"7d" | "30d" | "90d" | "all">("30d");
  
  const getLoginUrl = () => {
    const currentUrl = window.location.href;
    return `/sign-in?redirect_url=${encodeURIComponent(currentUrl)}`;
  };

  // Fetch subscription to check if user is Premium
  const { data: subscription, isLoading: subLoading } = trpc.subscription.getCurrent.useQuery(
    undefined,
    { enabled: isAuthenticated }
  );

  // Fetch analytics data
  const { data: analytics, isLoading: analyticsLoading } = trpc.prediction.getAnalytics.useQuery(
    { dateRange },
    { enabled: isAuthenticated && subscription?.tier === "premium" }
  );

  // Redirect if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle>Sign In Required</CardTitle>
            <CardDescription>Please sign in to view analytics</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <a href={getLoginUrl()}>Sign In</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show upgrade prompt if not Premium
  if (!subLoading && subscription?.tier !== "premium") {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b border-border/50 backdrop-blur-sm sticky top-0 z-50 bg-background/80">
          <div className="container py-4 flex items-center justify-between">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </header>

        <div className="container py-16 flex items-center justify-center">
          <Card className="max-w-2xl w-full border-primary/20">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="p-4 rounded-full bg-primary/10">
                  <Crown className="w-12 h-12 text-primary" />
                </div>
              </div>
              <CardTitle className="text-2xl">Premium Feature</CardTitle>
              <CardDescription className="text-base">
                Prediction Analytics is exclusively available for Premium subscribers
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <h3 className="font-semibold text-lg">What you'll get with Premium Analytics:</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <BarChart3 className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
                    <span>Track prediction accuracy trends over time</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <PieChart className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
                    <span>Visual breakdown of predictions by category</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Target className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
                    <span>Confidence score analysis for deep mode predictions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <TrendingUp className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
                    <span>Usage streaks and engagement statistics</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Download className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
                    <span>Export your analytics data as CSV</span>
                  </li>
                </ul>
              </div>

              <Link href="/account">
                <Button className="w-full" size="lg">
                  <Crown className="w-4 h-4 mr-2" />
                  Upgrade to Premium - $29.99/mo
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (analyticsLoading || subLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return null;
  }

  const { 
    totalPredictions, 
    categoryBreakdown, 
    feedbackStats, 
    deepModeStats,
    confidenceAverage,
    currentStreak,
    longestStreak,
    accuracyTrend 
  } = analytics;

  // Calculate percentages for category breakdown
  const categoryData = Object.entries(categoryBreakdown).map(([category, count]) => ({
    category,
    count: count as number,
    percentage: totalPredictions > 0 ? ((count as number / totalPredictions) * 100).toFixed(1) : "0",
  }));

  const categoryColors: Record<string, string> = {
    career: "bg-blue-500",
    love: "bg-pink-500",
    finance: "bg-green-500",
    health: "bg-purple-500",
    general: "bg-gray-500",
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border/50 backdrop-blur-sm sticky top-0 z-50 bg-background/80">
        <div className="container py-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-2 lg:gap-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 lg:w-auto lg:px-3">
                  <ArrowLeft className="w-4 h-4 lg:mr-2" />
                  <span className="hidden lg:inline">Dashboard</span>
                </Button>
              </Link>
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 lg:w-6 lg:h-6 text-primary" />
                <h1 className="text-lg lg:text-xl font-bold">Prediction Analytics</h1>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground hidden sm:inline">Period:</span>
              <Select value={dateRange} onValueChange={(val) => setDateRange(val as any)}>
                <SelectTrigger className="w-full sm:w-[140px]">
                  <Calendar className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                  <SelectItem value="90d">Last 90 days</SelectItem>
                  <SelectItem value="all">All time</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </header>

      <div className="container py-8 max-w-7xl space-y-8">
        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total Predictions</CardDescription>
              <CardTitle className="text-3xl">{totalPredictions}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                {dateRange === "all" ? "All time" : `Last ${dateRange}`}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Current Streak</CardDescription>
              <CardTitle className="text-3xl flex items-center gap-2">
                {currentStreak}
                <span className="text-base text-muted-foreground">days</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                Longest: {longestStreak} days
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Deep Mode Usage</CardDescription>
              <CardTitle className="text-3xl flex items-center gap-2">
                {deepModeStats.count}
                <Zap className="w-6 h-6 text-primary" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                {totalPredictions > 0 ? ((deepModeStats.count / totalPredictions) * 100).toFixed(0) : 0}% of total
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Avg Confidence</CardDescription>
              <CardTitle className="text-3xl flex items-center gap-2">
                {confidenceAverage !== null ? `${confidenceAverage}%` : "N/A"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                Deep mode predictions
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Category Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="w-5 h-5" />
              Category Breakdown
            </CardTitle>
            <CardDescription>Distribution of predictions across categories</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {categoryData.map(({ category, count, percentage }) => (
                <div key={category} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="capitalize font-medium">{category}</span>
                    <span className="text-muted-foreground">
                      {count} ({percentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full ${categoryColors[category] || "bg-gray-500"} transition-all duration-500`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Feedback Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ThumbsUp className="w-5 h-5 text-green-500" />
                Feedback Statistics
              </CardTitle>
              <CardDescription>User satisfaction metrics</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ThumbsUp className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Liked</span>
                </div>
                <span className="text-2xl font-bold text-green-500">{feedbackStats.liked}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ThumbsDown className="w-4 h-4 text-red-500" />
                  <span className="text-sm">Disliked</span>
                </div>
                <span className="text-2xl font-bold text-red-500">{feedbackStats.disliked}</span>
              </div>
              <div className="pt-4 border-t border-border">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Satisfaction Rate</span>
                  <span className="text-lg font-semibold">
                    {feedbackStats.liked + feedbackStats.disliked > 0
                      ? ((feedbackStats.liked / (feedbackStats.liked + feedbackStats.disliked)) * 100).toFixed(0)
                      : 0}%
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-primary" />
                Deep Mode Insights
              </CardTitle>
              <CardDescription>Advanced prediction statistics</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Deep Mode Predictions</span>
                <span className="text-2xl font-bold text-primary">{deepModeStats.count}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Average Confidence</span>
                <span className="text-2xl font-bold text-primary">
                  {confidenceAverage !== null ? `${confidenceAverage}%` : "N/A"}
                </span>
              </div>
              <div className="pt-4 border-t border-border">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Usage Rate</span>
                  <span className="text-lg font-semibold">
                    {totalPredictions > 0 ? ((deepModeStats.count / totalPredictions) * 100).toFixed(0) : 0}%
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
