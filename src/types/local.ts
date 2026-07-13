import type { PracticeLogPayload } from './practiceEntry';

export interface LocalPracticeLog {
  id: string;
  device_id: string;
  log_date: string;
  logged_at: string;
  practices_logged: PracticeLogPayload[];
  daily_practices_at_time: string[];
  daily_count_at_time: number;
  ring_state_before: number;
  ring_state_after: number;
  minutes_total: number;
  placement_instance_id?: string | null;
}

export type PendingPracticeLog = LocalPracticeLog;
