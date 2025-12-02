import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import { Link, useLocation } from "wouter";
import { Loader2, Home, History, Zap, Crown, ArrowLeft, Star, Paperclip, X, Sparkles, LogOut, ThumbsUp, ThumbsDown, Settings, TrendingUp, BarChart3 } from "lucide-react";
import PredictionLoadingAnimation from "@/components/PredictionLoadingAnimation";
import UpgradeModal from "@/components/UpgradeModal";
import ShareButtons from "@/components/ShareButtons";
import { TierBadge } from "@/components/Badge";
import { PredictionLoader } from "@/components/PredictionLoader";
import { TrajectoryTimeline } from "@/components/TrajectoryTimeline";

import { useState, useEffect } from "react";
import { useClerk } from "@clerk/clerk-react";
import { toast } from "sonner";
import { Streamdown } from "streamdown";

const TIER_ICONS = {
  free: Star,
  plus: Zap,
  pro: Crown,
  premium: Crown,
};

export default function Dashboard() {
  const { user, loading: authLoading, isAuthenticated } = useAuth();
  const { signOut } = useClerk();
  const [, navigate] = useLocation();
  const [userInput, setUserInput] = useState("");
  const [category, setCategory] = useState<"career" | "love" | "finance" | "health" | "general">("general");
  const [prediction, setPrediction] = useState<string | null>(null);
  const [currentPredictionId, setCurrentPredictionId] = useState<number | null>(null);
  const [currentShareToken, setCurrentShareToken] = useState<string | null>(null);
  const [userFeedback, setUserFeedback] = useState<"like" | "dislike" | null>(null);
  const [attachedFiles, setAttachedFiles] = useState<Array<{ name: string; url: string; preview?: string; type: string }>>([]);
  const [uploading, setUploading] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [upgradeReason, setUpgradeReason] = useState<"limit_reached" | "feature_locked" | "approaching_limit">("limit_reached");
  const [deepMode, setDeepMode] = useState(false);
  const [confidenceScore, setConfidenceScore] = useState<number | null>(null);
  const [trajectoryType, setTrajectoryType] = useState<"instant" | "30day" | "90day" | "yearly">("instant");

  const { data: subscription, isLoading: subLoading, refetch: refetchSub } = trpc.subscription.getCurrent.useQuery(
    undefined,
    { enabled: isAuthenticated }
  );

  // Redirect to onboarding if user hasn't completed it
  useEffect(() => {
    if (!authLoading && isAuthenticated && user && !user.onboardingCompleted) {
      navigate("/onboarding");
    }
  }, [authLoading, isAuthenticated, user, navigate]);

  // Fetch latest prediction (for welcome prediction display)
  const { data: latestPredictions } = trpc.prediction.getHistory.useQuery(
    { limit: 1 },
    { enabled: isAuthenticated && !prediction } // Only fetch if no prediction is currently displayed
  );

  // Auto-display welcome prediction on first visit
  useEffect(() => {
    if (latestPredictions && latestPredictions.predictions.length > 0 && !prediction) {
      const latest = latestPredictions.predictions[0];
      setPrediction(latest.predictionResult);
      setCurrentPredictionId(latest.id);
      setCurrentShareToken(latest.shareToken || null);
      setUserFeedback(latest.userFeedback as "like" | "dislike" | null);
      setConfidenceScore(latest.confidenceScore || null);
      setTrajectoryType(latest.trajectoryType as "instant" | "30day" | "90day" | "yearly");
    }
  }, [latestPredictions, prediction]);

  const uploadFileMutation = trpc.prediction.uploadFile.useMutation();

  const feedbackMutation = trpc.prediction.submitFeedback.useMutation({
    onSuccess: () => {
      toast.success("Thank you for your feedback! This helps us personalize future predictions.");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const generateMutation = trpc.prediction.generate.useMutation({
    onSuccess: (data) => {
      setPrediction(data.prediction);
      setCurrentPredictionId(data.predictionId); // Store prediction ID for feedback
      setCurrentShareToken(data.shareToken); // Store share token for sharing
      setUserFeedback(null); // Reset feedback for new prediction
      setConfidenceScore(data.confidenceScore || null); // Store confidence score
      
      const modeText = data.deepMode ? " (Deep Mode)" : "";
      toast.success(`Prediction generated${modeText}! ${data.remainingToday} predictions remaining today.`);
      refetchSub();
      setAttachedFiles([]); // Clear attachments after generation
      
      // Show approaching limit modal for free users with 1 prediction left
      if (subscription?.tier === "free" && data.remainingToday === 1) {
        setTimeout(() => {
          setUpgradeReason("approaching_limit");
          setShowUpgradeModal(true);
        }, 2000); // Show after 2 seconds
      }
    },
    onError: (error) => {
      toast.error(error.message);
      // If deep mode was locked, show upgrade modal
      if (error.message.includes("Deep Prediction Mode")) {
        setUpgradeReason("feature_locked");
        setShowUpgradeModal(true);
      }
    },
  });

  // Anonymous prediction mutation for non-authenticated users
  const generateAnonymousMutation = trpc.prediction.generateAnonymous.useMutation({
    onSuccess: (data) => {
      setPrediction(data.prediction);
      setUserFeedback(null);
      
      // Track anonymous usage in localStorage
      const anonymousUsage = JSON.parse(localStorage.getItem('anonymousUsage') || '{"count": 0, "lastReset": 0}');
      const now = Date.now();
      const weekInMs = 7 * 24 * 60 * 60 * 1000;
      
      // Reset if more than a week has passed
      if (now - anonymousUsage.lastReset > weekInMs) {
        anonymousUsage.count = 1;
        anonymousUsage.lastReset = now;
      } else {
        anonymousUsage.count += 1;
      }
      
      localStorage.setItem('anonymousUsage', JSON.stringify(anonymousUsage));
      
      const remaining = 3 - anonymousUsage.count;
      toast.success(`Prediction generated! ${remaining} free predictions remaining this week.`);
      
      // Show sign-up prompt after first prediction
      if (anonymousUsage.count === 1) {
        setTimeout(() => {
          toast.info("Sign up to save your predictions and get more features!", { duration: 5000 });
        }, 3000);
      }
      
      // Show upgrade modal when limit is reached
      if (anonymousUsage.count >= 3) {
        setTimeout(() => {
          setUpgradeReason("limit_reached");
          setShowUpgradeModal(true);
        }, 2000);
      }
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const checkoutMutation = trpc.subscription.createCheckoutSession.useMutation({
    onSuccess: (data) => {
      if (data.checkoutUrl) {
        toast.info("Redirecting to checkout...");
        window.open(data.checkoutUrl, "_blank");
      }
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  
  const handleUpgrade = (tier: "pro" | "premium") => {
    checkoutMutation.mutate({ tier, interval: "month" });
  };

  // Allow anonymous users to access dashboard
  // useEffect(() => {
  //   if (!authLoading && !isAuthenticated) {
  //     window.location.href = getLoginUrl();
  //   }
  // }, [authLoading, isAuthenticated]);
  
  // Handle payment success/cancel from URL params
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const payment = params.get("payment");
    
    if (payment === "success") {
      toast.success("Payment successful! Your subscription has been upgraded.");
      refetchSub();
      // Clean up URL
      window.history.replaceState({}, "", "/dashboard");
    } else if (payment === "cancelled") {
      toast.info("Payment cancelled. You can upgrade anytime.");
      // Clean up URL
      window.history.replaceState({}, "", "/dashboard");
    }
  }, [refetchSub]);

  // Show loading only during auth check, not for anonymous users
  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const processFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        // Check file size (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
          toast.error(`File ${file.name} is too large (max 10MB)`);
          continue;
        }

        // Read file as base64
        const reader = new FileReader();
        const fileData = await new Promise<string>((resolve, reject) => {
          reader.onload = () => {
            const base64 = reader.result as string;
            const base64Data = base64.split(',')[1]; // Remove data:image/png;base64, prefix
            resolve(base64Data);
          };
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });

        // Create preview for images
        let preview: string | undefined;
        if (file.type.startsWith('image/')) {
          preview = URL.createObjectURL(file);
        }

        // Upload to server
        const result = await uploadFileMutation.mutateAsync({
          fileName: file.name,
          fileData,
          mimeType: file.type,
        });

        setAttachedFiles(prev => [...prev, { 
          name: result.fileName, 
          url: result.url,
          preview,
          type: file.type,
        }]);
        toast.success(`${file.name} uploaded successfully`);
      }
    } catch (error) {
      toast.error("Failed to upload file");
    } finally {
      setUploading(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    await processFiles(event.target.files);
    event.target.value = ''; // Reset input
  };

  const handleRemoveFile = (url: string) => {
    setAttachedFiles(prev => prev.filter(f => f.url !== url));
  };

  const handleGenerate = () => {
    if (!userInput.trim()) {
      toast.error("Please enter your question or topic");
      return;
    }
    
    setPrediction(null);
    
    // Use anonymous mutation for non-authenticated users
    if (!isAuthenticated) {
      // Check anonymous usage limit
      const anonymousUsage = JSON.parse(localStorage.getItem('anonymousUsage') || '{"count": 0, "lastReset": 0}');
      const now = Date.now();
      const weekInMs = 7 * 24 * 60 * 60 * 1000;
      
      // Reset if more than a week has passed
      if (now - anonymousUsage.lastReset > weekInMs) {
        anonymousUsage.count = 0;
        anonymousUsage.lastReset = now;
        localStorage.setItem('anonymousUsage', JSON.stringify(anonymousUsage));
      }
      
      // Check if limit is reached
      if (anonymousUsage.count >= 3) {
        setUpgradeReason("limit_reached");
        setShowUpgradeModal(true);
        return;
      }
      
      generateAnonymousMutation.mutate({ userInput, category });
      return;
    }
    
    // Check if free tier limit is reached for authenticated users
    if (subscription?.tier === "free" && subscription.totalUsed >= 3) {
      setUpgradeReason("limit_reached");
      setShowUpgradeModal(true);
      return;
    }
    
    generateMutation.mutate({ 
      userInput, 
      category,
      attachmentUrls: attachedFiles.length > 0 ? attachedFiles.map(f => f.url) : undefined,
      deepMode,
      trajectoryType: trajectoryType !== "instant" ? trajectoryType : undefined,
    });
  };
  
  // Calculate anonymous usage for disabled state
  const getAnonymousUsage = () => {
    if (isAuthenticated) return { count: 0, lastReset: 0 };
    const anonymousUsage = JSON.parse(localStorage.getItem('anonymousUsage') || '{"count": 0, "lastReset": 0}');
    const now = Date.now();
    const weekInMs = 7 * 24 * 60 * 60 * 1000;
    if (now - anonymousUsage.lastReset > weekInMs) {
      return { count: 0, lastReset: now };
    }
    return anonymousUsage;
  };
  
  const anonymousUsage = getAnonymousUsage();
  const isGenerateDisabled = generateMutation.isPending || generateAnonymousMutation.isPending ||
    (!isAuthenticated && anonymousUsage.count >= 3) ||
    (isAuthenticated && subscription?.tier === "free" && subscription.totalUsed >= 3);

  const usagePercent = subscription 
    ? subscription.tier === "free" 
      ? (subscription.totalUsed / 3) * 100 
      : (subscription.usedToday / subscription.dailyLimit) * 100
    : 0;
  const TierIcon = subscription ? TIER_ICONS[subscription.tier] : Star;

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border/50 backdrop-blur-sm sticky top-0 z-50 bg-background/80">
        <div className="container py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Home
              </Button>
            </Link>
             <div className="flex items-center gap-2">
            <img src="/globe-logo.png" alt="AI Predictions Logo" className="w-8 h-8 object-contain logo-pulse" />
              <h1 className="text-xl font-bold">Dashboard</h1>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                {subscription?.tier !== "free" && (
                  <Link href="/history">
                    <Button variant="ghost" size="sm">
                      <History className="w-4 h-4 mr-2" />
                      History
                    </Button>
                  </Link>
                )}
                <Link href="/account">
                  <Button variant="ghost" size="sm">
                    <Settings className="w-4 h-4 mr-2" />
                    Account
                  </Button>
                </Link>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">{user?.name || user?.email}</span>
                  {subscription && <TierBadge tier={subscription.tier} size="sm" />}
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => signOut(() => navigate("/"))}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              <Button asChild variant="default" size="sm">
                <a href={getLoginUrl()}>Sign In</a>
              </Button>
            )}
          </div>
        </div>
      </header>

      <div className="container py-8 max-w-6xl">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Subscription Status */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  {TierIcon && <TierIcon className="w-5 h-5 text-primary" />}
                  <CardTitle className="capitalize">
                    {isAuthenticated ? `${subscription?.tier} Plan` : "Free Trial"}
                  </CardTitle>
                </div>
                <CardDescription>
                  {isAuthenticated ? "Your current subscription" : "Try before you sign up"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">
                      {!isAuthenticated ? "Weekly Predictions" : subscription?.tier === "free" ? "Weekly Predictions" : "Daily Usage"}
                    </span>
                    <span className="font-medium">
                      {!isAuthenticated
                        ? `${anonymousUsage.count} / 3`
                        : subscription?.tier === "free" 
                          ? `${subscription?.totalUsed} / 3`
                          : `${subscription?.usedToday} / ${subscription?.dailyLimit}`
                      }
                    </span>
                  </div>
                  <Progress value={!isAuthenticated ? (anonymousUsage.count / 3) * 100 : usagePercent} className="h-2" />
                  {(!isAuthenticated || subscription?.tier === "free") && (
                    <p className="text-xs text-muted-foreground mt-2">
                      {!isAuthenticated 
                        ? `${3 - anonymousUsage.count} predictions remaining this week`
                        : `${3 - (subscription?.totalUsed || 0)} predictions remaining this week`
                      }
                    </p>
                  )}
                </div>
                
                {!isAuthenticated && (
                  <div className="space-y-2 pt-4 border-t border-border">
                    <p className="text-sm text-muted-foreground">
                      Sign up to save your predictions and get more features!
                    </p>
                    <Button asChild className="w-full" size="sm">
                      <a href={getLoginUrl()}>
                        <Sparkles className="w-4 h-4 mr-2" />
                        Sign Up Free
                      </a>
                    </Button>
                  </div>
                )}
                
                {isAuthenticated && subscription?.tier === "free" && (
                  <div className="space-y-2 pt-4 border-t border-border">
                    <p className="text-sm text-muted-foreground">
                      {subscription.totalUsed >= 3 
                        ? "🔒 You've used all 3 free predictions. Upgrade to continue!" 
                        : "Upgrade for more predictions and features"}
                    </p>
                    <Button
                      onClick={() => handleUpgrade("pro")}
                      disabled={checkoutMutation.isPending}
                      className="w-full"
                      size="sm"
                    >
                      {checkoutMutation.isPending ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          <Zap className="w-4 h-4 mr-2" />
                          Upgrade to Pro - $9.99/mo
                        </>
                      )}
                    </Button>
                    <Button
                      onClick={() => handleUpgrade("premium")}
                      disabled={checkoutMutation.isPending}
                      variant="outline"
                      className="w-full"
                      size="sm"
                    >
                      {checkoutMutation.isPending ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          <Crown className="w-4 h-4 mr-2" />
                          Upgrade to Premium - $29.99/mo
                        </>
                      )}
                    </Button>
                  </div>
                )}

                {subscription?.tier === "pro" && (
                  <div className="space-y-2 pt-4 border-t border-border">
                    <p className="text-sm text-muted-foreground">Want more predictions?</p>
                    <Button
                      onClick={() => handleUpgrade("premium")}
                      disabled={checkoutMutation.isPending}
                      className="w-full"
                      size="sm"
                    >
                      {checkoutMutation.isPending ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          <Crown className="w-4 h-4 mr-2" />
                          Upgrade to Premium - $29.99/mo
                        </>
                      )}
                    </Button>
                  </div>
                )}
                
                {subscription?.tier === "premium" && (
                  <div className="space-y-2 pt-4 border-t border-border">
                    <p className="text-sm text-muted-foreground">Premium Features</p>
                    <Link href="/analytics">
                      <Button variant="outline" className="w-full" size="sm">
                        <BarChart3 className="w-4 h-4 mr-2" />
                        View Analytics
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Prediction Generator */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Generate Prediction</CardTitle>
                <CardDescription>
                  Ask a question or describe what you'd like to know about
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Category</label>
                  <Select value={category} onValueChange={(val) => setCategory(val as any)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">General</SelectItem>
                      <SelectItem value="career">Career</SelectItem>
                      <SelectItem value="love">Love & Relationships</SelectItem>
                      <SelectItem value="finance">Finance</SelectItem>
                      <SelectItem value="health">Health & Wellness</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Your Question</label>
                  <Textarea
                    placeholder="What would you like to know? Be specific for better predictions..."
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    rows={4}
                    maxLength={1000}
                  />
                  <div className="text-xs text-muted-foreground mt-1 text-right">
                    {userInput.length} / 1000
                  </div>
                </div>

                {/* File Upload Section */}
                <div>
                  <div className="flex items-center gap-2">
                    <input
                      type="file"
                      id="file-upload"
                      className="hidden"
                      onChange={handleFileUpload}
                      multiple
                      accept="image/*,.pdf,.doc,.docx,.txt"
                      disabled={uploading}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => document.getElementById('file-upload')?.click()}
                      disabled={uploading}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <Paperclip className="w-4 h-4 mr-2" />
                      {uploading ? "Uploading..." : "Attach files"}
                    </Button>
                    <span className="text-xs text-muted-foreground">
                      Images, PDFs, documents (max 10MB each)
                    </span>
                  </div>
                  
                  {/* Attached Files List with Thumbnails */}
                  {attachedFiles.length > 0 && (
                    <div className="mt-4 space-y-2">
                      <p className="text-xs text-muted-foreground">Attached files ({attachedFiles.length})</p>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {attachedFiles.map((file) => (
                          <div key={file.url} className="relative group rounded-xl border-2 border-border/50 overflow-hidden bg-gradient-to-br from-muted/30 to-muted/10 hover:border-primary/50 transition-all duration-200 hover:shadow-lg hover:shadow-primary/10">
                            {/* Thumbnail or Icon */}
                            <div className="aspect-square flex items-center justify-center bg-gradient-to-br from-background/50 to-muted/30 p-1">
                              {file.preview ? (
                                <img 
                                  src={file.preview} 
                                  alt={file.name}
                                  className="w-full h-full object-cover rounded-lg"
                                />
                              ) : (
                                <div className="text-center p-6">
                                  {file.type.includes('pdf') ? (
                                    <div className="flex flex-col items-center gap-2">
                                      <svg className="w-16 h-16 text-red-500/80" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm-1 2l5 5h-5V4zM8 18v-1h8v1H8zm0-4v-1h8v1H8zm0-4v-1h5v1H8z"/>
                                      </svg>
                                      <span className="text-[10px] font-medium text-red-500/80">PDF</span>
                                    </div>
                                  ) : (
                                    <div className="flex flex-col items-center gap-2">
                                      <svg className="w-16 h-16 text-blue-500/80" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm-1 2l5 5h-5V4zm-2 10v-2h2v2h-2zm0 2v2h2v-2h-2z"/>
                                      </svg>
                                      <span className="text-[10px] font-medium text-blue-500/80">DOC</span>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                            
                            {/* File Name */}
                            <div className="p-2 bg-background/90 backdrop-blur-sm border-t border-border/30">
                              <p className="text-[11px] truncate font-medium text-foreground/80">{file.name}</p>
                            </div>
                            
                            {/* Remove Button */}
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              onClick={() => handleRemoveFile(file.url)}
                              className="absolute top-2 right-2 h-7 w-7 p-0 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg rounded-full"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Deep Prediction Mode Toggle (Pro/Premium only) */}
                {isAuthenticated && subscription && ['pro', 'premium'].includes(subscription.tier) && (
                  <div className="flex items-center justify-between p-4 rounded-lg border border-primary/20 bg-primary/5">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Zap className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">Deep Prediction Mode</p>
                        <p className="text-xs text-muted-foreground">Advanced AI analysis with confidence scores</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={deepMode}
                        onChange={(e) => setDeepMode(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-muted peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                )}

                {/* Trajectory Prediction Selection */}
                {isAuthenticated && subscription && (
                  <div className="space-y-3">
                    <label className="text-sm font-medium block">Prediction Timeframe</label>
                    <div className="grid grid-cols-2 gap-3">
                      {/* Instant Prediction - All tiers */}
                      <button
                        type="button"
                        onClick={() => setTrajectoryType("instant")}
                        className={`p-4 rounded-lg border-2 transition-all text-left ${
                          trajectoryType === "instant"
                            ? "border-primary bg-primary/10"
                            : "border-border bg-card hover:border-primary/50"
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <Sparkles className="w-4 h-4 text-primary" />
                          <span className="font-semibold text-sm">Instant</span>
                        </div>
                        <p className="text-xs text-muted-foreground">Quick prediction</p>
                      </button>

                      {/* 30-Day Trajectory - Plus and above */}
                      <button
                        type="button"
                        onClick={() => {
                          if (['plus', 'pro', 'premium'].includes(subscription.tier)) {
                            setTrajectoryType("30day");
                          } else {
                            setUpgradeReason("feature_locked");
                            setShowUpgradeModal(true);
                          }
                        }}
                        className={`p-4 rounded-lg border-2 transition-all text-left relative ${
                          trajectoryType === "30day"
                            ? "border-primary bg-primary/10"
                            : "border-border bg-card hover:border-primary/50"
                        } ${!['plus', 'pro', 'premium'].includes(subscription.tier) ? 'opacity-60' : ''}`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <TrendingUp className="w-4 h-4 text-purple-400" />
                          <span className="font-semibold text-sm">30-Day Path</span>
                          {!['plus', 'pro', 'premium'].includes(subscription.tier) && (
                            <span className="text-xs px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">Plus+</span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">Monthly forecast</p>
                      </button>

                      {/* 90-Day Trajectory - Pro and above */}
                      <button
                        type="button"
                        onClick={() => {
                          if (['pro', 'premium'].includes(subscription.tier)) {
                            setTrajectoryType("90day");
                          } else {
                            setUpgradeReason("feature_locked");
                            setShowUpgradeModal(true);
                          }
                        }}
                        className={`p-4 rounded-lg border-2 transition-all text-left relative ${
                          trajectoryType === "90day"
                            ? "border-primary bg-primary/10"
                            : "border-border bg-card hover:border-primary/50"
                        } ${!['pro', 'premium'].includes(subscription.tier) ? 'opacity-60' : ''}`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <TrendingUp className="w-4 h-4 text-blue-400" />
                          <span className="font-semibold text-sm">90-Day Journey</span>
                          {!['pro', 'premium'].includes(subscription.tier) && (
                            <span className="text-xs px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">Pro+</span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">Quarterly outlook</p>
                      </button>

                      {/* Yearly Trajectory - Pro and above */}
                      <button
                        type="button"
                        onClick={() => {
                          if (['pro', 'premium'].includes(subscription.tier)) {
                            setTrajectoryType("yearly");
                          } else {
                            setUpgradeReason("feature_locked");
                            setShowUpgradeModal(true);
                          }
                        }}
                        className={`p-4 rounded-lg border-2 transition-all text-left relative ${
                          trajectoryType === "yearly"
                            ? "border-primary bg-primary/10"
                            : "border-border bg-card hover:border-primary/50"
                        } ${!['pro', 'premium'].includes(subscription.tier) ? 'opacity-60' : ''}`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <TrendingUp className="w-4 h-4 text-amber-400" />
                          <span className="font-semibold text-sm">Yearly Vision</span>
                          {!['pro', 'premium'].includes(subscription.tier) && (
                            <span className="text-xs px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">Pro+</span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">Annual trajectory</p>
                      </button>
                    </div>
                  </div>
                )}

                <Button
                  onClick={handleGenerate}
                  disabled={isGenerateDisabled || !userInput.trim()}
                  className="w-full"
                  size="lg"
                >
                  {generateMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Generate Prediction
                    </>
                  )}
                </Button>



                {/* Loading Animation */}
                {(generateMutation.isPending || generateAnonymousMutation.isPending) && (
                  <PredictionLoader />
                )}

                {/* Prediction Result */}
                {prediction && !generateMutation.isPending && !generateAnonymousMutation.isPending && (
                  <div className="mt-6 p-6 bg-card/50 rounded-lg border border-border">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <img src="/globe-logo.png" alt="" className="w-6 h-6 object-contain" />
                        <h3 className="font-semibold text-lg">Your Prediction</h3>
                        {deepMode && (
                          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-primary/10 text-primary border border-primary/20 flex items-center gap-1">
                            <Zap className="w-3 h-3" />
                            Deep Mode
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground mr-2">Was this helpful?</span>
                        <Button
                          variant={userFeedback === "like" ? "default" : "outline"}
                          size="sm"
                          onClick={() => {
                            if (currentPredictionId) {
                              setUserFeedback("like");
                              feedbackMutation.mutate({ predictionId: currentPredictionId, feedback: "like" });
                            }
                          }}
                          disabled={feedbackMutation.isPending || !currentPredictionId}
                          className="h-8 w-8 p-0"
                        >
                          <ThumbsUp className="w-4 h-4" />
                        </Button>
                        <Button
                          variant={userFeedback === "dislike" ? "default" : "outline"}
                          size="sm"
                          onClick={() => {
                            if (currentPredictionId) {
                              setUserFeedback("dislike");
                              feedbackMutation.mutate({ predictionId: currentPredictionId, feedback: "dislike" });
                            }
                          }}
                          disabled={feedbackMutation.isPending || !currentPredictionId}
                          className="h-8 w-8 p-0"
                        >
                          <ThumbsDown className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <TrajectoryTimeline 
                      predictionText={prediction}
                      trajectoryType={trajectoryType}
                      confidenceScore={confidenceScore || undefined}
                    />
                    
                    {/* Share Buttons */}
                    {currentShareToken && (
                      <div className="border-t border-border pt-4">
                        <ShareButtons 
                          shareToken={currentShareToken}
                          predictionText={prediction}
                          category={category}
                        />
                      </div>
                    )}
                  </div>
                )}             </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      {/* Upgrade Modal */}
      <UpgradeModal 
        open={showUpgradeModal} 
        onOpenChange={setShowUpgradeModal}
        reason={upgradeReason}
        remainingPredictions={subscription?.tier === "free" ? (3 - (subscription?.totalUsed || 0)) : 0}
      />
    </div>
  );
}
