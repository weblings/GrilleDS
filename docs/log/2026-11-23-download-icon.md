# downloadIcon for Aurora's Export graph

Id: 2026-11-23-download-icon

`Grille-1v8`. Aurora's graph editor Export graph button (Aurora-vtm5) needs a download glyph. Vidstack
media-icons 0.10.0 `raw/download.svg` is added to the `names` list in `scripts/vendor-icons.mjs` and regenerated
into `src/icons/download.ts` (viewBox `0 0 32 32`, two paths). Exported as `downloadIcon` from `src/icons/index.ts`,
and the Icon catalog fixture shows it with the rest.

The Vidstack entry in `THIRD_PARTY_NOTICES` lists `download`. Its MIT text (Copyright 2023 Rahim Alwer) is the one
already there, and the installed package's `LICENSE` is the same text, so no licence change.

Icon-count assertions went from 24 to 25 (`src/ui.test.tsx`, `scripts/icon-svg.test.mjs`, `scripts/vendor-icons.test.mjs`).
`dist/icons/download.svg` is emitted by the build.

Version is `0.2.2-dev.1` (the next patch plus a prerelease, since `0.2.1-dev.N` would sort below the published
0.2.1). Tagged `v0.2.2-dev.1`, the Release workflow makes a GitHub prerelease only. Not published to npm.

## Verification

- `npm run build`, `npm run typecheck`, `npm run lint` and `npx vitest run` (191) pass; `dist/icons/download.svg` is emitted. Run from a `D:` cwd: a lowercase `d:` makes vitest load twice and every suite fail.
- Not checked: the fixture in Cosmos by eye.

## Lessons

- none
