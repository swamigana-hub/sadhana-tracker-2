-- Diary study: ensure anon client can read/write device_sessions (and related tables).
-- Run in Supabase SQL Editor if setup sync fails with RLS errors.
-- Safe when device_id is client-generated and there is no user auth.

ALTER TABLE device_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE practice_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "diary_study_anon_device_sessions" ON device_sessions;
CREATE POLICY "diary_study_anon_device_sessions"
  ON device_sessions FOR ALL TO anon
  USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "diary_study_anon_practice_logs" ON practice_logs;
CREATE POLICY "diary_study_anon_practice_logs"
  ON practice_logs FOR ALL TO anon
  USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "diary_study_anon_analytics_events" ON analytics_events;
CREATE POLICY "diary_study_anon_analytics_events"
  ON analytics_events FOR ALL TO anon
  USING (true) WITH CHECK (true);
