# Disabled Button keeps its variant look

Id: 2026-11-17-button-disabled-variants

`Grille-83g.4`. `.ui-button[data-disabled]` swapped every variant to control-bg and text-disabled, so a
disabled primary read as a muted secondary. It now only sets `opacity: 0.4` and the not-allowed cursor,
so primary, secondary and strong each keep their own colours (as in Aurora's mock). Hover and pressed
styles do not apply while disabled because React Aria sets neither state on a disabled button.

Fixture: `disabled variants` in `src/Button.fixture.tsx` (each variant enabled beside disabled). Test: a
disabled primary keeps `data-variant` and `data-disabled` (`src/ui.test.tsx`).

## Verification

- `npm run build`, `npm run typecheck`, `npm run lint` and `npx vitest run` (159) pass.
- Not checked: the fixture in Cosmos by eye. Not yet released: v0.1.0-dev.17 ships it.

## Lessons

- none
