import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { HelpCircle } from "lucide-react";

interface ClarificationOption {
  label: string;
  icon: string;
  contextToAdd: string;
}

interface ClarificationQuestionProps {
  question: string;
  options: ClarificationOption[];
  onOptionSelect: (option: ClarificationOption) => void;
  isLoading?: boolean;
}

export function ClarificationQuestion({
  question,
  options,
  onOptionSelect,
  isLoading = false,
}: ClarificationQuestionProps) {
  return (
    <Card className="bg-gradient-to-br from-purple-500/10 to-indigo-500/10 border-purple-500/20">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-full bg-purple-500/20">
            <HelpCircle className="w-5 h-5 text-purple-400" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-foreground mb-3">
              {question}
            </p>
            <div className="flex flex-wrap gap-2">
              {options.map((option, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => onOptionSelect(option)}
                  disabled={isLoading}
                  className="bg-background/50 hover:bg-purple-500/20 hover:border-purple-500/50 transition-all"
                >
                  <span className="mr-1.5">{option.icon}</span>
                  {option.label}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
