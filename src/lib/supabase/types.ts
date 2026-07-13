import type { PracticeLogPayload } from '../../types/practiceEntry';

export interface DeviceSessionRow {
  id: string;
  device_id: string;
  created_at: string;
  setup_complete: boolean;
  daily_practices: string[];
  other_practices: string[];
  display_name: string | null;
}

export interface PracticeLogRow {
  id: string;
  device_id: string;
  log_date: string;
  logged_at: string;
  practices_logged: PracticeLogPayload[];
  daily_practices_at_time: string[];
  daily_count_at_time: number;
  ring_state_before: number;
  ring_state_after: number;
  minutes_total: number | null;
  placement_instance_id?: string | null;
}

export interface AnalyticsEventRow {
  id: string;
  device_id: string;
  event_name: string;
  properties: Record<string, unknown> | null;
  created_at: string;
}

export type DeviceSessionUpsert = Pick<
  DeviceSessionRow,
  'device_id' | 'setup_complete' | 'daily_practices' | 'other_practices'
> & {
  display_name?: string | null;
};

export type PracticeLogInsert = Omit<PracticeLogRow, 'id' | 'logged_at'> & {
  id?: string;
  logged_at?: string;
};

export type AnalyticsEventInsert = Pick<
  AnalyticsEventRow,
  'device_id' | 'event_name' | 'properties'
>;

export interface Database {
  public: {
    Tables: {
      device_sessions: {
        Row: DeviceSessionRow;
        Insert: DeviceSessionUpsert & { id?: string; created_at?: string };
        Update: Partial<DeviceSessionUpsert>;
        Relationships: [];
      };
      practice_logs: {
        Row: PracticeLogRow;
        Insert: PracticeLogInsert & { id?: string };
        Update: Partial<PracticeLogInsert>;
        Relationships: [];
      };
      analytics_events: {
        Row: AnalyticsEventRow;
        Insert: AnalyticsEventInsert & { id?: string; created_at?: string };
        Update: Partial<AnalyticsEventInsert>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
