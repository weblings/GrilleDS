# Packaging and release lessons

Licenses, fonts and the consumer contract of the release tarball. Seeded from Aurora. See
[`README.md`](README.md) for filing rules.

---

## Vite's license output lists JS modules only, so CSS-referenced fonts ship without their license
Tags: vite, licenses, fonts, notices
Applies-when: shipping or importing a stylesheet whose `@font-face` rules pull in font files

`build.license` builds the third-party notices from the JS module graph. Importing a font
stylesheet added six Inter woff/woff2 files (~165 kB) to a consumer's bundle but no Inter or OFL
entry, and the package's `LICENSE-Inter.txt` was not copied.

**Fix:** the library must ship the OFL text with its fonts and document that consumers add it to
their embedded notices by hand when they import the font stylesheet. Ship woff2 only.

Origin: Aurora build-toolchain.md — Vite's license output lists JS modules only, so CSS-referenced fonts ship without their license.

---

## npm publishes need 2FA or a granular bypass token, and CI should use trusted publishing instead
Tags: npm, publish, 2fa, tokens, oidc, trusted-publishing
Applies-when: publishing to npm by hand or adding npm publishing to the Release workflow

The first `npm publish` returned `403 Forbidden ... Two-factor authentication or granular access token
with bypass 2fa enabled is required` (and a `401` before login) until the account had 2FA on for
"Authorization and publishing" and `npm login` was rerun. Classic tokens are gone (revoked Dec 2025);
CI write tokens must be granular with Bypass 2FA and last 90 days at most. A published version can
never be reused.

**Fix:** enable 2FA, re-login, publish the GitHub release asset (`npm publish ./weblings_things-grille-X.Y.Z.tgz`)
so npm and GitHub carry the same bytes. For CI use npm trusted publishing (OIDC): npm CLI 11.5.1+, Node 22.14+,
`id-token: write`, no caching, and `repository.url` matching the repo; new configs default to staged
publish and expire if unused for 2 days (Grille-4kh).

Origin: Grille-4ve, first npm publish of @weblings_things/grille 0.2.1.
