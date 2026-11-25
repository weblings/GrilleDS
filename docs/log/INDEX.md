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
| 2026-11-11 | [[2026-11-11-release-dev10]] — v0.1.0-dev.10 released with the Aurora editor fixes | Grille-uqg.5, Grille-uqg |
| 2026-11-12 | [[2026-11-12-submenu-max-height]] — SubmenuItem maxHeight with scrolling flyout, MenuSection sticky headings | Grille-dyk |
| 2026-11-12 | [[2026-11-12-inspector-visual-pass]] — Inspector restyled to the dark shell, with value previews | Grille-e5t.9 |
| 2026-11-12 | [[2026-11-12-release-dev11]] — v0.1.0-dev.11 released with scrolling submenus | Grille-dyk |
| 2026-11-13 | [[2026-11-13-dot-icon]] — dotIcon for status marks | Grille-ky2.6 |
| 2026-11-13 | [[2026-11-13-menu-row-tooltip]] — MenuItem and SubmenuItem row tooltip, optionally only when cut off | Grille-cou |
| 2026-11-13 | [[2026-11-13-release-dev12]] — v0.1.0-dev.12 released with menu row tooltips and dotIcon | Grille-cou, Grille-ky2.6 |
| 2026-11-13 | [[2026-11-13-section-title-node]] — MenuSection and Section title typed as ReactNode | Grille-ahg |
| 2026-11-13 | [[2026-11-13-release-dev13]] — v0.1.0-dev.13 released with section title as ReactNode | Grille-ahg |
| 2026-11-13 | [[2026-11-13-button-default-size]] — Button default is the Rocky Road 31px size; strong variant, action size | Grille-41p |
| 2026-11-13 | [[2026-11-13-release-dev14]] — v0.1.0-dev.14 released with the Button default size | Grille-41p |
| 2026-11-13 | [[2026-11-13-circled-info-icon]] — circledInfoIcon | Grille-a0y |
| 2026-11-13 | [[2026-11-13-release-dev15]] — v0.1.0-dev.15 released with circledInfoIcon | Grille-a0y |
| 2026-11-13 | [[2026-11-13-button-icon-31]] — icon-only Button is a 31px square | Grille-kca |
| 2026-11-13 | [[2026-11-13-release-dev16]] — v0.1.0-dev.16 released with the 31px icon-only Button | Grille-kca |
| 2026-11-17 | [[2026-11-17-grip-icon]] — gripIcon drag handle | Grille-83g.9 |
| 2026-11-17 | [[2026-11-17-button-disabled-variants]] — a disabled Button keeps its variant colours, dimmed | Grille-83g.4 |
| 2026-11-17 | [[2026-11-17-button-ghost-variant]] — Button variant="ghost", a borderless icon button | Grille-83g.5 |
| 2026-11-17 | [[2026-11-17-message-row]] — MessageRow: outlined error or notice row with a centred mark, plus radius-lg | Grille-83g.1 |
| 2026-11-17 | [[2026-11-17-status-message-font-size]] — StatusMessage sets its own 13px font size | Grille-83g.15 |
| 2026-11-17 | [[2026-11-17-textfield-form]] — TextField aria-label form, placeholder, autoFocus, isInvalid, fill, multiline | Grille-83g.2, Grille-83g.11 |
| 2026-11-17 | [[2026-11-17-drawer-head]] — Drawer: head actions slot, muted count, hideControls, automatic divider | Grille-83g.6 |
| 2026-11-17 | [[2026-11-17-dialog-title-actions]] — Dialog title heading and DialogActions centred action-button bar | Grille-83g.3 |
| 2026-11-17 | [[2026-11-17-tooltip-standalone]] — Tooltip triggerRef, isOpen and onOpenChange for use outside a TooltipTrigger | Grille-83g.7 |
| 2026-11-17 | [[2026-11-17-menu-describedby]] — Menu takes aria-label or aria-labelledby, plus aria-describedby | Grille-83g.12 |
| 2026-11-17 | [[2026-11-17-popover-offset]] — Popover offset and crossOffset props | Grille-83g.13 |
| 2026-11-17 | [[2026-11-17-tree]] — Tree, TreeSection, TreeCard with controlled expandedKeys | Grille-83g.8 |
| 2026-11-17 | [[2026-11-17-tree-drag]] — Tree dragAndDropHooks, TreeDragHandle, TreeDropIndicator, drag and drop states | Grille-83g.14 |
| 2026-11-17 | [[2026-11-17-release-dev17]] — v0.1.0-dev.17 released with the Aurora controls panel components | Grille-83g.10 |
| 2026-11-19 | [[2026-11-19-release-0-2-0]] — v0.2.0 released, the first stable version | Grille-0up, Grille-uoq, Grille-e5t, Grille-ky2 |
| 2026-11-22 | [[2026-11-22-npm-publish-prep]] — npm publish prep, rename to @weblings_things/grille, 0.2.1 | Grille-4ve |
| 2026-11-22 | [[2026-11-22-npm-published]] — @weblings_things/grille 0.2.1 live on npm; release docs updated | Grille-4ve |
| 2026-11-23 | [[2026-11-23-switch]] — Switch component matching Aurora's toggle, prerelease held | Grille-0u5.1 |
| 2026-11-24 | [[2026-11-24-slider-aurora]] — Slider onChangeEnd, fullWidth layout and Aurora colours, prerelease held | Grille-0u5.2 |
| 2026-11-24 | [[2026-11-24-select-aurora]] — Select {id, label} options, isDisabled, fullWidth, prerelease held | Grille-0u5.3 |
| 2026-11-24 | [[2026-11-24-disclosure-accordion]] — Disclosure accordion variant, isExpanded/onExpandedChange, prerelease held | Grille-0u5.4 |
| 2026-11-24 | [[2026-11-24-power-icon]] — powerIcon from OpenMoji (CC BY-SA 4.0), round-cap strokes, prerelease held | Grille-0u5.5 |
| 2026-11-24 | [[2026-11-24-download-icon]] — downloadIcon added in dev.1 then removed, Aurora did not need it | Grille-1v8 |
| 2026-11-25 | [[2026-11-25-release-0-2-2-dev-2]] — v0.2.2-dev.2 prerelease with the Aurora dashboard and NUX controls | Grille-0u5 |
| 2026-11-25 | [[2026-11-25-slider-label-gap]] — Slider fullWidth 10px label gap and secondary label colour, released in v0.2.2-dev.3 | Grille-cf3 |
| 2026-11-25 | [[2026-11-25-power-icon-padding]] — powerIcon viewBox repadded to -4 -4 32 32, released in v0.2.2-dev.3 | Grille-jdf |
| 2026-11-25 | [[2026-11-25-slider-header-gap]] — --ui-slider-header-gap variable for aligning a fullWidth Slider track, released in v0.2.2-dev.4 | Grille-rga |
| 2026-11-25 | [[2026-11-25-square-chat-icon]] — squareChatIcon from Zest Free, released in v0.2.2-dev.4 | Grille-p22 |
| 2026-11-25 | [[2026-11-25-switch-motion]] — Switch eases track and knob over 0.2s, off under reduced motion, released in v0.2.2-dev.4 | Grille-chz |
| 2026-11-25 | [[2026-11-25-square-chat-icon-padding]] — squareChatIcon viewBox padded to -0.8 -0.8 25.6 25.6, released in v0.2.2-dev.5 | Grille-6co |
| 2026-11-25 | [[2026-11-25-message-row-icon]] — MessageRow optional icon prop replaces the tone mark, released in v0.2.2-dev.5 | Grille-qy0 |
