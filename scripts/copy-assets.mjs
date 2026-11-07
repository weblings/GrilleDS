// Ships tokens and self-contained fonts in dist, so no-npm consumers can vendor the folder as is.
import { copyFileSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const inter = 'node_modules/@fontsource/inter';
const weights = [400, 600, 700];

copyFileSync('src/tokens/generated/tokens.css', 'dist/tokens.css');

mkdirSync('dist/files', { recursive: true });
const wanted = weights.map((w) => `inter-latin-${w}-normal.`);
for (const name of readdirSync(join(inter, 'files'))) {
    if (wanted.some((prefix) => name.startsWith(prefix))) copyFileSync(join(inter, 'files', name), join('dist/files', name));
}
copyFileSync(join(inter, 'LICENSE'), 'dist/files/LICENSE-Inter.txt');

const css = weights.map((w) => readFileSync(join(inter, `latin-${w}.css`), 'utf8').trim());
writeFileSync('dist/fonts.css', `${css.join('\n')}\n`);
