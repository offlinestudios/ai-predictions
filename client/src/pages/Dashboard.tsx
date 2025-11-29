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
import { Loader2, Home, History, Zap, Crown, ArrowLeft, Star, Paperclip, X, Sparkles, LogOut } from "lucide-react";
import PredictionLoadingAnimation from "@/components/PredictionLoadingAnimation";

import { useState, useEffect } from "react";
import { useClerk } from "@clerk/clerk-react";
import { toast } from "sonner";
import { Streamdown } from "streamdown";

const TIER_ICONS = {
  free: Star,
  pro: Zap,
  premium: Crown,
};

export default function Dashboard() {
  const { user, loading: authLoading, isAuthenticated } = useAuth();
  const { signOut } = useClerk();
  const [, navigate] = useLocation();
  const [userInput, setUserInput] = useState("");
  const [category, setCategory] = useState<"career" | "love" | "finance" | "health" | "general">("general");
  const [prediction, setPrediction] = useState<string | null>(null);
  const [attachedFiles, setAttachedFiles] = useState<Array<{ name: string; url: string; preview?: string; type: string }>>([]);
  const [uploading, setUploading] = useState(false);

  const { data: subscription, isLoading: subLoading, refetch: refetchSub } = trpc.subscription.getCurrent.useQuery(
    undefined,
    { enabled: isAuthenticated }
  );

  const uploadFileMutation = trpc.prediction.uploadFile.useMutation();

  const generateMutation = trpc.prediction.generate.useMutation({
    onSuccess: (data) => {
      setPrediction(data.prediction);
      toast.success(`Prediction generated! ${data.remainingToday} predictions remaining today.`);
      refetchSub();
      setAttachedFiles([]); // Clear attachments after generation
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

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      window.location.href = getLoginUrl();
    }
  }, [authLoading, isAuthenticated]);
  
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

  if (authLoading || !isAuthenticated) {
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
    
    // Check if free tier limit is reached
    if (subscription?.tier === "free" && subscription.totalUsed >= 3) {
      toast.error("You've reached your free tier limit. Please upgrade to continue.");
      return;
    }
    
    setPrediction(null);
    generateMutation.mutate({ 
      userInput, 
      category,
      attachmentUrls: attachedFiles.length > 0 ? attachedFiles.map(f => f.url) : undefined,
    });
  };
  
  const isGenerateDisabled = generateMutation.isPending || 
    (subscription?.tier === "free" && subscription.totalUsed >= 3);

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
            {subscription?.tier !== "free" && (
              <Link href="/history">
                <Button variant="ghost" size="sm">
                  <History className="w-4 h-4 mr-2" />
                  History
                </Button>
              </Link>
            )}
            <div className="text-sm text-muted-foreground">
              {user?.name || user?.email}
            </div>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => signOut(() => navigate("/"))}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
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
                  <CardTitle className="capitalize">{subscription?.tier} Plan</CardTitle>
                </div>
                <CardDescription>Your current subscription</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">
                      {subscription?.tier === "free" ? "Total Predictions" : "Daily Usage"}
                    </span>
                    <span className="font-medium">
                      {subscription?.tier === "free" 
                        ? `${subscription?.totalUsed} / 3`
                        : `${subscription?.usedToday} / ${subscription?.dailyLimit}`
                      }
                    </span>
                  </div>
                  <Progress value={usagePercent} className="h-2" />
                  {subscription?.tier === "free" && (
                    <p className="text-xs text-muted-foreground mt-2">
                      {3 - (subscription?.totalUsed || 0)} predictions remaining
                    </p>
                  )}
                </div>
                
                {subscription?.tier === "free" && (
                  <div className="space-y-2 pt-4 border-t border-border">
                    <p className="text-sm text-muted-foreground">
                      {subscription.totalUsed >= 3 
                        ? "🔒 You've used all 3 free predictions. Upgrade to continue!" 
                        : "Upgrade for unlimited predictions"}
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
                          Upgrade to Premium - $19.99/mo
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
                          Upgrade to Premium - $19.99/mo
                        </>
                      )}
                    </Button>
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



                {/* Prediction Result */}
                {prediction && !generateMutation.isPending && (
                  <div className="mt-6 p-6 bg-card/50 rounded-lg border border-border">
                    <div className="flex items-center gap-2 mb-4">
                      <img src="/globe-logo.png" alt="" className="w-6 h-6 object-contain" />
                      <h3 className="font-semibold text-lg">Your Prediction</h3>
                    </div>
                    <div className="prose prose-invert max-w-none">
                      <Streamdown>{prediction}</Streamdown>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
