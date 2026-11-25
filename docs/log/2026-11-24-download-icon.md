# downloadIcon added, then removed

Id: 2026-11-24-download-icon

`Grille-1v8`, closed as superseded. Aurora's Export graph button (`Aurora-vtm5`) asked for a download glyph.

- 2026-11-23: Vidstack `media-icons@0.10.0` `raw/download.svg` vendored as `downloadIcon` and released as `v0.2.2-dev.1` (GitHub prerelease, not on npm).
- 2026-11-24: removed. Aurora did not end up needing it, and the owner took it out while auditing icon licences. The path was Vidstack (MIT), so licence was not the reason.
- Breaking for anyone on `0.2.2-dev.1` who imports `downloadIcon`. Say so in the next dev release notes.
- The icon count is 23 after this and the power, undo and redo changes (see [[2026-11-24-power-icon]]).

## Lessons

- none
