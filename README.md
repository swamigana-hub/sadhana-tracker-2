# Sadhana Tracker v2 (Start / Log)

Separate PWA for the diary-study "Start / Log" practice model. Runs alongside the original Sadhana Tracker with its **own Supabase project** and **fresh UI** for Home, session flow, logging, and Yoga tab.

## Copied verbatim from v1 (do not "improve")

| Area | Source in v1 | Notes |
|------|----------------|-------|
| Onboarding | `src/pages/setup/*` | Welcome, Name, Daily/Other selection, DailySaved confirmation — same copy, stepper, icons, auto-advance |
| Weekly heatmap | `src/components/progress/WeeklyHeatmap`, `WeekRow`, `DayTile` + aggregators | 7-state tile color/glow spec unchanged |
| Practice illustrations map | `src/data/illustrationMap.ts` | Explicit id→filename; copy PNGs into `public/illustrations/` |
| Supabase schema | `supabase/migrations/*` | Includes fixed `003_device_sessions_anon_access.sql` anon RLS policies |

## Built fresh in v2

- Two-tab bottom nav (Home, Yoga)
- Home (daily quote + Start/Log CTAs)
- Session Selection, Practice Player (placeholder), Success
- Log Practice Selection (bottom-sheet details)
- Yoga: All Practices, My Practices, Progress
- `src/data/dailyQuotes.ts`, `src/data/practiceDetails.ts` (seed until CSV/PDF added)
- Session/recent/log-draft local stores

## Setup

1. Create a **new** Supabase project in the dashboard.
2. Run all SQL files in `supabase/migrations/` in order (001 → 006).
3. Copy `.env.example` → `.env` and set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
4. Copy `practice-illustrations/` PNGs into `public/illustrations/` (47 files per `illustrationMap.ts`).
5. Add reference files when available:
   - `Practice Quotes - Pre.csv` → replace quotes in `src/data/dailyQuotes.ts`
   - `Practice details.pdf` → update `src/data/practiceDetails.ts`

```bash
npm install
npm run dev
```

## Open items

- **App default landing**: **Home** (`/`) after setup — Start/Log CTAs use primary-on-top, secondary-below stacking.
- **Yoga tab**: opens to My Practices (`/yoga/my`); Figma node IDs deferred.

## Spec

See `sadhana-tracker-v2-start-log-spec.md` and `IMPLEMENTATION_CHECKLIST.md`.
