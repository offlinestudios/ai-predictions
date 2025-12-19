import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Sparkles, MapPin, Calendar, Briefcase, Heart, Target, Check, ChevronRight } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

interface MissingField {
  key: string;
  label: string;
  icon: React.ReactNode;
  type: "text" | "select";
  placeholder?: string;
  options?: { value: string; label: string }[];
}

// Map missing factors to field configurations
const FIELD_CONFIG: Record<string, MissingField> = {
  "Your age range": {
    key: "ageRange",
    label: "Age Range",
    icon: <Calendar className="w-4 h-4" />,
    type: "select",
    options: [
      { value: "18-24", label: "18-24" },
      { value: "25-34", label: "25-34" },
      { value: "35-44", label: "35-44" },
      { value: "45-54", label: "45-54" },
      { value: "55-64", label: "55-64" },
      { value: "65+", label: "65+" },
    ],
  },
  "Your location/city": {
    key: "location",
    label: "Location",
    icon: <MapPin className="w-4 h-4" />,
    type: "text",
    placeholder: "e.g., New York, London, Tokyo",
  },
  "Your name/nickname": {
    key: "nickname",
    label: "Nickname",
    icon: <Sparkles className="w-4 h-4" />,
    type: "text",
    placeholder: "What should I call you?",
  },
  "Your relationship status": {
    key: "relationshipStatus",
    label: "Relationship Status",
    icon: <Heart className="w-4 h-4" />,
    type: "select",
    options: [
      { value: "single", label: "Single" },
      { value: "dating", label: "Dating" },
      { value: "in-relationship", label: "In a Relationship" },
      { value: "engaged", label: "Engaged" },
      { value: "married", label: "Married" },
      { value: "divorced", label: "Divorced" },
      { value: "widowed", label: "Widowed" },
      { value: "prefer-not-say", label: "Prefer not to say" },
    ],
  },
  "Your primary interests": {
    key: "interests",
    label: "Primary Interests",
    icon: <Target className="w-4 h-4" />,
    type: "select",
    options: [
      { value: "career", label: "Career & Work" },
      { value: "love", label: "Love & Relationships" },
      { value: "finance", label: "Money & Finance" },
      { value: "health", label: "Health & Wellness" },
    ],
  },
  "Your career profile details": {
    key: "industry",
    label: "Industry",
    icon: <Briefcase className="w-4 h-4" />,
    type: "text",
    placeholder: "e.g., Technology, Healthcare, Finance",
  },
  "Your finance profile details": {
    key: "incomeRange",
    label: "Income Range",
    icon: <Briefcase className="w-4 h-4" />,
    type: "select",
    options: [
      { value: "under-30k", label: "Under $30k" },
      { value: "30k-50k", label: "$30k - $50k" },
      { value: "50k-75k", label: "$50k - $75k" },
      { value: "75k-100k", label: "$75k - $100k" },
      { value: "100k-150k", label: "$100k - $150k" },
      { value: "150k-250k", label: "$150k - $250k" },
      { value: "250k+", label: "$250k+" },
    ],
  },
  "Your personality assessment": {
    key: "psyche",
    label: "Personality Assessment",
    icon: <Sparkles className="w-4 h-4" />,
    type: "select",
    options: [
      { value: "take-assessment", label: "Take the Assessment" },
    ],
  },
};

interface ImproveAccuracyCardProps {
  missingFactors: string[];
  currentScore: number;
  onProfileUpdated?: () => void;
}

export default function ImproveAccuracyCard({ 
  missingFactors, 
  currentScore,
  onProfileUpdated 
}: ImproveAccuracyCardProps) {
  const [selectedField, setSelectedField] = useState<MissingField | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [savedFields, setSavedFields] = useState<Set<string>>(new Set());

  const updateProfileMutation = trpc.user.updateProfileField.useMutation({
    onSuccess: () => {
      toast.success("Profile updated! Your future predictions will be more accurate.");
      setSavedFields(prev => {
        const newSet = new Set(Array.from(prev));
        newSet.add(selectedField?.key || "");
        return newSet;
      });
      setIsDialogOpen(false);
      setInputValue("");
      setSelectedField(null);
      onProfileUpdated?.();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update profile");
    },
  });

  // Filter to only show fields we have config for
  const availableFields = missingFactors
    .map(factor => FIELD_CONFIG[factor])
    .filter((field): field is MissingField => !!field && !savedFields.has(field.key));

  if (availableFields.length === 0) {
    return null;
  }

  const handleFieldClick = (field: MissingField) => {
    if (field.key === "psyche") {
      // Navigate to psyche assessment
      window.location.href = "/psyche";
      return;
    }
    setSelectedField(field);
    setInputValue("");
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (!selectedField || !inputValue) return;
    
    updateProfileMutation.mutate({
      field: selectedField.key,
      value: inputValue,
    });
  };

  // Calculate potential improvement
  const potentialImprovement = Math.min(15, availableFields.length * 5);
  const potentialScore = Math.min(100, currentScore + potentialImprovement);

  return (
    <>
      <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20 p-4 mt-4">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-primary/20 rounded-lg">
            <Sparkles className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-sm mb-1">Improve Your Prediction Accuracy</h4>
            <p className="text-xs text-muted-foreground mb-3">
              Add a few details to boost your accuracy from {currentScore}% to ~{potentialScore}%
            </p>
            
            <div className="flex flex-wrap gap-2">
              {availableFields.slice(0, 4).map((field) => (
                <Button
                  key={field.key}
                  variant="outline"
                  size="sm"
                  className="h-8 text-xs gap-1.5 bg-background/50 hover:bg-primary/10 hover:border-primary/40 transition-colors"
                  onClick={() => handleFieldClick(field)}
                >
                  {field.icon}
                  {field.label}
                  <ChevronRight className="w-3 h-3 opacity-50" />
                </Button>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Input Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedField?.icon}
              Add {selectedField?.label}
            </DialogTitle>
            <DialogDescription>
              This information will be saved to your profile and used to personalize all future predictions.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="field-input">{selectedField?.label}</Label>
              
              {selectedField?.type === "select" ? (
                <Select value={inputValue} onValueChange={setInputValue}>
                  <SelectTrigger>
                    <SelectValue placeholder={`Select ${selectedField?.label?.toLowerCase()}`} />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedField?.options?.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Input
                  id="field-input"
                  placeholder={selectedField?.placeholder}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && inputValue) {
                      handleSave();
                    }
                  }}
                />
              )}
            </div>
            
            <div className="flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleSave} 
                disabled={!inputValue || updateProfileMutation.isPending}
              >
                {updateProfileMutation.isPending ? (
                  "Saving..."
                ) : (
                  <>
                    <Check className="w-4 h-4 mr-1" />
                    Save to Profile
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
