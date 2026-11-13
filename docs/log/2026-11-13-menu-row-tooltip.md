# Menu row tooltip

Id: 2026-11-13-menu-row-tooltip

`Grille-cou`. Rescoped 2026-11-12 after Aurora revisited stage 6 (Aurora-u68h.4): reasons and
problem counts stay out of menus, saves are never disabled, and the unsaved mark is a dot Aurora draws.
What Aurora still needs is the full title of a cut-off Open ▸ item, shown on hover and arrow-key
focus without the nested focusable its `Hint` adds.

- **Shipped:** `tooltip` and `tooltipOnlyWhenTruncated` on `MenuItem` and `SubmenuItem`. Grille's
  Tooltip skin, placed right of the row; opens after 400 ms on hover (`TooltipTrigger`'s delay) and
  at once on keyboard focus; hidden on a submenu row while its flyout is open. Truncation is any
  element in the label with `scrollWidth > clientWidth`, so an ellipsis on a child span counts.
- **Changed:** `description` no longer sets a native `title=`. It is screen-reader text only and
  never shows a tooltip by itself (opt-in chosen over "description falls back to tooltip").
- **Dropped from the earlier branch work:** `descriptionDisplay="line"`, `warning` on items and
  submenu rows (icon, CSS, label alignment), click-to-show on disabled rows, and the A/B mock fixture.
- Fixture "Menu row tooltips" in `src/Popup.fixture.tsx`; README "Tooltips" section.

## Verification

- `npm run lint`, `npm run typecheck`, `npx vitest run` (153) pass. Tests: keyboard open with no
  nested focusable, no `title=` and no console warning; hover with and without truncation (stubbed
  `scrollWidth`); description alone shows nothing; submenu row hides on flyout open.
- Real Chromium (Playwright on the Cosmos export, the new fixture): hover shows nothing at 200 ms
  and the tooltip by 600 ms; the cut-off title (295 of 140 px) shows its tooltip on hover and on
  ArrowRight into the flyout; the fitting "Sunset" shows none; Escape closes flyout and tooltip; no
  `title=`, no nested focusables, no console warnings or errors.
- Not checked: Safari or Firefox, or inside Aurora itself (Aurora swaps its `Hint` after the release).

## Lessons

- A menu row can't host a `TooltipTrigger`; drive `Tooltip` through its state context (components)
