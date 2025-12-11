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
import { ONBOARDING_QUESTIONS } from "@/data/onboardingQuestions";
import { CATEGORY_QUESTION_MAP } from "@/lib/categoryQuestions";
import { motion, AnimatePresence } from "framer-motion";

const INTERESTS = [
  { id: "career", label: "Career & Success", icon: Briefcase, color: "text-blue-400" },
  { id: "love", label: "Love & Relationships", icon: Heart, color: "text-pink-400" },
  { id: "finance", label: "Money & Wealth", icon: DollarSign, color: "text-green-400" },
  { id: "health", label: "Health & Wellness", icon: Activity, color: "text-purple-400" },
  { id: "sports", label: "Sports Predictions", icon: Trophy, color: "text-orange-400" },
  { id: "stocks", label: "Stocks & Markets", icon: TrendingUp, color: "text-cyan-400" },
];

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
  | "interests"
  | "category-questions"
  | "relationship"
  | "psyche-questions"
  | "signup-prompt"
  | "profile-reveal";

export default function PsycheOnboarding() {
  const { user, loading: authLoading, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  
  // Step management
  const [currentStep, setCurrentStep] = useState<OnboardingStep>("welcome");
  
  // Practical info
  const [nickname, setNickname] = useState("");
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [relationshipStatus, setRelationshipStatus] = useState("");
  
  // Category questions
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
  const [currentCategoryQuestionIndex, setCurrentCategoryQuestionIndex] = useState(0);
  const [categoryAnswers, setCategoryAnswers] = useState<Record<string, Record<string, string>>>({});
  
  // Psyche questions
  const [currentPsycheQuestionIndex, setCurrentPsycheQuestionIndex] = useState(0);
  const [psycheResponses, setPsycheResponses] = useState<Record<number, string>>({});
  
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

  const submitOnboardingMutation = trpc.psyche.submitOnboarding.useMutation({
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

  const handleInterestToggle = (interestId: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interestId)
        ? prev.filter((id) => id !== interestId)
        : [...prev, interestId]
    );
  };

  const handleCategoryAnswer = (answerId: string) => {
    const currentCategory = selectedInterests[currentCategoryIndex];
    const questions = CATEGORY_QUESTION_MAP[currentCategory] || [];
    const currentQuestion = questions[currentCategoryQuestionIndex];

    const newAnswers = {
      ...categoryAnswers,
      [currentCategory]: {
        ...(categoryAnswers[currentCategory] || {}),
        [currentQuestion.id]: answerId,
      },
    };
    setCategoryAnswers(newAnswers);

    // Move to next question or category
    if (currentCategoryQuestionIndex < questions.length - 1) {
      setCurrentCategoryQuestionIndex(currentCategoryQuestionIndex + 1);
    } else if (currentCategoryIndex < selectedInterests.length - 1) {
      setCurrentCategoryIndex(currentCategoryIndex + 1);
      setCurrentCategoryQuestionIndex(0);
    } else {
      // All category questions done, move to relationship status
      setCurrentStep("relationship");
    }
  };

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
      interests: selectedInterests,
      relationshipStatus,
      categoryAnswers,
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
        setCurrentStep("interests");
        break;
      case "interests":
        if (selectedInterests.length === 0) {
          toast.error("Please select at least one interest");
          return;
        }
        setCurrentStep("category-questions");
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
      case "interests":
        setCurrentStep("name");
        break;
      case "category-questions":
        if (currentCategoryQuestionIndex > 0) {
          setCurrentCategoryQuestionIndex(currentCategoryQuestionIndex - 1);
        } else if (currentCategoryIndex > 0) {
          setCurrentCategoryIndex(currentCategoryIndex - 1);
          const prevCategoryQuestions = CATEGORY_QUESTION_MAP[selectedInterests[currentCategoryIndex - 1]] || [];
          setCurrentCategoryQuestionIndex(prevCategoryQuestions.length - 1);
        } else {
          setCurrentStep("interests");
        }
        break;
      case "relationship":
        // Go back to last category question
        setCurrentCategoryIndex(selectedInterests.length - 1);
        const lastCategoryQuestions = CATEGORY_QUESTION_MAP[selectedInterests[selectedInterests.length - 1]] || [];
        setCurrentCategoryQuestionIndex(lastCategoryQuestions.length - 1);
        setCurrentStep("category-questions");
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
                Your Complete Profile is Ready!
              </CardTitle>
              <CardDescription className="text-base">
                Sign up now to reveal your personalized profile combining your interests, situation, and personality type.
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
                Your complete personalized profile
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Psyche Profile Section */}
              {combinedProfile.profile && (
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                    {combinedProfile.profile.displayName}
                  </h3>
                  <p className="text-muted-foreground">{combinedProfile.profile.description}</p>
                  
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

                  <div className="bg-primary/5 rounded-lg p-4 border border-primary/10">
                    <h4 className="font-semibold mb-2">Decision-Making Style</h4>
                    <p className="text-sm text-muted-foreground">{combinedProfile.profile.decisionMakingStyle}</p>
                  </div>
                </div>
              )}

              {/* Interests Section */}
              <div>
                <h4 className="font-semibold text-lg mb-3">Your Interests</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedInterests.map(interest => {
                    const interestData = INTERESTS.find(i => i.id === interest);
                    if (!interestData) return null;
                    const Icon = interestData.icon;
                    return (
                      <div key={interest} className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
                        <Icon className={`w-4 h-4 ${interestData.color}`} />
                        <span className="text-sm">{interestData.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="pt-4">
                <Button
                  onClick={() => navigate("/dashboard?new=true")}
                  className="w-full"
                  size="lg"
                >
                  Continue to Your First Prediction
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
  const calculateProgress = () => {
    // Total weight distribution:
    // welcome: 5%
    // name: 5%
    // interests: 5%
    // category-questions: 30% (divided by number of category questions)
    // relationship: 5%
    // psyche-questions: 50% (divided by 16 questions)
    
    if (currentStep === "welcome") return 5;
    if (currentStep === "name") return 10;
    if (currentStep === "interests") return 15;
    
    if (currentStep === "category-questions") {
      // Calculate total category questions
      const totalCategoryQuestions = selectedInterests.reduce((total, interest) => {
        const questions = CATEGORY_QUESTION_MAP[interest as keyof typeof CATEGORY_QUESTION_MAP];
        return total + (questions?.length || 0);
      }, 0);
      
      // Calculate how many questions answered so far
      let answeredQuestions = 0;
      for (let i = 0; i < currentCategoryIndex; i++) {
        const interest = selectedInterests[i];
        const questions = CATEGORY_QUESTION_MAP[interest as keyof typeof CATEGORY_QUESTION_MAP];
        answeredQuestions += questions?.length || 0;
      }
      answeredQuestions += currentCategoryQuestionIndex;
      
      const categoryProgress = totalCategoryQuestions > 0 ? (answeredQuestions / totalCategoryQuestions) * 30 : 30;
      return 15 + categoryProgress;
    }
    
    if (currentStep === "relationship") return 50;
    
    if (currentStep === "psyche-questions") {
      const psycheProgress = (currentPsycheQuestionIndex / ONBOARDING_QUESTIONS.length) * 50;
      return 50 + psycheProgress;
    }
    
    return 100;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background via-background to-primary/5 p-4">
      <div className="w-full max-w-2xl">
        {/* Progress Bar */}
        {currentStep !== "welcome" && (
          <div className="mb-8">
            <div className="flex items-center justify-end mb-2">
              <span className="text-sm font-medium text-primary">
                {Math.round(calculateProgress())}%
              </span>
            </div>
            <Progress value={calculateProgress()} className="h-2" />
          </div>
        )}

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
                      Let's create your personalized profile. We'll ask about your interests, situation, and how you think and decide. This helps our AI provide accurate predictions tailored specifically to you.
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button onClick={handleNext} className="w-full" size="lg">
                    Get Started
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
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

            {/* Interests Step */}
            {currentStep === "interests" && (
              <Card>
                <CardHeader>
                  <CardTitle>What areas interest you most?</CardTitle>
                  <CardDescription>
                    Select all that apply. We'll ask specific questions about each area.
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

            {/* Category Questions Step */}
            {currentStep === "category-questions" && (() => {
              const currentCategory = selectedInterests[currentCategoryIndex];
              const questions = CATEGORY_QUESTION_MAP[currentCategory] || [];
              const currentQuestion = questions[currentCategoryQuestionIndex];
              
              if (!currentQuestion) return null;

              return (
                <Card>
                  <CardHeader>
                    <CardTitle>{currentQuestion.question}</CardTitle>
                    <CardDescription>
                      {INTERESTS.find(i => i.id === currentCategory)?.label}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      {currentQuestion.options.map((option) => (
                        <button
                          key={option.id}
                          onClick={() => handleCategoryAnswer(option.id)}
                          className="w-full p-4 rounded-lg border-2 border-border hover:border-primary/50 transition-all text-left"
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                    <Button onClick={handleBack} variant="outline" className="w-full">
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back
                    </Button>
                  </CardContent>
                </Card>
              );
            })()}

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
