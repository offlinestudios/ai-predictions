DO $$ BEGIN
 ALTER TABLE "predictions" ADD COLUMN "userFeedback" varchar(10);
EXCEPTION
 WHEN duplicate_column THEN null;
END $$;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "predictions" ADD COLUMN "feedbackAt" timestamp;
EXCEPTION
 WHEN duplicate_column THEN null;
END $$;
