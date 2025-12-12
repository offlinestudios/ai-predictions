import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { 
  ArrowLeft, ArrowRight, Loader2, Sparkles, Heart, Briefcase, 
  DollarSign, Activity, Trophy, TrendingUp 
} from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { useAuth } from "@/_core/hooks/useAuth";
import { coreQuestions, type CoreQuestion } from "@/data/coreQuestions";
import { getAdaptiveQuestions, type AdaptiveQuestion } from "@/data/adaptiveQuestions";
import { motion, AnimatePresence } from "framer-motion";

const INTERESTS = [
  { id: "career", label: "Career & Success", icon: Briefcase, color: "text-blue-400" },
  { id: "relationships", label: "Love & Relationships", icon: Heart, color: "text-pink-400" },
  { id: "money", label: "Money & Wealth", icon: DollarSign, color: "text-green-400" },
  { id: "health", label: "Health & Wellness", icon: Activity, color: "text-purple-400" },
  { id: "sports", label: "Sports Predictions", icon: Trophy, color: "text-orange-400" },
  { id: "stocks", label: "Stocks & Markets", icon: TrendingUp, color: "text-cyan-400" },
];

type OnboardingStep = 
  | "welcome"
  | "name"
  | "interests"
  | "core-questions"
  | "adaptive-questions"
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
  const [primaryInterest, setPrimaryInterest] = useState("");
  
  // Question responses
  const [coreResponses, setCoreResponses] = useState<QuestionResponse[]>([]);
  const [adaptiveResponses, setAdaptiveResponses] = useState<QuestionResponse[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  
  // State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [profile, setProfile] = useState<any>(null);

  // Get adaptive questions based on selected interest
  const adaptiveQuestions = primaryInterest ? getAdaptiveQuestions(primaryInterest) : [];

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
          setPrimaryInterest(parsedData.primaryInterest);
          setCoreResponses(parsedData.coreResponses);
          setAdaptiveResponses(parsedData.adaptiveResponses);
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

    // Move to next question or next step
    if (currentQuestionIndex < coreQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // All core questions done, move to adaptive questions
      setCurrentStep("adaptive-questions");
      setCurrentQuestionIndex(0);
    }
  };

  const handleAdaptiveQuestionAnswer = (optionIndex: number) => {
    const currentQuestion = adaptiveQuestions[currentQuestionIndex];
    const selectedOption = currentQuestion.options[optionIndex];
    
    const response: QuestionResponse = {
      questionId: currentQuestion.id,
      selectedOptionIndex: optionIndex,
      scores: selectedOption.scores,
    };

    const newResponses = [...adaptiveResponses];
    newResponses[currentQuestionIndex] = response;
    setAdaptiveResponses(newResponses);

    // Move to next question or complete
    if (currentQuestionIndex < adaptiveQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      handleComplete();
    }
  };

  const handleComplete = () => {
    const completeData = {
      nickname,
      primaryInterest,
      coreResponses,
      adaptiveResponses,
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
        setCurrentStep("interests");
        break;
      case "interests":
        if (!primaryInterest) {
          toast.error("Please select your primary interest");
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
      case "interests":
        setCurrentStep("name");
        break;
      case "core-questions":
        if (currentQuestionIndex > 0) {
          setCurrentQuestionIndex(currentQuestionIndex - 1);
        } else {
          setCurrentStep("interests");
        }
        break;
      case "adaptive-questions":
        if (currentQuestionIndex > 0) {
          setCurrentQuestionIndex(currentQuestionIndex - 1);
        } else {
          setCurrentStep("core-questions");
          setCurrentQuestionIndex(coreQuestions.length - 1);
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
      case "interests":
        return 20;
      case "core-questions":
        // 20% to 70% (8 questions)
        return 20 + (currentQuestionIndex / coreQuestions.length) * 50;
      case "adaptive-questions":
        // 70% to 100% (4 questions)
        return 70 + (currentQuestionIndex / adaptiveQuestions.length) * 30;
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
              <div className="mx-auto w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                <Sparkles className="h-10 w-10 text-primary" />
              </div>
              <CardTitle className="text-2xl font-bold">
                Your Profile is Ready!
              </CardTitle>
              <CardDescription className="text-base">
                Sign up now to reveal your personalized psyche profile and start making better predictions.
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

  // Profile reveal screen
  if (currentStep === "profile-reveal" && profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background via-background to-primary/5 p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-2xl"
        >
          <Card className="border-primary/20 shadow-2xl">
            <CardHeader className="text-center space-y-4">
              <div className="mx-auto w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                <Sparkles className="h-10 w-10 text-primary" />
              </div>
              <CardTitle className="text-3xl font-bold">
                {profile.psycheType.type}
              </CardTitle>
              <CardDescription className="text-lg">
                {profile.psycheType.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2">Your Traits</h3>
                <div className="flex flex-wrap gap-2">
                  {profile.psycheType.traits.map((trait: string, i: number) => (
                    <span key={i} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                      {trait}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Your Strengths</h3>
                <ul className="space-y-1">
                  {profile.psycheType.strengths.map((strength: string, i: number) => (
                    <li key={i} className="text-sm text-muted-foreground">• {strength}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Growth Areas</h3>
                <ul className="space-y-1">
                  {profile.psycheType.challenges.map((challenge: string, i: number) => (
                    <li key={i} className="text-sm text-muted-foreground">• {challenge}</li>
                  ))}
                </ul>
              </div>

              {profile.insights && profile.insights.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">Insights for {primaryInterest}</h3>
                  <ul className="space-y-2">
                    {profile.insights.map((insight: string, i: number) => (
                      <li key={i} className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
                        {insight}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <Button
                onClick={() => navigate("/dashboard")}
                className="w-full"
                size="lg"
              >
                Go to Dashboard
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-primary/5 flex items-center justify-center">
      <div className="container max-w-2xl mx-auto px-4 py-8">
        {/* Progress bar */}
        {currentStep !== "welcome" && currentStep !== "signup-prompt" && currentStep !== "profile-reveal" && (
          <div className="mb-8">
            <Progress value={getProgress()} className="h-2" />
            <p className="text-sm text-muted-foreground mt-2 text-center">
              {Math.round(getProgress())}% complete
            </p>
          </div>
        )}

        <AnimatePresence mode="wait">
          {/* Welcome Screen */}
          {currentStep === "welcome" && (
            <motion.div
              key="welcome"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Card className="border-primary/20 shadow-xl">
                <CardHeader className="text-center space-y-4">
                  <div className="mx-auto w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                    <Sparkles className="h-10 w-10 text-primary" />
                  </div>
                  <CardTitle className="text-3xl mb-3">
                    Welcome to Predicsure AI
                  </CardTitle>
                  <CardDescription className="text-base">
                    Let's create your personalized profile. We'll ask about your interests, situation, and how you think and decide. This helps our AI provide accurate predictions tailored specifically to you.
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
                    This will be used to personalize your experience.
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

          {/* Interests Screen */}
          {currentStep === "interests" && (
            <motion.div
              key="interests"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Card className="border-primary/20 shadow-xl">
                <CardHeader>
                  <CardTitle>What's your primary interest?</CardTitle>
                  <CardDescription>
                    Choose the area you're most interested in making predictions about.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 gap-3">
                    {INTERESTS.map((interest) => {
                      const Icon = interest.icon;
                      return (
                        <button
                          key={interest.id}
                          onClick={() => setPrimaryInterest(interest.id)}
                          className={`p-4 rounded-lg border-2 transition-all ${
                            primaryInterest === interest.id
                              ? "border-primary bg-primary/5"
                              : "border-border hover:border-primary/50"
                          }`}
                        >
                          <Icon className={`h-6 w-6 mx-auto mb-2 ${interest.color}`} />
                          <p className="text-sm font-medium text-center">{interest.label}</p>
                        </button>
                      );
                    })}
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
                    <span className="text-sm text-muted-foreground">Universal</span>
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

          {/* Adaptive Questions */}
          {currentStep === "adaptive-questions" && adaptiveQuestions.length > 0 && currentQuestionIndex < adaptiveQuestions.length && (
            <motion.div
              key={`adaptive-${currentQuestionIndex}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Card className="border-primary/20 shadow-xl">
                <CardHeader>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-muted-foreground">
                      Question {coreQuestions.length + currentQuestionIndex + 1} of {coreQuestions.length + adaptiveQuestions.length}
                    </span>
                    <span className="text-sm text-primary font-medium capitalize">{primaryInterest}</span>
                  </div>
                  <CardTitle className="text-xl">
                    {adaptiveQuestions[currentQuestionIndex].question}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    {adaptiveQuestions[currentQuestionIndex].options.map((option, index) => (
                      <button
                        key={index}
                        onClick={() => handleAdaptiveQuestionAnswer(index)}
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
