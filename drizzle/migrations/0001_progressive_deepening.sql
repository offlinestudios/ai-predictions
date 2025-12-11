-- Migration: Add progressive deepening fields
-- Created: 2024-12-11
-- Description: Adds fields to support progressive deepening feature where users can add additional interest categories after initial onboarding

-- Add progressive deepening tracking to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS "predictionCount" INTEGER DEFAULT 0 NOT NULL;
ALTER TABLE users ADD COLUMN IF NOT EXISTS "deepeningPromptedAt" TIMESTAMP;
ALTER TABLE users ADD COLUMN IF NOT EXISTS "deepeningDismissedCount" INTEGER DEFAULT 0 NOT NULL;

-- Add progressive deepening data to psycheProfiles table
ALTER TABLE "psycheProfiles" ADD COLUMN IF NOT EXISTS "secondaryInterests" TEXT;
ALTER TABLE "psycheProfiles" ADD COLUMN IF NOT EXISTS "crossDomainInsights" TEXT;
ALTER TABLE "psycheProfiles" ADD COLUMN IF NOT EXISTS "profileCompleteness" INTEGER DEFAULT 16 NOT NULL;

-- Update existing profiles to set initial completeness based on interests
UPDATE "psycheProfiles" p
SET "profileCompleteness" = (
  SELECT CASE 
    WHEN u.interests IS NULL OR u.interests = '[]' THEN 16
    ELSE LEAST(100, (jsonb_array_length(u.interests::jsonb) * 16))
  END
  FROM users u
  WHERE u.id = p."userId"
)
WHERE "profileCompleteness" = 16;

-- Create index for efficient prediction count queries
CREATE INDEX IF NOT EXISTS idx_users_prediction_count ON users("predictionCount");
CREATE INDEX IF NOT EXISTS idx_users_deepening_prompted ON users("deepeningPromptedAt");
