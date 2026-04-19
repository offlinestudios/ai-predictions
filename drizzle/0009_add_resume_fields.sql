-- Add resume upload and AI review fields to users table
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "resumeUrl" text;
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "resumeFileName" varchar(255);
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "resumeUploadedAt" timestamp;
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "resumeReviewResult" text;
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "resumeReviewedAt" timestamp;
