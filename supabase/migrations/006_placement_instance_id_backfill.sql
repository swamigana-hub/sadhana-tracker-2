-- Backfill null placement_instance_id values and prevent future nulls at the DB layer.
UPDATE practice_logs
SET placement_instance_id = gen_random_uuid()::text
WHERE placement_instance_id IS NULL;

ALTER TABLE practice_logs
  ALTER COLUMN placement_instance_id SET DEFAULT gen_random_uuid()::text;

ALTER TABLE practice_logs
  ALTER COLUMN placement_instance_id SET NOT NULL;
