import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { useIsMobile } from "@/hooks/useMobile";
import { trpc } from "@/lib/trpc";
import { useClerk } from "@clerk/clerk-react";
import { useLocation } from "wouter";
import { toast } from "sonner";
import ChatComposer from "@/components/ChatComposer";
import PredictionThread from "@/components/PredictionThread";
import MobileHeader from "@/components/MobileHeader";

import PredictionHistorySidebar from "@/components/PredictionHistorySidebar";
import UnifiedSidebar from "@/components/UnifiedSidebar";
import MobileUnifiedSidebar from "@/components/MobileUnifiedSidebar";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowLeft, Settings, LogOut, History } from "lucide-react";
import { TierBadge } from "@/components/Badge";
import PostPredictionPaywall from "@/components/PostPredictionPaywall";
import PremiumUnlockModal from "@/components/PremiumUnlockModal";
import { getLoginUrl } from "@/const";

interface Message {
  id: string;
  type: "user" | "assistant" | "system";
  content: string;
  category?: string;
  timestamp: Date;
  accuracy?: {
    score: number;
    label: string;
    potentialScore?: number;
    suggestedDetails?: string[];
  };
}

export default function DashboardChat() {
  const { user, loading: authLoading, isAuthenticated } = useAuth();
  const { signOut } = useClerk();
  const [, navigate] = useLocation();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPostPredictionPaywall, setShowPostPredictionPaywall] = useState(false);
  const [showPremiumUnlock, setShowPremiumUnlock] = useState(false);
  const [showHistorySidebar, setShowHistorySidebar] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  // Set initial sidebar state - closed by default on mobile
  useEffect(() => {
    if (isMobile !== undefined) {
      setShowHistorySidebar(false); // always closed on mobile by default
    }
  }, [isMobile]);

  // Fetch subscription data
  const { data: subscription } = trpc.subscription.getCurrent.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  // Generate prediction mutation
  const generateMutation = trpc.prediction.generate.useMutation({
    onSuccess: (data, variables) => {
      // Add assistant message with prediction
      const assistantMessage: Message = {
        id: `msg-${Date.now()}-assistant`,
        type: "assistant",
        content: data.prediction,
        category: variables.category,
        timestamp: new Date(),
        accuracy: {
          score: data.confidenceScore || 65,
          label: data.confidenceScore && data.confidenceScore >= 80 ? "High" : data.confidenceScore && data.confidenceScore >= 60 ? "Moderate" : "Low",
          potentialScore: 95,
          suggestedDetails: [
            "Age Range",
            "Location",
            "Income Range",
            "Relationship Status",
            "Current Life Stage"
          ]
        }
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      setIsGenerating(false);

      // Show paywall for free users after prediction
      if (subscription?.tier === "free") {
        setTimeout(() => setShowPostPredictionPaywall(true), 2000);
      }
    },
    onError: (error) => {
      setIsGenerating(false);
      toast.error(error.message || "Failed to generate prediction");
      
      // Remove loading message
      setMessages(prev => prev.filter(m => m.type !== "system"));
    }
  });

  // Handle prediction submission
  const handleSubmit = async (question: string, category: string, files: File[]) => {
    if (!question.trim()) return;

    // Check usage limits
    if (!isAuthenticated) {
      const anonymousUsage = JSON.parse(localStorage.getItem("anonymousUsage") || '{"count": 0, "lastReset": ""}');
      if (anonymousUsage.count >= 3) {
        toast.error("You've reached the free trial limit. Sign up to continue!");
        return;
      }
    } else if (subscription?.tier === "free" && (subscription?.totalUsed || 0) >= 3) {
      toast.error("You've used all 3 free predictions. Upgrade to continue!");
      setShowPostPredictionPaywall(true);
      return;
    }

    // Add user message
    const userMessage: Message = {
      id: `msg-${Date.now()}-user`,
      type: "user",
      content: question,
      category,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);

    // Add loading message
    const loadingMessage: Message = {
      id: `msg-${Date.now()}-system`,
      type: "system",
      content: "Analyzing your question and generating prediction...",
      timestamp: new Date()
    };
    setMessages(prev => [...prev, loadingMessage]);

    setIsGenerating(true);

    // TODO: Handle file uploads if needed
    // For now, just generate prediction with question

    // Map frontend categories to backend schema
    const categoryMap: Record<string, "career" | "love" | "finance" | "health" | "general"> = {
      "general": "general",
      "career": "career",
      "relationships": "love",
      "finance": "finance",
      "health": "health",
      "sports": "general", // Map sports to general
      "stocks": "finance" // Map stocks to finance
    };

    generateMutation.mutate({
      userInput: question,
      category: categoryMap[category] || "general",
      trajectoryType: "instant"
    });
  };

  // Handle selecting a prediction from history
  const handleSelectPrediction = (prediction: any) => {
    // Clear current messages and load the selected prediction
    const userMessage: Message = {
      id: `msg-${Date.now()}-user`,
      type: "user",
      content: prediction.userInput,
      category: prediction.category || "general",
      timestamp: new Date(prediction.createdAt)
    };

    const assistantMessage: Message = {
      id: `msg-${Date.now()}-assistant`,
      type: "assistant",
      content: prediction.predictionResult,
      category: prediction.category || "general",
      timestamp: new Date(prediction.createdAt),
      accuracy: {
        score: prediction.confidenceScore || 65,
        label: prediction.confidenceScore && prediction.confidenceScore >= 80 ? "High" : prediction.confidenceScore && prediction.confidenceScore >= 60 ? "Moderate" : "Low",
        potentialScore: 95,
        suggestedDetails: [
          "Age Range",
          "Location",
          "Income Range",
          "Relationship Status",
          "Current Life Stage"
        ]
      }
    };

    setMessages([userMessage, assistantMessage]);
    toast.success("Prediction loaded from history");
  };

  // Handle new prediction
  const handleNewPrediction = () => {
    setMessages([]);
    toast.success("Starting a new prediction");
  };

  // Handle refine request
  const handleRefineRequest = (messageId: string) => {
    toast.info("Refinement feature coming soon! This will ask you specific questions to improve accuracy.");
    // TODO: Implement refinement flow
  };

  // Handle feedback
  const handleFeedback = (messageId: string, helpful: boolean) => {
    toast.success(helpful ? "Thanks for the feedback!" : "We'll work on improving!");
    // TODO: Send feedback to backend
  };

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Check if composer should be disabled
  const isComposerDisabled = !isAuthenticated && messages.length >= 3;

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      {/* Desktop: Fixed Left Sidebar */}
      <div className="hidden lg:block w-80 h-screen sticky top-0">
        {isAuthenticated && (
          <UnifiedSidebar
            user={user}
            subscription={subscription}
            onSelectPrediction={handleSelectPrediction}
            currentPredictionId={null}
            isAuthenticated={isAuthenticated}
            onNewPrediction={handleNewPrediction}
          />
        )}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Mobile Header with Hamburger */}
        <MobileHeader 
          isAuthenticated={isAuthenticated}
          userName={user?.name}
          userEmail={user?.email}
          tier={subscription?.tier}
          onHistoryClick={() => setShowHistorySidebar(!showHistorySidebar)}
        />

        {/* Chat Area */}
        <main className="flex-1 overflow-y-auto pb-32 md:pb-40">
          <div className="container max-w-4xl pt-4 md:pt-8">
            <PredictionThread 
              messages={messages}
              onRefineRequest={handleRefineRequest}
              onFeedback={handleFeedback}
            />
            <div ref={messagesEndRef} />
          </div>
        </main>

        {/* Mobile: Sidebar Sheet (toggleable from right) */}
        {isMobile && isAuthenticated && (
          <PredictionHistorySidebar
            isOpen={showHistorySidebar}
            onClose={() => setShowHistorySidebar(false)}
            onSelectPrediction={handleSelectPrediction}
          />
        )}

        {/* Chat Composer - Fixed at bottom */}
        <ChatComposer 
          onSubmit={handleSubmit}
          isLoading={isGenerating}
          disabled={isComposerDisabled}
        />

        {/* Modals */}
        {isAuthenticated && subscription && (
          <PostPredictionPaywall 
            open={showPostPredictionPaywall}
            onOpenChange={setShowPostPredictionPaywall}
            userTier={subscription.tier}
            predictionCategory="general"
          />
        )}

        {showPremiumUnlock && (
          <PremiumUnlockModal
            open={showPremiumUnlock}
            onClose={() => setShowPremiumUnlock(false)}
            onComplete={() => setShowPremiumUnlock(false)}
          />
        )}
      </div>
    </div>
  );
}
