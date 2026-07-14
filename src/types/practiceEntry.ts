/** Structured practice entry stored in practice_logs.practices_logged JSONB. */
export interface LoggedPracticeEntry {
  practiceId: string;
  cycles?: number;
  durationMinutes?: number;
  level?: 'beginner' | 'advanced';
  kapalabhatis?: number;
}

export type PracticeLogPayload = string | LoggedPracticeEntry;
