// Writes dist/icons/<name>.svg from the built package, so the files can't drift from the React Icon.
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';
import { writeIconSvgs } from './icon-svg.mjs';

const icons = await import(pathToFileURL(resolve('dist/index.js')).href);
console.log(`icons: wrote ${writeIconSvgs(icons, 'dist/icons').length} svg files`);
