import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Sparkles, TrendingUp, Target, Zap } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

interface PremiumUnlockModalProps {
  open: boolean;
  onClose: () => void;
  onComplete: () => void;
}

const AGE_RANGES = [
  { value: "18-24", label: "18-24" },
  { value: "25-34", label: "25-34" },
  { value: "35-44", label: "35-44" },
  { value: "45-54", label: "45-54" },
  { value: "55-64", label: "55-64" },
  { value: "65+", label: "65+" },
];

const INCOME_RANGES = [
  { value: "0-30k", label: "Under $30,000" },
  { value: "30-50k", label: "$30,000 - $50,000" },
  { value: "50-75k", label: "$50,000 - $75,000" },
  { value: "75-100k", label: "$75,000 - $100,000" },
  { value: "100-150k", label: "$100,000 - $150,000" },
  { value: "150k+", label: "$150,000+" },
  { value: "prefer-not-say", label: "Prefer not to say" },
];

const INDUSTRIES = [
  { value: "tech", label: "Technology" },
  { value: "finance", label: "Finance & Banking" },
  { value: "healthcare", label: "Healthcare" },
  { value: "education", label: "Education" },
  { value: "retail", label: "Retail & E-commerce" },
  { value: "manufacturing", label: "Manufacturing" },
  { value: "creative", label: "Creative & Media" },
  { value: "consulting", label: "Consulting" },
  { value: "real-estate", label: "Real Estate" },
  { value: "hospitality", label: "Hospitality & Tourism" },
  { value: "legal", label: "Legal" },
  { value: "nonprofit", label: "Nonprofit" },
  { value: "student", label: "Student" },
  { value: "self-employed", label: "Self-Employed" },
  { value: "other", label: "Other" },
];

const TRANSITION_TYPES = [
  { value: "career-change", label: "Career change" },
  { value: "relocation", label: "Moving/Relocation" },
  { value: "relationship", label: "Relationship change" },
  { value: "education", label: "Starting/Finishing education" },
  { value: "business", label: "Starting/Scaling business" },
  { value: "family", label: "Family changes (marriage, kids, etc.)" },
  { value: "health", label: "Health transformation" },
  { value: "financial", label: "Major financial shift" },
  { value: "other", label: "Other major transition" },
];

export default function PremiumUnlockModal({ open, onClose, onComplete }: PremiumUnlockModalProps) {
  const [ageRange, setAgeRange] = useState("");
  const [location, setLocation] = useState("");
  const [incomeRange, setIncomeRange] = useState("");
  const [industry, setIndustry] = useState("");
  const [majorTransition, setMajorTransition] = useState(false);
  const [transitionType, setTransitionType] = useState("");

  const savePremiumDataMutation = trpc.user.savePremiumData.useMutation({
    onSuccess: () => {
      toast.success("Premium precision unlocked! Your future predictions will be even more accurate.");
      onComplete();
    },
    onError: (error) => {
      toast.error("Failed to save data: " + error.message);
    },
  });

  const handleSubmit = () => {
    if (!ageRange || !incomeRange || !industry) {
      toast.error("Please complete all required fields");
      return;
    }

    savePremiumDataMutation.mutate({
      ageRange,
      location: location || null,
      incomeRange,
      industry,
      majorTransition,
      transitionType: majorTransition ? transitionType : null,
    });
  };

  const handleSkip = () => {
    toast.info("You can unlock premium precision anytime from your dashboard");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <DialogTitle className="text-2xl">Unlock Deeper Precision</DialogTitle>
              <DialogDescription className="text-base mt-1">
                Get uncannily accurate predictions tailored to your exact life context
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Benefits */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
          <div className="flex items-start gap-3 p-4 rounded-lg bg-accent/50">
            <Target className="w-5 h-5 text-primary mt-0.5" />
            <div>
              <h4 className="font-semibold text-sm">Pinpoint Timing</h4>
              <p className="text-xs text-muted-foreground mt-1">
                Predictions aligned with your age, stage, and transitions
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-4 rounded-lg bg-accent/50">
            <TrendingUp className="w-5 h-5 text-primary mt-0.5" />
            <div>
              <h4 className="font-semibold text-sm">Industry Insights</h4>
              <p className="text-xs text-muted-foreground mt-1">
                Career predictions specific to your field and income level
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-4 rounded-lg bg-accent/50">
            <Zap className="w-5 h-5 text-primary mt-0.5" />
            <div>
              <h4 className="font-semibold text-sm">Life Context</h4>
              <p className="text-xs text-muted-foreground mt-1">
                Forecasts that account for major transitions you're facing
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="space-y-6">
          {/* Age Range */}
          <div className="space-y-2">
            <Label htmlFor="age-range">
              Age Range <span className="text-destructive">*</span>
            </Label>
            <Select value={ageRange} onValueChange={setAgeRange}>
              <SelectTrigger id="age-range">
                <SelectValue placeholder="Select your age range" />
              </SelectTrigger>
              <SelectContent>
                {AGE_RANGES.map((range) => (
                  <SelectItem key={range.value} value={range.value}>
                    {range.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="location">
              Location <span className="text-muted-foreground text-sm">(Optional)</span>
            </Label>
            <Input
              id="location"
              placeholder="City or region (e.g., New York, Bay Area)"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>

          {/* Income Range */}
          <div className="space-y-2">
            <Label htmlFor="income-range">
              Income Range <span className="text-destructive">*</span>
            </Label>
            <Select value={incomeRange} onValueChange={setIncomeRange}>
              <SelectTrigger id="income-range">
                <SelectValue placeholder="Select your income range" />
              </SelectTrigger>
              <SelectContent>
                {INCOME_RANGES.map((range) => (
                  <SelectItem key={range.value} value={range.value}>
                    {range.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Industry */}
          <div className="space-y-2">
            <Label htmlFor="industry">
              Industry/Field <span className="text-destructive">*</span>
            </Label>
            <Select value={industry} onValueChange={setIndustry}>
              <SelectTrigger id="industry">
                <SelectValue placeholder="Select your industry" />
              </SelectTrigger>
              <SelectContent>
                {INDUSTRIES.map((ind) => (
                  <SelectItem key={ind.value} value={ind.value}>
                    {ind.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Major Transition */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="major-transition"
                checked={majorTransition}
                onCheckedChange={(checked) => setMajorTransition(checked as boolean)}
              />
              <Label htmlFor="major-transition" className="font-normal cursor-pointer">
                I'm currently undergoing a major life transition
              </Label>
            </div>

            {majorTransition && (
              <div className="space-y-2 ml-6">
                <Label htmlFor="transition-type">What type of transition?</Label>
                <Select value={transitionType} onValueChange={setTransitionType}>
                  <SelectTrigger id="transition-type">
                    <SelectValue placeholder="Select transition type" />
                  </SelectTrigger>
                  <SelectContent>
                    {TRANSITION_TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-6">
          <Button
            onClick={handleSkip}
            variant="outline"
            className="flex-1"
            disabled={savePremiumDataMutation.isPending}
          >
            Skip for Now
          </Button>
          <Button
            onClick={handleSubmit}
            className="flex-1"
            disabled={savePremiumDataMutation.isPending}
          >
            {savePremiumDataMutation.isPending ? "Unlocking..." : "Unlock Premium Precision"}
            <Sparkles className="w-4 h-4 ml-2" />
          </Button>
        </div>

        <p className="text-xs text-center text-muted-foreground mt-4">
          Your data is encrypted and never shared. Used only to enhance your predictions.
        </p>
      </DialogContent>
    </Dialog>
  );
}
