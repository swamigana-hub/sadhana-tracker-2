-- Per-placement log identity (duplicate placements log independently)
ALTER TABLE practice_logs
  ADD COLUMN IF NOT EXISTS placement_instance_id TEXT;
