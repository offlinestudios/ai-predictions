import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Sparkles, 
  Brain, 
  Loader2, 
  Share2, 
  ChevronRight,
  Users,
  Lightbulb,
  Target,
  TrendingUp,
  Zap
} from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import PersonalityRadarChart, { PersonalityBars } from "./PersonalityRadarChart";
import ShareablePsycheCard from "./ShareablePsycheCard";
import { getPsycheMetadata, getCompatibleTypes } from "@/lib/psycheMetadata";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function PsycheProfileCard() {
  const [, navigate] = useLocation();
  const [showShareModal, setShowShareModal] = useState(false);
  const { data: profile, isLoading } = trpc.psyche.getProfile.useQuery();
  const { user } = useAuth();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5" />
            Your Psyche Profile
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
            Discover Your Personality Profile
          </CardTitle>
          <CardDescription>
            Complete our personality assessment to unlock personalized predictions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Your personality profile reveals your unique decision-making patterns, emotional tendencies, and risk tolerance. 
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

  // Get metadata for this psyche type
  const psycheType = profile.psycheType || profile.displayName.toLowerCase().replace(/^the\s+/i, '').replace(/\s+/g, '_');
  const metadata = getPsycheMetadata(psycheType);

  return (
    <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            {/* Icon */}
            <div 
              className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
              style={{ backgroundColor: `${metadata?.color || '#8b5cf6'}20` }}
            >
              {metadata?.icon || '✨'}
            </div>
            <div>
              <CardTitle className="flex items-center gap-2">
                {profile.displayName}
              </CardTitle>
              {/* Rarity Badge */}
              {metadata && (
                <Badge 
                  variant="outline" 
                  className="mt-1 text-xs"
                  style={{ 
                    borderColor: metadata.color,
                    color: metadata.color
                  }}
                >
                  {metadata.rarityLabel} • Only {metadata.rarity}% of users
                </Badge>
              )}
            </div>
          </div>
          
          {/* Share Button */}
          <Dialog open={showShareModal} onOpenChange={setShowShareModal}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon" className="shrink-0">
                <Share2 className="w-4 h-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Share Your Psyche Profile</DialogTitle>
              </DialogHeader>
              <ShareablePsycheCard 
                profile={{
                  ...profile,
                  psycheType,
                  parameters: profile.parameters
                }}
                userName={user?.name || undefined}
              />
            </DialogContent>
          </Dialog>
        </div>
        <CardDescription className="mt-2">{profile.description}</CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="overview" className="text-xs">Overview</TabsTrigger>
            <TabsTrigger value="insights" className="text-xs">Insights</TabsTrigger>
            <TabsTrigger value="compatibility" className="text-xs">Match</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4">
            {/* Radar Chart */}
            {profile.parameters && (
              <div className="hidden sm:block">
                <PersonalityRadarChart 
                  data={profile.parameters} 
                  size={200}
                  color={metadata?.color || '#8b5cf6'}
                />
              </div>
            )}
            
            {/* Bar Chart for mobile */}
            {profile.parameters && (
              <div className="sm:hidden">
                <PersonalityBars 
                  data={profile.parameters}
                  color={metadata?.color || '#8b5cf6'}
                />
              </div>
            )}

            {/* Core Traits */}
            <div>
              <h4 className="font-semibold mb-3 text-sm uppercase tracking-wide text-muted-foreground flex items-center gap-2">
                <Target className="w-4 h-4" />
                Core Traits
              </h4>
              <div className="flex flex-wrap gap-2">
                {profile.coreTraits.map((trait: string, index: number) => (
                  <Badge 
                    key={index} 
                    variant="secondary"
                    className="text-xs"
                  >
                    {trait}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Decision-Making Style */}
            <div>
              <h4 className="font-semibold mb-2 text-sm uppercase tracking-wide text-muted-foreground flex items-center gap-2">
                <Brain className="w-4 h-4" />
                Decision-Making Style
              </h4>
              <p className="text-sm text-muted-foreground">{profile.decisionMakingStyle}</p>
            </div>
          </TabsContent>

          {/* Insights Tab */}
          <TabsContent value="insights" className="space-y-4">
            {/* Superpower */}
            {metadata?.superpower && (
              <div className="p-4 rounded-xl bg-gradient-to-r from-primary/10 to-transparent border border-primary/20">
                <h4 className="font-semibold mb-2 text-sm uppercase tracking-wide flex items-center gap-2">
                  <Zap className="w-4 h-4 text-primary" />
                  Your Superpower
                </h4>
                <p className="text-sm font-medium">{metadata.superpower}</p>
              </div>
            )}

            {/* Strengths */}
            {metadata?.strengths && (
              <div>
                <h4 className="font-semibold mb-3 text-sm uppercase tracking-wide text-muted-foreground flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  {metadata.strengthsTitle || 'Your Strengths'}
                </h4>
                <ul className="space-y-2">
                  {metadata.strengths.map((strength, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <ChevronRight className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                      <span>{strength}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Prediction Insight */}
            {metadata?.predictionInsight && (
              <div className="p-4 rounded-xl bg-muted/50 border border-border">
                <h4 className="font-semibold mb-2 text-sm uppercase tracking-wide flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-yellow-500" />
                  Prediction Insight
                </h4>
                <p className="text-sm text-muted-foreground">{metadata.predictionInsight}</p>
              </div>
            )}

            {/* Daily Insight */}
            {metadata?.dailyInsight && (
              <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
                <h4 className="font-semibold mb-2 text-sm uppercase tracking-wide flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  Today's Insight
                </h4>
                <p className="text-sm italic">"{metadata.dailyInsight}"</p>
              </div>
            )}

            {/* Growth Edge */}
            <div className="p-4 rounded-xl bg-primary/10 border border-primary/20">
              <h4 className="font-semibold mb-2 text-sm uppercase tracking-wide flex items-center gap-2">
                <img src="/logo.svg" alt="" className="w-4 h-4" />
                Your Growth Edge
              </h4>
              <p className="text-sm text-muted-foreground">{profile.growthEdge}</p>
            </div>
          </TabsContent>

          {/* Compatibility Tab */}
          <TabsContent value="compatibility" className="space-y-4">
            {/* Famous Examples */}
            {metadata?.famousExamples && (
              <div>
                <h4 className="font-semibold mb-3 text-sm uppercase tracking-wide text-muted-foreground flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Famous {profile.displayName.replace('The ', '')}s
                </h4>
                <div className="flex flex-wrap gap-2">
                  {metadata.famousExamples.map((name, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Compatible Types */}
            {metadata?.compatibleWith && (
              <div>
                <h4 className="font-semibold mb-3 text-sm uppercase tracking-wide text-muted-foreground">
                  Best Matched With
                </h4>
                <div className="space-y-2">
                  {getCompatibleTypes(metadata.compatibleWith).map((type, index) => (
                    <div 
                      key={index}
                      className="flex items-center gap-2 p-2 rounded-lg bg-green-500/10 border border-green-500/20"
                    >
                      <span className="text-green-500">✓</span>
                      <span className="text-sm">{type}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tension Types */}
            {metadata?.tensionWith && (
              <div>
                <h4 className="font-semibold mb-3 text-sm uppercase tracking-wide text-muted-foreground">
                  May Have Tension With
                </h4>
                <div className="space-y-2">
                  {getCompatibleTypes(metadata.tensionWith).map((type, index) => (
                    <div 
                      key={index}
                      className="flex items-center gap-2 p-2 rounded-lg bg-orange-500/10 border border-orange-500/20"
                    >
                      <span className="text-orange-500">⚡</span>
                      <span className="text-sm">{type}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Compare with Friends CTA */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-primary/10 to-purple-500/10 border border-primary/20">
              <h4 className="font-semibold mb-2 text-sm">Compare with Friends</h4>
              <p className="text-xs text-muted-foreground mb-3">
                Share your profile and see how your psyche compares with friends and family.
              </p>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => setShowShareModal(true)}
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share to Compare
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        <div className="pt-2 text-xs text-muted-foreground text-center border-t border-border">
          All predictions are tailored to your unique personality profile
        </div>
      </CardContent>
    </Card>
  );
}
