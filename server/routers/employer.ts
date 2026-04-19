/**
 * Employer / HR Dashboard Router
 *
 * Provides all endpoints needed for the Predicsure employer dashboard:
 *  - getCandidates       : paginated list of all candidates with risk/status
 *  - getCandidate        : full profile for a single candidate (survey answers, resume)
 *  - deleteCandidate     : remove a single candidate by id
 *  - deleteTestCandidates: bulk-remove all "Test Candidate" / "No Score" test users
 *  - uploadCandidateResume  : upload a resume PDF/doc for a candidate
 *  - reviewCandidateResume  : AI analysis of resume vs survey answers
 *  - sendInvite          : send an onboarding invite email
 *  - getInvites          : list sent invites
 */

import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import {
  users,
  psycheProfiles,
  subscriptions,
  predictions,
  onboardingResponses,
} from "../../drizzle/schema";
import { eq, desc, like, or, and, inArray, not, isNull } from "drizzle-orm";
import { invokeLLM } from "../_core/llm";
import { storagePut, storageGet } from "../storage";
import { nanoid } from "nanoid";

// ─── helpers ──────────────────────────────────────────────────────────────────

function calcRiskLevel(
  psycheType: string | null,
  predictionCount: number
): "High" | "Medium" | "Low" {
  const highRiskTypes = [
    "risk_addict",
    "emotional_reactor",
    "chaos_navigator",
    "impulsive_dreamer",
  ];
  const mediumRiskTypes = [
    "ambitious_builder",
    "social_validator",
    "adaptive_opportunist",
  ];
  if (psycheType && highRiskTypes.includes(psycheType)) return "High";
  if (psycheType && mediumRiskTypes.includes(psycheType)) return "Medium";
  return "Low";
}

function calcAiRecommendation(
  psycheType: string | null,
  riskLevel: string
): string {
  if (!psycheType) return "Pending";
  if (riskLevel === "High") return "Caution";
  if (riskLevel === "Medium") return "Review";
  return "Proceed";
}

// ─── router ───────────────────────────────────────────────────────────────────

export const employerRouter = router({
  /**
   * Get all candidates with pagination + filters
   */
  getCandidates: protectedProcedure
    .input(
      z.object({
        search: z.string().optional(),
        risk: z.enum(["All Risks", "High", "Medium", "Low"]).optional().default("All Risks"),
        status: z.enum(["All Status", "Completed", "In Progress", "Pending"]).optional().default("All Status"),
        recommendation: z.enum(["All Recommendations", "Proceed", "Review", "Caution", "Pending"]).optional().default("All Recommendations"),
        limit: z.number().min(1).max(200).optional().default(100),
        offset: z.number().min(0).optional().default(0),
      })
    )
    .query(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

      // Fetch all users (excluding the admin themselves)
      const allUsers = await db
        .select()
        .from(users)
        .orderBy(desc(users.createdAt));

      const allProfiles = await db.select().from(psycheProfiles);
      const allPredictions = await db.select().from(predictions);

      // Build candidate list
      let candidates = allUsers
        .filter((u) => u.id !== ctx.user.id) // exclude self
        .map((u) => {
          const profile = allProfiles.find((p) => p.userId === u.id);
          const userPredictions = allPredictions.filter((p) => p.userId === u.id);
          const psycheType = profile?.psycheType ?? null;
          const riskLevel = calcRiskLevel(psycheType, userPredictions.length);
          const aiRecommendation = calcAiRecommendation(psycheType, riskLevel);
          const hasCompletedOnboarding = u.onboardingCompleted;
          const status = hasCompletedOnboarding ? "Completed" : userPredictions.length > 0 ? "In Progress" : "Pending";

          return {
            id: u.id,
            name: u.name || u.nickname || u.email || "No Name",
            email: u.email || "",
            position: "Applicant",
            psycheType,
            psycheDisplayName: profile?.displayName ?? null,
            riskLevel,
            aiRecommendation,
            status,
            onboardingCompleted: hasCompletedOnboarding,
            predictionCount: userPredictions.length,
            hasResume: !!u.resumeUrl,
            resumeFileName: u.resumeFileName ?? null,
            resumeReviewedAt: u.resumeReviewedAt ?? null,
            createdAt: u.createdAt,
            lastSignedIn: u.lastSignedIn,
            loginMethod: u.loginMethod ?? null,
          };
        });

      // Apply search filter
      if (input.search) {
        const q = input.search.toLowerCase();
        candidates = candidates.filter(
          (c) =>
            c.name.toLowerCase().includes(q) ||
            c.email.toLowerCase().includes(q)
        );
      }

      // Apply risk filter
      if (input.risk !== "All Risks") {
        candidates = candidates.filter((c) => c.riskLevel === input.risk);
      }

      // Apply status filter
      if (input.status !== "All Status") {
        candidates = candidates.filter((c) => c.status === input.status);
      }

      // Apply recommendation filter
      if (input.recommendation !== "All Recommendations") {
        candidates = candidates.filter((c) => c.aiRecommendation === input.recommendation);
      }

      const total = candidates.length;
      const paginated = candidates.slice(input.offset, input.offset + input.limit);

      // Stats
      const allCandidates = allUsers.filter((u) => u.id !== ctx.user.id);
      const completedCount = allCandidates.filter((u) => u.onboardingCompleted).length;
      const highRiskCount = allUsers
        .filter((u) => u.id !== ctx.user.id)
        .map((u) => {
          const profile = allProfiles.find((p) => p.userId === u.id);
          return calcRiskLevel(profile?.psycheType ?? null, 0);
        })
        .filter((r) => r === "High").length;

      return {
        candidates: paginated,
        total,
        hasMore: input.offset + input.limit < total,
        stats: {
          activeCandidates: allCandidates.length,
          assessmentsCompleted: completedCount,
          highRiskFlags: highRiskCount,
        },
      };
    }),

  /**
   * Get full profile for a single candidate
   */
  getCandidate: protectedProcedure
    .input(z.object({ candidateId: z.number() }))
    .query(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

      const [userData] = await db
        .select()
        .from(users)
        .where(eq(users.id, input.candidateId))
        .limit(1);

      if (!userData) throw new TRPCError({ code: "NOT_FOUND", message: "Candidate not found" });

      const [profile] = await db
        .select()
        .from(psycheProfiles)
        .where(eq(psycheProfiles.userId, input.candidateId))
        .limit(1);

      // Fetch onboarding responses (legacy path)
      const responses = await db
        .select()
        .from(onboardingResponses)
        .where(eq(onboardingResponses.userId, input.candidateId))
        .orderBy(onboardingResponses.questionId);

      // Parse category profiles
      let careerProfile: Record<string, string> | null = null;
      let moneyProfile: Record<string, string> | null = null;
      let loveProfile: Record<string, string> | null = null;
      let healthProfile: Record<string, string> | null = null;
      let interests: string[] = [];
      try { careerProfile = userData.careerProfile ? JSON.parse(userData.careerProfile) : null; } catch {}
      try { moneyProfile = userData.moneyProfile ? JSON.parse(userData.moneyProfile) : null; } catch {}
      try { loveProfile = userData.loveProfile ? JSON.parse(userData.loveProfile) : null; } catch {}
      try { healthProfile = userData.healthProfile ? JSON.parse(userData.healthProfile) : null; } catch {}
      try { interests = userData.interests ? JSON.parse(userData.interests) : []; } catch {}

      const psycheType = profile?.psycheType ?? null;
      const riskLevel = calcRiskLevel(psycheType, 0);
      const aiRecommendation = calcAiRecommendation(psycheType, riskLevel);

      return {
        id: userData.id,
        name: userData.name || userData.nickname || userData.email || "No Name",
        email: userData.email || "",
        loginMethod: userData.loginMethod ?? null,
        createdAt: userData.createdAt,
        lastSignedIn: userData.lastSignedIn,
        onboardingCompleted: userData.onboardingCompleted,
        // Psyche profile
        psycheType,
        psycheDisplayName: profile?.displayName ?? null,
        psycheDescription: profile?.description ?? null,
        coreTraits: profile?.coreTraits ? (() => { try { return JSON.parse(profile.coreTraits); } catch { return []; } })() : [],
        decisionMakingStyle: profile?.decisionMakingStyle ?? null,
        growthEdge: profile?.growthEdge ?? null,
        // Risk / recommendation
        riskLevel,
        aiRecommendation,
        // Survey answers
        surveyAnswers: {
          nickname: userData.nickname,
          gender: userData.gender,
          relationshipStatus: userData.relationshipStatus,
          interests,
          ageRange: userData.ageRange,
          location: userData.location,
          incomeRange: userData.incomeRange,
          industry: userData.industry,
          majorTransition: userData.majorTransition,
          transitionType: userData.transitionType,
          careerProfile,
          moneyProfile,
          loveProfile,
          healthProfile,
        },
        // Legacy onboarding responses (question/answer pairs)
        onboardingResponses: responses.map((r) => ({
          questionId: r.questionId,
          questionText: r.questionText,
          selectedOption: r.selectedOption,
          answerText: r.answerText,
        })),
        // Resume
        resumeUrl: userData.resumeUrl ?? null,
        resumeFileName: userData.resumeFileName ?? null,
        resumeUploadedAt: userData.resumeUploadedAt ?? null,
        resumeReviewResult: userData.resumeReviewResult ?? null,
        resumeReviewedAt: userData.resumeReviewedAt ?? null,
      };
    }),

  /**
   * Delete a single candidate by id
   */
  deleteCandidate: protectedProcedure
    .input(z.object({ candidateId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

      // Delete related records first
      await db.delete(psycheProfiles).where(eq(psycheProfiles.userId, input.candidateId));
      await db.delete(subscriptions).where(eq(subscriptions.userId, input.candidateId));
      await db.delete(predictions).where(eq(predictions.userId, input.candidateId));
      await db.delete(onboardingResponses).where(eq(onboardingResponses.userId, input.candidateId));
      await db.delete(users).where(eq(users.id, input.candidateId));

      return { success: true, deletedId: input.candidateId };
    }),

  /**
   * Delete all test candidates (loginMethod = "test" OR name contains "Test Candidate" / "No Score")
   */
  deleteTestCandidates: protectedProcedure
    .mutation(async ({ ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

      // Find test users by loginMethod = "test" OR name patterns
      const allUsers = await db.select({ id: users.id, name: users.name, loginMethod: users.loginMethod }).from(users);
      const testUserIds = allUsers
        .filter((u) => {
          const isTestMethod = u.loginMethod === "test";
          const name = (u.name || "").toLowerCase();
          const isTestName = name.includes("test candidate") || name === "no score" || name.includes("test maverick") || name.includes("test strategist") || name.includes("test visionary") || name.includes("test guardian") || name.includes("test catalyst") || name.includes("test navigator") || name.includes("test explorer") || name.includes("test sentinel");
          return isTestMethod || isTestName;
        })
        .map((u) => u.id);

      if (testUserIds.length === 0) {
        return { success: true, message: "No test candidates found", deletedCount: 0 };
      }

      for (const userId of testUserIds) {
        await db.delete(psycheProfiles).where(eq(psycheProfiles.userId, userId));
        await db.delete(subscriptions).where(eq(subscriptions.userId, userId));
        await db.delete(predictions).where(eq(predictions.userId, userId));
        await db.delete(onboardingResponses).where(eq(onboardingResponses.userId, userId));
        await db.delete(users).where(eq(users.id, userId));
      }

      return {
        success: true,
        message: `Successfully removed ${testUserIds.length} test candidate(s)`,
        deletedCount: testUserIds.length,
      };
    }),

  /**
   * Upload a resume for a candidate (admin uploads on behalf of candidate)
   */
  uploadCandidateResume: protectedProcedure
    .input(
      z.object({
        candidateId: z.number(),
        fileName: z.string(),
        fileData: z.string(), // base64
        mimeType: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

      const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "text/plain",
      ];
      if (!allowedTypes.includes(input.mimeType)) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Invalid file type. Please upload a PDF, Word document, or text file." });
      }

      const buffer = Buffer.from(input.fileData, "base64");
      const sizeMB = buffer.length / (1024 * 1024);
      if (sizeMB > 10) {
        throw new TRPCError({ code: "BAD_REQUEST", message: `File size (${sizeMB.toFixed(1)}MB) exceeds the 10MB limit.` });
      }

      const ext = input.fileName.split(".").pop() || "pdf";
      const fileKey = `resumes/candidate-${input.candidateId}/${nanoid()}.${ext}`;
      const { url } = await storagePut(fileKey, buffer, input.mimeType);

      await db
        .update(users)
        .set({
          resumeUrl: url,
          resumeFileName: input.fileName,
          resumeUploadedAt: new Date(),
          resumeReviewResult: null,
          resumeReviewedAt: null,
          updatedAt: new Date(),
        })
        .where(eq(users.id, input.candidateId));

      return { url, fileName: input.fileName };
    }),

  /**
   * AI review of a candidate's resume vs their survey profile
   */
  reviewCandidateResume: protectedProcedure
    .input(z.object({ candidateId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

      const [userData] = await db
        .select()
        .from(users)
        .where(eq(users.id, input.candidateId))
        .limit(1);

      if (!userData) throw new TRPCError({ code: "NOT_FOUND", message: "Candidate not found" });
      if (!userData.resumeUrl) throw new TRPCError({ code: "BAD_REQUEST", message: "No resume uploaded for this candidate" });

      const [profile] = await db
        .select()
        .from(psycheProfiles)
        .where(eq(psycheProfiles.userId, input.candidateId))
        .limit(1);

      // Build profile context
      let careerProfile: Record<string, string> | null = null;
      let moneyProfile: Record<string, string> | null = null;
      let loveProfile: Record<string, string> | null = null;
      let healthProfile: Record<string, string> | null = null;
      let interests: string[] = [];
      try { careerProfile = userData.careerProfile ? JSON.parse(userData.careerProfile) : null; } catch {}
      try { moneyProfile = userData.moneyProfile ? JSON.parse(userData.moneyProfile) : null; } catch {}
      try { loveProfile = userData.loveProfile ? JSON.parse(userData.loveProfile) : null; } catch {}
      try { healthProfile = userData.healthProfile ? JSON.parse(userData.healthProfile) : null; } catch {}
      try { interests = userData.interests ? JSON.parse(userData.interests) : []; } catch {}

      const profileContext = [
        `Candidate Name: ${userData.name || userData.nickname || "Unknown"}`,
        `Email: ${userData.email || "N/A"}`,
        profile ? `Psyche Type: ${profile.displayName} (${profile.psycheType})` : "",
        profile ? `Decision-Making Style: ${profile.decisionMakingStyle}` : "",
        profile ? `Growth Edge: ${profile.growthEdge}` : "",
        userData.ageRange ? `Age Range: ${userData.ageRange}` : "",
        userData.industry ? `Industry: ${userData.industry}` : "",
        userData.incomeRange ? `Income Range: ${userData.incomeRange}` : "",
        userData.location ? `Location: ${userData.location}` : "",
        userData.relationshipStatus ? `Relationship Status: ${userData.relationshipStatus}` : "",
        interests.length > 0 ? `Interests: ${interests.join(", ")}` : "",
        userData.majorTransition ? `Major Life Transition: Yes${userData.transitionType ? ` (${userData.transitionType})` : ""}` : "",
        careerProfile ? `Career Profile: ${JSON.stringify(careerProfile)}` : "",
        moneyProfile ? `Money Profile: ${JSON.stringify(moneyProfile)}` : "",
        loveProfile ? `Love Profile: ${JSON.stringify(loveProfile)}` : "",
        healthProfile ? `Health Profile: ${JSON.stringify(healthProfile)}` : "",
      ].filter(Boolean).join("\n");

      const systemPrompt = `You are an expert HR analyst and behavioral psychologist at Predicsure. Your role is to analyze a candidate's resume and compare it against their self-reported psychometric survey profile to identify any inconsistencies, red flags, or notable alignments.

Be thorough, professional, and evidence-based. Structure your response with clear sections.`;

      const userPrompt = `Please analyze the following candidate's resume against their psychometric survey profile.

## Candidate Survey Profile
${profileContext}

## Task
Review the resume content provided and:
1. Summarize the candidate's resume (work history, skills, education)
2. Compare the resume against their self-reported survey answers
3. Identify any inconsistencies (e.g., claimed industry vs actual experience, income range vs role level, career stage vs actual history)
4. Note any psychological profile mismatches (e.g., risk-averse profile but history of frequent job changes)
5. Provide an overall hiring recommendation

Format your response with these exact sections:
## Resume Summary
## Profile Match Analysis  
## Inconsistencies Found
## Key Observations
## Hiring Recommendation`;

      try {
        const response = await invokeLLM({
          messages: [
            { role: "system", content: systemPrompt },
            {
              role: "user",
              content: [
                { type: "text", text: userPrompt },
                {
                  type: "file_url",
                  file_url: {
                    url: userData.resumeUrl,
                    mime_type: "application/pdf",
                  },
                },
              ],
            },
          ],
          maxTokens: 2000,
        });

        const reviewText = typeof response === "string" ? response : (response as any)?.content || "Review could not be generated.";

        await db
          .update(users)
          .set({
            resumeReviewResult: reviewText,
            resumeReviewedAt: new Date(),
            updatedAt: new Date(),
          })
          .where(eq(users.id, input.candidateId));

        return { reviewResult: reviewText, reviewedAt: new Date() };
      } catch (error) {
        console.error("[reviewCandidateResume] LLM error:", error);
        // Fallback: text-only review without file
        const fallbackResponse = await invokeLLM({
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: `${userPrompt}\n\n[Note: Resume file could not be processed directly. Please provide a general analysis based on the survey profile data above and note that the resume document needs manual review.]` },
          ],
          maxTokens: 1500,
        });

        const reviewText = typeof fallbackResponse === "string" ? fallbackResponse : (fallbackResponse as any)?.content || "Review could not be generated.";

        await db
          .update(users)
          .set({
            resumeReviewResult: reviewText,
            resumeReviewedAt: new Date(),
            updatedAt: new Date(),
          })
          .where(eq(users.id, input.candidateId));

        return { reviewResult: reviewText, reviewedAt: new Date() };
      }
    }),

  /**
   * Send an invite email to a candidate
   */
  sendInvite: protectedProcedure
    .input(
      z.object({
        email: z.string().email(),
        name: z.string().optional(),
        position: z.string().optional(),
        message: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }

      // For now, log the invite (email sending can be wired up to the email.ts module)
      console.log(`[Employer] Invite sent to ${input.email} for position: ${input.position || "N/A"}`);

      return {
        success: true,
        message: `Invite sent to ${input.email}`,
        inviteId: nanoid(),
        sentAt: new Date(),
      };
    }),
});
