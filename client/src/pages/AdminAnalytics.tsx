import { useState } from "react";
import { trpc } from "../lib/trpc";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Input } from "../components/ui/input";
import { Alert, AlertDescription } from "../components/ui/alert";
import {
  Loader2,
  Users,
  DollarSign,
  TrendingUp,
  Activity,
  ArrowLeft,
  Search,
  AlertCircle,
  CheckCircle,
  Brain,
  Target,
  BarChart3,
  Crown,
  Zap,
  Star,
} from "lucide-react";
import { useLocation } from "wouter";

export default function AdminAnalytics() {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [tierFilter, setTierFilter] = useState<"all" | "free" | "plus" | "premium">("all");

  // Get current user to check admin status
  const { data: user, isLoading: userLoading } = trpc.auth.me.useQuery();

  // Get analytics data
  const { data: analytics, isLoading: analyticsLoading } = trpc.admin.getAnalytics.useQuery(undefined, {
    enabled: user?.role === "admin",
  });

  // Get user list
  const { data: userList, isLoading: userListLoading } = trpc.admin.getUserList.useQuery(
    {
      search: searchQuery,
      tier: tierFilter,
      limit: 50,
      offset: 0,
    },
    {
      enabled: user?.role === "admin",
    }
  );

  // Get insights
  const { data: insights, isLoading: insightsLoading } = trpc.admin.getInsights.useQuery(undefined, {
    enabled: user?.role === "admin",
  });

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
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Admin Analytics</h1>
            <p className="text-muted-foreground mt-1">Comprehensive insights and metrics</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setLocation("/admin")}>
              Testing Tools
            </Button>
            <Button variant="outline" onClick={() => setLocation("/dashboard")}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Dashboard
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="revenue">Revenue</TabsTrigger>
            <TabsTrigger value="predictions">Predictions</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {analyticsLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : analytics ? (
              <>
                {/* Key Metrics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Total Users */}
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                      <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{analytics.users.total}</div>
                      <p className="text-xs text-muted-foreground">
                        +{analytics.users.newLast7Days} this week
                      </p>
                    </CardContent>
                  </Card>

                  {/* Active Users */}
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                      <Activity className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{analytics.users.active}</div>
                      <p className="text-xs text-muted-foreground">
                        {((analytics.users.active / analytics.users.total) * 100).toFixed(1)}% of total
                      </p>
                    </CardContent>
                  </Card>

                  {/* MRR */}
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">MRR</CardTitle>
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">${analytics.revenue.mrr}</div>
                      <p className="text-xs text-muted-foreground">Monthly recurring revenue</p>
                    </CardContent>
                  </Card>

                  {/* Conversion Rate */}
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
                      <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{analytics.revenue.conversionRate}%</div>
                      <p className="text-xs text-muted-foreground">Free to paid conversion</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Subscription Breakdown */}
                <Card>
                  <CardHeader>
                    <CardTitle>Subscription Tiers</CardTitle>
                    <CardDescription>Distribution of users across subscription tiers</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex items-center gap-4 p-4 border rounded-lg bg-gray-500/5">
                        <Star className="w-8 h-8 text-gray-500" />
                        <div>
                          <div className="text-2xl font-bold">{analytics.subscriptions.free}</div>
                          <div className="text-sm text-muted-foreground">Free Users</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 p-4 border rounded-lg bg-blue-500/5">
                        <Zap className="w-8 h-8 text-blue-500" />
                        <div>
                          <div className="text-2xl font-bold">{analytics.subscriptions.plus}</div>
                          <div className="text-sm text-muted-foreground">Plus ($9.99/mo)</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 p-4 border rounded-lg bg-amber-500/5">
                        <Crown className="w-8 h-8 text-amber-500" />
                        <div>
                          <div className="text-2xl font-bold">{analytics.subscriptions.premium}</div>
                          <div className="text-sm text-muted-foreground">Premium ($59/yr)</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Predictions Overview */}
                <Card>
                  <CardHeader>
                    <CardTitle>Prediction Analytics</CardTitle>
                    <CardDescription>Total predictions and category breakdown</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <div className="text-3xl font-bold">{analytics.predictions.total}</div>
                        <div className="text-sm text-muted-foreground">Total Predictions</div>
                      </div>
                      <div className="flex-1">
                        <div className="text-3xl font-bold">{analytics.predictions.avgPerUser.toFixed(1)}</div>
                        <div className="text-sm text-muted-foreground">Avg per User</div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="text-sm font-semibold">By Category:</div>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {Object.entries(analytics.predictions.byCategory).map(([category, count]) => (
                          <div key={category} className="flex items-center justify-between p-2 border rounded bg-muted/30">
                            <span className="text-sm capitalize">{category}</span>
                            <span className="text-sm font-semibold">{count}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>No analytics data available</AlertDescription>
              </Alert>
            )}
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            {/* Search and Filter */}
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>Search and filter users</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by email, name, or nickname..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <select
                    value={tierFilter}
                    onChange={(e) => setTierFilter(e.target.value as any)}
                    className="px-4 py-2 border rounded-md bg-background"
                  >
                    <option value="all">All Tiers</option>
                    <option value="free">Free</option>
                    <option value="plus">Plus</option>
                    <option value="premium">Premium</option>
                  </select>
                </div>
              </CardContent>
            </Card>

            {/* User List */}
            {userListLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : userList && userList.users.length > 0 ? (
              <Card>
                <CardHeader>
                  <CardTitle>Users ({userList.total})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {userList.users.map((user) => (
                      <div
                        key={user.id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{user.email}</span>
                            {user.role === "admin" && (
                              <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full">
                                Admin
                              </span>
                            )}
                          </div>
                          <div className="text-sm text-muted-foreground mt-1">
                            {user.name || "No name"} • {user.personalityType || "No personality"}
                          </div>
                        </div>
                        <div className="flex items-center gap-4 text-sm">
                          <div className="text-right">
                            <div className="font-semibold capitalize">{user.tier}</div>
                            <div className="text-muted-foreground">{user.predictionCount} predictions</div>
                          </div>
                          <div className="text-right">
                            <div className="text-muted-foreground">
                              Joined {new Date(user.createdAt).toLocaleDateString()}
                            </div>
                            <div className="text-muted-foreground">
                              {user.onboardingCompleted ? "✓ Onboarded" : "⚠ Incomplete"}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>No users found</AlertDescription>
              </Alert>
            )}
          </TabsContent>

          {/* Revenue Tab */}
          <TabsContent value="revenue" className="space-y-6">
            {analyticsLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : analytics ? (
              <>
                {/* Revenue Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">${analytics.revenue.totalRevenue}</div>
                      <p className="text-xs text-muted-foreground">All-time revenue</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">MRR</CardTitle>
                      <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">${analytics.revenue.mrr}</div>
                      <p className="text-xs text-muted-foreground">Monthly recurring revenue</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">ARPU</CardTitle>
                      <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        ${analytics.users.total > 0 ? (analytics.revenue.totalRevenue / analytics.users.total).toFixed(2) : "0.00"}
                      </div>
                      <p className="text-xs text-muted-foreground">Average revenue per user</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Subscription Breakdown */}
                <Card>
                  <CardHeader>
                    <CardTitle>Revenue by Tier</CardTitle>
                    <CardDescription>Monthly revenue breakdown by subscription tier</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 border rounded-lg bg-blue-500/5">
                        <div className="flex items-center gap-3">
                          <Zap className="w-6 h-6 text-blue-500" />
                          <div>
                            <div className="font-semibold">Plus Tier</div>
                            <div className="text-sm text-muted-foreground">{analytics.subscriptions.plus} subscribers</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xl font-bold">${(analytics.subscriptions.plus * 9.99).toFixed(2)}</div>
                          <div className="text-sm text-muted-foreground">per month</div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-4 border rounded-lg bg-amber-500/5">
                        <div className="flex items-center gap-3">
                          <Crown className="w-6 h-6 text-amber-500" />
                          <div>
                            <div className="font-semibold">Premium Tier</div>
                            <div className="text-sm text-muted-foreground">{analytics.subscriptions.premium} subscribers</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xl font-bold">${(analytics.subscriptions.premium * 4.92).toFixed(2)}</div>
                          <div className="text-sm text-muted-foreground">per month (annual)</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Conversion Funnel */}
                <Card>
                  <CardHeader>
                    <CardTitle>Conversion Funnel</CardTitle>
                    <CardDescription>User journey from signup to paid subscription</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <span className="text-sm">Total Signups</span>
                        <span className="font-semibold">{analytics.users.total}</span>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <span className="text-sm">Paid Subscribers</span>
                        <span className="font-semibold">{analytics.subscriptions.paid}</span>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded-lg bg-primary/10">
                        <span className="text-sm font-semibold">Conversion Rate</span>
                        <span className="font-bold text-primary">{analytics.revenue.conversionRate}%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : null}
          </TabsContent>

          {/* Predictions Tab */}
          <TabsContent value="predictions" className="space-y-6">
            {analyticsLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : analytics ? (
              <>
                {/* Prediction Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Predictions</CardTitle>
                      <BarChart3 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{analytics.predictions.total}</div>
                      <p className="text-xs text-muted-foreground">All-time predictions</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Avg per User</CardTitle>
                      <Activity className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{analytics.predictions.avgPerUser.toFixed(1)}</div>
                      <p className="text-xs text-muted-foreground">Average predictions per user</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Categories</CardTitle>
                      <Target className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{Object.keys(analytics.predictions.byCategory).length}</div>
                      <p className="text-xs text-muted-foreground">Active categories</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Category Breakdown */}
                <Card>
                  <CardHeader>
                    <CardTitle>Predictions by Category</CardTitle>
                    <CardDescription>Distribution of predictions across categories</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {Object.entries(analytics.predictions.byCategory)
                        .sort(([, a], [, b]) => b - a)
                        .map(([category, count]) => {
                          const percentage = ((count / analytics.predictions.total) * 100).toFixed(1);
                          return (
                            <div key={category} className="space-y-1">
                              <div className="flex items-center justify-between text-sm">
                                <span className="capitalize font-medium">{category}</span>
                                <span className="text-muted-foreground">
                                  {count} ({percentage}%)
                                </span>
                              </div>
                              <div className="h-2 bg-muted rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-primary"
                                  style={{ width: `${percentage}%` }}
                                />
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </CardContent>
                </Card>

                {/* Personality Type Predictions */}
                <Card>
                  <CardHeader>
                    <CardTitle>Predictions by Personality Type</CardTitle>
                    <CardDescription>Average predictions per personality type</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {Object.entries(analytics.personality.avgPredictions)
                        .sort(([, a], [, b]) => b - a)
                        .map(([type, avg]) => (
                          <div key={type} className="flex items-center justify-between p-3 border rounded-lg">
                            <span className="text-sm capitalize">{type.replace(/_/g, " ")}</span>
                            <span className="font-semibold">{avg.toFixed(1)} avg</span>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : null}
          </TabsContent>

          {/* Insights Tab */}
          <TabsContent value="insights" className="space-y-6">
            {insightsLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : insights ? (
              <>
                {/* Key Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Onboarding Completion</CardTitle>
                      <CheckCircle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{insights.metrics.onboardingCompletionRate}%</div>
                      <p className="text-xs text-muted-foreground">Users who complete onboarding</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Overall Conversion</CardTitle>
                      <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{insights.metrics.overallConversionRate}%</div>
                      <p className="text-xs text-muted-foreground">Free to paid conversion rate</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Recommendations */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Brain className="w-5 h-5" />
                      AI Recommendations
                    </CardTitle>
                    <CardDescription>Data-driven insights to improve your business</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {insights.recommendations.map((rec, index) => (
                        <Alert key={index} variant={rec.priority === "high" ? "default" : "default"}>
                          <div className="flex items-start gap-3">
                            <div className={`mt-0.5 ${rec.priority === "high" ? "text-red-500" : "text-yellow-500"}`}>
                              {rec.priority === "high" ? <AlertCircle className="h-5 w-5" /> : <CheckCircle className="h-5 w-5" />}
                            </div>
                            <div className="flex-1">
                              <div className="font-semibold mb-1">{rec.title}</div>
                              <AlertDescription>{rec.description}</AlertDescription>
                              <div className="mt-2">
                                <span className={`text-xs px-2 py-1 rounded-full ${
                                  rec.priority === "high" ? "bg-red-500/10 text-red-500" : "bg-yellow-500/10 text-yellow-500"
                                }`}>
                                  {rec.priority.toUpperCase()} PRIORITY
                                </span>
                              </div>
                            </div>
                          </div>
                        </Alert>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Personality Conversion Rates */}
                <Card>
                  <CardHeader>
                    <CardTitle>Conversion by Personality Type</CardTitle>
                    <CardDescription>Which personality types convert best to paid subscriptions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {Object.entries(insights.personalityConversion)
                        .sort(([, a], [, b]) => b.rate - a.rate)
                        .map(([type, data]) => (
                          <div key={type} className="space-y-1">
                            <div className="flex items-center justify-between text-sm">
                              <span className="capitalize font-medium">{type.replace(/_/g, " ")}</span>
                              <span className="text-muted-foreground">
                                {data.paid}/{data.total} ({data.rate.toFixed(1)}%)
                              </span>
                            </div>
                            <div className="h-2 bg-muted rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                                style={{ width: `${data.rate}%` }}
                              />
                            </div>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Engagement by Personality */}
                <Card>
                  <CardHeader>
                    <CardTitle>Engagement by Personality Type</CardTitle>
                    <CardDescription>Average predictions per user by personality type</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {Object.entries(insights.personalityEngagement)
                        .sort(([, a], [, b]) => b.avgPerUser - a.avgPerUser)
                        .map(([type, data]) => (
                          <div key={type} className="flex items-center justify-between p-3 border rounded-lg">
                            <span className="text-sm capitalize">{type.replace(/_/g, " ")}</span>
                            <div className="text-right">
                              <div className="font-semibold">{data.avgPerUser.toFixed(1)}</div>
                              <div className="text-xs text-muted-foreground">predictions/user</div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : null}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
