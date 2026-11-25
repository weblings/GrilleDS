# Slider header gap variable

Id: 2026-11-25-slider-header-gap

`Grille-rga`, ask from Aurora (`Aurora-4nqt.7`): a supported way to align a `fullWidth` Slider track with neighbouring controls in a row.

- `--ui-slider-header-gap` sets the header's bottom margin. The old formula is its `var()` fallback, so the unset layout is unchanged (4px at an 8px bar).
- It is not declared on `.ui-slider`, so a value set on a parent is inherited.
- It is a manual offset (about 11.5px in Aurora's row), not automatic alignment. A larger gap makes the slider taller by the same amount.
- Aurora's `.ui-slider-header` margin override still wins and can be replaced by the variable.
- New `Slider, full width, header gap` fixture. `CHANGELOG.txt` entry is under Unreleased.

## Open

- Committed, not yet tagged or released. The version bump, tag and release are the owner's call. The bead was closed at commit on the owner's instruction.
- The `npm run review` page was not run.

## Verification

- Chromium measurement of static markup with the built token and skin CSS, before and after: unset stays 4px (60px tall), the variable on the slider or a parent gives 11.5px (67.5px tall), a direct margin override still gives 11.5px.
- `npx vitest run` (201, including uncommitted `Grille-p22` work in the same tree), typecheck and lint pass.

## Lessons

- Filed in CSS and tokens lessons: an opt-in custom property belongs in the `var()` fallback.
- Filed in engineering hygiene lessons: measure a CSS change in a real browser, before and after.
