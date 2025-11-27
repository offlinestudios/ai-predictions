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
import { Loader2, Home, History, Zap, Crown, ArrowLeft, Star, Paperclip, X } from "lucide-react";
import PredictionLoadingAnimation from "@/components/PredictionLoadingAnimation";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Streamdown } from "streamdown";

const TIER_ICONS = {
  free: Star,
  pro: Zap,
  premium: Crown,
};

export default function Dashboard() {
  const { user, loading: authLoading, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const [userInput, setUserInput] = useState("");
  const [category, setCategory] = useState<"career" | "love" | "finance" | "health" | "general">("general");
  const [prediction, setPrediction] = useState<string | null>(null);
  const [attachedFiles, setAttachedFiles] = useState<Array<{ name: string; url: string; preview?: string; type: string }>>([]);
  const [uploading, setUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [showDropZone, setShowDropZone] = useState(false);

  // Global drag detection
  useEffect(() => {
    let dragCounter = 0;

    const handleWindowDragEnter = (e: DragEvent) => {
      e.preventDefault();
      dragCounter++;
      if (e.dataTransfer?.types.includes('Files')) {
        setShowDropZone(true);
      }
    };

    const handleWindowDragLeave = (e: DragEvent) => {
      e.preventDefault();
      dragCounter--;
      if (dragCounter === 0) {
        setShowDropZone(false);
      }
    };

    const handleWindowDrop = (e: DragEvent) => {
      e.preventDefault();
      dragCounter = 0;
      setShowDropZone(false);
    };

    const handleWindowDragOver = (e: DragEvent) => {
      e.preventDefault();
    };

    window.addEventListener('dragenter', handleWindowDragEnter);
    window.addEventListener('dragleave', handleWindowDragLeave);
    window.addEventListener('drop', handleWindowDrop);
    window.addEventListener('dragover', handleWindowDragOver);

    return () => {
      window.removeEventListener('dragenter', handleWindowDragEnter);
      window.removeEventListener('dragleave', handleWindowDragLeave);
      window.removeEventListener('drop', handleWindowDrop);
      window.removeEventListener('dragover', handleWindowDragOver);
    };
  }, []);

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

  const upgradeMutation = trpc.subscription.upgrade.useMutation({
    onSuccess: () => {
      toast.success("Subscription upgraded successfully!");
      refetchSub();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      window.location.href = getLoginUrl();
    }
  }, [authLoading, isAuthenticated]);

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

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    await processFiles(files);
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
    generateMutation.mutate({ 
      userInput, 
      category,
      attachmentUrls: attachedFiles.length > 0 ? attachedFiles.map(f => f.url) : undefined,
    });
  };

  const usagePercent = subscription ? (subscription.usedToday / subscription.dailyLimit) * 100 : 0;
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
            <Link href="/history">
              <Button variant="ghost" size="sm">
                <History className="w-4 h-4 mr-2" />
                History
              </Button>
            </Link>
            <div className="text-sm text-muted-foreground">
              {user?.name || user?.email}
            </div>
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
                    <span className="text-muted-foreground">Daily Usage</span>
                    <span className="font-medium">
                      {subscription?.usedToday} / {subscription?.dailyLimit}
                    </span>
                  </div>
                  <Progress value={usagePercent} className="h-2" />
                </div>
                
                {subscription?.tier === "free" && (
                  <div className="space-y-2 pt-4 border-t border-border">
                    <p className="text-sm text-muted-foreground">Upgrade for more predictions</p>
                    <Button
                      onClick={() => upgradeMutation.mutate({ tier: "pro" })}
                      disabled={upgradeMutation.isPending}
                      className="w-full"
                      size="sm"
                    >
                      {upgradeMutation.isPending ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          <Zap className="w-4 h-4 mr-2" />
                          Upgrade to Pro
                        </>
                      )}
                    </Button>
                    <Button
                      onClick={() => upgradeMutation.mutate({ tier: "premium" })}
                      disabled={upgradeMutation.isPending}
                      variant="outline"
                      className="w-full"
                      size="sm"
                    >
                      {upgradeMutation.isPending ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          <Crown className="w-4 h-4 mr-2" />
                          Upgrade to Premium
                        </>
                      )}
                    </Button>
                  </div>
                )}

                {subscription?.tier === "pro" && (
                  <div className="space-y-2 pt-4 border-t border-border">
                    <p className="text-sm text-muted-foreground">Want more predictions?</p>
                    <Button
                      onClick={() => upgradeMutation.mutate({ tier: "premium" })}
                      disabled={upgradeMutation.isPending}
                      className="w-full"
                      size="sm"
                    >
                      {upgradeMutation.isPending ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          <Crown className="w-4 h-4 mr-2" />
                          Upgrade to Premium
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
                <div className="relative">
                  {/* Compact Attach Button (Default) */}
                  {!showDropZone && (
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
                        or drag and drop
                      </span>
                    </div>
                  )}

                  {/* Full Drop Zone Overlay (Only when dragging) */}
                  {showDropZone && (
                    <div
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm flex items-center justify-center"
                    >
                      <div className={`border-4 border-dashed rounded-2xl p-12 text-center transition-all max-w-2xl mx-auto ${
                        isDragging 
                          ? 'border-primary bg-primary/20 scale-105' 
                          : 'border-primary/50 bg-primary/10'
                      }`}>
                        <Paperclip className="w-16 h-16 mx-auto mb-4 text-primary" />
                        <h3 className="text-2xl font-semibold mb-2">Drop your files here</h3>
                        <p className="text-muted-foreground">
                          Images, PDFs, documents (max 10MB each)
                        </p>
                      </div>
                    </div>
                  )}
                  
                  <input
                    type="file"
                    id="file-upload-hidden"
                    className="hidden"
                    onChange={handleFileUpload}
                    multiple
                    accept="image/*,.pdf,.doc,.docx,.txt"
                    disabled={uploading}
                  />
                  
                  {/* Attached Files List with Thumbnails */}
                  {attachedFiles.length > 0 && (
                    <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {attachedFiles.map((file) => (
                        <div key={file.url} className="relative group rounded-lg border border-border overflow-hidden bg-muted/30">
                          {/* Thumbnail or Icon */}
                          <div className="aspect-square flex items-center justify-center bg-muted/50">
                            {file.preview ? (
                              <img 
                                src={file.preview} 
                                alt={file.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="text-center p-4">
                                {file.type.includes('pdf') ? (
                                  <svg className="w-12 h-12 mx-auto text-red-500" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M4 18h12V6h-4V2H4v16zm-2 1V0h12l4 4v16H2v-1z"/>
                                  </svg>
                                ) : (
                                  <svg className="w-12 h-12 mx-auto text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M4 2h8l4 4v12H4V2zm1 1v14h10V7h-3V3H5z"/>
                                  </svg>
                                )}
                              </div>
                            )}
                          </div>
                          
                          {/* File Name */}
                          <div className="p-2 bg-background/80 backdrop-blur-sm">
                            <p className="text-xs truncate">{file.name}</p>
                          </div>
                          
                          {/* Remove Button */}
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={() => handleRemoveFile(file.url)}
                            className="absolute top-1 right-1 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <Button
                  onClick={handleGenerate}
                  disabled={generateMutation.isPending || !userInput.trim()}
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
                      <img src="/globe-logo.png" alt="" className="w-4 h-4 mr-2 object-contain" />
                      Generate Prediction
                    </>
                  )}
                </Button>

                {/* Loading Animation */}
                {generateMutation.isPending && (
                  <div className="mt-6">
                    <PredictionLoadingAnimation />
                  </div>
                )}

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
