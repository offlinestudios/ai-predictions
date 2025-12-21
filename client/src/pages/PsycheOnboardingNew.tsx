import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, Loader2, Sparkles } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { useAuth } from "@/_core/hooks/useAuth";
import { coreQuestions, type CoreQuestion } from "@/data/coreQuestions";
import { motion, AnimatePresence } from "framer-motion";

type OnboardingStep = 
  | "welcome"
  | "name"
  | "core-questions"
  | "signup-prompt"
  | "profile-reveal";

interface QuestionResponse {
  questionId: string;
  selectedOptionIndex: number;
  scores: {
    risk: number;
    emotional: number;
    timeHorizon: number;
    decisionStyle: number;
  };
}

export default function PsycheOnboardingNew() {
  const { user, loading: authLoading, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  
  // Step management
  const [currentStep, setCurrentStep] = useState<OnboardingStep>("welcome");
  
  // User data
  const [nickname, setNickname] = useState("");
  
  // Question responses
  const [coreResponses, setCoreResponses] = useState<QuestionResponse[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  
  // State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [profile, setProfile] = useState<any>(null);

  // Check if user already completed onboarding
  useEffect(() => {
    if (!authLoading && isAuthenticated && user?.onboardingCompleted) {
      navigate("/dashboard");
    }
  }, [authLoading, isAuthenticated, user, navigate]);

  // Check if user just signed up and has stored responses
  useEffect(() => {
    if (!authLoading && isAuthenticated && !user?.onboardingCompleted) {
      const savedData = localStorage.getItem("hybridOnboardingData");
      if (savedData) {
        try {
          const parsedData = JSON.parse(savedData);
          // Restore the state from saved data
          setNickname(parsedData.nickname);
          setCoreResponses(parsedData.coreResponses);
          // Submit immediately
          setIsSubmitting(true);
          submitOnboardingMutation.mutate(parsedData);
          localStorage.removeItem("hybridOnboardingData");
        } catch (e) {
          console.error("Failed to parse saved data", e);
          localStorage.removeItem("hybridOnboardingData");
        }
      }
    }
  }, [authLoading, isAuthenticated, user]);

  const submitOnboardingMutation = trpc.psyche.submitHybridOnboarding.useMutation({
    onSuccess: (data) => {
      setProfile(data);
      setCurrentStep("profile-reveal");
      setIsSubmitting(false);
      toast.success("Your profile has been created!");
    },
    onError: (error) => {
      setIsSubmitting(false);
      toast.error(error.message || "Failed to process your responses");
    },
  });

  const handleCoreQuestionAnswer = (optionIndex: number) => {
    const currentQuestion = coreQuestions[currentQuestionIndex];
    const selectedOption = currentQuestion.options[optionIndex];
    
    const response: QuestionResponse = {
      questionId: currentQuestion.id,
      selectedOptionIndex: optionIndex,
      scores: selectedOption.scores,
    };

    const newResponses = [...coreResponses];
    newResponses[currentQuestionIndex] = response;
    setCoreResponses(newResponses);

    // Move to next question or complete
    if (currentQuestionIndex < coreQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // All core questions done, complete onboarding
      handleComplete(newResponses);
    }
  };

  const handleComplete = (responses?: QuestionResponse[]) => {
    const completeData = {
      nickname,
      primaryInterest: "general", // Default to general since we removed interest selection
      coreResponses: responses || coreResponses,
      adaptiveResponses: [], // No adaptive questions anymore
    };

    if (isAuthenticated) {
      setIsSubmitting(true);
      submitOnboardingMutation.mutate(completeData);
    } else {
      localStorage.setItem("hybridOnboardingData", JSON.stringify(completeData));
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
        setCurrentStep("core-questions");
        setCurrentQuestionIndex(0);
        break;
    }
  };

  const handleBack = () => {
    switch (currentStep) {
      case "name":
        setCurrentStep("welcome");
        break;
      case "core-questions":
        if (currentQuestionIndex > 0) {
          setCurrentQuestionIndex(currentQuestionIndex - 1);
        } else {
          setCurrentStep("name");
        }
        break;
    }
  };

  // Calculate progress
  const getProgress = () => {
    switch (currentStep) {
      case "welcome":
        return 0;
      case "name":
        return 10;
      case "core-questions":
        // 10% to 100% (8 questions)
        return 10 + ((currentQuestionIndex + 1) / coreQuestions.length) * 90;
      default:
        return 100;
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
              <div className="mx-auto w-20 h-20 flex items-center justify-center">
                <img src="/logo.svg" alt="Predicsure AI" className="w-20 h-20" />
              </div>
              <CardTitle className="text-2xl font-bold">
                Your Profile is Ready
              </CardTitle>
              <CardDescription className="text-base">
                Sign up to reveal your personalized profile and start receiving guidance.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                onClick={() => navigate("/sign-up")}
                className="w-full"
                size="lg"
              >
                Sign Up to Continue
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

  // Profile reveal screen
  if (currentStep === "profile-reveal" && profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background via-background to-primary/5 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-lg"
        >
          <Card className="border-primary/20 shadow-2xl">
            <CardHeader className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="text-2xl font-bold">
                Welcome, {nickname}
              </CardTitle>
              <CardDescription className="text-base">
                Your profile has been created. You're ready to start.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Profile Summary */}
              <div className="space-y-4 p-4 rounded-lg bg-muted/30">
                <h3 className="font-semibold text-center">Your Psyche Profile</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="text-center">
                    <p className="text-muted-foreground">Risk Tolerance</p>
                    <p className="font-medium">{profile.riskTolerance || "Balanced"}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-muted-foreground">Decision Style</p>
                    <p className="font-medium">{profile.decisionStyle || "Adaptive"}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-muted-foreground">Time Horizon</p>
                    <p className="font-medium">{profile.timeHorizon || "Medium-term"}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-muted-foreground">Emotional Style</p>
                    <p className="font-medium">{profile.emotionalStyle || "Balanced"}</p>
                  </div>
                </div>
              </div>

              <Button
                onClick={() => navigate("/dashboard")}
                className="w-full"
                size="lg"
              >
                Start Your First Prediction
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  // Submitting state
  if (isSubmitting) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background via-background to-primary/5 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md text-center"
        >
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-lg font-medium">Creating your profile...</p>
          <p className="text-sm text-muted-foreground mt-2">
            We're analyzing your responses to understand how you see the world.
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background via-background to-primary/5 p-4">
      <div className="w-full max-w-md">
        {/* Progress Bar - directly above card */}
        {currentStep !== "welcome" && (
          <div className="mb-4">
            <Progress value={getProgress()} className="h-2" />
            <p className="text-center text-sm text-muted-foreground mt-2">
              {Math.round(getProgress())}% complete
            </p>
          </div>
        )}

        {/* Main Content */}
        <AnimatePresence mode="wait">
          {/* Welcome Screen */}
          {currentStep === "welcome" && (
            <motion.div
              key="welcome"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Card className="border-primary/20 shadow-2xl">
                <CardHeader className="text-center space-y-4">
                  <div className="mx-auto w-20 h-20 flex items-center justify-center">
                    <img src="/logo.svg" alt="Predicsure AI" className="w-20 h-20" />
                  </div>
                  <CardTitle className="text-3xl mb-3">
                    Welcome to Predicsure AI
                  </CardTitle>
                  <CardDescription className="text-base">
                    Let's get you oriented. We'll ask a few simple questions to understand what's shifting in your life, so your guidance feels relevant without you having to explain everything.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button onClick={handleNext} className="w-full" size="lg">
                    Get Started
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Name Screen */}
          {currentStep === "name" && (
            <motion.div
              key="name"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Card className="border-primary/20 shadow-xl">
                <CardHeader>
                  <CardTitle>What should we call you?</CardTitle>
                  <CardDescription>
                    This helps personalize your experience.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="nickname">Your Name or Nickname</Label>
                    <Input
                      id="nickname"
                      value={nickname}
                      onChange={(e) => setNickname(e.target.value)}
                      placeholder="Enter your name..."
                      autoFocus
                      onKeyDown={(e) => e.key === "Enter" && handleNext()}
                    />
                  </div>
                  <div className="flex gap-3">
                    <Button onClick={handleBack} variant="outline" className="flex-1">
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back
                    </Button>
                    <Button onClick={handleNext} className="flex-1">
                      Continue
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Core Questions */}
          {currentStep === "core-questions" && (
            <motion.div
              key={`core-${currentQuestionIndex}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Card className="border-primary/20 shadow-xl">
                <CardHeader>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-muted-foreground">
                      Question {currentQuestionIndex + 1} of {coreQuestions.length}
                    </span>
                  </div>
                  <CardTitle className="text-xl">
                    {coreQuestions[currentQuestionIndex].question}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    {coreQuestions[currentQuestionIndex].options.map((option, index) => (
                      <button
                        key={index}
                        onClick={() => handleCoreQuestionAnswer(index)}
                        className="w-full text-left flex items-start space-x-3 p-4 rounded-lg border-2 border-border hover:border-primary/50 hover:bg-primary/5 cursor-pointer transition-all"
                      >
                        <div className="w-5 h-5 rounded-full border-2 border-border mt-0.5 flex-shrink-0" />
                        <span className="flex-1">{option.text}</span>
                      </button>
                    ))}
                  </div>
                  <Button onClick={handleBack} variant="outline" className="w-full">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
