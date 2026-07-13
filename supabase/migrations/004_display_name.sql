-- Optional display name for per-person attribution alongside device_id.
ALTER TABLE device_sessions ADD COLUMN IF NOT EXISTS display_name TEXT;
