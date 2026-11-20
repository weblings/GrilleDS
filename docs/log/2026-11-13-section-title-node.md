# Section titles as ReactNode

Id: 2026-11-13-section-title-node

`Grille-ahg`. `MenuSectionProps.title` and `SectionProps.title` were typed `string` but only render as
the header's children, so Aurora cast a node (`'Not saved yet'` + `dotIcon` + hidden ", unsaved
changes") `as unknown as string`. Both are now `ReactNode`, matching `SubmenuItem`'s `label`. No
runtime change; the group's accessible name is the heading's text content, so an icon needs visually
hidden text beside it (noted on the prop). No separate plain-text prop added: nothing needs one yet.

Fixture: a "Not saved yet" section in the long grouped submenu (`src/Popup.fixture.tsx`). Test: the group
is named by the node's text and contains the icon (`src/ui.test.tsx`).

## Verification

- `npm run typecheck`, `npm run lint`, `npm run build` and `npx vitest run` (154) pass.
- Not checked: the heading in Cosmos by eye. Not yet released: the next `v0.1.0-dev.*` ships it;
  Aurora follow-up `Aurora-j8i6` drops the cast after bumping.

## Lessons

- none
