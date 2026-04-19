/**
 * EmployerDashboard — Predicsure HR Platform
 *
 * Full employer-facing dashboard with:
 *  - Candidate Pipeline (real DB data)
 *  - Candidate Profile Modal (survey answers, psyche profile, resume upload, AI review)
 *  - Test candidate removal
 *  - Invite Management tab
 *  - Roles & Matching tab
 *  - Interviews tab
 */

import React, { useState, useRef, useCallback } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import { toast } from "sonner";
import {
  Users,
  Mail,
  Briefcase,
  Calendar,
  Eye,
  Trash2,
  ChevronDown,
  AlertTriangle,
  CheckCircle,
  Clock,
  Search,
  Send,
  Upload,
  FileText,
  X,
  Loader2,
  RefreshCw,
  Shield,
  Brain,
  TrendingUp,
  Star,
  LogOut,
  Settings,
  ChevronRight,
  Download,
  Sparkles,
  UserX,
  BarChart2,
  Activity,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  CAREER_QUESTIONS,
  MONEY_QUESTIONS,
  LOVE_QUESTIONS,
  HEALTH_QUESTIONS,
} from "@/lib/categoryQuestions";

// ─── Types ────────────────────────────────────────────────────────────────────

type RiskLevel = "High" | "Medium" | "Low";
type StatusType = "Completed" | "In Progress" | "Pending";
type RecommendationType = "Proceed" | "Review" | "Caution" | "Pending";
type TabType = "pipeline" | "invites" | "roles" | "interviews";

interface Candidate {
  id: number;
  name: string;
  email: string;
  position: string;
  psycheType: string | null;
  psycheDisplayName: string | null;
  riskLevel: RiskLevel;
  aiRecommendation: RecommendationType;
  status: StatusType;
  onboardingCompleted: boolean;
  predictionCount: number;
  hasResume: boolean;
  resumeFileName: string | null;
  resumeReviewedAt: Date | string | null;
  createdAt: Date | string;
  lastSignedIn: Date | string;
  loginMethod: string | null;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const RISK_COLORS: Record<RiskLevel, string> = {
  High: "bg-red-500/20 text-red-400 border border-red-500/30",
  Medium: "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30",
  Low: "bg-green-500/20 text-green-400 border border-green-500/30",
};

const RECOMMENDATION_COLORS: Record<RecommendationType, string> = {
  Proceed: "text-green-400",
  Review: "text-yellow-400",
  Caution: "text-red-400",
  Pending: "text-gray-400",
};

const STATUS_ICONS: Record<StatusType, React.ReactElement> = {
  Completed: <CheckCircle className="w-4 h-4 text-green-400" />,
  "In Progress": <Clock className="w-4 h-4 text-blue-400" />,
  Pending: <Clock className="w-4 h-4 text-gray-400" />,
};

function formatDate(d: Date | string | null | undefined): string {
  if (!d) return "—";
  const date = new Date(d);
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function timeAgo(d: Date | string | null | undefined): string {
  if (!d) return "—";
  const diff = Date.now() - new Date(d).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
  if (days < 365) return `${Math.floor(days / 30)} months ago`;
  return `${Math.floor(days / 365)} years ago`;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function FilterDropdown({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#1e2433] border border-white/10 text-sm text-gray-200 hover:bg-[#252b3b] transition-colors"
      >
        {value}
        <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-1 z-50 min-w-[160px] rounded-md bg-[#1e2433] border border-white/10 shadow-xl">
          {options.map((opt) => (
            <button
              key={opt}
              onClick={() => { onChange(opt); setOpen(false); }}
              className={`w-full text-left px-3 py-2 text-sm hover:bg-white/5 transition-colors ${value === opt ? "text-[#6c63ff]" : "text-gray-200"}`}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Survey Answers Section ───────────────────────────────────────────────────

function SurveyAnswersSection({ surveyAnswers, onboardingResponses }: {
  surveyAnswers: Record<string, any> | null;
  onboardingResponses: Array<{ questionId: number; questionText: string; selectedOption: string; answerText: string }>;
}) {
  if (!surveyAnswers) {
    return (
      <div className="text-center py-8 text-gray-400">
        <Brain className="w-8 h-8 mx-auto mb-2 opacity-50" />
        <p className="text-sm">No survey data available</p>
        <p className="text-xs mt-1">Candidate has not completed onboarding</p>
      </div>
    );
  }

  // Helper to get label from question options
  function getLabel(questions: typeof CAREER_QUESTIONS, questionId: string, valueId: string): string {
    const q = questions.find((q) => q.id === questionId);
    if (!q) return valueId;
    const opt = q.options.find((o) => o.id === valueId);
    return opt?.label || valueId;
  }

  const sections = [
    {
      title: "About the Candidate",
      color: "border-blue-500/30 bg-blue-500/5",
      titleColor: "text-blue-400",
      items: [
        surveyAnswers.nickname && { q: "Preferred Name", a: surveyAnswers.nickname },
        surveyAnswers.gender && { q: "Gender", a: surveyAnswers.gender },
        surveyAnswers.ageRange && { q: "Age Range", a: surveyAnswers.ageRange },
        surveyAnswers.relationshipStatus && { q: "Relationship Status", a: surveyAnswers.relationshipStatus },
        surveyAnswers.location && { q: "Location", a: surveyAnswers.location },
        surveyAnswers.industry && { q: "Industry", a: surveyAnswers.industry },
        surveyAnswers.incomeRange && { q: "Income Range", a: surveyAnswers.incomeRange },
        surveyAnswers.interests?.length > 0 && { q: "Interests", a: surveyAnswers.interests.join(", ") },
        surveyAnswers.majorTransition && { q: "Major Life Transition", a: surveyAnswers.transitionType || "Yes" },
      ].filter(Boolean) as Array<{ q: string; a: string }>,
    },
    {
      title: "Career & Success",
      color: "border-orange-500/30 bg-orange-500/5",
      titleColor: "text-orange-400",
      items: surveyAnswers.careerProfile
        ? Object.entries(surveyAnswers.careerProfile).map(([k, v]) => ({
            q: CAREER_QUESTIONS.find((q) => q.id === k)?.question || k,
            a: getLabel(CAREER_QUESTIONS, k, v as string),
          }))
        : [],
    },
    {
      title: "Money & Finance",
      color: "border-green-500/30 bg-green-500/5",
      titleColor: "text-green-400",
      items: surveyAnswers.moneyProfile
        ? Object.entries(surveyAnswers.moneyProfile).map(([k, v]) => ({
            q: MONEY_QUESTIONS.find((q) => q.id === k)?.question || k,
            a: getLabel(MONEY_QUESTIONS, k, v as string),
          }))
        : [],
    },
    {
      title: "Love & Relationships",
      color: "border-pink-500/30 bg-pink-500/5",
      titleColor: "text-pink-400",
      items: surveyAnswers.loveProfile
        ? Object.entries(surveyAnswers.loveProfile).map(([k, v]) => ({
            q: LOVE_QUESTIONS.find((q) => q.id === k)?.question || k,
            a: getLabel(LOVE_QUESTIONS, k, v as string),
          }))
        : [],
    },
    {
      title: "Health & Wellness",
      color: "border-teal-500/30 bg-teal-500/5",
      titleColor: "text-teal-400",
      items: surveyAnswers.healthProfile
        ? Object.entries(surveyAnswers.healthProfile).map(([k, v]) => ({
            q: HEALTH_QUESTIONS.find((q) => q.id === k)?.question || k,
            a: getLabel(HEALTH_QUESTIONS, k, v as string),
          }))
        : [],
    },
  ];

  const hasAnySurveyData = sections.some((s) => s.items.length > 0);
  const hasLegacyResponses = onboardingResponses && onboardingResponses.length > 0;

  if (!hasAnySurveyData && !hasLegacyResponses) {
    return (
      <div className="text-center py-8 text-gray-400">
        <Brain className="w-8 h-8 mx-auto mb-2 opacity-50" />
        <p className="text-sm">Survey answers not yet available</p>
        <p className="text-xs mt-1">Candidate may still be completing their profile</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {sections.map((section) =>
        section.items.length > 0 ? (
          <div key={section.title} className={`rounded-lg border p-4 ${section.color}`}>
            <h4 className={`text-sm font-semibold mb-3 ${section.titleColor}`}>{section.title}</h4>
            <div className="space-y-2">
              {section.items.map((item, i) => (
                <div key={i} className="flex flex-col gap-0.5">
                  <span className="text-xs text-gray-400">{item.q}</span>
                  <span className="text-sm text-gray-100 font-medium">{item.a}</span>
                </div>
              ))}
            </div>
          </div>
        ) : null
      )}

      {/* Legacy onboarding responses */}
      {hasLegacyResponses && (
        <div className="rounded-lg border border-purple-500/30 bg-purple-500/5 p-4">
          <h4 className="text-sm font-semibold mb-3 text-purple-400">Psyche Assessment Responses</h4>
          <div className="space-y-3">
            {onboardingResponses.map((r) => (
              <div key={r.questionId} className="flex flex-col gap-0.5">
                <span className="text-xs text-gray-400">Q{r.questionId}: {r.questionText}</span>
                <span className="text-sm text-gray-100 font-medium">{r.selectedOption}. {r.answerText}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Resume Upload Section ────────────────────────────────────────────────────

function ResumeSection({ candidate, onResumeUploaded, onReviewComplete }: {
  candidate: any;
  onResumeUploaded: () => void;
  onReviewComplete: () => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [reviewExpanded, setReviewExpanded] = useState(false);

  const uploadMutation = trpc.employer.uploadCandidateResume.useMutation({
    onSuccess: () => {
      toast.success("Resume uploaded successfully");
      onResumeUploaded();
    },
    onError: (err) => toast.error(err.message),
  });

  const reviewMutation = trpc.employer.reviewCandidateResume.useMutation({
    onSuccess: () => {
      toast.success("AI review complete");
      onReviewComplete();
      setReviewExpanded(true);
    },
    onError: (err) => toast.error(err.message),
  });

  const handleFile = useCallback(async (file: File) => {
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain",
    ];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Please upload a PDF, Word document, or text file");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size must be under 10MB");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = (e.target?.result as string).split(",")[1];
      uploadMutation.mutate({
        candidateId: candidate.id,
        fileName: file.name,
        fileData: base64,
        mimeType: file.type,
      });
    };
    reader.readAsDataURL(file);
  }, [candidate.id, uploadMutation]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  return (
    <div className="space-y-4">
      {/* Upload Zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all ${
          isDragging
            ? "border-[#6c63ff] bg-[#6c63ff]/10"
            : "border-white/10 hover:border-white/20 hover:bg-white/5"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept=".pdf,.doc,.docx,.txt"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
        />
        {uploadMutation.isPending ? (
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="w-8 h-8 text-[#6c63ff] animate-spin" />
            <p className="text-sm text-gray-400">Uploading resume...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <Upload className="w-8 h-8 text-gray-400" />
            <p className="text-sm text-gray-200 font-medium">
              {candidate.resumeFileName ? "Replace resume" : "Upload resume"}
            </p>
            <p className="text-xs text-gray-500">PDF, Word, or TXT · Max 10MB</p>
          </div>
        )}
      </div>

      {/* Current Resume Info */}
      {candidate.resumeFileName && (
        <div className="flex items-center gap-3 p-3 rounded-lg bg-[#1e2433] border border-white/10">
          <FileText className="w-5 h-5 text-[#6c63ff] flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm text-gray-200 font-medium truncate">{candidate.resumeFileName}</p>
            {candidate.resumeUploadedAt && (
              <p className="text-xs text-gray-500">Uploaded {timeAgo(candidate.resumeUploadedAt)}</p>
            )}
          </div>
          {candidate.resumeUrl && (
            <a
              href={candidate.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0 p-1.5 rounded hover:bg-white/10 transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              <Download className="w-4 h-4 text-gray-400" />
            </a>
          )}
        </div>
      )}

      {/* AI Review Button */}
      {candidate.resumeFileName && (
        <Button
          onClick={() => reviewMutation.mutate({ candidateId: candidate.id })}
          disabled={reviewMutation.isPending}
          className="w-full bg-[#6c63ff] hover:bg-[#5a52e0] text-white"
        >
          {reviewMutation.isPending ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Running AI Analysis...
            </>
          ) : candidate.resumeReviewResult ? (
            <>
              <RefreshCw className="w-4 h-4 mr-2" />
              Re-run AI Review
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2" />
              Run AI Consistency Review
            </>
          )}
        </Button>
      )}

      {/* Review Result */}
      {candidate.resumeReviewResult && (
        <div className="rounded-lg border border-[#6c63ff]/30 bg-[#6c63ff]/5 overflow-hidden">
          <button
            onClick={() => setReviewExpanded(!reviewExpanded)}
            className="w-full flex items-center justify-between p-3 hover:bg-white/5 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#6c63ff]" />
              <span className="text-sm font-medium text-gray-200">AI Review Results</span>
              {candidate.resumeReviewedAt && (
                <span className="text-xs text-gray-500">· {timeAgo(candidate.resumeReviewedAt)}</span>
              )}
            </div>
            <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${reviewExpanded ? "rotate-180" : ""}`} />
          </button>
          {reviewExpanded && (
            <div className="px-4 pb-4">
              <Separator className="mb-3 bg-white/10" />
              <ScrollArea className="max-h-[400px]">
                <div className="prose prose-invert prose-sm max-w-none">
                  {candidate.resumeReviewResult.split("\n").map((line: string, i: number) => {
                    if (line.startsWith("## ")) {
                      return <h3 key={i} className="text-sm font-semibold text-[#6c63ff] mt-4 mb-2">{line.replace("## ", "")}</h3>;
                    }
                    if (line.startsWith("**") && line.endsWith("**")) {
                      return <p key={i} className="text-sm font-semibold text-gray-200">{line.replace(/\*\*/g, "")}</p>;
                    }
                    if (line.startsWith("- ")) {
                      return <p key={i} className="text-sm text-gray-300 ml-3">• {line.replace("- ", "")}</p>;
                    }
                    if (line.trim() === "") return <div key={i} className="h-1" />;
                    return <p key={i} className="text-sm text-gray-300">{line}</p>;
                  })}
                </div>
              </ScrollArea>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Candidate Profile Modal ──────────────────────────────────────────────────

function CandidateProfileModal({
  candidateId,
  onClose,
}: {
  candidateId: number;
  onClose: () => void;
}) {
  const [activeTab, setActiveTab] = useState<"profile" | "survey" | "resume">("profile");
  const utils = trpc.useUtils();

  const { data: candidate, isLoading, refetch } = trpc.employer.getCandidate.useQuery(
    { candidateId },
    { enabled: !!candidateId }
  );

  const handleResumeUploaded = () => {
    refetch();
    utils.employer.getCandidates.invalidate();
  };

  if (isLoading) {
    return (
      <DialogContent className="max-w-2xl bg-[#0f1117] border-white/10 text-white">
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-8 h-8 text-[#6c63ff] animate-spin" />
        </div>
      </DialogContent>
    );
  }

  if (!candidate) {
    return (
      <DialogContent className="max-w-2xl bg-[#0f1117] border-white/10 text-white">
        <div className="text-center py-8 text-gray-400">Candidate not found</div>
      </DialogContent>
    );
  }

  const riskColor = { High: "text-red-400", Medium: "text-yellow-400", Low: "text-green-400" }[candidate.riskLevel] || "text-gray-400";
  const recColor = RECOMMENDATION_COLORS[candidate.aiRecommendation as RecommendationType] || "text-gray-400";

  return (
    <DialogContent className="max-w-2xl bg-[#0f1117] border-white/10 text-white max-h-[90vh] flex flex-col p-0 overflow-hidden">
      {/* Header */}
      <div className="p-6 pb-4 border-b border-white/10 flex-shrink-0">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white">{candidate.name}</h2>
            <p className="text-sm text-gray-400 mt-0.5">{candidate.email}</p>
            <div className="flex items-center gap-3 mt-2">
              <span className={`text-xs font-semibold px-2 py-0.5 rounded ${RISK_COLORS[candidate.riskLevel as RiskLevel]}`}>
                {candidate.riskLevel} Risk
              </span>
              <span className={`text-xs font-semibold ${recColor}`}>
                AI: {candidate.aiRecommendation}
              </span>
              {candidate.psycheDisplayName && (
                <span className="text-xs text-purple-400 font-medium">
                  {candidate.psycheDisplayName}
                </span>
              )}
            </div>
          </div>
          <div className="text-right text-xs text-gray-500">
            <p>Joined {formatDate(candidate.createdAt)}</p>
            <p>Last active {timeAgo(candidate.lastSignedIn)}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mt-4">
          {(["profile", "survey", "resume"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors capitalize ${
                activeTab === tab
                  ? "bg-[#6c63ff] text-white"
                  : "text-gray-400 hover:text-gray-200 hover:bg-white/5"
              }`}
            >
              {tab === "survey" ? "Survey Answers" : tab === "resume" ? "Resume & AI Review" : "Profile"}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <ScrollArea className="flex-1 overflow-auto">
        <div className="p-6">
          {/* Profile Tab */}
          {activeTab === "profile" && (
            <div className="space-y-4">
              {/* Psyche Profile */}
              {candidate.psycheDisplayName ? (
                <div className="rounded-lg border border-purple-500/30 bg-purple-500/5 p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Brain className="w-5 h-5 text-purple-400" />
                    <h4 className="text-sm font-semibold text-purple-400">Psyche Profile</h4>
                  </div>
                  <p className="text-lg font-bold text-white">{candidate.psycheDisplayName}</p>
                  {candidate.psycheDescription && (
                    <p className="text-sm text-gray-300 mt-1">{candidate.psycheDescription}</p>
                  )}
                  {candidate.coreTraits && candidate.coreTraits.length > 0 && (
                    <div className="mt-3">
                      <p className="text-xs text-gray-500 mb-1.5">Core Traits</p>
                      <div className="flex flex-wrap gap-1.5">
                        {candidate.coreTraits.map((trait: string, i: number) => (
                          <span key={i} className="text-xs px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                            {trait}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {candidate.decisionMakingStyle && (
                    <div className="mt-3">
                      <p className="text-xs text-gray-500 mb-1">Decision-Making Style</p>
                      <p className="text-sm text-gray-300">{candidate.decisionMakingStyle}</p>
                    </div>
                  )}
                  {candidate.growthEdge && (
                    <div className="mt-3">
                      <p className="text-xs text-gray-500 mb-1">Growth Edge</p>
                      <p className="text-sm text-gray-300">{candidate.growthEdge}</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="rounded-lg border border-white/10 bg-white/5 p-4 text-center">
                  <Brain className="w-8 h-8 mx-auto mb-2 text-gray-500" />
                  <p className="text-sm text-gray-400">Psyche assessment not yet completed</p>
                </div>
              )}

              {/* Risk Assessment */}
              <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Shield className="w-5 h-5 text-gray-400" />
                  <h4 className="text-sm font-semibold text-gray-300">Risk Assessment</h4>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Risk Level</p>
                    <span className={`text-sm font-bold ${riskColor}`}>{candidate.riskLevel}</span>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">AI Recommendation</p>
                    <span className={`text-sm font-bold ${recColor}`}>{candidate.aiRecommendation}</span>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Assessment Status</p>
                    <span className="text-sm text-gray-200">{candidate.onboardingCompleted ? "Completed" : "Pending"}</span>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Resume</p>
                    <span className="text-sm text-gray-200">{candidate.resumeFileName ? "Uploaded" : "Not uploaded"}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Survey Answers Tab */}
          {activeTab === "survey" && (
            <SurveyAnswersSection
              surveyAnswers={candidate.surveyAnswers}
              onboardingResponses={candidate.onboardingResponses}
            />
          )}

          {/* Resume Tab */}
          {activeTab === "resume" && (
            <ResumeSection
              candidate={candidate}
              onResumeUploaded={handleResumeUploaded}
              onReviewComplete={handleResumeUploaded}
            />
          )}
        </div>
      </ScrollArea>
    </DialogContent>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────

export default function EmployerDashboard() {
  const { user, loading: authLoading } = useAuth();
  const [, navigate] = useLocation();

  const [activeTab, setActiveTab] = useState<TabType>("pipeline");
  const [riskFilter, setRiskFilter] = useState("All Risks");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [recFilter, setRecFilter] = useState("All Recommendations");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCandidateId, setSelectedCandidateId] = useState<number | null>(null);
  const [inviteEmail, setInviteEmail] = useState("");
  const [invitePosition, setInvitePosition] = useState("");

  const utils = trpc.useUtils();

  // Fetch candidates
  const { data: candidateData, isLoading, refetch } = trpc.employer.getCandidates.useQuery(
    {
      search: searchQuery || undefined,
      risk: riskFilter as any,
      status: statusFilter as any,
      recommendation: recFilter as any,
      limit: 200,
    },
    { enabled: user?.role === "admin", refetchOnWindowFocus: false }
  );

  // Delete single candidate
  const deleteMutation = trpc.employer.deleteCandidate.useMutation({
    onSuccess: () => {
      toast.success("Candidate removed");
      refetch();
    },
    onError: (err) => toast.error(err.message),
  });

  // Delete test candidates
  const deleteTestMutation = trpc.employer.deleteTestCandidates.useMutation({
    onSuccess: (data) => {
      toast.success(data.message);
      refetch();
    },
    onError: (err) => toast.error(err.message),
  });

  // Send invite
  const inviteMutation = trpc.employer.sendInvite.useMutation({
    onSuccess: (data) => {
      toast.success(data.message);
      setInviteEmail("");
      setInvitePosition("");
    },
    onError: (err) => toast.error(err.message),
  });

  // Auth guard
  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#0f1117] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#6c63ff] animate-spin" />
      </div>
    );
  }

  if (!user) {
    navigate("/sign-in");
    return null;
  }

  if (user.role !== "admin") {
    // Non-admin users see the personal dashboard
    navigate("/dashboard");
    return null;
  }

  const candidates = candidateData?.candidates || [];
  const stats = candidateData?.stats || { activeCandidates: 0, assessmentsCompleted: 0, highRiskFlags: 0 };

  // Recent activity from candidates
  const recentActivity = [...candidates]
    .sort((a, b) => new Date(b.lastSignedIn).getTime() - new Date(a.lastSignedIn).getTime())
    .slice(0, 10)
    .map((c) => ({
      name: c.name,
      text: c.onboardingCompleted
        ? `completed assessment.${c.riskLevel === "High" ? " (High Risk)" : ""}`
        : "joined the platform.",
      isHighRisk: c.riskLevel === "High",
      time: timeAgo(c.lastSignedIn),
    }));

  const testCandidateCount = candidates.filter(
    (c) => c.loginMethod === "test" || c.name.toLowerCase().includes("test candidate") || c.name.toLowerCase() === "no score"
  ).length;

  return (
    <div className="min-h-screen bg-[#0f1117] text-white flex flex-col">
      {/* Top Nav */}
      <header className="h-14 border-b border-white/10 flex items-center justify-between px-6 flex-shrink-0 bg-[#0f1117]">
        <div className="flex items-center gap-3">
          <span className="text-lg font-bold text-white">PredicSure</span>
          <span className="text-gray-600">|</span>
          <span className="text-sm text-gray-400">Dashboard</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-300">{user.name || user.email}</span>
          <button
            onClick={() => navigate("/account")}
            className="p-1.5 rounded hover:bg-white/10 transition-colors"
            title="Settings"
          >
            <Settings className="w-4 h-4 text-gray-400" />
          </button>
        </div>
      </header>

      {/* Tab Bar */}
      <div className="border-b border-white/10 px-6 flex items-center gap-1 flex-shrink-0 bg-[#0f1117]">
        {[
          { id: "pipeline", label: "Candidate Pipeline", icon: Users },
          { id: "invites", label: "Invite Management", icon: Mail },
          { id: "roles", label: "Roles & Matching", icon: Briefcase },
          { id: "interviews", label: "Interviews", icon: Calendar },
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id as TabType)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === id
                ? "border-[#6c63ff] text-white"
                : "border-transparent text-gray-400 hover:text-gray-200"
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
        <div className="ml-auto flex items-center gap-2 py-2">
          <button
            onClick={() => navigate("/admin")}
            className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
          >
            Admin Tools
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel */}
        <div className="flex-1 overflow-auto">
          {/* ── Candidate Pipeline Tab ── */}
          {activeTab === "pipeline" && (
            <div className="p-6 space-y-6">
              {/* Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="rounded-xl border border-white/10 bg-[#141824] p-5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-400">Active Candidates</span>
                    <Users className="w-5 h-5 text-[#6c63ff]" />
                  </div>
                  <p className="text-3xl font-bold text-white">{stats.activeCandidates}</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-[#141824] p-5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-400">Assessments Completed</span>
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  </div>
                  <p className="text-3xl font-bold text-white">{stats.assessmentsCompleted}</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-[#141824] p-5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-400">High Risk Flags</span>
                    <AlertTriangle className="w-5 h-5 text-red-400" />
                  </div>
                  <p className="text-3xl font-bold text-white">{stats.highRiskFlags}</p>
                </div>
              </div>

              {/* Candidate Table */}
              <div className="rounded-xl border border-white/10 bg-[#141824] overflow-hidden">
                {/* Table Header */}
                <div className="p-4 border-b border-white/10 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <h2 className="text-base font-semibold text-white">All Candidates</h2>
                    {testCandidateCount > 0 && (
                      <button
                        onClick={() => deleteTestMutation.mutate()}
                        disabled={deleteTestMutation.isPending}
                        className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-red-500/10 border border-red-500/20 text-xs text-red-400 hover:bg-red-500/20 transition-colors"
                        title={`Remove ${testCandidateCount} test candidates`}
                      >
                        {deleteTestMutation.isPending ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                          <UserX className="w-3 h-3" />
                        )}
                        Remove {testCandidateCount} test {testCandidateCount === 1 ? "candidate" : "candidates"}
                      </button>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {/* Search */}
                    <div className="relative">
                      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500" />
                      <input
                        type="text"
                        placeholder="Search candidates..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-8 pr-3 py-1.5 rounded-md bg-[#1e2433] border border-white/10 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-[#6c63ff]/50 w-48"
                      />
                    </div>
                    {/* Filters */}
                    <FilterDropdown
                      label="Risk"
                      options={["All Risks", "High", "Medium", "Low"]}
                      value={riskFilter}
                      onChange={setRiskFilter}
                    />
                    <FilterDropdown
                      label="Status"
                      options={["All Status", "Completed", "In Progress", "Pending"]}
                      value={statusFilter}
                      onChange={setStatusFilter}
                    />
                    <FilterDropdown
                      label="Recommendation"
                      options={["All Recommendations", "Proceed", "Review", "Caution", "Pending"]}
                      value={recFilter}
                      onChange={setRecFilter}
                    />
                    {/* Send Invite */}
                    <button
                      onClick={() => setActiveTab("invites")}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#6c63ff] hover:bg-[#5a52e0] text-white text-sm font-medium transition-colors"
                    >
                      <Send className="w-3.5 h-3.5" />
                      Send Invite
                    </button>
                  </div>
                </div>

                {/* Table */}
                {isLoading ? (
                  <div className="flex items-center justify-center py-16">
                    <Loader2 className="w-6 h-6 text-[#6c63ff] animate-spin" />
                  </div>
                ) : candidates.length === 0 ? (
                  <div className="text-center py-16 text-gray-500">
                    <Users className="w-10 h-10 mx-auto mb-3 opacity-30" />
                    <p className="text-sm">No candidates found</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-white/5">
                          <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Candidate</th>
                          <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Position</th>
                          <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">AI Recommendation</th>
                          <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Overall Risk</th>
                          <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                          <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                          <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {candidates.map((c) => (
                          <tr key={c.id} className="border-b border-white/5 hover:bg-white/2 transition-colors">
                            <td className="px-4 py-3">
                              <div>
                                <p className="text-sm font-medium text-gray-200">{c.name}</p>
                                {c.email && <p className="text-xs text-gray-500">{c.email}</p>}
                              </div>
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-400">{c.position}</td>
                            <td className="px-4 py-3">
                              <span className={`text-sm font-medium ${RECOMMENDATION_COLORS[c.aiRecommendation as RecommendationType]}`}>
                                {c.aiRecommendation}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <span className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ${RISK_COLORS[c.riskLevel as RiskLevel]}`}>
                                {c.riskLevel}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <span className="flex items-center gap-1.5 text-sm">
                                {STATUS_ICONS[c.status as StatusType]}
                                <span className={c.status === "Completed" ? "text-green-400" : c.status === "In Progress" ? "text-blue-400" : "text-gray-400"}>
                                  {c.status}
                                </span>
                              </span>
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-400">{formatDate(c.createdAt)}</td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => setSelectedCandidateId(c.id)}
                                  className="flex items-center gap-1 px-2 py-1 rounded text-xs text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                  View
                                </button>
                                <button
                                  onClick={() => {
                                    if (confirm(`Remove ${c.name} from the pipeline?`)) {
                                      deleteMutation.mutate({ candidateId: c.id });
                                    }
                                  }}
                                  disabled={deleteMutation.isPending}
                                  className="p-1 rounded text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── Invite Management Tab ── */}
          {activeTab === "invites" && (
            <div className="p-6 max-w-2xl">
              <h2 className="text-xl font-bold text-white mb-6">Send Assessment Invite</h2>
              <div className="rounded-xl border border-white/10 bg-[#141824] p-6 space-y-4">
                <div>
                  <label className="text-sm text-gray-400 mb-1.5 block">Candidate Email *</label>
                  <input
                    type="email"
                    placeholder="candidate@example.com"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    className="w-full px-3 py-2 rounded-md bg-[#1e2433] border border-white/10 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-[#6c63ff]/50"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-1.5 block">Position (optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. Senior Developer"
                    value={invitePosition}
                    onChange={(e) => setInvitePosition(e.target.value)}
                    className="w-full px-3 py-2 rounded-md bg-[#1e2433] border border-white/10 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-[#6c63ff]/50"
                  />
                </div>
                <Button
                  onClick={() => {
                    if (!inviteEmail) { toast.error("Please enter an email address"); return; }
                    inviteMutation.mutate({ email: inviteEmail, position: invitePosition || undefined });
                  }}
                  disabled={inviteMutation.isPending}
                  className="w-full bg-[#6c63ff] hover:bg-[#5a52e0] text-white"
                >
                  {inviteMutation.isPending ? (
                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Sending...</>
                  ) : (
                    <><Send className="w-4 h-4 mr-2" />Send Invite</>
                  )}
                </Button>
              </div>
            </div>
          )}

          {/* ── Roles & Matching Tab ── */}
          {activeTab === "roles" && (
            <div className="p-6">
              <h2 className="text-xl font-bold text-white mb-6">Roles & Matching</h2>
              <div className="rounded-xl border border-white/10 bg-[#141824] p-8 text-center">
                <Briefcase className="w-12 h-12 mx-auto mb-3 text-gray-600" />
                <p className="text-gray-400 text-sm">Role matching coming soon</p>
                <p className="text-gray-600 text-xs mt-1">Define roles and automatically match candidates based on psyche profiles</p>
              </div>
            </div>
          )}

          {/* ── Interviews Tab ── */}
          {activeTab === "interviews" && (
            <div className="p-6">
              <h2 className="text-xl font-bold text-white mb-6">Interviews</h2>
              <div className="rounded-xl border border-white/10 bg-[#141824] p-8 text-center">
                <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-600" />
                <p className="text-gray-400 text-sm">Interview scheduling coming soon</p>
                <p className="text-gray-600 text-xs mt-1">Schedule and manage candidate interviews directly from the dashboard</p>
              </div>
            </div>
          )}
        </div>

        {/* Right Panel — Recent Activity */}
        {activeTab === "pipeline" && (
          <div className="w-72 border-l border-white/10 bg-[#0f1117] flex-shrink-0 overflow-auto">
            <div className="p-4 border-b border-white/10">
              <h3 className="text-sm font-semibold text-gray-300 flex items-center gap-2">
                <Activity className="w-4 h-4 text-[#6c63ff]" />
                Recent Activity
              </h3>
            </div>
            <div className="p-3 space-y-1">
              {recentActivity.length === 0 ? (
                <p className="text-xs text-gray-500 text-center py-4">No recent activity</p>
              ) : (
                recentActivity.map((item, i) => (
                  <div key={i} className="flex items-start gap-2.5 p-2 rounded-lg hover:bg-white/5 transition-colors">
                    <div className={`mt-0.5 w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${item.isHighRisk ? "bg-red-500/20" : "bg-[#6c63ff]/20"}`}>
                      {item.isHighRisk ? (
                        <AlertTriangle className="w-3 h-3 text-red-400" />
                      ) : (
                        <CheckCircle className="w-3 h-3 text-[#6c63ff]" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-200 leading-relaxed">
                        <span className="font-medium">{item.name}</span>{" "}
                        <span className="text-gray-400">{item.text}</span>
                      </p>
                      <p className="text-xs text-gray-600 mt-0.5">{item.time}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Candidate Profile Modal */}
      <Dialog open={selectedCandidateId !== null} onOpenChange={(open) => !open && setSelectedCandidateId(null)}>
        {selectedCandidateId !== null && (
          <CandidateProfileModal
            candidateId={selectedCandidateId}
            onClose={() => setSelectedCandidateId(null)}
          />
        )}
      </Dialog>
    </div>
  );
}
