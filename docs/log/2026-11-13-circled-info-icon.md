# circledInfoIcon

Id: 2026-11-13-circled-info-icon

`Grille-a0y`. New `circledInfoIcon` from Zest `symbols/circled-info.svg` (24 grid, evenodd), exported from
`src/icons/index.ts` and written to `dist/icons/circled-info.svg`. Credited in THIRD_PARTY_NOTICES.
Icon-count tests go 22 to 23. Aurora uses it for the notice mark (Aurora-u8jx.5, bump in Aurora-u8jx.10).

Missed dev.14: it was uncommitted when that tag was cut, so it ships in dev.15
([[2026-11-13-release-dev15]]).

## Verification

- Lint, typecheck, build, `npm test` (156) and `scripts` tests (41) pass.
- Not checked: the glyph in Cosmos by eye.

## Lessons

- Reconcile `git status` against beads before tagging (filed in `docs/lessons/engineering-hygiene.md`).
