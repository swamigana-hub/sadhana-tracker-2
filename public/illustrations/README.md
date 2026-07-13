# Practice illustrations

PNG files served at `/illustrations/{filename}.png`.

## Adding / updating files

1. Place PNGs in this folder (transparent backgrounds).
2. Register each practice in `src/data/illustrationMap.ts` (`PRACTICE_ILLUSTRATION_FILES`) — filenames are **not** derived from practice IDs (e.g. `thoppukarnam` → `thoppu-karnam.png`).

Practices without a map entry show a gradient placeholder.

Run `npm run check:images` to audit PNG sizes.
