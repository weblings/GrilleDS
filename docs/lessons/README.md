# Lessons learned — index and filing rules

Gotchas, non-obvious findings, and hard-won decisions that aren't obvious from reading the code or
planning docs. Add here whenever something costs more than 30 minutes to diagnose.

**This directory is the only lessons-learned location in the repo.** Don't start a new
LessonsLearned elsewhere; if unsure whether one already exists, `find . -iname "*lesson*"` first.

## Index

| File | Scope | Entries | File here when |
|---|---|---|---|
| [components.md](components.md) | Focus, ARIA, popups, events, test queries for React Aria components | 8 | a component misbehaves around focus, keys, popovers or option values |
| [css-tokens.md](css-tokens.md) | Cascade, specificity, shared tokens, focus rings | 8 | a style is overridden, ignored or inconsistent across controls |
| [packaging-release.md](packaging-release.md) | Licenses, fonts, consumer contract of the release tarball | 1 | changing what the build ships or what consumers must do |
| [engineering-hygiene.md](engineering-hygiene.md) | Verification and workflow habits, library-vs-consumer boundaries | 4 | the lesson is about how to verify or hand off work, not one component |

Counts as of 2026-11-11. Bump the count when adding entries (`grep -c '^## '` per file).

## Where a new lesson goes

1. About an agent's own verification/reliability habits, specific to this clone, not code/design?
   → `bd remember`, not the repo.
2. Otherwise → the lesson file whose scope row above matches; if none fits, add a file and a row.
3. Cross-cutting entry? File under whichever system *constrains the fix*, not whichever exhibited
   the symptom.
4. Destination file too long to skim (rough proxy: 15+ entries)? Split along a finer cut of the same
   activity, into a new sibling file, then update this index and any entry or comment that pointed
   at the old filename.

## Entry format

A `##` headline stating the general, reusable principle, immediately followed by `Tags:` and
`Applies-when:` lines (the retrieval contract), then a short root-cause paragraph and a bolded
**Fix:** (or **How to apply:**) line.

Cite entries by headline, never by filename — headlines survive splits, filenames don't.
