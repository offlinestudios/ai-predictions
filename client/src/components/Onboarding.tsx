import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Sparkles, Heart, Briefcase, DollarSign, User, ArrowRight } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { PredictionLoader } from "./PredictionLoader";

interface OnboardingProps {
  onComplete: () => void;
}

export function Onboarding({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState(1);
  const [nickname, setNickname] = useState("");
  const [gender, setGender] = useState("");
  const [relationshipStatus, setRelationshipStatus] = useState("");
  const [interests, setInterests] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const completeOnboardingMutation = trpc.user.completeOnboarding.useMutation();

  const interestOptions = [
    { id: "love", label: "Love & Relationships", icon: Heart },
    { id: "career", label: "Career & Success", icon: Briefcase },
    { id: "finance", label: "Money & Finance", icon: DollarSign },
    { id: "self", label: "Personal Growth", icon: User },
  ];

  const toggleInterest = (id: string) => {
    setInterests((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleComplete = async () => {
    setIsGenerating(true);
    
    // Simulate "reading pattern" animation
    await new Promise((resolve) => setTimeout(resolve, 3000));
    
    // Save onboarding data
    await completeOnboardingMutation.mutateAsync({
      nickname: nickname || undefined,
      gender: gender || undefined,
      relationshipStatus: relationshipStatus || undefined,
      interests: JSON.stringify(interests),
    });
    
    setIsGenerating(false);
    onComplete();
  };

  if (isGenerating) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 flex items-center justify-center p-4">
        <div className="text-center space-y-6">
          <PredictionLoader />
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-white">Reading your pattern...</h2>
            <p className="text-slate-300 max-w-md mx-auto">
              Analyzing your emotional trajectory • Decision patterns • Shifts in attention • Internal state signals
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-slate-900/50 border-slate-800 backdrop-blur-sm p-8">
        {/* Progress indicator */}
        <div className="flex justify-center gap-2 mb-8">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className={`h-2 w-16 rounded-full transition-colors ${
                i <= step ? "bg-purple-500" : "bg-slate-700"
              }`}
            />
          ))}
        </div>

        {/* Step 1: Hook */}
        {step === 1 && (
          <div className="space-y-6 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-500/20 mb-4">
              <Sparkles className="w-8 h-8 text-purple-400" />
            </div>
            <h1 className="text-4xl font-bold text-white">
              See what's shifting in your life right now
            </h1>
            <p className="text-xl text-slate-300">
              Your personalized prediction engine. Love, career, identity, timing.
            </p>
            <Button
              onClick={() => setStep(2)}
              size="lg"
              className="bg-purple-600 hover:bg-purple-700 text-white px-8"
            >
              Continue <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        )}

        {/* Step 2: Personalization */}
        {step === 2 && (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white text-center mb-8">
              Let's personalize your experience
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  What should we call you? (optional)
                </label>
                <Input
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder="Your name or nickname"
                  className="bg-slate-800 border-slate-700 text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Gender (optional)
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {["Male", "Female", "Other"].map((option) => (
                    <Button
                      key={option}
                      variant={gender === option ? "default" : "outline"}
                      onClick={() => setGender(option)}
                      className={
                        gender === option
                          ? "bg-purple-600 hover:bg-purple-700"
                          : "bg-slate-800 border-slate-700 hover:bg-slate-700"
                      }
                    >
                      {option}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Relationship Status (optional)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {["Single", "In a relationship", "Married", "Complicated"].map((option) => (
                    <Button
                      key={option}
                      variant={relationshipStatus === option ? "default" : "outline"}
                      onClick={() => setRelationshipStatus(option)}
                      className={
                        relationshipStatus === option
                          ? "bg-purple-600 hover:bg-purple-700"
                          : "bg-slate-800 border-slate-700 hover:bg-slate-700"
                      }
                    >
                      {option}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setStep(1)}
                className="flex-1 bg-slate-800 border-slate-700 hover:bg-slate-700"
              >
                Back
              </Button>
              <Button
                onClick={() => setStep(3)}
                className="flex-1 bg-purple-600 hover:bg-purple-700"
              >
                Continue <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Interests */}
        {step === 3 && (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white text-center mb-2">
              What do you want predictions about?
            </h2>
            <p className="text-slate-300 text-center mb-8">
              Select all that interest you
            </p>

            <div className="grid grid-cols-2 gap-4">
              {interestOptions.map((option) => {
                const Icon = option.icon;
                const isSelected = interests.includes(option.id);
                return (
                  <button
                    key={option.id}
                    onClick={() => toggleInterest(option.id)}
                    className={`p-6 rounded-lg border-2 transition-all ${
                      isSelected
                        ? "border-purple-500 bg-purple-500/20"
                        : "border-slate-700 bg-slate-800 hover:border-slate-600"
                    }`}
                  >
                    <Icon
                      className={`w-8 h-8 mx-auto mb-3 ${
                        isSelected ? "text-purple-400" : "text-slate-400"
                      }`}
                    />
                    <p
                      className={`font-medium ${
                        isSelected ? "text-purple-300" : "text-slate-300"
                      }`}
                    >
                      {option.label}
                    </p>
                  </button>
                );
              })}
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setStep(2)}
                className="flex-1 bg-slate-800 border-slate-700 hover:bg-slate-700"
              >
                Back
              </Button>
              <Button
                onClick={handleComplete}
                disabled={interests.length === 0}
                className="flex-1 bg-purple-600 hover:bg-purple-700 disabled:opacity-50"
              >
                Complete Setup <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
