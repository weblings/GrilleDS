// Turns IconData into a standalone SVG string and writes one file per icon. Mirrors src/Icon.tsx.
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

export const iconFileName = (key) => key.replace(/Icon$/, '').replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`);

const attr = (value) => String(value).replace(/&/g, '&amp;').replace(/"/g, '&quot;');

export function iconToSvg(icon) {
    const paths = icon.paths.map((p) => {
        const rule = p.fillRule ? ` fill-rule="${p.fillRule}"` : '';
        const stroke = p.stroke ? ` fill="none" stroke="currentColor" stroke-width="${p.stroke.width}"` : '';
        return `<path d="${attr(p.d)}"${rule}${stroke}/>`;
    });
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${attr(icon.viewBox)}" fill="currentColor">${paths.join('')}</svg>\n`;
}

export function writeIconSvgs(icons, outDir) {
    mkdirSync(outDir, { recursive: true });
    const names = [];
    for (const [key, icon] of Object.entries(icons)) {
        if (!key.endsWith('Icon') || !Array.isArray(icon.paths)) continue; // skips the Icon component
        const name = iconFileName(key);
        writeFileSync(join(outDir, `${name}.svg`), iconToSvg(icon));
        names.push(name);
    }
    return names;
}
