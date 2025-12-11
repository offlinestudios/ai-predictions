import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  Briefcase, 
  Heart, 
  DollarSign, 
  Activity, 
  Trophy, 
  TrendingUp,
  Check
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Category {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
}

const CATEGORIES: Category[] = [
  {
    id: "career",
    name: "Career & Success",
    icon: <Briefcase className="h-6 w-6" />,
    description: "Professional growth and career decisions",
  },
  {
    id: "love",
    name: "Love & Relationships",
    icon: <Heart className="h-6 w-6" />,
    description: "Romantic relationships and connections",
  },
  {
    id: "finance",
    name: "Money & Wealth",
    icon: <DollarSign className="h-6 w-6" />,
    description: "Financial decisions and wealth building",
  },
  {
    id: "health",
    name: "Health & Wellness",
    icon: <Activity className="h-6 w-6" />,
    description: "Physical and mental wellbeing",
  },
  {
    id: "sports",
    name: "Sports Predictions",
    icon: <Trophy className="h-6 w-6" />,
    description: "Sports outcomes and betting",
  },
  {
    id: "stocks",
    name: "Stocks & Markets",
    icon: <TrendingUp className="h-6 w-6" />,
    description: "Investment and market predictions",
  },
];

interface CategorySelectionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  availableCategories: string[];
  onContinue: (selectedCategories: string[]) => void;
}

export default function CategorySelectionModal({
  open,
  onOpenChange,
  availableCategories,
  onContinue,
}: CategorySelectionModalProps) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const handleToggle = (categoryId: string) => {
    setSelectedCategories(prev => {
      if (prev.includes(categoryId)) {
        return prev.filter(id => id !== categoryId);
      } else {
        // Limit to 2 categories at a time
        if (prev.length >= 2) {
          return prev;
        }
        return [...prev, categoryId];
      }
    });
  };

  const handleContinue = () => {
    onContinue(selectedCategories);
    setSelectedCategories([]);
  };

  const availableCategoryObjects = CATEGORIES.filter(cat =>
    availableCategories.includes(cat.id)
  );

  const questionCount = selectedCategories.length * 3;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add More Interests</DialogTitle>
          <DialogDescription>
            Select 1-2 areas you'd like to add. You'll answer 3 quick questions for each.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 py-4">
          {availableCategoryObjects.map(category => (
            <Card
              key={category.id}
              className={cn(
                "p-4 cursor-pointer transition-all hover:border-primary/50",
                selectedCategories.includes(category.id)
                  ? "border-primary bg-primary/5"
                  : "border-border"
              )}
              onClick={() => handleToggle(category.id)}
            >
              <div className="flex items-start gap-3">
                <div className={cn(
                  "p-2 rounded-lg",
                  selectedCategories.includes(category.id)
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                )}>
                  {category.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">{category.name}</h3>
                    {selectedCategories.includes(category.id) && (
                      <Check className="h-5 w-5 text-primary" />
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {category.description}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <p className="text-sm text-muted-foreground flex-1">
            {selectedCategories.length === 0
              ? "Select at least 1 category to continue"
              : `${questionCount} questions • ~${Math.ceil(questionCount / 2)} minutes`}
          </p>
          <Button
            onClick={handleContinue}
            disabled={selectedCategories.length === 0}
          >
            Continue
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
