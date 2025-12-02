import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sparkles, Heart, Briefcase, DollarSign, Activity, ArrowRight, Loader2 } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

const INTERESTS = [
  { id: "career", label: "Career & Success", icon: Briefcase, color: "text-blue-400" },
  { id: "love", label: "Love & Relationships", icon: Heart, color: "text-pink-400" },
  { id: "finance", label: "Money & Wealth", icon: DollarSign, color: "text-green-400" },
  { id: "health", label: "Health & Wellness", icon: Activity, color: "text-purple-400" },
];

const RELATIONSHIP_STATUS = [
  { id: "single", label: "Single" },
  { id: "dating", label: "Dating" },
  { id: "relationship", label: "In a Relationship" },
  { id: "married", label: "Married" },
  { id: "complicated", label: "It's Complicated" },
  { id: "prefer-not-say", label: "Prefer not to say" },
];

export default function Onboarding() {
  const [, navigate] = useLocation();
  const [step, setStep] = useState(1);
  const [nickname, setNickname] = useState("");
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [relationshipStatus, setRelationshipStatus] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const saveOnboardingMutation = trpc.user.saveOnboarding.useMutation({
    onSuccess: () => {
      toast.success("Welcome! Your profile is ready.");
      navigate("/dashboard");
    },
    onError: (error) => {
      toast.error("Failed to save preferences: " + error.message);
      setIsGenerating(false);
    },
  });

  const handleInterestToggle = (interestId: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interestId)
        ? prev.filter((id) => id !== interestId)
        : [...prev, interestId]
    );
  };

  const handleContinue = () => {
    if (step === 1) {
      setStep(2);
    } else if (step === 2) {
      if (!nickname.trim()) {
        toast.error("Please enter your name");
        return;
      }
      setStep(3);
    } else if (step === 3) {
      if (selectedInterests.length === 0) {
        toast.error("Please select at least one interest");
        return;
      }
      setStep(4);
    } else if (step === 4) {
      if (!relationshipStatus) {
        toast.error("Please select your relationship status");
        return;
      }
      // Start "reading pattern" animation
      setStep(5);
      setIsGenerating(true);
      
      // Simulate reading pattern for 3 seconds, then save
      setTimeout(() => {
        saveOnboardingMutation.mutate({
          nickname,
          interests: selectedInterests,
          relationshipStatus,
        });
      }, 3000);
    }
  };

  const handleSkip = () => {
    // Save minimal data and skip to dashboard
    saveOnboardingMutation.mutate({
      nickname: "User",
      interests: ["general"],
      relationshipStatus: "prefer-not-say",
    });
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Progress Indicator */}
        {step < 5 && (
          <div className="mb-8">
            <div className="flex items-center justify-center gap-2 mb-2">
              {[1, 2, 3, 4].map((s) => (
                <div
                  key={s}
                  className={`h-2 rounded-full transition-all ${
                    s <= step ? "bg-primary w-12" : "bg-muted w-8"
                  }`}
                />
              ))}
            </div>
            <p className="text-center text-sm text-muted-foreground">
              Step {step} of 4
            </p>
          </div>
        )}

        {/* Step 1: Welcome */}
        {step === 1 && (
          <Card className="border-2 border-primary/20">
            <CardHeader className="text-center space-y-4 pb-8">
              <div className="mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <Sparkles className="w-10 h-10 text-white" />
              </div>
              <div>
                <CardTitle className="text-3xl mb-3">
                  Welcome to AI Predictions
                </CardTitle>
                <CardDescription className="text-base">
                  Let's personalize your experience. We'll ask a few questions to understand
                  what matters most to you, so our AI can provide more accurate and meaningful
                  predictions tailored just for you.
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button onClick={handleContinue} className="w-full" size="lg">
                Get Started
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button onClick={handleSkip} variant="ghost" className="w-full">
                Skip for now
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Name */}
        {step === 2 && (
          <Card>
            <CardHeader>
              <CardTitle>What should we call you?</CardTitle>
              <CardDescription>
                This helps us personalize your predictions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="nickname">Your Name or Nickname</Label>
                <Input
                  id="nickname"
                  placeholder="Enter your name..."
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  maxLength={100}
                  autoFocus
                />
              </div>
              <div className="flex gap-3">
                <Button onClick={() => setStep(1)} variant="outline" className="flex-1">
                  Back
                </Button>
                <Button onClick={handleContinue} className="flex-1">
                  Continue
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Interests */}
        {step === 3 && (
          <Card>
            <CardHeader>
              <CardTitle>What areas interest you most?</CardTitle>
              <CardDescription>
                Select all that apply. This helps us focus on what matters to you.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {INTERESTS.map((interest) => {
                  const Icon = interest.icon;
                  const isSelected = selectedInterests.includes(interest.id);
                  return (
                    <button
                      key={interest.id}
                      onClick={() => handleInterestToggle(interest.id)}
                      className={`p-4 rounded-lg border-2 transition-all text-left ${
                        isSelected
                          ? "border-primary bg-primary/10"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={`w-6 h-6 ${interest.color}`} />
                        <span className="font-medium">{interest.label}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
              <div className="flex gap-3">
                <Button onClick={() => setStep(2)} variant="outline" className="flex-1">
                  Back
                </Button>
                <Button onClick={handleContinue} className="flex-1">
                  Continue
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 4: Relationship Status */}
        {step === 4 && (
          <Card>
            <CardHeader>
              <CardTitle>What's your relationship status?</CardTitle>
              <CardDescription>
                This helps us provide more relevant predictions about your love life and relationships
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {RELATIONSHIP_STATUS.map((status) => {
                  const isSelected = relationshipStatus === status.id;
                  return (
                    <button
                      key={status.id}
                      onClick={() => setRelationshipStatus(status.id)}
                      className={`p-4 rounded-lg border-2 transition-all text-left ${
                        isSelected
                          ? "border-primary bg-primary/10"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <span className="font-medium">{status.label}</span>
                    </button>
                  );
                })}
              </div>
              <div className="flex gap-3">
                <Button onClick={() => setStep(3)} variant="outline" className="flex-1">
                  Back
                </Button>
                <Button onClick={handleContinue} className="flex-1">
                  Complete Setup
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 5: Reading Pattern (Loading) */}
        {step === 5 && (
          <Card className="border-2 border-primary/20">
            <CardContent className="py-16">
              <div className="flex flex-col items-center justify-center space-y-6">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 animate-pulse" />
                  <div className="absolute inset-0 w-24 h-24 rounded-full border-4 border-primary/30 animate-spin" style={{ borderTopColor: "transparent" }} />
                </div>
                <div className="text-center space-y-2">
                  <h3 className="text-2xl font-bold">Reading Your Pattern...</h3>
                  <p className="text-muted-foreground">
                    Our AI is analyzing your preferences to create a personalized experience
                  </p>
                </div>
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
