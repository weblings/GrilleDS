# Popover offset and crossOffset

Id: 2026-11-17-popover-offset

`Grille-83g.13`. `Popover` takes `offset` and `crossOffset` (numbers, px) and passes them to React Aria's
Popover. Grille passed neither before, so the defaults are React Aria's own (offset 8, crossOffset 0) and
stay as is when the props are omitted. The `preventScroll` note on the bead is background only, not done.

Fixture: "Popover offset" in `src/Popup.fixture.tsx`: one anchor style with offset 0, 8, 16, a crossOffset
and the default, each popover showing its measured gap and shift. Tests (`src/ui.test.tsx`): jsdom has no
layout, so `getBoundingClientRect` is stubbed and the popover's computed top and left are checked for the
default (anchor bottom + 8) and for offset 16 with crossOffset 24. Real layout is only covered by the fixture.

## Verification

- `npm run build`, `npm run typecheck`, `npm run lint` and `npx vitest run` (180) pass.
- Not checked: the fixture in Cosmos by eye (including its measured gap text). Not yet released: v0.1.0-dev.17 ships it.

## Lessons

- none
