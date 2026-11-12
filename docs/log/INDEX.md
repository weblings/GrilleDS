# Build log index

Append-only record of closed and paused milestones. Every material fact lands here — set-up,
verification, surprises, dead ends — stated once and tightly. A paused entry records where the work
stands and what resumes it. Planning docs stay clean: decisions, status, and pointers here only.

No backfill: earlier work is recorded in git history and closed beads (`bd list --status=closed`,
`.beads/issues.jsonl`). This log starts on migration day (2026-11-10).

| Date | Milestone | Beads |
|---|---|---|
| 2026-11-10 | [[2026-11-10-agents-md-rewrite]] — AGENTS.md rewrite, CLAUDE.md stub | Grille-x08.5 |
| 2026-11-10 | [[2026-11-10-lessons-seed]] — seed docs/lessons from Aurora, RockyRoad, RockyRoadImport | Grille-x08.4 |
| 2026-11-10 | [[2026-11-10-aurora-docs-migration]] — close out docs parity: CONTRIBUTING/CHANGELOG, skills, pre-commit hooks, plan archived | Grille-x08, Grille-x08.6, Grille-x08.7, Grille-x08.8, Grille-x08.9 |
| 2026-11-11 | [[2026-11-11-slider-fill]] — Slider fills the track up to the thumb | Grille-7o0 |
| 2026-11-11 | [[2026-11-11-icon-source]] — vendored Vidstack, Zest and Aurora icons with third-party notices | Grille-ky2.1 |
| 2026-11-11 | [[2026-11-11-icon-component]] — Icon component, size tokens, overhang rule | Grille-ky2.2 |
| 2026-11-11 | [[2026-11-11-icon-svg-export]] — plain-SVG icon export in dist/icons | Grille-ky2.3 |
| 2026-11-11 | [[2026-11-11-icon-glyph-swap]] — Drawer, Select, Disclosure, Menu, Callout use icons not glyphs | Grille-ky2.4 |
| 2026-11-11 | [[2026-11-11-release-dev9]] — v0.1.0-dev.9 released with the icons | Grille-ky2.5 |
| 2026-11-11 | [[2026-11-11-popover-trigger-toggle]] — trigger press on an open non-modal Popover stays closed | Grille-uqg.1 |
| 2026-11-11 | [[2026-11-11-autocomplete-field-width]] — Autocomplete search field fills a fixed-width container | Grille-uqg.2 |
| 2026-11-11 | [[2026-11-11-menu-selected-item]] — single-select Menu marks the chosen item with a check | Grille-uqg.4 |
| 2026-11-11 | [[2026-11-11-trigger-chevron-flip]] — open dropdown triggers flip their chevron | Grille-uqg.6 |
| 2026-11-11 | [[2026-11-11-tooltip]] — Tooltip and TooltipTrigger with rich content | Grille-uqg.3 |
