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
