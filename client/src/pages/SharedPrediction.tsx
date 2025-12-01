import { useParams } from "wouter";
import { trpc } from "../lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Sparkles, Calendar } from "lucide-react";
import { Streamdown } from "streamdown";
import { Helmet } from "react-helmet-async";

export default function SharedPrediction() {
  const params = useParams();
  const shareToken = params.token || "";
  
  const { data: prediction, isLoading, error } = trpc.prediction.getSharedPrediction.useQuery({
    shareToken,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 flex items-center justify-center">
        <div className="text-white text-xl">Loading prediction...</div>
      </div>
    );
  }

  if (error || !prediction) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 flex items-center justify-center">
        <Card className="w-full max-w-2xl mx-4">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Prediction Not Found</h2>
            <p className="text-muted-foreground mb-6">
              This prediction link is invalid or has been removed.
            </p>
            <Button asChild>
              <a href="/">Get Your Own Predictions</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const categoryColors: Record<string, string> = {
    career: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    love: "bg-pink-500/20 text-pink-400 border-pink-500/30",
    finance: "bg-green-500/20 text-green-400 border-green-500/30",
    health: "bg-orange-500/20 text-orange-400 border-orange-500/30",
    general: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  };

  const categoryColor = categoryColors[prediction.category || "general"] || categoryColors.general;

  // Generate OG tags data
  const ogTitle = `${prediction.category?.toUpperCase() || "GENERAL"} Prediction: ${prediction.userInput.substring(0, 60)}${prediction.userInput.length > 60 ? "..." : ""}`;
  const ogDescription = prediction.predictionResult.substring(0, 155).replace(/[#*_`]/g, "") + "...";
  const shareUrl = `${window.location.origin}/share/${shareToken}`;
  const ogImageUrl = `${window.location.origin}/api/og-image/${shareToken}`;

  return (
    <>
      <Helmet>
        <title>{ogTitle} - AI Predictions</title>
        <meta name="description" content={ogDescription} />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="article" />
        <meta property="og:url" content={shareUrl} />
        <meta property="og:title" content={ogTitle} />
        <meta property="og:description" content={ogDescription} />
        <meta property="og:image" content={ogImageUrl} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={shareUrl} />
        <meta property="twitter:title" content={ogTitle} />
        <meta property="twitter:description" content={ogDescription} />
        <meta property="twitter:image" content={ogImageUrl} />
      </Helmet>
      
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-purple-400" />
            <span className="text-xl font-bold text-white">AI Predictions</span>
          </div>
          <Button asChild variant="default">
            <a href="/">Get Your Predictions</a>
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <div className="flex items-center justify-between mb-4">
              <div className={`px-3 py-1 rounded-full text-sm font-medium border ${categoryColor}`}>
                {prediction.category?.toUpperCase() || "GENERAL"}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />
                {new Date(prediction.createdAt).toLocaleDateString()}
              </div>
            </div>
            <CardTitle className="text-2xl">
              {prediction.userInput}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-invert max-w-none mb-8">
              <Streamdown>{prediction.predictionResult}</Streamdown>
            </div>

            <div className="border-t border-border pt-6">
              <div className="text-center">
                <p className="text-muted-foreground mb-4">
                  Want personalized predictions powered by advanced AI?
                </p>
                <Button asChild size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                  <a href="/">Start Free - Get 3 Predictions</a>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Branding Footer */}
        <div className="text-center mt-8 text-muted-foreground text-sm">
          <p>Powered by Advanced AI • Personalized Insights • Trusted by Thousands</p>
        </div>
      </div>
      </div>
    </>
  );
}
