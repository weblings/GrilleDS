# @weblings_things/grille 0.2.1 is live on npm

Id: 2026-11-22-npm-published

Status: shipped 2026-11-22 — follow-up to [[2026-11-22-npm-publish-prep]] (Grille-4ve).

## What landed

- v0.2.1 (PR #12) was tagged, the Release workflow attached `weblings_things-grille-0.2.1.tgz`, and the owner
  published that asset to npm by hand. `npm view @weblings_things/grille version --prefer-online` returns `0.2.1`,
  dist-tag `latest`.
- The first attempt failed with a 403 (the account lacked 2FA for publishing), then a 401; fixed by enabling 2FA
  and logging in again. Nothing was uploaded by the failed attempts.
- AGENTS.md, CONTRIBUTING.md and the `release.yml` header now say Aurora installs from npm and that publishing is
  manual until Grille-4kh (trusted publishing in the workflow).

## Verification

- The release asset was extracted and checked before publishing: 92 files, no woff or test types, name and version
  correct, 132,458 bytes.
- Registry check after publish: version 0.2.1, `latest`.

## Lessons

- npm publishes need 2FA or a granular bypass token, and CI should use trusted publishing instead (packaging-release)
