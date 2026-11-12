# Grille

Shared design tokens and React components for the weblings projects. Components wrap
[React Aria](https://react-spectrum.adobe.com/react-aria/), so keyboard and screen reader behavior
comes built in.

## Install

Grille installs from git. Pin an exact commit:

```sh
npm install github:weblings/GrilleDS#<commit>
```

React 19 is a peer dependency. It's optional, so projects that only use tokens don't need it.

## Use

```ts
import '@weblings/grille/fonts.css';
import '@weblings/grille/tokens.css';
import '@weblings/grille/ui.css';
import { Button, Select } from '@weblings/grille';
```

Import components from Grille, never from `react-aria-components` directly. The wrappers are the
stable API.

| Export | Contents |
|---|---|
| `.` | React components and `mountIsland` |
| `./tokens` | Token values as JS constants, with no React |
| `./tokens.css` | Tokens as `--ui-*` CSS variables |
| `./tokens.json` | DTCG source, for other generators |
| `./ui.css` | Component skin |
| `./fonts.css` | Inter 400, 600 and 700 |
| `./icons/<name>.svg` | Each icon as a plain SVG, for pages without React |

### CSS layers

`ui.css` declares `@layer reset, app, ui;`, so import order doesn't matter. These layer names are
part of the API:

- Put your CSS reset in `@layer reset`. An unlayered reset overrides the skin.
- `@layer app` rules can't override `ui`. Only unlayered rules can.

### Dropdown triggers

A trigger with `aria-expanded="true"` shows its chevron flipped. `Select` does this on its own. For
your own trigger, set `aria-expanded` and render `<Icon icon={chevronDownIcon} />` as a direct child
of the button.

### Tooltips

`<TooltipTrigger><Button>Save</Button><Tooltip>Saves <b>everything</b></Tooltip></TooltipTrigger>`. The
first child must be focusable (a button, link or input); hover and keyboard focus show the tooltip
and Esc hides it. `Tooltip` content is any ReactNode, so bold text and short lists work. Tooltips
are not read for non-focusable elements, so put help for a menu row in its `description` instead.

### Adding React to a non-React page

`mountIsland(el, node)` renders React into one element and returns a function that removes it, so a
page can convert one piece at a time.

### Icons without React

Each icon also ships as `dist/icons/<name>.svg` (kebab-case: `chevron-down.svg`, `x-mark.svg`),
with the same paths as `Icon`. Copy the files you need into the page's folder:

```html
<img src="icons/chevron-down.svg" width="16" height="16" alt="">
```

The files have no width or height, so size them with CSS or attributes. They use `currentColor`,
but an `<img>` can't inherit it and draws black. To color an icon, use it as a CSS mask, or paste
the `<svg>` inline:

```css
.chevron {
    width: 16px;
    height: 16px;
    background: currentColor;
    mask: url(icons/chevron-down.svg) center / contain no-repeat;
}
```

The files draw at the glyph's own box. `Icon` draws 4px past the layout box on each side
(`--ui-size-icon-overhang`); a page that wants the same optical size should do likewise.

## Develop

```sh
npm install
npm run dev        # component playground
npm test
npm run lint
npm run typecheck
```

Tokens live in `tokens/tokens.json`. `npm run build` generates the CSS and TS outputs.

During 0.x, a minor version may break the API and a patch may not.

## License

MIT. Inter is under the SIL Open Font License, included at `dist/files/LICENSE-Inter.txt`.
