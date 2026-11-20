# StatusMessage font size

Id: 2026-11-17-status-message-font-size

`Grille-83g.15`. `.ui-status-message` set no font size and inherited the page's, so inside a Modal it rendered at 16px.
It now sets `--ui-size-font-sm` (13px), the size consumers already set on the page and the size of the library's other
secondary text (Callout, field labels). New fixture `in a modal` in `src/StatusMessage.fixture.tsx` shows error and neutral
messages in a Modal beside the existing ones.

## Verification

- `npm run build`, `npm run typecheck`, `npm run lint` and `npx vitest run` (165) pass.
- Not checked: the fixture in Cosmos by eye. Not yet released: v0.1.0-dev.17 ships it.

## Lessons

- none
