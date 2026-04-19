import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import {
  Loader2, Home, ArrowLeft, Star, Zap, Crown, ExternalLink, CreditCard,
  Calendar, TrendingUp, Sparkles, Brain, Settings, Upload, FileText,
  CheckCircle, AlertTriangle, RefreshCw, ClipboardList, User, Briefcase,
  DollarSign, Heart, Activity, Download, Eye,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import PsycheProfileCard from "@/components/PsycheProfileCard";
import { toast } from "sonner";
import {
  CAREER_QUESTIONS,
  MONEY_QUESTIONS,
  LOVE_QUESTIONS,
  HEALTH_QUESTIONS,
} from "@/lib/categoryQuestions";

const TIER_INFO = {
  free: {
    icon: Star,
    name: "Free Plan",
    color: "text-gray-400",
    bgColor: "bg-gray-500/10",
    limit: "3 predictions per week",
  },
  plus: {
    icon: Zap,
    name: "Plus Plan",
    color: "text-purple-400",
    bgColor: "bg-purple-500/10",
    limit: "Unlimited predictions",
  },
  pro: {
    icon: Crown,
    name: "Pro Plan",
    color: "text-yellow-400",
    bgColor: "bg-yellow-500/10",
    limit: "Unlimited + 90-day forecasts",
  },
  premium: {
    icon: Crown,
    name: "Premium Plan",
    color: "text-purple-400",
    bgColor: "bg-purple-500/10",
    limit: "Unlimited predictions",
  },
};

// Helper to look up a label from a list of questions by answerId
function getLabelForAnswer(
  questions: { id: string; question: string; options: { id: string; label: string }[] }[],
  questionId: string,
  answerId: string
): { question: string; answer: string } | null {
  const q = questions.find((q) => q.id === questionId);
  if (!q) return null;
  const opt = q.options.find((o) => o.id === answerId);
  return { question: q.question, answer: opt?.label ?? answerId };
}

// Survey section component
function SurveySection({
  title,
  icon: Icon,
  color,
  items,
}: {
  title: string;
  icon: React.ElementType;
  color: string;
  items: { question: string; answer: string }[];
}) {
  if (!items.length) return null;
  return (
    <div className="space-y-3">
      <div className={`flex items-center gap-2 font-semibold text-sm uppercase tracking-wide ${color}`}>
        <Icon className="w-4 h-4" />
        {title}
      </div>
      <div className="space-y-2 pl-1">
        {items.map((item, i) => (
          <div key={i} className="p-3 rounded-lg border border-border bg-muted/20">
            <p className="text-xs text-muted-foreground mb-1">{item.question}</p>
            <p className="text-sm font-medium">{item.answer}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// Resume review markdown renderer (simple)
function ReviewContent({ content }: { content: string }) {
  const sections = content.split(/\n(?=##\s)/);
  return (
    <div className="space-y-4">
      {sections.map((section, i) => {
        const lines = section.trim().split("\n");
        const heading = lines[0]?.replace(/^##\s*/, "").trim();
        const body = lines.slice(1).join("\n").trim();
        if (!heading) return null;
        return (
          <div key={i} className="space-y-2">
            <h4 className="font-semibold text-sm text-primary">{heading}</h4>
            <div className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
              {body}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function Account() {
  const { user, loading: authLoading, isAuthenticated } = useAuth();
  const utils = trpc.useUtils();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const { data: subscription, isLoading: subLoading } = trpc.subscription.getCurrent.useQuery(
    undefined,
    { enabled: isAuthenticated }
  );

  const { data: surveyAnswers, isLoading: surveyLoading } = trpc.user.getSurveyAnswers.useQuery(
    undefined,
    { enabled: isAuthenticated }
  );

  const { data: resumeInfo, isLoading: resumeInfoLoading } = trpc.user.getResumeInfo.useQuery(
    undefined,
    { enabled: isAuthenticated }
  );

  const portalMutation = trpc.subscription.createPortalSession.useMutation({
    onSuccess: (data) => {
      if (data.portalUrl) {
        window.open(data.portalUrl, "_blank");
      }
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const uploadResumeMutation = trpc.user.uploadResume.useMutation({
    onSuccess: () => {
      toast.success("Resume uploaded successfully!");
      utils.user.getResumeInfo.invalidate();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to upload resume.");
    },
  });

  const reviewResumeMutation = trpc.user.reviewResume.useMutation({
    onSuccess: () => {
      toast.success("AI review complete!");
      utils.user.getResumeInfo.invalidate();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to review resume.");
    },
  });

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      window.location.href = getLoginUrl();
    }
  }, [authLoading, isAuthenticated]);

  const handleFileSelect = async (file: File) => {
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain",
    ];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Please upload a PDF, Word document (.doc/.docx), or text file.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be under 5MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = (reader.result as string).split(",")[1];
      uploadResumeMutation.mutate({
        fileName: file.name,
        fileData: base64,
        mimeType: file.type,
      });
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  };

  if (authLoading || !isAuthenticated || subLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const tierInfo = subscription ? TIER_INFO[subscription.tier] : TIER_INFO.free;
  const TierIcon = tierInfo.icon;

  // Build survey answer items from profile data
  const basicItems: { question: string; answer: string }[] = [];
  if (surveyAnswers?.nickname)
    basicItems.push({ question: "What should we call you?", answer: surveyAnswers.nickname });
  if (surveyAnswers?.gender)
    basicItems.push({ question: "Gender", answer: surveyAnswers.gender });
  if (surveyAnswers?.relationshipStatus)
    basicItems.push({ question: "Relationship status", answer: surveyAnswers.relationshipStatus });
  if (surveyAnswers?.ageRange)
    basicItems.push({ question: "Age range", answer: surveyAnswers.ageRange });
  if (surveyAnswers?.location)
    basicItems.push({ question: "Location", answer: surveyAnswers.location });
  if (surveyAnswers?.industry)
    basicItems.push({ question: "Industry", answer: surveyAnswers.industry });
  if (surveyAnswers?.incomeRange)
    basicItems.push({ question: "Income range", answer: surveyAnswers.incomeRange });
  if (surveyAnswers?.interests?.length)
    basicItems.push({ question: "Primary interests", answer: surveyAnswers.interests.join(", ") });
  if (surveyAnswers?.majorTransition)
    basicItems.push({
      question: "Going through a major life transition?",
      answer: surveyAnswers.majorTransition
        ? `Yes${surveyAnswers.transitionType ? ` — ${surveyAnswers.transitionType}` : ""}`
        : "No",
    });

  // Career profile items
  const careerItems: { question: string; answer: string }[] = [];
  if (surveyAnswers?.careerProfile) {
    for (const [key, val] of Object.entries(surveyAnswers.careerProfile)) {
      const found = getLabelForAnswer(CAREER_QUESTIONS as any, key, val);
      if (found) careerItems.push(found);
    }
  }

  // Money profile items
  const moneyItems: { question: string; answer: string }[] = [];
  if (surveyAnswers?.moneyProfile) {
    for (const [key, val] of Object.entries(surveyAnswers.moneyProfile)) {
      const found = getLabelForAnswer(MONEY_QUESTIONS as any, key, val);
      if (found) moneyItems.push(found);
    }
  }

  // Love profile items
  const loveItems: { question: string; answer: string }[] = [];
  if (surveyAnswers?.loveProfile) {
    for (const [key, val] of Object.entries(surveyAnswers.loveProfile)) {
      const found = getLabelForAnswer(LOVE_QUESTIONS as any, key, val);
      if (found) loveItems.push(found);
    }
  }

  // Health profile items
  const healthItems: { question: string; answer: string }[] = [];
  if (surveyAnswers?.healthProfile) {
    for (const [key, val] of Object.entries(surveyAnswers.healthProfile)) {
      const found = getLabelForAnswer(HEALTH_QUESTIONS as any, key, val);
      if (found) healthItems.push(found);
    }
  }

  const hasAnySurveyData =
    basicItems.length > 0 ||
    careerItems.length > 0 ||
    moneyItems.length > 0 ||
    loveItems.length > 0 ||
    healthItems.length > 0;

  const hasResume = !!resumeInfo?.resumeUrl;
  const hasReview = !!resumeInfo?.resumeReviewResult;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/40 bg-card/30 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Link href="/dashboard">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <Settings className="w-6 h-6 text-primary" />
            <h1 className="text-lg font-semibold">Account Settings</h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-6">
          {/* User Profile Card */}
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Your account details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                  <span className="text-2xl font-bold text-primary">
                    {user?.name?.charAt(0).toUpperCase() ||
                      user?.email?.charAt(0).toUpperCase() ||
                      "U"}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-lg">{user?.name || "User"}</p>
                  <p className="text-sm text-muted-foreground">{user?.email}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Psyche Profile Card */}
          <PsycheProfileCard />

          {/* ─── Survey Answers Card ─── */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <ClipboardList className="w-5 h-5 text-primary" />
                <div>
                  <CardTitle>Your Survey Answers</CardTitle>
                  <CardDescription>
                    Responses you provided during onboarding — used to personalise your predictions
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {surveyLoading ? (
                <div className="flex items-center gap-2 text-muted-foreground py-4">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm">Loading your answers…</span>
                </div>
              ) : !hasAnySurveyData ? (
                <div className="text-center py-8 space-y-3">
                  <ClipboardList className="w-10 h-10 text-muted-foreground mx-auto opacity-40" />
                  <p className="text-sm text-muted-foreground">
                    No survey answers found yet. Complete the onboarding to see your answers here.
                  </p>
                  <Link href="/onboarding">
                    <Button variant="outline" size="sm">
                      <Sparkles className="w-4 h-4 mr-2" />
                      Complete Onboarding
                    </Button>
                  </Link>
                </div>
              ) : (
                <ScrollArea className="max-h-[520px] pr-2">
                  <div className="space-y-6">
                    {basicItems.length > 0 && (
                      <SurveySection
                        title="About You"
                        icon={User}
                        color="text-blue-400"
                        items={basicItems}
                      />
                    )}
                    {careerItems.length > 0 && (
                      <>
                        <Separator />
                        <SurveySection
                          title="Career & Success"
                          icon={Briefcase}
                          color="text-orange-400"
                          items={careerItems}
                        />
                      </>
                    )}
                    {moneyItems.length > 0 && (
                      <>
                        <Separator />
                        <SurveySection
                          title="Money & Finance"
                          icon={DollarSign}
                          color="text-green-400"
                          items={moneyItems}
                        />
                      </>
                    )}
                    {loveItems.length > 0 && (
                      <>
                        <Separator />
                        <SurveySection
                          title="Love & Relationships"
                          icon={Heart}
                          color="text-pink-400"
                          items={loveItems}
                        />
                      </>
                    )}
                    {healthItems.length > 0 && (
                      <>
                        <Separator />
                        <SurveySection
                          title="Health & Wellness"
                          icon={Activity}
                          color="text-teal-400"
                          items={healthItems}
                        />
                      </>
                    )}
                  </div>
                </ScrollArea>
              )}
            </CardContent>
          </Card>

          {/* ─── Resume Upload & AI Review Card ─── */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                <div>
                  <CardTitle>Resume Upload &amp; AI Review</CardTitle>
                  <CardDescription>
                    Upload your resume to match it against your profile and get an AI consistency
                    analysis
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-5">
              {/* Upload zone */}
              <div
                className={`relative border-2 border-dashed rounded-xl p-6 text-center transition-colors cursor-pointer ${
                  isDragging
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50 hover:bg-muted/20"
                }`}
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  accept=".pdf,.doc,.docx,.txt"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileSelect(file);
                    e.target.value = "";
                  }}
                />
                {uploadResumeMutation.isPending ? (
                  <div className="flex flex-col items-center gap-2">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    <p className="text-sm text-muted-foreground">Uploading resume…</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <Upload className="w-8 h-8 text-muted-foreground" />
                    <p className="text-sm font-medium">
                      {hasResume ? "Replace resume" : "Upload your resume"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Drag &amp; drop or click — PDF, Word, or TXT · Max 5 MB
                    </p>
                  </div>
                )}
              </div>

              {/* Current resume info */}
              {resumeInfoLoading ? (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm">Loading resume info…</span>
                </div>
              ) : hasResume ? (
                <div className="space-y-4">
                  {/* File info bar */}
                  <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/30">
                    <div className="flex items-center gap-3 min-w-0">
                      <FileText className="w-5 h-5 text-primary shrink-0" />
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">
                          {resumeInfo.resumeFileName || "resume"}
                        </p>
                        {resumeInfo.resumeUploadedAt && (
                          <p className="text-xs text-muted-foreground">
                            Uploaded{" "}
                            {new Date(resumeInfo.resumeUploadedAt).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <a
                        href={resumeInfo.resumeUrl!}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Button variant="ghost" size="sm" className="h-8 px-2">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </a>
                      <a
                        href={resumeInfo.resumeUrl!}
                        download={resumeInfo.resumeFileName || "resume"}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Button variant="ghost" size="sm" className="h-8 px-2">
                          <Download className="w-4 h-4" />
                        </Button>
                      </a>
                    </div>
                  </div>

                  {/* AI Review button */}
                  <Button
                    onClick={() => reviewResumeMutation.mutate()}
                    disabled={reviewResumeMutation.isPending}
                    className="w-full"
                    variant={hasReview ? "outline" : "default"}
                  >
                    {reviewResumeMutation.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Analysing resume…
                      </>
                    ) : hasReview ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Re-run AI Review
                      </>
                    ) : (
                      <>
                        <Brain className="w-4 h-4 mr-2" />
                        Run AI Consistency Review
                      </>
                    )}
                  </Button>

                  {/* Review result */}
                  {hasReview && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <span className="text-sm font-medium">AI Review Complete</span>
                        {resumeInfo.resumeReviewedAt && (
                          <span className="text-xs text-muted-foreground ml-auto">
                            {new Date(resumeInfo.resumeReviewedAt).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </span>
                        )}
                      </div>
                      <div className="p-4 rounded-xl border border-border bg-muted/20">
                        <ScrollArea className="max-h-[480px] pr-2">
                          <ReviewContent content={resumeInfo.resumeReviewResult!} />
                        </ScrollArea>
                      </div>
                    </div>
                  )}

                  {/* No review yet hint */}
                  {!hasReview && !reviewResumeMutation.isPending && (
                    <Alert>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertTitle>No review yet</AlertTitle>
                      <AlertDescription>
                        Click "Run AI Consistency Review" to have the AI compare your resume against
                        your profile answers and flag any inconsistencies.
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center">
                  Upload a resume above to enable AI-powered consistency review.
                </p>
              )}
            </CardContent>
          </Card>

          {/* Current Subscription Card */}
          <Card>
            <CardHeader>
              <CardTitle>Current Subscription</CardTitle>
              <CardDescription>Manage your subscription and billing</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Tier Badge */}
              <div className="flex items-center justify-between p-4 rounded-lg border border-border bg-card/50">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-full ${tierInfo.bgColor}`}>
                    <TierIcon className={`w-6 h-6 ${tierInfo.color}`} />
                  </div>
                  <div>
                    <p className="font-semibold text-lg">{tierInfo.name}</p>
                    <p className="text-sm text-muted-foreground">{tierInfo.limit}</p>
                  </div>
                </div>
                <Badge
                  variant={subscription?.tier === "free" ? "secondary" : "default"}
                  className="text-sm px-3 py-1"
                >
                  {subscription?.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>

              {/* Usage Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-lg border border-border bg-muted/30">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-4 h-4 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">
                      Total Used
                    </p>
                  </div>
                  <p className="text-2xl font-bold">{subscription?.totalUsed || 0}</p>
                  <p className="text-xs text-muted-foreground mt-1">All-time predictions</p>
                </div>
                <div className="p-4 rounded-lg border border-border bg-muted/30">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">Today</p>
                  </div>
                  <p className="text-2xl font-bold">
                    {subscription?.tier === "free"
                      ? `${subscription?.totalUsed || 0} / 3`
                      : subscription?.dailyLimit === -1
                      ? `${subscription?.usedToday || 0}`
                      : `${subscription?.usedToday || 0} / ${subscription?.dailyLimit || 0}`}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {subscription?.tier === "free" ? "Lifetime limit" : "Daily usage"}
                  </p>
                </div>
                <div className="p-4 rounded-lg border border-border bg-muted/30">
                  <div className="flex items-center gap-2 mb-2">
                    <Star className="w-4 h-4 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">Tier</p>
                  </div>
                  <p className="text-2xl font-bold capitalize">{subscription?.tier || "Free"}</p>
                  <p className="text-xs text-muted-foreground mt-1">Current plan</p>
                </div>
              </div>

              {/* Manage Subscription Button */}
              {subscription?.tier !== "free" && (
                <div className="pt-4 border-t border-border">
                  <Button
                    onClick={() => portalMutation.mutate()}
                    disabled={portalMutation.isPending}
                    className="w-full"
                    size="lg"
                  >
                    {portalMutation.isPending ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <CreditCard className="w-4 h-4 mr-2" />
                    )}
                    Manage Subscription & Billing
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </Button>
                  <p className="text-xs text-muted-foreground text-center mt-2">
                    Update payment method, view invoices, or cancel subscription
                  </p>
                </div>
              )}

              {/* Upgrade CTA for Free Users */}
              {subscription?.tier === "free" && (
                <div className="pt-4 border-t border-border">
                  <div className="p-4 rounded-lg bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20">
                    <p className="font-semibold mb-2">Upgrade for unlimited predictions</p>
                    <p className="text-sm text-muted-foreground mb-4">
                      Get access to daily predictions, full history, and personalized insights.
                    </p>
                    <Link href="/pricing">
                      <Button className="w-full">
                        <Zap className="w-4 h-4 mr-2" />
                        View Plans
                      </Button>
                    </Link>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Account Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Account Actions</CardTitle>
              <CardDescription>Manage your account settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/history">
                <Button variant="outline" className="w-full justify-start">
                  <Calendar className="w-4 h-4 mr-2" />
                  View Prediction History
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="outline" className="w-full justify-start">
                  <Home className="w-4 h-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
