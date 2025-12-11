import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Brain, Loader2, Plus } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";
import CategorySelectionModal from "./CategorySelectionModal";
import AdaptiveQuestionsFlow from "./AdaptiveQuestionsFlow";

export default function PsycheProfileCardEnhanced() {
  const [, navigate] = useLocation();
  const { data: profile, isLoading, refetch } = trpc.psyche.getProfile.useQuery();
  const { data: availableCategories = [] } = trpc.psyche.getAvailableCategories.useQuery();
  
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showQuestionsFlow, setShowQuestionsFlow] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const addCategoriesMutation = trpc.psyche.addInterestCategories.useMutation({
    onSuccess: () => {
      refetch();
      setShowQuestionsFlow(false);
      setSelectedCategories([]);
    },
  });

  const handleCategorySelection = (categories: string[]) => {
    setSelectedCategories(categories);
    setShowCategoryModal(false);
    setShowQuestionsFlow(true);
  };

  const handleQuestionsComplete = async (responses: any[]) => {
    await addCategoriesMutation.mutateAsync({
      categories: selectedCategories,
      responses,
    });
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5" />
            Your Personality Type
          </CardTitle>
          <CardDescription>Understanding your decision-making patterns</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!profile) {
    return (
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5" />
            Discover Your Personality Type
          </CardTitle>
          <CardDescription>
            Complete our personality assessment to unlock personalized predictions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Your personality type reveals your unique decision-making patterns, emotional tendencies, and risk tolerance. 
              This allows us to tailor predictions specifically to how you think and act.
            </p>
            <Button
              onClick={() => navigate("/psyche-onboarding")}
              className="w-full"
              size="lg"
            >
              <Sparkles className="mr-2 h-5 w-5" />
              Take the Personality Assessment
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const profileCompleteness = (profile as any).profileCompleteness || 16;
  const crossDomainInsights = (profile as any).crossDomainInsights || [];
  const userInterests = (profile as any).interests || [];

  return (
    <>
      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              {profile.displayName}
            </CardTitle>
            {profileCompleteness < 100 && (
              <Badge variant="outline">{profileCompleteness}% Complete</Badge>
            )}
          </div>
          <CardDescription>{profile.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Interests */}
          {userInterests.length > 0 && (
            <div>
              <h4 className="font-semibold mb-2 text-sm uppercase tracking-wide text-muted-foreground">
                Your Interests
              </h4>
              <div className="flex flex-wrap gap-2">
                {userInterests.map((interest: string) => (
                  <Badge key={interest} variant="secondary">
                    {interest.charAt(0).toUpperCase() + interest.slice(1)}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Core Traits */}
          <div>
            <h4 className="font-semibold mb-3 text-sm uppercase tracking-wide text-muted-foreground">
              Core Traits
            </h4>
            <ul className="space-y-2">
              {profile.coreTraits.map((trait: string, index: number) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <span className="text-primary mt-0.5">•</span>
                  <span>{trait}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Decision-Making Style */}
          <div>
            <h4 className="font-semibold mb-2 text-sm uppercase tracking-wide text-muted-foreground">
              Decision-Making Style
            </h4>
            <p className="text-sm text-muted-foreground">{profile.decisionMakingStyle}</p>
          </div>

          {/* Cross-Domain Insights */}
          {crossDomainInsights.length > 0 && (
            <div>
              <h4 className="font-semibold mb-2 text-sm uppercase tracking-wide text-muted-foreground">
                Cross-Domain Patterns
              </h4>
              <ul className="space-y-1">
                {crossDomainInsights.map((insight: string, index: number) => (
                  <li key={index} className="text-sm text-muted-foreground">
                    • {insight}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Growth Edge */}
          <div className="bg-primary/10 rounded-lg p-4 border border-primary/20">
            <h4 className="font-semibold mb-2 text-sm uppercase tracking-wide flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              Your Growth Edge
            </h4>
            <p className="text-sm text-muted-foreground">{profile.growthEdge}</p>
          </div>

          {/* Add More Interests Button */}
          {availableCategories.length > 0 && (
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setShowCategoryModal(true)}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add More Interests
            </Button>
          )}

          <div className="pt-2 text-xs text-muted-foreground text-center">
            All predictions are tailored to your unique personality type
          </div>
        </CardContent>
      </Card>

      {/* Category Selection Modal */}
      <CategorySelectionModal
        open={showCategoryModal}
        onOpenChange={setShowCategoryModal}
        availableCategories={availableCategories}
        onContinue={handleCategorySelection}
      />

      {/* Adaptive Questions Flow */}
      <AdaptiveQuestionsFlow
        open={showQuestionsFlow}
        onOpenChange={setShowQuestionsFlow}
        categories={selectedCategories}
        onComplete={handleQuestionsComplete}
      />
    </>
  );
}
