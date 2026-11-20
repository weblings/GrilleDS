# Button: Rocky Road 31px default size

Id: 2026-11-13-button-default-size

`Grille-41p`. Decided in Aurora (Aurora-u8jx.7, option C-prime): Rocky Road's button tokens become the
default so Aurora's graph editor drops its local overrides (32px bar rule, `.editor .btn` padding).

- Default Button: radius 5px (new `size.radius.xs`), padding 8px, gap 6px, 12px regular, about 31px tall.
  Gap is 6px, not Rocky Road's 2px: Zest/Vidstack icons are full-bleed and crowd at 2px. Icon button is 32x32.
- Primary is the same size as default and differs only in colour. The large form button (10px 24px, 16px
  semibold, 12px radius) is retired with no replacement.
- New `variant="strong"` (`color.strong.*`: #8b8b8b, hover #7c7c7c, active #6c6c6c, bold, #111 text).
- New `size="action"`: 150x36 at 13px (`size.button.action-width/-height`), for dialog actions.
- `data-size="sm"` kept (6px 10px, about 27px). `size.button.pad-x` removed; nothing else used it.
- Every consumer's default and primary buttons shift about 4px taller.

## Verification

- `npm run lint`, `typecheck` and `npx vitest run` (156) pass. Fixture matrix covers the new variant and size.
- Not checked: rendered height in the viewer or in Aurora/RockyRoad; Aurora bumps after release.

## Lessons

- none
