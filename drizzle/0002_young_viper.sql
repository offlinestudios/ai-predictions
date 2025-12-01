DO $$ BEGIN
 ALTER TABLE "predictions" ADD COLUMN "shareToken" varchar(32);
EXCEPTION
 WHEN duplicate_column THEN null;
END $$;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "predictions" ADD CONSTRAINT "predictions_shareToken_unique" UNIQUE("shareToken");
EXCEPTION
 WHEN duplicate_table THEN null;
END $$;
