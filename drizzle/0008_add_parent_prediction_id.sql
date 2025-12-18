-- Add parentPredictionId column to predictions table for tracking follow-up questions
-- Follow-up predictions will have this set to the ID of the root prediction
-- Root predictions will have this as NULL
ALTER TABLE "predictions" ADD COLUMN "parentPredictionId" integer;

-- Add index for faster lookups of follow-up predictions
CREATE INDEX IF NOT EXISTS "predictions_parent_id_idx" ON "predictions" ("parentPredictionId");
