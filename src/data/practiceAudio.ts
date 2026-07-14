/** Guided audio URLs — host files in Supabase Storage; set via env. */
const base = import.meta.env.VITE_SUPABASE_STORAGE_URL?.replace(/\/$/, '') ?? '';

export const GUIDED_AUDIO_URLS: Record<string, string> = {
  'guru-pooja': import.meta.env.VITE_AUDIO_GURU_POOJA ?? `${base}/audio/guru-pooja.mp3`,
  'inner-engineering-crash-course':
    import.meta.env.VITE_AUDIO_IE_CRASH_COURSE ?? `${base}/audio/inner-engineering-crash-course.mp3`,
  mahamantra: import.meta.env.VITE_AUDIO_MAHAMANTRA ?? `${base}/audio/mahamantra.mp3`,
  'shambhavi-mahamudra-kriya':
    import.meta.env.VITE_AUDIO_SHAMBHAVI ?? `${base}/audio/shambhavi-mahamudra-kriya.mp3`,
};

export function hasGuidedAudio(practiceId: string): boolean {
  return practiceId in GUIDED_AUDIO_URLS;
}

export function getGuidedAudioUrl(practiceId: string): string | null {
  return GUIDED_AUDIO_URLS[practiceId] ?? null;
}
