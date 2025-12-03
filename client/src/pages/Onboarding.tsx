import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sparkles, Heart, Briefcase, DollarSign, Activity, ArrowRight, Loader2 } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import CategoryQuestions, { type CategoryProfiles } from "@/components/CategoryQuestions";

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
  const { user, loading: authLoading, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const [step, setStep] = useState(1);
  const [nickname, setNickname] = useState("");
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [categoryProfiles, setCategoryProfiles] = useState<CategoryProfiles>({});
  const [relationshipStatus, setRelationshipStatus] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  // Check if user is authenticated and already completed onboarding
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      if (user?.onboardingCompleted) {
        // User already completed onboarding, redirect to dashboard
        navigate("/dashboard");
      } else {
        // User just signed up, check if they have localStorage data
        const savedData = localStorage.getItem("onboardingData");
        if (savedData) {
          try {
            const data = JSON.parse(savedData);
            // Auto-save their preferences from localStorage
            setIsProcessing(true);
            setStep(5); // Show loading animation
            setTimeout(() => {
              saveOnboardingMutation.mutate(data);
              localStorage.removeItem("onboardingData"); // Clean up
            }, 2000);
          } catch (e) {
            // Invalid data, let them complete onboarding normally
          }
        }
      }
    }
  }, [authLoading, isAuthenticated, user, navigate]);

  // Load from localStorage if anonymous user returns
  useEffect(() => {
    if (!isAuthenticated) {
      const savedData = localStorage.getItem("onboardingData");
      if (savedData) {
        try {
          const data = JSON.parse(savedData);
          setNickname(data.nickname || "");
          setSelectedInterests(data.interests || []);
          setRelationshipStatus(data.relationshipStatus || "");
          if (data.careerProfile || data.moneyProfile || data.loveProfile || data.healthProfile) {
            setCategoryProfiles({
              careerProfile: data.careerProfile,
              moneyProfile: data.moneyProfile,
              loveProfile: data.loveProfile,
              healthProfile: data.healthProfile,
            });
          }
        } catch (e) {
          // Invalid data, ignore
        }
      }
    }
  }, [isAuthenticated]);

  const saveOnboardingMutation = trpc.user.saveOnboarding.useMutation({
    onSuccess: (data) => {
      // Welcome prediction generated successfully
      toast.success(`Welcome, ${nickname}! Your personalized prediction is ready.`);
      // Redirect to dashboard where the prediction will be displayed
      navigate("/dashboard");
    },
    onError: (error) => {
      toast.error("Failed to save preferences: " + error.message);
      setIsProcessing(false);
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
      // Move to category-specific questions
      setStep(4);
    } else if (step === 5) {
      if (!relationshipStatus) {
        toast.error("Please select your relationship status");
        return;
      }
      
      // Save to localStorage for anonymous users
      const onboardingData = {
        nickname,
        interests: selectedInterests,
        relationshipStatus,
        ...categoryProfiles,
      };
      localStorage.setItem("onboardingData", JSON.stringify(onboardingData));
      
      // Start "reading pattern" animation
      setStep(6);
      setIsProcessing(true);
      
      // After 3 seconds, check if user is authenticated
      setTimeout(() => {
        if (isAuthenticated) {
          // User is authenticated, save to database
          saveOnboardingMutation.mutate(onboardingData);
        } else {
          // User is anonymous, show sign-up prompt
          setStep(7);
          setIsProcessing(false);
        }
      }, 3000);
    }
  };

  const handleSkip = () => {
    if (isAuthenticated) {
      // Save minimal data for authenticated users
      saveOnboardingMutation.mutate({
        nickname: "User",
        interests: ["general"],
        relationshipStatus: "prefer-not-say",
      });
    } else {
      // For anonymous users, just go to dashboard
      navigate("/dashboard");
    }
  };

  const handleSignUp = () => {
    // Save current data to localStorage before redirecting
    const onboardingData = {
      nickname,
      interests: selectedInterests,
      relationshipStatus,
    };
    localStorage.setItem("onboardingData", JSON.stringify(onboardingData));
    
    // Redirect to sign-up page
    window.location.href = getLoginUrl() + "?redirect_url=/onboarding";
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Progress Indicator */}
        {step < 7 && (
          <div className="mb-8">
            <div className="flex items-center justify-center gap-2 mb-2">
              {[1, 2, 3, 4, 5, 6].map((s) => (
                <div
                  key={s}
                  className={`h-2 rounded-full transition-all ${
                    s <= step ? "bg-primary w-12" : "bg-muted w-8"
                  }`}
                />
              ))}
            </div>
            <p className="text-center text-sm text-muted-foreground">
              Step {step} of 6
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
                  Welcome to Predicsure AI
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

        {/* Step 4: Category-Specific Questions */}
        {step === 4 && (
          <CategoryQuestions
            categories={selectedInterests}
            onComplete={(profiles) => {
              setCategoryProfiles(profiles);
              setStep(5);
            }}
            onBack={() => setStep(3)}
          />
        )}

        {/* Step 5: Relationship Status */}
        {step === 5 && (
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
                <Button onClick={() => setStep(4)} variant="outline" className="flex-1">
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

        {/* Step 6: Reading Pattern (Loading) */}
        {step === 6 && (
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

        {/* Step 7: Sign-Up Prompt (Anonymous Users Only) */}
        {step === 7 && (
          <Card className="border-2 border-primary/20">
            <CardHeader className="text-center space-y-4">
              <div className="mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <Sparkles className="w-10 h-10 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl mb-3">
                  Your Profile is Ready, {nickname}!
                </CardTitle>
                <CardDescription className="text-base">
                  Sign up now to unlock your personalized predictions and save your preferences.
                  We've tailored our AI specifically for your interests in{" "}
                  <span className="font-semibold text-foreground">
                    {selectedInterests.map(id => INTERESTS.find(i => i.id === id)?.label).join(", ")}
                  </span>.
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button onClick={handleSignUp} className="w-full" size="lg">
                Sign Up Free
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button onClick={() => navigate("/dashboard")} variant="outline" className="w-full">
                Continue as Guest
              </Button>
              <p className="text-xs text-center text-muted-foreground">
                By signing up, you'll get unlimited predictions, history tracking, and personalized insights.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
