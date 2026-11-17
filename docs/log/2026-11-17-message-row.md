# MessageRow

Id: 2026-11-17-message-row

`Grille-83g.1`. New `MessageRow`: an outlined error or notice row (2px default border, new `radius-lg` token at 12px,
10px/16px padding, `text-wrap: pretty`) that replaces the hand-written `shell-banner-row` markup in Aurora. Props: `message`,
`tone` (`'error' | 'notice'`, default notice, no warning tone by decision), `id`, `children` (slot under the text), `onDismiss`
and `dismissLabel`. Presentational only: no role or live region. The mark (circled exclamation in `text-error`, circled
info in the text colour) is a grid column of its own, centred on grid row 1 (the message lines only), while the slot sits
in row 2 under the text column and the dismiss (a 24px ghost icon button) in row 1 at top right, centred on the first line with
`margin-block: calc((1lh - 24px) / 2)` so it never grows the row. The mark keeps the shared icon overhang, so it
matches other Grille icons. `StatusMessage` is unchanged.

Fixtures: `src/MessageRow.fixture.tsx` (error and notice at 1, 2 and 6 lines, each plain, with buttons, with dismiss, with
both). Tests: `src/ui.test.tsx` (no role or live region, id passes through, mark per tone, dismiss callback and name, axe).

## Verification

- `npm run build`, `npm run typecheck`, `npm run lint` and `npx vitest run` (165) pass.
- Not checked: the fixture in Cosmos by eye. Not yet released: v0.1.0-dev.17 ships it.

## Lessons

- none
