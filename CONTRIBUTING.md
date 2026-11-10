# Contributing to Grille

Grille is the React design-system library (React Aria components, design tokens, Cosmos
fixtures) that Aurora installs from a GitHub release tarball. This file covers the workflow
around the code. Coding agents: the full rules are in [AGENTS.md](AGENTS.md).

## Tasks: beads, not TODO lists

All task tracking goes through [`bd` (beads)](https://github.com/gastownhall/beads) — no
markdown TODOs or checkboxes. Issues live in a local DB; `.beads/issues.jsonl` is the tracked
export that carries them between clones over git.

```sh
bd bootstrap                # fresh clone with no local DB, before the first import
bd import                   # after every git pull
bd ready                    # find available work
bd show <id>                # details + dependencies before editing
bd update <id> --claim      # claim work when starting
bd create --title="..." --description="..." --type=task|bug|feature --priority=2
bd close <id> --reason="..."  # only when the work is actually complete
bd export -o .beads/issues.jsonl   # immediately before git add-ing task state
```

If a failed import left an empty DB, delete `.beads/embeddeddolt/` and retry. Never run
`bd import --reinit-local`, never export with `--include-memories`/`--all` (`bd remember`
notes are clone-local), and don't use `bd dolt push/pull`.

## Version + changelog

The version's single truth is `version` in `package.json` (currently `0.1.0-dev.N`).
`CHANGELOG.txt` is hand-written, newest first, one `vX.Y.Z:` header per release with `- `
bullets in consumer terms (what Aurora sees, not how it was built; prefix internal items
with `Dev -`). Bump both together in a "Version X.Y.Z; ..." commit, only when asked.

## Release

A version commit publishes nothing. Consumers install from the GitHub release tarball,
which exists only after the tag is pushed and the Release workflow
(`.github/workflows/release.yml`) has run.

- Tag the version commit (`git tag vX.Y.Z <commit>`), then push the branch and the tag.
  The tag must match `package.json`'s version or the workflow fails.
- **Never re-tag or replace a release asset.** Consumers' lockfiles record its integrity
  hash. To fix a bad release, cut a new version (as dev.4 replaced the unpublished dev.3).
- Verify with `gh release view vX.Y.Z`.

## Quality gates

Before finishing, all of these must pass:

```sh
npm run build       # tokens + vite + tsc + assets
npm test            # vitest, including the fixture-per-export guard
npm run typecheck
npm run lint        # stylelint + UI-boundary check
```

Every new component export needs a Cosmos fixture (`npm run dev` to view it).

## Pre-commit doc checks

Activate once per clone:

```sh
git config core.hooksPath .beads/hooks
```

`docs/check-lessons.sh`, `docs/check-links.py` and `docs/check-close.py` are the doc-lint
checks; they join the pre-commit hook in Grille-x08.7. Until then, run them by hand after
touching docs. `--no-verify` bypasses the hook.

## Docs

[docs/README.md](docs/README.md) is the map. In short:

- `docs/planning/` — active plans; `docs/archive/` — shipped or abandoned ones, kept as history.
- `docs/lessons/` — non-obvious gotchas, each entry with `Tags:`/`Applies-when:` lines; filing
  rules in [docs/lessons/README.md](docs/lessons/README.md).
- `docs/log/` — dated file plus a `docs/log/INDEX.md` row when a milestone closes or pauses.
- Cite other docs as `[[id]]` (each doc has an `Id:` line under its H1), not by path.
  [docs/_ids.md](docs/_ids.md) maps ids to current paths; it's generated, don't hand-edit.
