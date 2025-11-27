import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { Loader2, ArrowLeft, Calendar } from "lucide-react";
import { CrystalBall } from "@/components/CrystalBall";
import { useEffect } from "react";
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

  const { data: predictions, isLoading } = trpc.prediction.getHistory.useQuery(
    { limit: 50 },
    { enabled: isAuthenticated }
  );

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
              <CrystalBall size="md" />
              <h1 className="text-xl font-bold">Prediction History</h1>
            </div>
          </div>
          <div className="text-sm text-muted-foreground">
            {user?.name || user?.email}
          </div>
        </div>
      </header>

      <div className="container py-8 max-w-4xl">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : predictions && predictions.length > 0 ? (
          <div className="space-y-6">
            {predictions.map((pred) => (
              <Card key={pred.id} className="hover:border-primary/30 transition-colors">
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
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
                      </div>
                      <CardTitle className="text-lg">{pred.userInput}</CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-invert prose-sm max-w-none">
                    <Streamdown>{pred.predictionResult}</Streamdown>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="text-center py-12">
            <CardContent>
              <CrystalBall size="xl" className="mx-auto mb-4" />
              <CardTitle className="mb-2">No predictions yet</CardTitle>
              <CardDescription className="mb-6">
                Start generating predictions to see your history here
              </CardDescription>
              <Button asChild>
                <Link href="/dashboard">
                  <CrystalBall size="sm" className="mr-2" />
                  Generate Your First Prediction
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
