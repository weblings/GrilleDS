# Tooltip opens without a trigger

Id: 2026-11-17-tooltip-standalone

`Grille-83g.7`. `Tooltip` takes `triggerRef`, `isOpen` and `onOpenChange`, so an owner can open it on
an element that is not its own trigger (a Tree row or card focused by its parent). react-aria-components
1.22.1 still throws on a standalone `<Tooltip isOpen>` (`TooltipInner` reads only
`TooltipTriggerStateContext`, checked in the installed source), so Grille wraps it in that context with
a minimal `{ isOpen, open, close }` state, the same pattern `Menu.tsx` uses for row tooltips. With
`isOpen` omitted nothing changes: the tooltip still lives inside a `TooltipTrigger`. No upgrade done.

Fixture: "standalone (isOpen)" in `src/Tooltip.fixture.tsx`. Test: renders with role tooltip on a plain
div and closes when `isOpen` goes false (`src/ui.test.tsx`).

## Verification

- `npm run build`, `npm run typecheck`, `npm run lint` and `npx vitest run` (177, after the Drawer and Dialog beads) pass.
- Not checked: the fixture in Cosmos by eye. Not yet released: v0.1.0-dev.17 ships it.

## Lessons

- none (the Aurora lesson already covers the crash; Grille's row-tooltip lesson covers the context pattern)
