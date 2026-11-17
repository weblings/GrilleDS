# Ghost Button variant

Id: 2026-11-17-button-ghost-variant

`Grille-83g.5`. `Button` gains `variant="ghost"`: a borderless icon button for the `...` menus on rows and
heads. Transparent with a text-muted icon, a control-bg fill and text-default on hover or while
`aria-expanded="true"`, control-bg-hover when pressed, and the shared focus ring. Per the owner's answer
it is a variant value, not a separate prop. With `icon`, size sm is a 24px square (new token
`size.button.icon-size-sm`) and md is the existing 31px square. Other variants keep their sm sizing.
Disabled ghost follows the disabled rule (`Grille-83g.4`).

Fixture: `ghost` in `src/Button.fixture.tsx` (sm and md rows: rest, hover, pressed, focus, expanded,
disabled). Hover, pressed and focus are forced with static data attributes on a plain button. There is no
MenuTrigger in Grille, so expanded uses `aria-expanded="true"` as the popup fixtures do. Test: variant, size
and icon markers (`src/ui.test.tsx`).

## Verification

- `npm run build`, `npm run typecheck`, `npm run lint` and `npx vitest run` (160) pass; `--ui-size-button-icon-size-sm` is generated.
- Not checked: the fixture in Cosmos by eye. Not yet released: v0.1.0-dev.17 ships it.

## Lessons

- none
