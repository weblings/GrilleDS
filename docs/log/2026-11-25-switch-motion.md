# Switch motion

Id: 2026-11-25-switch-motion

`Grille-chz`. Switch eases the track `background-color` and the knob `transform` over 0.2s, matching Aurora's
`.toggle-switch`. Consumer bead: `Aurora-4nqt.7`.

- Both transitions sit inside `@media (prefers-reduced-motion: no-preference)` in `src/styles/ui.css`.
- The chevron rotations (Select, Disclosure, Tree) are unchanged and still ignore the preference.

## Open

- Released in v0.2.2-dev.4 (GitHub prerelease).

## Verification

- `npm test` (201), typecheck, lint and build pass.
- Headless Chromium on `dist/ui.css`: 0.2s on track and knob with `no-preference`, none with `reduce`.
- The motion was not checked by eye in Cosmos.

## Lessons

- none
