# Submenu maxHeight and MenuSection

Id: 2026-11-12-submenu-max-height

`Grille-dyk`. `SubmenuItem` takes `maxHeight` (number = px, or a CSS length), set as
`--ui-submenu-max-height` on the flyout's inner menu; default is the new token
`size.submenu.max-height` (480, the Dashboard Effects panel cap). The flyout popover is a flex column
(React Aria caps it to the space on screen) and the inner `.ui-menu` scrolls with
`overscroll-behavior: contain`, so popover padding still keeps the focus ring inside the clip. New
`MenuSection` (`title`) wraps React Aria's section + header: heading sticky at top on the popup
background, `scroll-padding-top` = new token `size.menu.heading-height` (28) so arrow-key focus never
sits under it. Fixture "Menu long grouped submenu" in `src/Popup.fixture.tsx`.

## Verification

- Tests in `src/ui.test.tsx`: default and numeric/CSS-length maxHeight, section group labels, arrow
  keys skip headings. Typecheck, lint, build pass.
- jsdom has no layout, so scrolling, sticky headings, and the default against Aurora's Add node
  cascade were not checked in a browser; check in Cosmos. Not released yet (no version bump).

## Lessons

- none
