import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { Loader2, ArrowLeft, Calendar, LogOut, Search, ThumbsUp, ThumbsDown, Settings, ChevronLeft, ChevronRight } from "lucide-react";
import ShareButtons from "@/components/ShareButtons";

import { useEffect, useState } from "react";
import { useClerk } from "@clerk/clerk-react";
import { useLocation } from "wouter";
import { Streamdown } from "streamdown";

const CATEGORY_COLORS = {
  career: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  love: "bg-pink-500/20 text-pink-300 border-pink-500/30",
  finance: "bg-green-500/20 text-green-300 border-green-500/30",
  health: "bg-purple-500/20 text-purple-300 border-purple-500/30",
  general: "bg-gray-500/20 text-gray-300 border-gray-500/30",
};

export default function History() {
  const { user, loading: authLoading, isAuthenticated } = useAuth();
  const { signOut } = useClerk();
  const [, navigate] = useLocation();

  const [category, setCategory] = useState<"all" | "career" | "love" | "finance" | "health" | "general">("all");
  const [feedback, setFeedback] = useState<"all" | "like" | "dislike" | "none">("all");
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [page, setPage] = useState(0);
  const limit = 10;

  const { data, isLoading } = trpc.prediction.getHistory.useQuery(
    { 
      limit,
      offset: page * limit,
      category: category === "all" ? undefined : category,
      feedback: feedback === "all" ? undefined : feedback,
      search: search || undefined,
    },
    { enabled: isAuthenticated }
  );

  const predictions = data?.predictions || [];
  const total = data?.total || 0;
  const totalPages = Math.ceil(total / limit);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      window.location.href = getLoginUrl();
    }
  }, [authLoading, isAuthenticated]);

  // Reset to page 0 when filters change
  useEffect(() => {
    setPage(0);
  }, [category, feedback, search]);

  const handleSearch = () => {
    setSearch(searchInput);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  if (authLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border/50 backdrop-blur-sm sticky top-0 z-50 bg-background/80">
        <div className="container py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Dashboard
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <img src="/logo.svg" alt="AI Predictions Logo" className="w-6 h-6 object-contain logo-pulse" />
              <h1 className="text-xl font-bold">Prediction History</h1>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/account">
              <Button variant="ghost" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Account
              </Button>
            </Link>
            <div className="text-sm text-muted-foreground">
              {user?.name || user?.email}
            </div>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => signOut(() => navigate("/"))}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="container py-8 max-w-5xl">
        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Filter Predictions</CardTitle>
            <CardDescription>Search and filter your prediction history</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Search */}
              <div className="md:col-span-3">
                <div className="flex gap-2">
                  <Input
                    placeholder="Search predictions..."
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="flex-1"
                  />
                  <Button onClick={handleSearch} variant="secondary">
                    <Search className="w-4 h-4 mr-2" />
                    Search
                  </Button>
                </div>
              </div>

              {/* Category Filter */}
              <div>
                <label className="text-sm font-medium mb-2 block">Category</label>
                <Select value={category} onValueChange={(val: any) => setCategory(val)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="career">Career</SelectItem>
                    <SelectItem value="love">Love</SelectItem>
                    <SelectItem value="finance">Finance</SelectItem>
                    <SelectItem value="health">Health</SelectItem>
                    <SelectItem value="general">General</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Feedback Filter */}
              <div>
                <label className="text-sm font-medium mb-2 block">Feedback</label>
                <Select value={feedback} onValueChange={(val: any) => setFeedback(val)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Feedback</SelectItem>
                    <SelectItem value="like">Liked</SelectItem>
                    <SelectItem value="dislike">Disliked</SelectItem>
                    <SelectItem value="none">No Feedback</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Results Count */}
              <div className="flex items-end">
                <div className="text-sm text-muted-foreground">
                  {total} {total === 1 ? "prediction" : "predictions"} found
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Predictions List */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : predictions.length > 0 ? (
          <>
            <div className="space-y-6">
              {predictions.map((pred) => (
                <Card key={pred.id} className="hover:border-primary/30 transition-colors">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <Badge 
                            variant="outline" 
                            className={CATEGORY_COLORS[pred.category as keyof typeof CATEGORY_COLORS] || CATEGORY_COLORS.general}
                          >
                            {pred.category}
                          </Badge>
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(pred.createdAt).toLocaleDateString(undefined, {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                          {pred.userFeedback && (
                            <Badge 
                              variant="outline" 
                              className={pred.userFeedback === "like" 
                                ? "bg-green-500/20 text-green-300 border-green-500/30" 
                                : "bg-red-500/20 text-red-300 border-red-500/30"}
                            >
                              {pred.userFeedback === "like" ? (
                                <><ThumbsUp className="w-3 h-3 mr-1" /> Liked</>
                              ) : (
                                <><ThumbsDown className="w-3 h-3 mr-1" /> Disliked</>
                              )}
                            </Badge>
                          )}
                        </div>
                        <CardTitle className="text-lg">{pred.userInput}</CardTitle>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="prose prose-invert prose-sm max-w-none mb-6">
                      <Streamdown>{pred.predictionResult}</Streamdown>
                    </div>
                    
                    {/* Share Buttons */}
                    {pred.shareToken && (
                      <div className="border-t border-border pt-4">
                        <ShareButtons 
                          shareToken={pred.shareToken}
                          predictionText={pred.predictionResult}
                          category={pred.category}
                        />
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(p => Math.max(0, p - 1))}
                  disabled={page === 0}
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Previous
                </Button>
                <div className="text-sm text-muted-foreground px-4">
                  Page {page + 1} of {totalPages}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                  disabled={page >= totalPages - 1}
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            )}
          </>
        ) : (
          <Card className="text-center py-12">
            <CardContent>
              <img src="/logo.svg" alt="" className="w-16 h-16 mx-auto mb-4 object-contain" />
              <CardTitle className="mb-2">No predictions found</CardTitle>
              <CardDescription className="mb-6">
                {search || category !== "all" || feedback !== "all" 
                  ? "Try adjusting your filters or search terms"
                  : "Start generating predictions to see your history here"}
              </CardDescription>
              <Button asChild>
                <Link href="/dashboard">
                  <img src="/logo.svg" alt="" className="w-4 h-4 mr-2 object-contain" />
                  Generate Prediction
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
