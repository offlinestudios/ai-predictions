import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, Brain, Loader2 } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";

export default function PsycheProfileCard() {
  const [, navigate] = useLocation();
  const { data: profile, isLoading } = trpc.psyche.getProfile.useQuery();

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

  return (
    <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          {profile.displayName}
        </CardTitle>
        <CardDescription>{profile.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
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

        <div>
          <h4 className="font-semibold mb-2 text-sm uppercase tracking-wide text-muted-foreground">
            Decision-Making Style
          </h4>
          <p className="text-sm text-muted-foreground">{profile.decisionMakingStyle}</p>
        </div>

        <div className="bg-primary/10 rounded-lg p-4 border border-primary/20">
          <h4 className="font-semibold mb-2 text-sm uppercase tracking-wide flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            Your Growth Edge
          </h4>
          <p className="text-sm text-muted-foreground">{profile.growthEdge}</p>
        </div>

        <div className="pt-2 text-xs text-muted-foreground text-center">
          All predictions are tailored to your unique personality type
        </div>
      </CardContent>
    </Card>
  );
}
