# Slider fullWidth label gap and colour

Id: 2026-11-25-slider-label-gap

`Grille-cf3`, follow-up to `Grille-0u5.2` from Aurora (`Aurora-4nqt.5`), measured on v0.2.2-dev.2.

- Label-to-track gap was 16px against Aurora's 10px. The header's 10px margin (`--ui-size-space-lg`) stacked on the 6px between the 20px track box and the 8px bar. The margin is now `calc(space-lg - 10px + bar/2)`, so the visible gap is 10px.
- The fullWidth label is `--ui-color-text-secondary` (was default text, white). Weight 700 unchanged.

## Open

- No CSS-measuring test exists in the repo. The `Slider, full width` fixture is the only coverage, so the 10px gap needs a check on the `npm run review` page.
- Version bumped to 0.2.2-dev.3, committed, not yet tagged or released (tag and release are the owner's call).

## Verification

- `npx vitest run` (199), `npx tsc --noEmit` and `npm run lint` pass.

## Lessons

- none
