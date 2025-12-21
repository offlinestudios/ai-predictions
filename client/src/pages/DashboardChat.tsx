import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { useIsMobile } from "@/hooks/useMobile";
import { trpc } from "@/lib/trpc";
import { useClerk } from "@clerk/clerk-react";
import { useLocation } from "wouter";
import { toast } from "sonner";
import ChatComposer from "@/components/ChatComposer";
import PredictionThread from "@/components/PredictionThread";
// ClarificationQuestion removed - AI handles ambiguity naturally
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
import DepthPaywall from "@/components/DepthPaywall";
import { getLoginUrl } from "@/const";

interface Message {
  id: string;
  type: "user" | "assistant" | "system";
  content: string;
  timestamp: Date;
  accuracy?: {
    score: number;
    label: "High" | "Moderate" | "Low";
  };
  missingFactors?: string[];
  predictionId?: number;
  shareToken?: string | null;
  userInput?: string;
  questionType?: "oracle" | "decision" | "timeline" | "quick" | "compatibility" | "risk";
  followUpQuestion?: {
    question: string;
    options: string[];
  } | null;
}

export default function DashboardChat() {
  const { user, loading: authLoading, isAuthenticated } = useAuth();
  const { signOut } = useClerk();
  const [, navigate] = useLocation();
  const utils = trpc.useUtils(); // For invalidating queries
  const [messages, setMessages] = useState<Message[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPostPredictionPaywall, setShowPostPredictionPaywall] = useState(false);
  const [showPremiumUnlock, setShowPremiumUnlock] = useState(false);
  const [showHistorySidebar, setShowHistorySidebar] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [currentPredictionId, setCurrentPredictionId] = useState<number | null>(null);
  const [currentPrediction, setCurrentPrediction] = useState<{
    id: number;
    userInput: string;
    predictionResult: string;
    shareToken: string | null;
  } | null>(null);
  // Track the original root question for follow-ups (prevents nested context strings)
  const [rootQuestion, setRootQuestion] = useState<string | null>(null);
  
  // Depth Ladder: Track conversation depth (1=Surface, 2=Pattern, 3=Differentiation, 4=Forecast)
  const [conversationDepth, setConversationDepth] = useState<1 | 2 | 3 | 4>(1);
  const [showDepthPaywall, setShowDepthPaywall] = useState(false);
  const [pendingFollowUp, setPendingFollowUp] = useState<string | null>(null); // Store follow-up for after payment
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  // Set initial sidebar state - closed by default on mobile
  useEffect(() => {
    if (isMobile !== undefined) {
      setShowHistorySidebar(false); // always closed on mobile by default
    }
  }, [isMobile]);

  // Fetch subscription data
  const { data: subscription, refetch: refetchSubscription } = trpc.subscription.getCurrent.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  // Fetch prediction history to get accurate count of root predictions (not follow-ups)
  const { data: historyData, isLoading: isHistoryLoading } = trpc.prediction.getHistory.useQuery(
    { limit: 1 }, // We only need the total count, not the actual predictions
    { enabled: isAuthenticated }
  );
  
  // Use actual root prediction count for limit checking
  // Only consider limit reached when data has loaded AND count >= 3
  // This prevents blocking users while data is still loading
  const actualPredictionCount = historyData?.total ?? 0;
  const isDataLoaded = !isHistoryLoading && historyData !== undefined;

  // Question analysis removed - AI handles ambiguity naturally in its response

  // Generate prediction mutation
  const generateMutation = trpc.prediction.generate.useMutation({
    onSuccess: (data, variables) => {
      // Remove loading/system message first
      setMessages(prev => prev.filter(m => m.type !== "system"));
      
      // Add assistant message with prediction
      const assistantMessage: Message = {
        id: `msg-${Date.now()}-assistant`,
        type: "assistant",
        content: data.prediction,
        timestamp: new Date(),
        // Accuracy score calculated based on profile completeness and question specificity
        accuracy: {
          score: data.confidenceScore ?? 50, // Use calculated score from backend
          label: (data.confidenceScore ?? 50) >= 75 ? "High" : (data.confidenceScore ?? 50) >= 50 ? "Moderate" : "Low",
        },
        missingFactors: data.missingFactors || [],
        predictionId: data.id,
        shareToken: data.shareToken,
        userInput: variables.userInput,
        questionType: data.questionType,
        followUpQuestion: data.followUpQuestion,
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      setIsGenerating(false);

      // Set current prediction for share modal
      // Only set the prediction ID if this is a new root prediction (not a follow-up)
      // This ensures follow-ups stay linked to the original prediction thread
      if (data.id && !data.isFollowUp) {
        setCurrentPredictionId(data.id);
        setCurrentPrediction({
          id: data.id,
          userInput: variables.userInput,
          predictionResult: data.prediction,
          shareToken: data.shareToken || null
        });
      }

      // Depth Ladder: Update depth level after successful prediction
      // Depth is tracked per conversation thread and increases with follow-ups
      // Note: Depth paywall is handled in handleFollowUpSelect before submission
      
      // Invalidate history query to update the count for limit checking
      utils.prediction.getHistory.invalidate();
      
      // Show post-prediction paywall only when user has used all 3 free predictions
      // (not for depth ladder - that's handled separately)
      // Check if this was their 3rd prediction (count was 2 before this one)
      if (subscription?.tier === "free" && actualPredictionCount >= 2 && !data.isFollowUp) {
        setTimeout(() => {
          refetchSubscription();
          setShowPostPredictionPaywall(true);
        }, 2000);
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
  const handleSubmit = async (question: string, files: File[], deepMode: boolean = false, trajectoryType: string = "instant") => {
    if (!question.trim()) return;

    // Check usage limits
    if (!isAuthenticated) {
      const anonymousUsage = JSON.parse(localStorage.getItem("anonymousUsage") || '{"count": 0, "lastReset": ""}');
      if (anonymousUsage.count >= 3) {
        toast.error("You've reached the free trial limit. Sign up to continue!");
        return;
      }
    } else if (subscription?.tier === "free" && isDataLoaded && actualPredictionCount >= 3) {
      toast.error("You've used all 3 free predictions. Upgrade to continue!");
      setShowPostPredictionPaywall(true);
      return;
    }

    // Set root question if this is the first prediction in the thread
    if (!rootQuestion && !currentPredictionId) {
      setRootQuestion(question);
    }

    // Add user message
    const userMessage: Message = {
      id: `msg-${Date.now()}-user`,
      type: "user",
      content: question,
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

    // Generate prediction directly - AI handles any ambiguity naturally
    generateMutation.mutate({
      userInput: question,
      category: "general",
      deepMode: deepMode,
      trajectoryType: trajectoryType as "instant" | "30day" | "90day" | "yearly",
      parentPredictionId: currentPredictionId || undefined,
      depthLevel: conversationDepth, // Pass current depth level
    });
  };

  // Handle prediction submission with explicit depth level (for follow-ups)
  const handleSubmitWithDepth = async (question: string, files: File[], deepMode: boolean, trajectoryType: string, depth: 1 | 2 | 3 | 4) => {
    if (!question.trim()) return;

    // Add loading message
    const loadingMessage: Message = {
      id: `msg-${Date.now()}-system`,
      type: "system",
      content: "Going deeper...",
      timestamp: new Date()
    };
    setMessages(prev => [...prev, loadingMessage]);

    setIsGenerating(true);

    // Generate prediction with specified depth level
    generateMutation.mutate({
      userInput: question,
      category: "general",
      deepMode: deepMode,
      trajectoryType: trajectoryType as "instant" | "30day" | "90day" | "yearly",
      parentPredictionId: currentPredictionId || undefined,
      depthLevel: depth,
    });
  };

  // Handle selecting a prediction from history
  const handleSelectPrediction = (prediction: any) => {
    // Clear current messages and load the selected prediction
    const userMessage: Message = {
      id: `msg-${Date.now()}-user`,
      type: "user",
      content: prediction.userInput,

      timestamp: new Date(prediction.createdAt)
    };

    const assistantMessage: Message = {
      id: `msg-${Date.now()}-assistant`,
      type: "assistant",
      content: prediction.predictionResult,

      timestamp: new Date(prediction.createdAt),
      // Show accuracy for all predictions (older ones without scores get 50 as fallback)
      accuracy: {
        score: prediction.confidenceScore || 50,
        label: (prediction.confidenceScore || 50) >= 75 ? "High" : (prediction.confidenceScore || 50) >= 50 ? "Moderate" : "Low",
      }
    };

    setMessages([userMessage, assistantMessage]);
    setCurrentPredictionId(prediction.id);
    setCurrentPrediction({
      id: prediction.id,
      userInput: prediction.userInput,
      predictionResult: prediction.predictionResult,
      shareToken: prediction.shareToken
    });
    toast.success("Prediction loaded from history");
  };

  // Handle new prediction
  const handleNewPrediction = () => {
    setMessages([]);
    setCurrentPredictionId(null);
    setCurrentPrediction(null);
    setRootQuestion(null); // Reset root question for new thread
    setConversationDepth(1); // Reset depth ladder for new thread
    setPendingFollowUp(null);
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

  // Handle profile update from ImproveAccuracyCard
  const handleProfileUpdated = () => {
    // Refetch subscription to update any cached user data
    refetchSubscription();
    // Optionally show a toast or update UI to indicate profile was updated
  };

  // Handle follow-up question selection - implements Depth Ladder
  const handleFollowUpSelect = (option: string, _originalQuestion: string) => {
    // Use the root question (first question in thread) to avoid nested context strings
    const questionContext = rootQuestion || _originalQuestion;
    
    // Calculate next depth level
    const nextDepth = Math.min(conversationDepth + 1, 4) as 1 | 2 | 3 | 4;
    
    // DEPTH LADDER: Free users hit paywall at Level 3
    if (nextDepth >= 3 && subscription?.tier === "free") {
      // Store the pending follow-up for after payment
      setPendingFollowUp(option);
      setShowDepthPaywall(true);
      return;
    }
    
    // Update depth level
    setConversationDepth(nextDepth);
    
    // Create a follow-up message that includes the user's answer
    const followUpMessage = `Regarding my question "${questionContext}": ${option}`;
    
    // Add user message for the follow-up (show just the option selected)
    const userMessage: Message = {
      id: `msg-${Date.now()}-user`,
      type: "user",
      content: option,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    
    // Submit as a follow-up prediction with depth level
    handleSubmitWithDepth(followUpMessage, [], false, "instant", nextDepth);
  };

  // Clarification handling removed - AI handles ambiguity naturally

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Check if composer should be disabled
  // Disable for: unauthenticated users after 3 messages, OR free users who hit their 3 prediction limit
  // Only block when data is loaded AND count >= 3 (prevents false blocking while loading)
  const hasReachedFreeLimit = subscription?.tier === "free" && isDataLoaded && actualPredictionCount >= 3;
  const isComposerDisabled = (!isAuthenticated && messages.length >= 3) || hasReachedFreeLimit;

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      {/* Desktop: Fixed Left Sidebar */}
      <div className={`hidden lg:block h-screen sticky top-0 transition-all duration-300 ${sidebarCollapsed ? 'w-16' : 'w-64'}`}>
        {isAuthenticated && (
          <UnifiedSidebar
            user={user || undefined}
            subscription={subscription}
            onSelectPrediction={handleSelectPrediction}
            currentPredictionId={null}
            isAuthenticated={isAuthenticated}
            onNewPrediction={handleNewPrediction}
            isCollapsed={sidebarCollapsed}
            onCollapsedChange={setSidebarCollapsed}
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
          onNewPrediction={handleNewPrediction}
          onSelectPrediction={handleSelectPrediction}
          currentPredictionId={currentPredictionId}
        />

        {/* Chat Area */}
        <main className="flex-1 overflow-y-auto pb-32 md:pb-40">
          <div className="container max-w-4xl pt-4 md:pt-8">
            <PredictionThread 
              messages={messages}
              onRefineRequest={handleRefineRequest}
              onFeedback={handleFeedback}
              onProfileUpdated={handleProfileUpdated}
              onFollowUpSelect={handleFollowUpSelect}
              isGenerating={isGenerating}
              currentPrediction={currentPrediction}
            />
            
            {/* Clarification popup removed - AI handles ambiguity naturally */}
            
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
          sidebarCollapsed={sidebarCollapsed}
          subscription={subscription}
          onUpgradeClick={() => setShowPostPredictionPaywall(true)}
          actualPredictionCount={actualPredictionCount}
          isDataLoaded={isDataLoaded}
        />

        {/* Modals */}
        {isAuthenticated && subscription && (
          <PostPredictionPaywall 
            open={showPostPredictionPaywall}
            onOpenChange={setShowPostPredictionPaywall}
            userTier={subscription.tier}
          />
        )}

        {showPremiumUnlock && (
          <PremiumUnlockModal
            open={showPremiumUnlock}
            onClose={() => setShowPremiumUnlock(false)}
            onComplete={() => setShowPremiumUnlock(false)}
          />
        )}

        {/* Depth Ladder Paywall - Shows at Level 3 for free users */}
        <DepthPaywall
          open={showDepthPaywall}
          onOpenChange={setShowDepthPaywall}
          onContinueFree={() => {
            // User chose to continue with free tier - process at surface level (Level 2)
            if (pendingFollowUp && rootQuestion) {
              // Keep at Level 2 (surface level) instead of advancing to Level 3
              const followUpMessage = `Regarding my question "${rootQuestion}": ${pendingFollowUp}`;
              
              // Add user message for the follow-up
              const userMessage: Message = {
                id: `msg-${Date.now()}-user`,
                type: "user",
                content: pendingFollowUp,
                timestamp: new Date()
              };
              setMessages(prev => [...prev, userMessage]);
              
              // Submit at Level 2 (surface level) - don't advance depth
              handleSubmitWithDepth(followUpMessage, [], false, "instant", 2);
            }
            setPendingFollowUp(null);
          }}
          rootQuestion={rootQuestion}
        />
      </div>
    </div>
  );
}
