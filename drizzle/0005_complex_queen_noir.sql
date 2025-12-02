-- Idempotent migration: Update tier and badge enums to replace 'starter' with 'plus'

-- Update badge enum
DO $$ BEGIN
  -- Convert badge column to text temporarily
  ALTER TABLE "users" ALTER COLUMN "badge" SET DATA TYPE text;
  ALTER TABLE "users" ALTER COLUMN "badge" SET DEFAULT 'none'::text;
  
  -- Drop and recreate badge enum
  DROP TYPE IF EXISTS "public"."badge";
  CREATE TYPE "public"."badge" AS ENUM('none', 'plus', 'pro', 'premium');
  
  -- Convert badge column back to enum
  ALTER TABLE "users" ALTER COLUMN "badge" SET DEFAULT 'none'::"public"."badge";
  ALTER TABLE "users" ALTER COLUMN "badge" SET DATA TYPE "public"."badge" USING "badge"::"public"."badge";
EXCEPTION
  WHEN duplicate_object THEN
    -- Enum already exists, skip
    NULL;
  WHEN others THEN
    RAISE;
END $$;

-- Update tier enum
DO $$ BEGIN
  -- Convert tier column to text temporarily
  ALTER TABLE "subscriptions" ALTER COLUMN "tier" SET DATA TYPE text;
  ALTER TABLE "subscriptions" ALTER COLUMN "tier" SET DEFAULT 'free'::text;
  
  -- Drop and recreate tier enum
  DROP TYPE IF EXISTS "public"."tier";
  CREATE TYPE "public"."tier" AS ENUM('free', 'plus', 'pro', 'premium');
  
  -- Convert tier column back to enum
  ALTER TABLE "subscriptions" ALTER COLUMN "tier" SET DEFAULT 'free'::"public"."tier";
  ALTER TABLE "subscriptions" ALTER COLUMN "tier" SET DATA TYPE "public"."tier" USING "tier"::"public"."tier";
EXCEPTION
  WHEN duplicate_object THEN
    -- Enum already exists, skip
    NULL;
  WHEN others THEN
    RAISE;
END $$;
