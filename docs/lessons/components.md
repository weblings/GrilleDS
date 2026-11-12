# Component lessons

Focus, ARIA, popups, events and test queries for Grille's React Aria components. Seeded from
Aurora and RockyRoad (origin line on each entry). See [`README.md`](README.md) for filing rules.

---

## A non-modal panel hears Esc only with focus inside, and a host's document-level key listeners still fire from it
Tags: drawer, keyboard, focus, events
Applies-when: placing a Grille Drawer (or any non-modal panel) beside a host that listens for keys on `document`

A Drawer takes focus on its own non-input container when it opens, so a host's document-level
shortcut (a canvas's Delete/Backspace) skips only inputs and contenteditable and fires from the
drawer. The Drawer closes on Esc only through its own `onKeyDown`, so after a click elsewhere Esc
does nothing.

**Fix:** the host disables its key handling while focus is inside the panel (`onFocus`/`onBlur` on
a wrapper) and adds its own window Esc handler that yields to open menus and popups. The library
should not assume it owns the document's keys.

Origin: Aurora components.md — React Flow's Delete and Backspace fire from a drawer, and Grille's Drawer hears Esc only with focus inside.

---

## React Aria popups on a host that captures pointer or keyboard need explicit workarounds
Tags: react-aria, popover, menu, focus, keyboard
Applies-when: a Menu, Popover or Autocomplete opens over a host surface (canvas, editor) that handles pointer and keys itself

A pointer-anchored Popover (a 0x0 fixed div as `triggerRef`) works, with these gaps:

- Host key handlers at the document (Delete/Backspace) act under an open menu. Stop propagation for
  those keys only; stopping all keys also swallows Esc.
- The anchor is not focusable, so focus ends on `body` after close. Refocus the element that was
  active on open.
- The Popover does not follow a moved anchor, so key it on the pointer coordinates.
- Modal popovers (the default) need two clicks to select underneath and block wheel zoom. Use
  `isNonModal`, which then leaves a pane drag not dismissing the menu.
- A shortcut that opens a search field must call `preventDefault`, or the keypress is typed into it.

**Fix:** apply per gap as above; check each in a real browser, not jsdom.

Origin: Aurora components.md — React Aria popups on the React Flow canvas need five workarounds.

---

## Disabling the focused control drops focus to body, and focus() on a disabled control does nothing
Tags: focus, disabled, aria, keyboard
Applies-when: a control is disabled while busy and the design also returns focus to it

Disabling the focused trigger moves `activeElement` to `body`, and `focus()` on the disabled
trigger leaves focus where it was. Keyboard and screen-reader users lose their place until they
Tab back in; focus does not return when the control is re-enabled.

**Fix:** accept the loss for short waits, or use `aria-disabled="true"` and ignore clicks and keys
in the handlers. That keeps focus, but the control stays in the tab order and every input path must
be blocked by hand.

Origin: Aurora components.md — Disabling the focused control drops focus to body, and focus() on a disabled control does nothing.

---

## An ARIA pattern that commits a value on every interaction needs adapting when the commit callback has side effects
Tags: aria, listbox, select, callbacks
Applies-when: wrapping a reference interaction pattern around an `onSelect`/`onChange` that is not a cheap value assignment

The APG collapsible-listbox keyboard model is "select follows focus": each arrow press moves the
cursor and commits the option. Implemented literally it fires `onSelect` per arrow press, while a
consumer's callback may switch a device or hit a REST endpoint before the user has decided.

**Fix:** verify the real spec, then diverge deliberately. Keep `aria-activedescendant` moving live
(screen readers still announce "option 3") but fire `onSelect` and set `aria-selected` only on an
explicit commit (Enter, Space, click, Tab-out).

Origin: Aurora components.md — An ARIA pattern that commits a value on every interaction needs adapting when the commit callback has real side effects.

---

## A shared component's value-matching can silently assume every option value is a string
Tags: types, dataset, select, silent-failure
Applies-when: a reusable component compares option values against a DOM-derived value

`dataset.value` is always a string, so `options.find(o => o.value === btn.dataset.value)` never
matches a numeric option (`5 === "5"`). Clicking did nothing, with no error, until the first
caller with a non-string value appeared.

**Fix:** normalize explicitly (`String(o.value) === btn.dataset.value`), or avoid the round trip
through the DOM by keying on index. Add a numeric-valued case to the component's tests.

Origin: Aurora components.md — A shared component's internal value-matching can silently assume every caller's option value is a string.

---

## `stopPropagation()` on a popover trigger splits "close on outside click" from "close sibling popovers"
Tags: events, popover, outside-click, stopPropagation
Applies-when: implementing close-on-outside-click or close-sibling-popovers

A trigger's own click handler that stops propagation keeps the click from a single `document`
listener, forcing a separate sibling-closing mechanism. Without it, one bubble-phase document
listener with a containment check handles both, because the target's own handler has already run
and updated its state.

**Fix:** remove the `stopPropagation()` and use one bubble-phase document listener; capture phase
would see stale state.

Origin: RockyRoad desktop-dom.md — stopPropagation() on a popover trigger silently splits "close on outside click" and "close sibling popovers" into two unrelated problems.

---

## `getByRole` misses react-aria submenus; locate flyouts by attribute
Tags: testing, playwright, react-aria, submenu
Applies-when: a browser check drives a Grille `SubmenuItem` or reads output of a rebuilt backend

The open submenu's `role=menu` is not reachable by `getByRole('menu', { name })` (the check timed
out although the DOM had it). Separately, a browser check against a built app runs the binary as it
stands, so it can silently test a stale build.

**Fix:** select the flyout with `[role=menu][aria-label="..."]`, and rebuild before any check that
depends on a changed API.

Origin: Aurora webui-testing.md — A browser check against the built app needs a rebuilt binary, and `getByRole` misses react-aria submenus.

---

## Pressing a popover's trigger blur-closes it, then the trigger's toggle reopens it
Tags: react-aria, popover, focus, toggle, non-modal
Applies-when: a non-modal Popover has a trigger that toggles it open and closed

React Aria's popover closes on blur. In Chrome a press focuses the trigger, so `onOpenChange(false)`
fires first and the trigger's `onClick` toggle then sees closed and reopens. Safari does not focus
buttons on click, so it hides the bug.

**Fix:** record whether the last `pointerdown` (capture, on `document`) landed inside `triggerRef`
and ignore the close while it did. Tab out still closes. jsdom with `userEvent.click` reproduces it.

Origin: Grille-uqg.1 — Aurora editor menus flashed back open when their trigger was clicked.
