---
name: packaging-release-lessons
description: Known Grille packaging and release gotchas (licenses, fonts, the release tarball's consumer contract) — check before changing what the build ships or what consumers must do.
allowed-tools: Read, Grep, Glob
---

# Packaging and release lessons

Before changing the build output, the release tarball, bundled fonts or licenses, check these lessons.

Lesson files this skill covers:

- [`docs/lessons/packaging-release.md`](../../../docs/lessons/packaging-release.md) — licenses, fonts, consumer contract

## How to use this skill

1. Skim the covered file(s) by headline: `grep -n '^## ' <file>`.
2. Grep `Tags:` and `Applies-when:` for the task at hand (e.g. `grep -n -A1 '^Tags:.*focus' <file>`)
   and read only the matching entries in full before proceeding. Don't skip this because the task
   "seems simple" — these gotchas often fail silently.
3. If you hit a new gotcha not covered, file it per [`docs/lessons/README.md`](../../../docs/lessons/README.md)
   (entry format, Tags/Applies-when contract, which file it belongs in). Keep entries tight.
