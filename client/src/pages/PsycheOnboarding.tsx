import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, Loader2, Sparkles } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { useAuth } from "@/_core/hooks/useAuth";
import { ONBOARDING_QUESTIONS } from "@/data/onboardingQuestions";
import { motion, AnimatePresence } from "framer-motion";

export default function PsycheOnboarding() {
  const { user, loading: authLoading, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState<Record<number, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [psycheProfile, setPsycheProfile] = useState<any>(null);

  // Check if user is authenticated and already completed onboarding
  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated) {
        // Redirect to sign up
        toast.error("Please sign up to discover your psyche profile");
        navigate("/");
      } else if (user?.onboardingCompleted) {
        // User already completed onboarding, redirect to dashboard
        navigate("/dashboard");
      }
    }
  }, [authLoading, isAuthenticated, user, navigate]);

  const submitOnboardingMutation = trpc.psyche.submitOnboarding.useMutation({
    onSuccess: (data) => {
      setPsycheProfile(data.profile);
      setShowProfile(true);
      setIsSubmitting(false);
      toast.success("Your psyche profile has been revealed!");
    },
    onError: (error) => {
      setIsSubmitting(false);
      toast.error(error.message || "Failed to process your responses");
    },
  });

  const progress = ((currentQuestion + 1) / ONBOARDING_QUESTIONS.length) * 100;
  const currentQuestionData = ONBOARDING_QUESTIONS[currentQuestion];
  const currentResponse = responses[currentQuestionData.id];

  const handleNext = () => {
    if (!currentResponse) {
      toast.error("Please select an answer");
      return;
    }

    if (currentQuestion < ONBOARDING_QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Submit all responses
      handleSubmit();
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    
    const formattedResponses = ONBOARDING_QUESTIONS.map(q => {
      const selectedOption = responses[q.id];
      const option = q.options.find(opt => opt.value === selectedOption);
      
      return {
        questionId: q.id,
        questionText: q.question,
        selectedOption: selectedOption || "",
        answerText: option?.label || "",
      };
    });

    submitOnboardingMutation.mutate({
      responses: formattedResponses,
    });
  };

  const handleContinueToDashboard = () => {
    navigate("/dashboard?new=true");
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background via-background to-primary/5">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (showProfile && psycheProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background via-background to-primary/5 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-2xl"
        >
          <Card className="border-primary/20 shadow-2xl">
            <CardHeader className="text-center space-y-4">
              <div className="mx-auto w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                <Sparkles className="h-10 w-10 text-primary" />
              </div>
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                {psycheProfile.displayName}
              </CardTitle>
              <CardDescription className="text-lg">
                {psycheProfile.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold text-lg mb-3">Core Traits</h3>
                <ul className="space-y-2">
                  {psycheProfile.coreTraits.map((trait: string, index: number) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span className="text-muted-foreground">{trait}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-3">Decision-Making Style</h3>
                <p className="text-muted-foreground">{psycheProfile.decisionMakingStyle}</p>
              </div>

              <div className="bg-primary/5 rounded-lg p-4 border border-primary/10">
                <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  Your Growth Edge
                </h3>
                <p className="text-muted-foreground">{psycheProfile.growthEdge}</p>
              </div>

              <div className="pt-4">
                <Button
                  onClick={handleContinueToDashboard}
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background via-background to-primary/5 p-4">
      <div className="w-full max-w-2xl">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-medium text-muted-foreground">
              Question {currentQuestion + 1} of {ONBOARDING_QUESTIONS.length}
            </h2>
            <span className="text-sm font-medium text-primary">
              {Math.round(progress)}%
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle className="text-2xl">{currentQuestionData.question}</CardTitle>
                <CardDescription>
                  Choose the answer that resonates most with you
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <RadioGroup
                  value={currentResponse}
                  onValueChange={(value) => {
                    setResponses({
                      ...responses,
                      [currentQuestionData.id]: value,
                    });
                  }}
                >
                  {currentQuestionData.options.map((option) => (
                    <div
                      key={option.value}
                      className="flex items-center space-x-3 p-4 rounded-lg border border-border hover:border-primary/50 transition-colors cursor-pointer"
                      onClick={() => {
                        setResponses({
                          ...responses,
                          [currentQuestionData.id]: option.value,
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
                    onClick={handlePrevious}
                    disabled={currentQuestion === 0 || isSubmitting}
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
                    ) : currentQuestion === ONBOARDING_QUESTIONS.length - 1 ? (
                      <>
                        Reveal My Profile
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
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
