# squareChatIcon viewBox padding

Id: 2026-11-25-square-chat-icon-padding

`Grille-6co`, follow-up to `Grille-p22` for Aurora (`Aurora-7p8f`).

- The glyph's ink is 22 x 24 on its 24 grid against 22 x 22 for the circled marks, so it read larger at a shared size.
- viewBox is now `-0.8 -0.8 25.6 25.6` (paths unchanged), which draws it at 93.75%.
- The icon viewBox test now allows decimals.

## Open

- Released in v0.2.2-dev.5 (GitHub prerelease).

## Verification

- `npm test` (202), typecheck, lint and build pass. `dist/icons/square-chat.svg` carries the new viewBox.
- `npm run review -- --base HEAD`: the `Icon` fixtures show as Changed.

## Lessons

- none
