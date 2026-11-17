# Drawer head: actions, count, optional controls

Id: 2026-11-17-drawer-head

`Grille-83g.6`. `Drawer` gains `actions` (ReactNode, placed before the built-in controls), `count`
(number, muted after the title, outside the `h2` so the region's name stays the title) and
`hideControls` (omits the close and full-height buttons). A 1px `border-default` rule is drawn
between actions and the built-in controls only when both exist, with no prop. Escape and focus
handling never used the close button (focus goes to the section, Escape is a window and section
listener), so they are unchanged. The toggle lost its `margin-left: auto`: the heading group now
takes the free space. The edge grab tab is not included, as the bead says.

Fixtures (`src/Drawer.fixture.tsx`): "Head menu and count, right" and "..., bottom" (ghost icon
Button opening a Menu, no built-in controls), "Actions with built-in controls" (divider). Tests:
`src/ui.test.tsx` Drawer block (count, actions order and divider, no divider alone, hideControls plus
Escape).

## Verification

- `npm run build`, `npm run typecheck`, `npm run lint` and `npm test` (172) pass.
- Not checked: the fixture in Cosmos by eye. Not yet released: v0.1.0-dev.17 ships it.

## Lessons

- none
