# Power icon

Id: 2026-11-24-power-icon

`Grille-0u5.5`, part of the Aurora dashboard and NUX controls epic (`Grille-0u5`, Aurora ask `Aurora-4nqt.5`).

`powerIcon` added for Aurora's Stop button.

- Source is the owner's tweak of the OpenMoji 23FB power symbol (CC BY-SA 4.0), not Zest Pro or SVG Repo. Redrawn from `Power.svg` as two strokes (open circle arc and stem) on a 24 grid, width 2, centred.
- `IconPath.stroke` gains `round` (round caps and joins). `Icon` and the plain-SVG export both honour it.
- `THIRD_PARTY_NOTICES` has an OpenMoji entry with attribution, licence link and the change statement.
- Icon count tests 24 to 25. The catalog fixture picks the icon up automatically.

## Zest licence audit

- Compared against `32pixelsCo/zest-icons`: minus, circled-info and triangle-exclaimation (warning, and the bar and dot of circled-exclamation) are in `zest-free`. Paths match.
- `undoIcon` and `redoIcon` are Zest Pro only (`zest-pro/images/wysiwyg/undo.svg`, `redo.svg`, same paths). Free has no undo or redo. The notices wrongly call them Zest Free. Removed `undoIcon` and `redoIcon` (`Grille-oat`) since Aurora 1.2.0 uses undo and redo only as text in its Edit menu. Breaking for any consumer importing them. Aurora's matching cleanup is `Aurora-atpm`.
- `downloadIcon` removed (Vidstack path, dropped as unneeded). Its old log entry was deleted.

## Open

- CC BY-SA 4.0 is share-alike for the adapted icon only. The notice says the rest of Grille stays MIT. Worth a second look if a consumer needs a single-licence bundle.
- Dev prerelease for Aurora is held with the rest of the epic. The bead stays open until then.

## Verification

- Full suite, `tsc --noEmit` and lint pass. New tests: round caps in the React and SVG renderings.

## Lessons

- Zest Free label is not proof: filed in `packaging-release.md`.
