DO $$ BEGIN
 CREATE TYPE "public"."badge" AS ENUM('none', 'starter', 'pro', 'premium');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."predictionMode" AS ENUM('standard', 'deep');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;--> statement-breakpoint
DO $$ BEGIN
 ALTER TYPE "public"."tier" ADD VALUE 'starter' BEFORE 'pro';
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "predictions" ADD COLUMN "confidenceScore" integer;
EXCEPTION
 WHEN duplicate_column THEN null;
END $$;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "predictions" ADD COLUMN "predictionMode" "predictionMode" DEFAULT 'standard' NOT NULL;
EXCEPTION
 WHEN duplicate_column THEN null;
END $$;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "predictions" ADD COLUMN "predictionTimeline" varchar(50);
EXCEPTION
 WHEN duplicate_column THEN null;
END $$;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "subscriptions" ADD COLUMN "currentStreak" integer DEFAULT 0 NOT NULL;
EXCEPTION
 WHEN duplicate_column THEN null;
END $$;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "subscriptions" ADD COLUMN "longestStreak" integer DEFAULT 0 NOT NULL;
EXCEPTION
 WHEN duplicate_column THEN null;
END $$;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "subscriptions" ADD COLUMN "lastPredictionDate" timestamp;
EXCEPTION
 WHEN duplicate_column THEN null;
END $$;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "subscriptions" ADD COLUMN "billingInterval" varchar(20) DEFAULT 'monthly';
EXCEPTION
 WHEN duplicate_column THEN null;
END $$;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "users" ADD COLUMN "badge" "badge" DEFAULT 'none' NOT NULL;
EXCEPTION
 WHEN duplicate_column THEN null;
END $$;
