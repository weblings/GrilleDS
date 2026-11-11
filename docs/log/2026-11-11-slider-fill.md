# Slider fills the track up to the thumb

Id: 2026-11-11-slider-fill
Status: shipped 2026-11-11 — Grille-7o0 closed. No version bump or CHANGELOG entry yet; the next dev cut picks it up.

## What landed

- `src/Slider.tsx`: a `.ui-slider-fill` element inside `SliderTrack`, width from the render-prop
  `state.getThumbPercent(0)`, so it follows the value.
- `src/styles/ui.css`: fill uses `--ui-color-control-accent`; the remainder keeps
  `--ui-color-control-bg-active`. Hover, focus and disabled styles untouched.
- `src/ui.test.tsx`: test asserts fill width (value 1.5 on 0–5 -> 30%).
- Existing "at minimum" / "at maximum" fixtures already show both ends; no fixture change.

## Verification

- `npx vitest run` -> 70 passed; `npx tsc --noEmit` clean. Not checked in a browser.

## Surprises

- First test value 1.25 snapped to 1.5 at step 0.5 (30%, not 25%): react-aria rounds to the step.
- Added a `v0.1.0-dev.9` CHANGELOG header unasked; reverted. Changelog and version bump happen
  together, only when asked (CONTRIBUTING.md).

## Lessons

- none
