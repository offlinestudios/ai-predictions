import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, ArrowRight, Loader2, Sparkles, Brain,
  TrendingUp, AlertTriangle, ChevronRight
} from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { useAuth } from "@/_core/hooks/useAuth";
import { ONBOARDING_QUESTIONS } from "@/data/onboardingQuestions";
import { motion, AnimatePresence } from "framer-motion";
import { getPsycheMetadata } from "@/lib/psycheMetadata";

const RELATIONSHIP_STATUS = [
  { id: "single", label: "Single" },
  { id: "dating", label: "Dating" },
  { id: "relationship", label: "In a Relationship" },
  { id: "married", label: "Married" },
  { id: "complicated", label: "It's Complicated" },
  { id: "prefer-not-say", label: "Prefer not to say" },
];

type OnboardingStep = 
  | "welcome"
  | "name"
  | "relationship"
  | "psyche-questions"
  | "signup-prompt"
  | "profile-reveal";

export default function PsycheOnboarding() {
  const { user, loading: authLoading, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const { data: existingProfile } = trpc.psyche.getProfile.useQuery(undefined, {
    enabled: isAuthenticated,
  });
  
  // Step management
  const [currentStep, setCurrentStep] = useState<OnboardingStep>("welcome");
  
  // Practical info
  const [nickname, setNickname] = useState("");
  const [relationshipStatus, setRelationshipStatus] = useState("");
  
  // Psyche questions
  const [currentPsycheQuestionIndex, setCurrentPsycheQuestionIndex] = useState(0);
  const [psycheResponses, setPsycheResponses] = useState<Record<number, string>>({});
  
  // State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [combinedProfile, setCombinedProfile] = useState<any>(null);

  // Check if user already has a psyche profile
  useEffect(() => {
    if (!authLoading && isAuthenticated && existingProfile) {
      navigate("/dashboard");
    }
  }, [authLoading, isAuthenticated, existingProfile, navigate]);

  // Check if user just signed up and has stored responses
  useEffect(() => {
    if (!authLoading && isAuthenticated && !user?.onboardingCompleted) {
      const savedData = localStorage.getItem("completeOnboardingData");
      if (savedData) {
        try {
          const parsedData = JSON.parse(savedData);
          setIsSubmitting(true);
          submitOnboardingMutation.mutate(parsedData);
          localStorage.removeItem("completeOnboardingData");
        } catch (e) {
          console.error("Failed to parse saved data", e);
        }
      }
    }
  }, [authLoading, isAuthenticated, user]);

  const submitOnboardingMutation = trpc.psyche.submitOnboarding.useMutation({
    onSuccess: (data) => {
      setCombinedProfile(data);
      setCurrentStep("profile-reveal");
      setIsSubmitting(false);
      toast.success("Your personality profile has been created!");
    },
    onError: (error) => {
      setIsSubmitting(false);
      toast.error(error.message || "Failed to process your responses");
    },
  });

  const handleComplete = () => {
    // Format all data
    const formattedPsycheResponses = ONBOARDING_QUESTIONS.map(q => {
      const selectedOption = psycheResponses[q.id];
      const option = q.options.find(opt => opt.value === selectedOption);
      
      return {
        questionId: q.id,
        questionText: q.question,
        selectedOption: selectedOption || "",
        answerText: option?.label || "",
      };
    });

    const completeData = {
      nickname,
      interests: [], // No longer collecting interests
      relationshipStatus,
      categoryAnswers: {}, // No longer collecting category answers
      psycheResponses: formattedPsycheResponses,
    };

    if (isAuthenticated) {
      setIsSubmitting(true);
      submitOnboardingMutation.mutate(completeData);
    } else {
      localStorage.setItem("completeOnboardingData", JSON.stringify(completeData));
      setCurrentStep("signup-prompt");
    }
  };

  const handleNext = () => {
    switch (currentStep) {
      case "welcome":
        setCurrentStep("name");
        break;
      case "name":
        if (!nickname.trim()) {
          toast.error("Please enter your name");
          return;
        }
        setCurrentStep("relationship");
        break;
      case "relationship":
        if (!relationshipStatus) {
          toast.error("Please select your relationship status");
          return;
        }
        setCurrentStep("psyche-questions");
        break;
      case "psyche-questions":
        const currentQuestion = ONBOARDING_QUESTIONS[currentPsycheQuestionIndex];
        const currentResponse = psycheResponses[currentQuestion.id];
        
        if (!currentResponse) {
          toast.error("Please select an answer");
          return;
        }

        if (currentPsycheQuestionIndex < ONBOARDING_QUESTIONS.length - 1) {
          setCurrentPsycheQuestionIndex(currentPsycheQuestionIndex + 1);
        } else {
          handleComplete();
        }
        break;
    }
  };

  const handleBack = () => {
    switch (currentStep) {
      case "name":
        setCurrentStep("welcome");
        break;
      case "relationship":
        setCurrentStep("name");
        break;
      case "psyche-questions":
        if (currentPsycheQuestionIndex > 0) {
          setCurrentPsycheQuestionIndex(currentPsycheQuestionIndex - 1);
        } else {
          setCurrentStep("relationship");
        }
        break;
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background via-background to-primary/5">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Sign-up prompt screen
  if (currentStep === "signup-prompt") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background via-background to-primary/5 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md"
        >
          <Card className="border-primary/20 shadow-2xl">
            <CardHeader className="text-center space-y-4">
              <div className="mx-auto w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                <Sparkles className="h-10 w-10 text-primary" />
              </div>
              <CardTitle className="text-2xl font-bold">
                Your Profile is Ready!
              </CardTitle>
              <CardDescription className="text-base">
                Sign up now to reveal your personalized personality profile and get tailored predictions.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                onClick={() => navigate("/sign-up")}
                className="w-full"
                size="lg"
              >
                Sign Up to See Your Profile
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <p className="text-xs text-center text-muted-foreground">
                Your responses have been saved. Complete sign-up to unlock your profile.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  // Profile reveal screen - Updated to match Settings design
  if (currentStep === "profile-reveal" && combinedProfile) {
    const psycheType = combinedProfile.profile?.psycheType || 
      combinedProfile.profile?.displayName?.toLowerCase().replace(/^the\s+/i, '').replace(/\s+/g, '_');
    const metadata = getPsycheMetadata(psycheType);

    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background via-background to-primary/5 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-lg"
        >
          <Card className="border-primary/20 shadow-2xl bg-gradient-to-br from-primary/5 to-transparent">
            <CardHeader className="text-center space-y-4">
              <div className="mx-auto w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                <Brain className="h-10 w-10 text-primary" />
              </div>
              <div>
                <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  {combinedProfile.profile?.displayName || "Your Profile"}
                </CardTitle>
                <CardDescription className="text-base mt-2">
                  {combinedProfile.profile?.description}
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Your Traits - as badges */}
              {combinedProfile.profile?.coreTraits && (
                <div>
                  <h4 className="font-semibold mb-3 text-sm uppercase tracking-wide text-muted-foreground">
                    Your Traits
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {combinedProfile.profile.coreTraits.map((trait: string, index: number) => (
                      <Badge 
                        key={index} 
                        variant="outline" 
                        className="bg-primary/10 border-primary/30 text-primary hover:bg-primary/20"
                      >
                        {trait}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Your Strengths */}
              {metadata?.strengths && (
                <div>
                  <h4 className="font-semibold mb-3 text-sm uppercase tracking-wide text-muted-foreground flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    Your Strengths
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

              {/* Growth Areas */}
              {metadata?.growthAreas && (
                <div>
                  <h4 className="font-semibold mb-3 text-sm uppercase tracking-wide text-muted-foreground flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    Growth Areas
                  </h4>
                  <ul className="space-y-2">
                    {metadata.growthAreas.map((area, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <span className="text-primary mt-0.5">•</span>
                        <span>{area}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Insights for relationships */}
              {metadata?.relationshipInsights && (
                <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
                  <h4 className="font-semibold mb-3 text-sm uppercase tracking-wide">
                    Insights for Relationships
                  </h4>
                  <ul className="space-y-2">
                    {metadata.relationshipInsights.map((insight, index) => (
                      <li key={index} className="text-sm text-muted-foreground">
                        {insight}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="pt-4">
                <Button
                  onClick={() => navigate("/dashboard?new=true")}
                  className="w-full"
                  size="lg"
                >
                  Go to Dashboard
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  // Calculate overall progress
  // Total: welcome (5%) + name (10%) + relationship (15%) + 12 psyche questions (70%)
  const calculateProgress = () => {
    if (currentStep === "welcome") return 5;
    if (currentStep === "name") return 15;
    if (currentStep === "relationship") return 25;
    
    if (currentStep === "psyche-questions") {
      const psycheProgress = ((currentPsycheQuestionIndex + 1) / ONBOARDING_QUESTIONS.length) * 75;
      return 25 + psycheProgress;
    }
    
    return 100;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background via-background to-primary/5 p-4">
      <div className="w-full max-w-2xl">
        {/* Progress Bar */}
        {currentStep !== "welcome" && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">
                {currentStep === "psyche-questions" 
                  ? `Question ${currentPsycheQuestionIndex + 1} of ${ONBOARDING_QUESTIONS.length}`
                  : ""}
              </span>
              <span className="text-sm font-medium text-primary">
                {Math.round(calculateProgress())}% complete
              </span>
            </div>
            <Progress value={calculateProgress()} className="h-2" />
          </div>
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep + currentPsycheQuestionIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {/* Welcome Step */}
            {currentStep === "welcome" && (
              <Card className="border-2 border-primary/20">
                <CardHeader className="text-center space-y-4 pb-8">
                  <div className="mx-auto w-20 h-20 flex items-center justify-center">
                    <img src="/logo.svg" alt="Predicsure AI" className="w-20 h-20" />
                  </div>
                  <div>
                    <CardTitle className="text-3xl mb-3">
                      Discover Your Personality Profile
                    </CardTitle>
                    <CardDescription className="text-base">
                      Answer 12 quick questions to reveal your unique decision-making patterns. 
                      This helps us provide predictions tailored specifically to how you think.
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button onClick={handleNext} className="w-full" size="lg">
                    Get Started
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                  <p className="text-xs text-center text-muted-foreground">
                    Takes about 2 minutes
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Name Step */}
            {currentStep === "name" && (
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
                    <Button onClick={handleBack} variant="outline" className="flex-1">
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back
                    </Button>
                    <Button onClick={handleNext} className="flex-1">
                      Continue
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Relationship Status Step */}
            {currentStep === "relationship" && (
              <Card>
                <CardHeader>
                  <CardTitle>What's your relationship status?</CardTitle>
                  <CardDescription>
                    This helps us understand your context for predictions
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    {RELATIONSHIP_STATUS.map((status) => (
                      <button
                        key={status.id}
                        onClick={() => setRelationshipStatus(status.id)}
                        className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                          relationshipStatus === status.id
                            ? "border-primary bg-primary/10"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        {status.label}
                      </button>
                    ))}
                  </div>
                  <div className="flex gap-3">
                    <Button onClick={handleBack} variant="outline" className="flex-1">
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back
                    </Button>
                    <Button onClick={handleNext} className="flex-1">
                      Continue
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Psyche Questions Step */}
            {currentStep === "psyche-questions" && (() => {
              const currentQuestion = ONBOARDING_QUESTIONS[currentPsycheQuestionIndex];
              const currentResponse = psycheResponses[currentQuestion.id];

              return (
                <Card className="border-primary/20">
                  <CardHeader>
                    <CardTitle className="text-2xl">{currentQuestion.question}</CardTitle>
                    <CardDescription>
                      Choose the answer that resonates most with you
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <RadioGroup
                      value={currentResponse}
                      onValueChange={(value) => {
                        setPsycheResponses({
                          ...psycheResponses,
                          [currentQuestion.id]: value,
                        });
                      }}
                    >
                      {currentQuestion.options.map((option) => (
                        <div
                          key={option.value}
                          className="flex items-center space-x-3 p-4 rounded-lg border border-border hover:border-primary/50 transition-colors cursor-pointer"
                          onClick={() => {
                            setPsycheResponses({
                              ...psycheResponses,
                              [currentQuestion.id]: option.value,
                            });
                          }}
                        >
                          <RadioGroupItem value={option.value} id={`option-${option.value}`} />
                          <Label
                            htmlFor={`option-${option.value}`}
                            className="flex-1 cursor-pointer text-base"
                          >
                            {option.label}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>

                    <div className="flex gap-3 pt-4">
                      <Button
                        variant="outline"
                        onClick={handleBack}
                        disabled={isSubmitting}
                        className="flex-1"
                      >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Previous
                      </Button>
                      <Button
                        onClick={handleNext}
                        disabled={!currentResponse || isSubmitting}
                        className="flex-1"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Processing...
                          </>
                        ) : currentPsycheQuestionIndex === ONBOARDING_QUESTIONS.length - 1 ? (
                          <>
                            Complete Assessment
                            <Sparkles className="ml-2 h-4 w-4" />
                          </>
                        ) : (
                          <>
                            Next
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
