# Components use Grille icons instead of text glyphs

Id: 2026-11-11-icon-glyph-swap
Status: shipped 2026-11-11 — Grille-ky2.4.

## What landed

- Drawer close is `xMarkIcon`; the bottom-side toggle is `fullscreenArrowIcon` / `fullscreenArrowExitIcon`
  (still `aria-label` Expand/Collapse, `aria-expanded`).
- Select trigger is `chevronDownIcon` (sm). Disclosure uses `chevronRightIcon` rotated 90deg when expanded
  (replaces the CSS `::before` glyphs). Menu `SubmenuItem` uses `chevronRightIcon`. Popup fixture trigger uses `chevronDownIcon`.
- Callout uses `warningIcon` instead of the `⚠` glyph. StatusMessage uses `warningIcon` / `circledExclamationIcon`
  instead of `⚠` / `✖`. Both use the md layout box with no overhang (owner found the overhang sm icons too big for text),
  baseline-aligned and translated so the icon centre meets the capital-letter centre (0.36em above the baseline).
  Measured within ~0.4px of cap centre; wrapped text keeps the icon on line one.
- `warningIcon` is now Zest's `triangle-exclaimation` (the owner dropped Aurora's own 34x29 mark; it survives only in git history).
- New `circledExclamationIcon`: Zest has no exclamation circle, so it joins the ring of `circled-info` with the bar
  and dot of `triangle-exclaimation` (derived, credited in THIRD_PARTY_NOTICES).
- Vendored Vidstack `chevron-right` (20 icons now; notices, vendor script, counts in tests and icon-source log updated).
- `.ui-button` is now an inline flex row (gap `space-md`) so an icon sits beside the label.
- `IconData.tight`: skips the overhang for edge-to-edge artwork. Added for Aurora's warning mark; unused since the Zest swap.

## Verification

- `npm test` 135 passed; typecheck, lint clean. New per-component tests assert an `svg.ui-icon` and no text glyph.
- Callout and StatusMessage fixtures rendered in headless Chromium and measured (icon path box vs canvas cap height).
  Headless had no Inter, so the owner confirmed the final look in Cosmos.
- Other components not checked in Cosmos by me; the owner reviewed Popup, Callout and Drawer there and found the
  stacked-chevron and oversized-warning bugs fixed here.

## Open

- Aurora's mock for the Drawer toggle was not compared against the vendored fullscreen icons.
- `0.36em` is Inter's cap-height centre; revisit if the font changes.

## Lessons

- An Icon is `display: block`, so any container that isn't flex stacks it under the label
- An icon drawn edge to edge must opt out of the overhang or it renders oversized
- An icon beside text needs the layout box and a cap-height offset, not the overhang or flex centring
