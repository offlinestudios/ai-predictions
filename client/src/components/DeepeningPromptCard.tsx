import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight } from "lucide-react";

interface DeepeningPromptCardProps {
  onEnhance: () => void;
  onDismiss: () => void;
}

export default function DeepeningPromptCard({ onEnhance, onDismiss }: DeepeningPromptCardProps) {
  return (
    <Card className="border-primary/30 bg-gradient-to-r from-primary/5 to-primary/10">
      <CardHeader>
        <div className="flex items-center gap-3">
          <Sparkles className="h-6 w-6 text-primary" />
          <CardTitle>Enhance Your Profile</CardTitle>
        </div>
        <CardDescription>
          Add more interests to get even more personalized predictions across different areas of your life.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex gap-3">
        <Button onClick={onEnhance}>
          Add Interests
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
        <Button variant="ghost" onClick={onDismiss}>
          Maybe Later
        </Button>
      </CardContent>
    </Card>
  );
}
