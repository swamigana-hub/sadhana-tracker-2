-- Sadhana Tracker — disable RLS for diary-study anon client
-- Production may have RLS enabled without matching policies; this restores 001 intent.
-- Safe for diary study (no auth, device_id is client-generated).

ALTER TABLE device_sessions DISABLE ROW LEVEL SECURITY;
ALTER TABLE practice_logs DISABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events DISABLE ROW LEVEL SECURITY;
