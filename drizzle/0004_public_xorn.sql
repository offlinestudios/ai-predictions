-- Create trajectoryType enum if it doesn't exist
DO $$ BEGIN
  CREATE TYPE "public"."trajectoryType" AS ENUM('instant', '30day', '90day', 'yearly');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Add trajectoryType column to predictions if it doesn't exist
DO $$ BEGIN
  ALTER TABLE "predictions" ADD COLUMN "trajectoryType" "trajectoryType" DEFAULT 'instant' NOT NULL;
EXCEPTION
  WHEN duplicate_column THEN null;
END $$;

-- Add onboarding fields to users table if they don't exist
DO $$ BEGIN
  ALTER TABLE "users" ADD COLUMN "nickname" varchar(100);
EXCEPTION
  WHEN duplicate_column THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "users" ADD COLUMN "gender" varchar(20);
EXCEPTION
  WHEN duplicate_column THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "users" ADD COLUMN "relationshipStatus" varchar(50);
EXCEPTION
  WHEN duplicate_column THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "users" ADD COLUMN "interests" text;
EXCEPTION
  WHEN duplicate_column THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "users" ADD COLUMN "onboardingCompleted" boolean DEFAULT false NOT NULL;
EXCEPTION
  WHEN duplicate_column THEN null;
END $$;
