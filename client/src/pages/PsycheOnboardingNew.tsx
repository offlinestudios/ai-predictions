import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Progress } from "@/components/ui/progress";
import { 
  ArrowLeft, ArrowRight, Loader2, Sparkles, Heart, Briefcase, 
  DollarSign, Activity, Trophy, TrendingUp 
} from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { useAuth } from "@/_core/hooks/useAuth";
import { CORE_QUESTIONS } from "@/data/coreQuestions";
import { ADAPTIVE_QUESTIONS } from "@/data/adaptiveQuestions";
import { getFeedbackMessage } from "@/data/microFeedback";
import { motion, AnimatePresence } from "framer-motion";

const INTERESTS = [
  { id: "career", label: "Career & Success", icon: Briefcase, color: "text-blue-400" },
  { id: "love", label: "Love & Relationships", icon: Heart, color: "text-pink-400" },
  { id: "finance", label: "Money & Wealth", icon: DollarSign, color: "text-green-400" },
  { id: "health", label: "Health & Wellness", icon: Activity, color: "text-purple-400" },
  { id: "sports", label: "Sports Predictions", icon: Trophy, color: "text-orange-400" },
  { id: "stocks", label: "Stocks & Markets", icon: TrendingUp, color: "text-cyan-400" },
];

type OnboardingStep = 
  | "welcome"
  | "name"
  | "primary-interest"
  | "core-questions"
  | "adaptive-questions"
  | "signup-prompt"
  | "profile-reveal";

export default function PsycheOnboardingNew() {
  const { user, loading: authLoading, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  
  // Step management
  const [currentStep, setCurrentStep] = useState<OnboardingStep>("welcome");
  
  // User data
  const [nickname, setNickname] = useState("");
  const [primaryInterest, setPrimaryInterest] = useState("");
  
  // Question responses
  const [coreResponses, setCoreResponses] = useState<Record<number, string>>({});
  const [adaptiveResponses, setAdaptiveResponses] = useState<Record<string, string>>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  
  // Micro-feedback
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  
  // State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [combinedProfile, setCombinedProfile] = useState<any>(null);

  // Check if user already completed onboarding
  useEffect(() => {
    if (!authLoading && isAuthenticated && user?.onboardingCompleted) {
      navigate("/dashboard");
    }
  }, [authLoading, isAuthenticated, user, navigate]);

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

  const submitOnboardingMutation = trpc.psyche.submitHybridOnboarding.useMutation({
    onSuccess: (data) => {
      setCombinedProfile(data);
      setCurrentStep("profile-reveal");
      setIsSubmitting(false);
      toast.success("Your complete profile has been created!");
    },
    onError: (error) => {
      setIsSubmitting(false);
      toast.error(error.message || "Failed to process your responses");
    },
  });

  const showMicroFeedback = (message: string) => {
    setFeedbackMessage(message);
    setShowFeedback(true);
    setTimeout(() => {
      setShowFeedback(false);
    }, 2000);
  };

  const handleCoreQuestionAnswer = (answerId: string) => {
    const currentQuestion = CORE_QUESTIONS[currentQuestionIndex];
    setCoreResponses(prev => ({ ...prev, [currentQuestion.id]: answerId }));

    // Check for micro-feedback triggers
    const totalQuestions = currentQuestionIndex + 1;
    if (totalQuestions === 4) {
      const message = getFeedbackMessage("after_question_4");
      showMicroFeedback(message);
      setTimeout(() => {
        if (currentQuestionIndex < CORE_QUESTIONS.length - 1) {
          setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
      }, 2000);
    } else if (totalQuestions === 8) {
      const message = getFeedbackMessage("after_question_8", primaryInterest);
      showMicroFeedback(message);
      setTimeout(() => {
        setCurrentStep("adaptive-questions");
        setCurrentQuestionIndex(0);
      }, 2000);
    } else {
      // Move to next question
      if (currentQuestionIndex < CORE_QUESTIONS.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      }
    }
  };

  const handleAdaptiveQuestionAnswer = (answerId: string) => {
    const adaptiveQuestions = ADAPTIVE_QUESTIONS[primaryInterest] || [];
    const currentQuestion = adaptiveQuestions[currentQuestionIndex];
    setAdaptiveResponses(prev => ({ ...prev, [currentQuestion.id]: answerId }));

    const totalQuestions = currentQuestionIndex + 1;
    if (totalQuestions === 4) {
      // All adaptive questions done
      const message = getFeedbackMessage("after_question_12");
      showMicroFeedback(message);
      setTimeout(() => {
        handleComplete();
      }, 2000);
    } else {
      // Move to next adaptive question
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handleComplete = () => {
    // Format core question responses
    const formattedCoreResponses = CORE_QUESTIONS.map(q => {
      const selectedOptionId = coreResponses[q.id];
      const option = q.options.find(opt => opt.id === selectedOptionId);
      
      return {
        questionId: `core_${q.id}`,
        questionText: q.question,
        selectedOption: selectedOptionId || "",
        answerText: option?.text || "",
        trait: q.trait,
        indicators: option?.indicators || [],
        parameters: option?.parameters || {},
      };
    });

    // Format adaptive question responses
    const adaptiveQuestions = ADAPTIVE_QUESTIONS[primaryInterest] || [];
    const formattedAdaptiveResponses = adaptiveQuestions.map(q => {
      const selectedOptionId = adaptiveResponses[q.id];
      const option = q.options.find(opt => opt.id === selectedOptionId);
      
      return {
        questionId: q.id,
        questionText: q.question,
        selectedOption: selectedOptionId || "",
        answerText: option?.text || "",
        domainTrait: q.domainTrait,
        indicators: option?.indicators || [],
        domainInsight: option?.domainInsight || "",
      };
    });

    const completeData = {
      nickname,
      primaryInterest,
      coreResponses: formattedCoreResponses,
      adaptiveResponses: formattedAdaptiveResponses,
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
        setCurrentStep("primary-interest");
        break;
      case "primary-interest":
        if (!primaryInterest) {
          toast.error("Please select your primary interest");
          return;
        }
        setCurrentStep("core-questions");
        break;
      case "core-questions":
        const currentCoreQuestion = CORE_QUESTIONS[currentQuestionIndex];
        const currentCoreResponse = coreResponses[currentCoreQuestion.id];
        
        if (!currentCoreResponse) {
          toast.error("Please select an answer");
          return;
        }
        
        handleCoreQuestionAnswer(currentCoreResponse);
        break;
      case "adaptive-questions":
        const adaptiveQuestions = ADAPTIVE_QUESTIONS[primaryInterest] || [];
        const currentAdaptiveQuestion = adaptiveQuestions[currentQuestionIndex];
        const currentAdaptiveResponse = adaptiveResponses[currentAdaptiveQuestion.id];
        
        if (!currentAdaptiveResponse) {
          toast.error("Please select an answer");
          return;
        }
        
        handleAdaptiveQuestionAnswer(currentAdaptiveResponse);
        break;
    }
  };

  const handleBack = () => {
    switch (currentStep) {
      case "name":
        setCurrentStep("welcome");
        break;
      case "primary-interest":
        setCurrentStep("name");
        break;
      case "core-questions":
        if (currentQuestionIndex > 0) {
          setCurrentQuestionIndex(currentQuestionIndex - 1);
        } else {
          setCurrentStep("primary-interest");
        }
        break;
      case "adaptive-questions":
        if (currentQuestionIndex > 0) {
          setCurrentQuestionIndex(currentQuestionIndex - 1);
        } else {
          setCurrentStep("core-questions");
          setCurrentQuestionIndex(CORE_QUESTIONS.length - 1);
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
                Your Personality Type is Ready!
              </CardTitle>
              <CardDescription className="text-base">
                Sign up now to reveal your personalized profile and start making predictions.
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
  if (currentStep === "profile-reveal" && combinedProfile) {
    const interestData = INTERESTS.find(i => i.id === primaryInterest);
    const Icon = interestData?.icon || Sparkles;
    
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background via-background to-primary/5 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-3xl"
        >
          <Card className="border-primary/20 shadow-2xl">
            <CardHeader className="text-center space-y-4">
              <div className="mx-auto w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                <Sparkles className="h-10 w-10 text-primary" />
              </div>
              <CardTitle className="text-3xl font-bold">
                Welcome, {nickname}!
              </CardTitle>
              <CardDescription className="text-lg">
                Your personalized personality type
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Personality Type Section */}
              {combinedProfile.profile && (
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                    {combinedProfile.profile.displayName}
                  </h3>
                  <p className="text-muted-foreground">{combinedProfile.profile.description}</p>
                  
                  {combinedProfile.profile.coreTraits && (
                    <div>
                      <h4 className="font-semibold text-lg mb-2">Core Traits</h4>
                      <ul className="space-y-1">
                        {combinedProfile.profile.coreTraits.map((trait: string, index: number) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-primary mt-1">•</span>
                            <span className="text-muted-foreground text-sm">{trait}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {combinedProfile.profile.decisionMakingStyle && (
                    <div className="bg-primary/5 rounded-lg p-4 border border-primary/10">
                      <h4 className="font-semibold mb-2">Decision-Making Style</h4>
                      <p className="text-sm text-muted-foreground">{combinedProfile.profile.decisionMakingStyle}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Primary Interest Section */}
              <div>
                <h4 className="font-semibold text-lg mb-3">Your Primary Interest</h4>
                <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-primary/10 border border-primary/20 w-fit">
                  <Icon className={`w-6 h-6 ${interestData?.color}`} />
                  <span className="font-medium">{interestData?.label}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  You can add more interests later to get even more personalized predictions.
                </p>
              </div>

              <div className="pt-4">
                <Button
                  onClick={() => navigate("/dashboard?new=true")}
                  className="w-full"
                  size="lg"
                >
                  Make Your First Prediction
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  // Calculate overall progress (12 questions total)
  const calculateProgress = () => {
    // Total weight distribution:
    // welcome: 8%
    // name: 8%
    // primary-interest: 8%
    // core-questions: 50% (8 questions, ~6.25% each)
    // adaptive-questions: 26% (4 questions, ~6.5% each)
    
    if (currentStep === "welcome") return 8;
    if (currentStep === "name") return 16;
    if (currentStep === "primary-interest") return 24;
    
    if (currentStep === "core-questions") {
      const coreProgress = (currentQuestionIndex / CORE_QUESTIONS.length) * 50;
      return 24 + coreProgress;
    }
    
    if (currentStep === "adaptive-questions") {
      const adaptiveQuestions = ADAPTIVE_QUESTIONS[primaryInterest] || [];
      const adaptiveProgress = adaptiveQuestions.length > 0 
        ? (currentQuestionIndex / adaptiveQuestions.length) * 26 
        : 26;
      return 74 + adaptiveProgress;
    }
    
    return 100;
  };

  // Get current question number (1-12)
  const getCurrentQuestionNumber = () => {
    if (currentStep === "core-questions") {
      return currentQuestionIndex + 1;
    }
    if (currentStep === "adaptive-questions") {
      return 8 + currentQuestionIndex + 1;
    }
    return 0;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background via-background to-primary/5 p-4">
      <div className="w-full max-w-2xl">
        {/* Progress Bar */}
        {currentStep !== "welcome" && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              {(currentStep === "core-questions" || currentStep === "adaptive-questions") && (
                <span className="text-sm font-medium text-muted-foreground">
                  Question {getCurrentQuestionNumber()} of 12
                </span>
              )}
              <span className="text-sm font-medium text-primary ml-auto">
                {Math.round(calculateProgress())}%
              </span>
            </div>
            <Progress value={calculateProgress()} className="h-2" />
          </div>
        )}

        {/* Micro-Feedback Overlay */}
        <AnimatePresence>
          {showFeedback && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50"
            >
              <Card className="border-primary/30 bg-primary/10 backdrop-blur-sm shadow-lg">
                <CardContent className="py-3 px-6">
                  <p className="text-sm font-medium text-primary">{feedbackMessage}</p>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Welcome Screen */}
            {currentStep === "welcome" && (
              <Card className="border-2 border-primary/20">
                <CardHeader className="text-center space-y-4 pb-8">
                  <div className="mx-auto w-20 h-20 flex items-center justify-center">
                    <img src="/logo.svg" alt="Predicsure AI" className="w-20 h-20" />
                  </div>
                  <div>
                    <CardTitle className="text-3xl mb-3">
                      Welcome to Predicsure AI
                    </CardTitle>
                    <CardDescription className="text-base">
                      Let's discover your personality type in just 12 questions. This helps our AI provide accurate predictions tailored specifically to you.
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button onClick={handleNext} className="w-full" size="lg">
                    Get Started
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                  <p className="text-xs text-center text-muted-foreground">
                    Takes about 5 minutes
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

            {/* Primary Interest Step */}
            {currentStep === "primary-interest" && (
              <Card>
                <CardHeader>
                  <CardTitle>What's your primary interest?</CardTitle>
                  <CardDescription>
                    Choose one to start. You can add more interests later.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {INTERESTS.map((interest) => {
                      const Icon = interest.icon;
                      const isSelected = primaryInterest === interest.id;
                      return (
                        <button
                          key={interest.id}
                          onClick={() => setPrimaryInterest(interest.id)}
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

            {/* Core Questions Step */}
            {currentStep === "core-questions" && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">
                    {CORE_QUESTIONS[currentQuestionIndex].question}
                  </CardTitle>
                  <CardDescription>
                    {CORE_QUESTIONS[currentQuestionIndex].trait}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <RadioGroup
                    value={coreResponses[CORE_QUESTIONS[currentQuestionIndex].id] || ""}
                    onValueChange={(value) => {
                      setCoreResponses(prev => ({
                        ...prev,
                        [CORE_QUESTIONS[currentQuestionIndex].id]: value
                      }));
                    }}
                    className="space-y-3"
                  >
                    {CORE_QUESTIONS[currentQuestionIndex].options.map((option) => (
                      <div
                        key={option.id}
                        className="flex items-start space-x-3 p-4 rounded-lg border-2 border-border hover:border-primary/50 transition-all cursor-pointer"
                        onClick={() => {
                          setCoreResponses(prev => ({
                            ...prev,
                            [CORE_QUESTIONS[currentQuestionIndex].id]: option.id
                          }));
                        }}
                      >
                        <RadioGroupItem value={option.id} id={option.id} className="mt-1" />
                        <Label htmlFor={option.id} className="flex-1 cursor-pointer font-normal">
                          {option.text}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
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

            {/* Adaptive Questions Step */}
            {currentStep === "adaptive-questions" && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">
                    {ADAPTIVE_QUESTIONS[primaryInterest][currentQuestionIndex].question}
                  </CardTitle>
                  <CardDescription>
                    {ADAPTIVE_QUESTIONS[primaryInterest][currentQuestionIndex].domainTrait}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <RadioGroup
                    value={adaptiveResponses[ADAPTIVE_QUESTIONS[primaryInterest][currentQuestionIndex].id] || ""}
                    onValueChange={(value) => {
                      setAdaptiveResponses(prev => ({
                        ...prev,
                        [ADAPTIVE_QUESTIONS[primaryInterest][currentQuestionIndex].id]: value
                      }));
                    }}
                    className="space-y-3"
                  >
                    {ADAPTIVE_QUESTIONS[primaryInterest][currentQuestionIndex].options.map((option) => (
                      <div
                        key={option.id}
                        className="flex items-start space-x-3 p-4 rounded-lg border-2 border-border hover:border-primary/50 transition-all cursor-pointer"
                        onClick={() => {
                          setAdaptiveResponses(prev => ({
                            ...prev,
                            [ADAPTIVE_QUESTIONS[primaryInterest][currentQuestionIndex].id]: option.id
                          }));
                        }}
                      >
                        <RadioGroupItem value={option.id} id={option.id} className="mt-1" />
                        <Label htmlFor={option.id} className="flex-1 cursor-pointer font-normal">
                          {option.text}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                  <div className="flex gap-3">
                    <Button onClick={handleBack} variant="outline" className="flex-1">
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back
                    </Button>
                    <Button 
                      onClick={handleNext} 
                      className="flex-1"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          Continue
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
