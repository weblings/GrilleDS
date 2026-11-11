# Icon component, size tokens and overhang rule

Id: 2026-11-11-icon-component
Status: shipped 2026-11-11 — Grille-ky2.2 closed.

## What landed

- `Icon` (`src/Icon.tsx`) exported from the package root with `IconProps`; `export * from './icons'` also
  exposes the 18 `IconData` objects and types. Props: `icon`, optional `label`, `size` (`md` | `sm`).
- No `label`: `aria-hidden="true"`. With `label`: `role="img"` + `aria-label`. Always `focusable="false"`.
  `fill="currentColor"`; stroked paths (warning outline) get `fill="none"` + `stroke="currentColor"`.
- Tokens `--ui-size-icon` (16), `--ui-size-icon-sm` (12), `--ui-size-icon-overhang` (4).
- Overhang rule (also commented in `ui.css`): the glyph is drawn at layout box + 2x overhang (24 / 20 px)
  and a negative margin of the overhang pulls it back to the layout box. Vidstack's 32 grid and Zest's 24 grid
  both pad their artwork, so both land at the same visual weight as the 12-16 px layout box. Matches Aurora's mock.
- Works with `ui-button[data-icon]` unchanged: the button pads around the layout box.
- Fixture `Icon.fixture.tsx`: all icons at each size, all icons on each button variant x size, a labelled icon.

## Verification

- `npm test` -> 106 passed (per-icon viewBox / aria-hidden / currentColor, labelled, axe on an icon button);
  `npm run typecheck`, `npm run lint`, `npm run build` clean.
- Not checked visually in Cosmos.

## Lessons

- none
