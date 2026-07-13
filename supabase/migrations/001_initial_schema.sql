-- Sadhana Tracker PWA — initial schema
-- Run this in Supabase SQL Editor for new projects.

-- device_sessions: one row per device_id
CREATE TABLE IF NOT EXISTS device_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  setup_complete BOOLEAN NOT NULL DEFAULT false,
  daily_practices JSONB NOT NULL DEFAULT '[]'::jsonb,
  other_practices JSONB NOT NULL DEFAULT '[]'::jsonb
);

-- practice_logs: append-only, one row per log event
CREATE TABLE IF NOT EXISTS practice_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id TEXT NOT NULL,
  log_date DATE NOT NULL,
  logged_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  practices_logged JSONB NOT NULL DEFAULT '[]'::jsonb,
  daily_practices_at_time JSONB NOT NULL DEFAULT '[]'::jsonb,
  daily_count_at_time INTEGER NOT NULL DEFAULT 0,
  ring_state_before INTEGER NOT NULL DEFAULT 0,
  ring_state_after INTEGER NOT NULL DEFAULT 0,
  minutes_total INTEGER
);

CREATE INDEX IF NOT EXISTS idx_practice_logs_device_date
  ON practice_logs (device_id, log_date);

-- analytics_events: append-only instrumentation
CREATE TABLE IF NOT EXISTS analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id TEXT NOT NULL,
  event_name TEXT NOT NULL,
  properties JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_analytics_events_device_event
  ON analytics_events (device_id, event_name);

-- Diary study build: RLS disabled. Re-enable before any public production use.
ALTER TABLE device_sessions DISABLE ROW LEVEL SECURITY;
ALTER TABLE practice_logs DISABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events DISABLE ROW LEVEL SECURITY;
