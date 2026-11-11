# Components use Grille icons instead of text glyphs

Id: 2026-11-11-icon-glyph-swap
Status: shipped 2026-11-11 — Grille-ky2.4. Icon proportion in small text is still open (see below).

## What landed

- Drawer close is `xMarkIcon`; the bottom-side toggle is `fullscreenArrowIcon` / `fullscreenArrowExitIcon`
  (still `aria-label` Expand/Collapse, `aria-expanded`).
- Select trigger is `chevronDownIcon` (sm). Disclosure uses `chevronRightIcon` rotated 90deg when expanded
  (replaces the CSS `::before` glyphs). Menu `SubmenuItem` uses `chevronRightIcon`. Popup fixture trigger uses `chevronDownIcon`.
- Callout uses `warningIcon` (sm) instead of the `⚠` glyph. StatusMessage uses `warningIcon` / `circledExclamationIcon`
  (sm) instead of `⚠` / `✖`; its icon is top-aligned so it stays on the first line of a wrapped message.
- `warningIcon` is now Zest's `triangle-exclaimation` (trial swap by the owner; Aurora's 34x29 mark is in git history).
- New `circledExclamationIcon`: Zest has no exclamation circle, so it joins the ring of `circled-info` with the bar
  and dot of `triangle-exclaimation` (derived, credited in THIRD_PARTY_NOTICES).
- Vendored Vidstack `chevron-right` (20 icons now; notices, vendor script, counts in tests and icon-source log updated).
- `.ui-button` is now an inline flex row (gap `space-md`) so an icon sits beside the label.
- `IconData.tight`: skips the overhang for edge-to-edge artwork. Added for Aurora's warning mark; unused since the Zest swap.

## Verification

- `npm test` 135 passed; typecheck, lint clean. New per-component tests assert an `svg.ui-icon` and no text glyph.
- Callout and StatusMessage fixtures rendered in headless Chromium. Callout default vs long-text: same 24px icon, but a
  one-line title (16px) makes it look bigger than the two-line one (30px), so Callout uses `size="sm"`.
- Other components not checked in Cosmos by me; the owner reviewed Popup, Callout and Drawer there and found the
  stacked-chevron and oversized-warning bugs fixed here.

## Open

- Owner finds the sm icons out of proportion with 13px status text (visible glyph ~19px vs a ~15px line, from the
  4px overhang). Options proposed; none chosen yet.
- Aurora's mock for the Drawer toggle was not compared against the vendored fullscreen icons.

## Lessons

- An Icon is `display: block`, so any container that isn't flex stacks it under the label
- An icon drawn edge to edge must opt out of the overhang or it renders oversized
