# powerIcon viewBox padding

Id: 2026-11-25-power-icon-padding

`Grille-jdf`, follow-up to `Grille-0u5.5` from Aurora (`Aurora-4nqt.5`), measured on v0.2.2-dev.2.

- The OpenMoji power path ran edge to edge in its 24 viewBox, so its ink was about 97% of the box in a size sm icon button. `arrowLeft` is about 60%.
- viewBox is now `-4 -4 32 32` (paths unchanged, still centred). Expected ink at size sm is about 12.1 x 12.7px against the arrow's 12.5px.
- The icon viewBox test now allows a negative origin. A new test holds the power ink (19.4 of the grid) at 55 to 70% of the viewBox.

## Open

- Expected sizes are computed from Aurora's measurements, not re-measured in a browser.
- Version bumped to 0.2.2-dev.3, committed, not yet tagged or released (tag and release are the owner's call).

## Verification

- `npx vitest run` (199), `npx tsc --noEmit` and `npm run lint` pass.

## Lessons

- none
