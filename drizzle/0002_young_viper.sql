ALTER TABLE "predictions" ADD COLUMN "shareToken" varchar(32);--> statement-breakpoint
ALTER TABLE "predictions" ADD CONSTRAINT "predictions_shareToken_unique" UNIQUE("shareToken");