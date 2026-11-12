# Menu single selection shows a check

Id: 2026-11-11-menu-selected-item

`Grille-uqg.4`. Aurora's Test split-button menu marked the current mode with a ", default" suffix.
`Menu` now takes `selectionMode="single"`, `selectedKey` and `onSelectionChange(id)`; items become
`menuitemradio` (`aria-checked`) and a picked item closes the menu (React Aria default).

**Decision: a check (✓), not filled/unfilled radio circles.** Both were mocked in Cosmos. Aurora's
graph-editor mock already draws `✓` in a `.tick` slot for every checked menu item, including its
`menuitemradio` effect picker, so circles would be the odd one out and a swap needs no visual change.
Zest/Vidstack icon sets offered both shapes; neither was needed (the check is Grille-drawn).

`MenuItem` reserves a 16px `.ui-menu-check` slot on every row of a selectable menu so labels stay
aligned, and renders the new `checkIcon` (`src/icons/check.ts`, exported) in the chosen row. Plain
menus get no slot. Icon-count assertions went from 20 to 21.

## Verification

- `npm run lint`, `npx tsc --noEmit` and `npx vitest run` (140) pass. New tests: checked
  `menuitemradio` moves on pick; plain menus have no slot.
- Cosmos fixture "Menu single select" in `src/Popup.fixture.tsx`, screenshotted in dark.

## Lessons

- none
