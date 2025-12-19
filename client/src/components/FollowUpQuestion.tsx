import { MessageCircle } from "lucide-react";

interface FollowUpQuestionProps {
  question: string;
  options: string[];
  onOptionSelect: (option: string) => void;
  isLoading?: boolean;
}

export function FollowUpQuestion({
  question,
  options,
  onOptionSelect,
  isLoading = false,
}: FollowUpQuestionProps) {
  return (
    <div className="mt-6 rounded-xl border border-purple-500/20 bg-purple-500/5 p-4">
      <div className="flex items-start gap-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-purple-500/20">
          <MessageCircle className="h-4 w-4 text-purple-400" />
        </div>
        <div className="flex-1 space-y-3">
          <p className="text-sm font-medium text-foreground/90">{question}</p>
          <div className="flex flex-wrap gap-2">
            {options.map((option, index) => (
              <button
                key={index}
                onClick={() => onOptionSelect(option)}
                disabled={isLoading}
                className="rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-2 text-sm text-purple-300 transition-all hover:border-purple-500/50 hover:bg-purple-500/20 hover:text-purple-200 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
