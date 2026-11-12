# Popover trigger press no longer closes then reopens

Id: 2026-11-11-popover-trigger-toggle

`Grille-uqg.1`. Clicking the trigger of an open non-modal Popover blur-closed it (Chrome focuses the
button), then the trigger's toggle reopened it. `src/Popover.tsx` now tracks whether the last
`pointerdown` landed on `triggerRef` and drops the close it causes. Tab out and focus restore are
unchanged. Point-anchored popovers are untouched. Keyboard Shift+Tab onto the trigger still closes
on blur, as before.

## Verification

- New test in `src/ui.test.tsx` (toggle open/closed/open, then Tab out) fails without the fix and
  passes with it. `npx vitest run` -> 136 passed; `npx tsc --noEmit` clean. Not checked in a real
  browser. Cosmos fixture "Trigger toggles open popover" added to `src/Popup.fixture.tsx`.

## Lessons

- Pressing a popover's trigger blur-closes it, then the trigger's toggle reopens it
