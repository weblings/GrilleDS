# MessageRow icon prop

Id: 2026-11-25-message-row-icon

`Grille-qy0`, for Aurora (`Aurora-7p8f`), which masks its own icon over the mark in CSS.

- New optional `icon` (`IconData`) on `MessageRow` replaces the tone's mark. Unset, the mark is unchanged.
- `data-tone` and the error tone colour still apply to a passed icon.
- Fixtures `error custom icon` and `notice custom icon` use `squareChatIcon`.

## Open

- Released in v0.2.2-dev.5 (GitHub prerelease). Aurora's override in `web/ui/styles/shell.css` can go once it takes the release.

## Verification

- `npm test` (202), typecheck, lint and build pass.
- `npm run review -- --base HEAD`: both new fixtures were checked by eye, and the other `MessageRow` fixtures are unchanged.

## Lessons

- none
