ALTER TABLE "users" ADD COLUMN "ageRange" varchar(20);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "location" varchar(100);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "incomeRange" varchar(50);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "industry" varchar(100);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "majorTransition" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "transitionType" varchar(100);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "premiumDataCompleted" boolean DEFAULT false NOT NULL;