# Implementation Checklist — Sadhana Tracker v2 Start/Log

## Section 1 — Entry Points
- [x] 1.1 Home loads with quote, CTAs, bottom nav (quote deterministic by date)
- [x] 1.2 Start Practice → Session Selection
- [x] 1.3 Log Practice → Log Practice Selection
- [x] 1.4 Yoga tab → Yoga section (Home remains default app landing)

## Section 2 — Start a Practice
- [x] 2.1 Session Selection layout (recent, lists, collapsed all-other, sticky CTA)
- [x] 2.2 Checkbox selection + disabled Start Session
- [x] 2.3 Recent session card pre-check / toggle / auto-clear highlight
- [x] 2.4 Selections do not persist on leave
- [x] 2.5 Start Session → Player (not blocked by save)
- [x] 2.6 Practice Player placeholder
- [x] 2.7 Resume active session on return
- [x] 2.8 Complete Session → Success (optimistic + silent retry)

## Section 3 — Log a Practice
- [x] 3.1 Log Practice Selection layout
- [x] 3.2 Bottom sheet details (cycles/duration, chips, re-open)
- [x] 3.3 All-other adds to Other schedule
- [x] 3.4 Log draft persists in localStorage
- [x] 3.5 Log Practices → Success

## Section 4 — Success Screen
- [x] 4.1 Headline, Today ring, enlarged This Week row, Done
- [x] 4.2 Done → Home

## Section 5 — Yoga tab
- [x] 5.1 All Practices catalog + chips + setup re-entry
- [x] 5.2 Add bottom sheet (Daily/Other, max-2 message)
- [x] 5.3 My Practices Today + lists + sticky CTAs + empty daily
- [x] 5.4 Manage bottom sheet (remove / move)
- [x] 5.5 Progress aggregates + weekly heatmap

## Section 6 — System
- [x] 6.1 Optimistic saves + silent retry (`syncQueue`, `useCompletionWriter`)
- [x] 6.2 Load failure inline retry (Session Selection scaffold)
- [x] 6.3 PWA scope (same as v1)

## Bootstrap
- [x] Separate repo/folder
- [x] Supabase migrations copied with fixed RLS
- [ ] New Supabase project credentials (user action)
- [ ] Illustration PNGs copied to `public/illustrations/`
- [ ] Practice Quotes CSV / Practice details PDF seeded from source files
