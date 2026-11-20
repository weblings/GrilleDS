# Dialog title and actions bar

Id: 2026-11-17-dialog-title-actions

`Grille-83g.3`. `Dialog` takes a `title` prop that renders a real heading (`Heading slot="title"`, 13px bold
text-default), so React Aria labels the dialog through `aria-labelledby`. `DialogProps` is a union:
`title` or `aria-label` is required, so existing `aria-label` callers are unchanged. New `DialogActions`
centres its children with space-lg between (action-size buttons, primary last). Props for the title
(a prop is the natural place for something that must wire the label) and a component for the bar (it is
only a layout wrapper). The space-xl rhythm stays on `.ui-modal > .ui-dialog`, so a Dialog in a Popover
looks as before. Rhythm and placement are unchanged for untitled dialogs.

Fit: the modal is 360px wide with 16px padding and a 1px border. Content-box (no reset) gives 360px
of content, border-box gives 360 - 32 - 2 = 326px. Two 150px buttons plus a 10px gap are 310px, so
they fit either way (16px spare at worst).

Fixture: "Name effect" in `src/Modal.fixture.tsx` is now Aurora's naming dialog. Tests: titled dialog named
and labelled by its heading, action order, aria-label without a title, axe (`src/ui.test.tsx`).

## Verification

- `npm run build`, `npm run typecheck`, `npm run lint` and `npx vitest run` (176, after the Drawer bead) pass.
- Not checked: the fixture in Cosmos by eye. Not yet released: v0.1.0-dev.17 ships it.

## Lessons

- none
