# Components use Grille icons instead of text glyphs

Id: 2026-11-11-icon-glyph-swap
Status: shipped 2026-11-11 — Grille-ky2.4 (StatusMessage glyphs still open, see below).

## What landed

- Drawer close is `xMarkIcon`; the bottom-side toggle is `fullscreenArrowIcon` / `fullscreenArrowExitIcon`
  (still `aria-label` Expand/Collapse, `aria-expanded`).
- Select trigger is `chevronDownIcon` (sm). Disclosure uses `chevronRightIcon` rotated 90deg when expanded
  (replaces the CSS `::before` glyphs). Menu `SubmenuItem` uses `chevronRightIcon`. Popup fixture trigger uses `chevronDownIcon`.
- Callout uses `warningIcon` instead of the `⚠` glyph.
- Vendored Vidstack `chevron-right` (19 icons now; notices, vendor script, counts in tests and icon-source log updated).
- `.ui-button` is now an inline flex row (gap `space-md`) so an icon sits beside the label.
- `IconData.tight`: set on the warning icon so it skips the overhang (see the lesson on edge-to-edge icons).

## Verification

- `npm test` 133 passed; typecheck, lint clean. New per-component tests assert an `svg.ui-icon` and no text glyph.
- Callout fixtures rendered in headless Chromium: icon 16x16 beside the title, long title wraps by design.
- Other components not checked in Cosmos by me; the owner reviewed Popup, Callout and Drawer there and found the
  stacked-chevron and oversized-warning bugs fixed here.

## Open

- `StatusMessage` still uses `✖` / `⚠` and a test asserts the text; needs an error icon choice from the owner.
- Aurora's mock for the Drawer toggle was not compared against the vendored fullscreen icons.

## Lessons

- An Icon is `display: block`, so any container that isn't flex stacks it under the label
- An icon drawn edge to edge must opt out of the overhang or it renders oversized
