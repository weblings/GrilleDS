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

### CSS layers

`ui.css` declares `@layer reset, app, ui;`, so import order doesn't matter. These layer names are
part of the API:

- Put your CSS reset in `@layer reset`. An unlayered reset overrides the skin.
- `@layer app` rules can't override `ui`. Only unlayered rules can.

### Adding React to a non-React page

`mountIsland(el, node)` renders React into one element and returns a function that removes it, so a
page can convert one piece at a time.

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
