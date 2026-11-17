# Menu aria-describedby and aria-labelledby

Id: 2026-11-17-menu-describedby

`Grille-83g.12`. `MenuProps` now takes `aria-label` or `aria-labelledby` (a union that requires one) and an
optional `aria-describedby`, all passed to the menu element, so a description line above the menu in a
Dialog is announced with it. Existing callers pass `aria-label` and compile unchanged. The announcement
itself is a manual device check in `Aurora-e4bi.9`.

Fixture: "Menu with a description" in `src/Popup.fixture.tsx`. Test: the menu element carries the
attribute and the labelledby id (`src/ui.test.tsx`, attribute only).

## Verification

- `npm run build`, `npm run typecheck`, `npm run lint` and `npx vitest run` (178) pass.
- Not checked: the fixture in Cosmos by eye. Not yet released: v0.1.0-dev.17 ships it.

## Lessons

- none
