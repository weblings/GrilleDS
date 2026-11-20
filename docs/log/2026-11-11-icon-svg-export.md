# Plain-SVG icon export

Id: 2026-11-11-icon-svg-export
Status: shipped 2026-11-11 — Grille-ky2.3 closed.

## What landed

- Owner chose individual files over a sprite: Chrome blocks external `<use href>` on `file://` pages, which the
  Aurora mocks are. Files work with `<img>`, CSS mask and copy-into-folder mocks.
- `npm run build` writes `dist/icons/<name>.svg` (18 files, kebab-case: `chevron-down`, `x-mark`) via
  `scripts/build-icon-svgs.mjs`, which reads the built `dist/index.js` so the files can't drift from `Icon`.
  `scripts/icon-svg.mjs` holds the pure `iconToSvg` / `writeIconSvgs`.
- `package.json` exports `./icons/*.svg`; `dist` already ships, so `npm pack` includes them (18 files checked).
- Same paths as `Icon`: viewBox, `fill="currentColor"`, stroked paths get `fill="none" stroke="currentColor"`.
  No width/height; the overhang (drawing past the layout box) is not baked in.
- `<img>` can't inherit `currentColor` and draws black; README documents the CSS-mask and inline alternatives.

## Verification

- `scripts/icon-svg.test.mjs`: one file per icon, kebab names, each file's path `d` list equals the React
  `Icon` render, warning stroke. `npm test` 127 passed; typecheck, lint, build clean.

## Lessons

- none
