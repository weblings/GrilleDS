// Checks the plain-SVG export draws the same paths as the React Icon.
import { mkdtempSync, readFileSync, readdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { renderToStaticMarkup } from 'react-dom/server';
import { createElement } from 'react';
import { describe, expect, it } from 'vitest';
import { Icon } from '../src/Icon';
import * as icons from '../src/icons/index';
import { iconFileName, writeIconSvgs } from './icon-svg.mjs';

const dir = mkdtempSync(join(tmpdir(), 'grille-icons-'));
const names = writeIconSvgs(icons, dir);
const ds = (svg) => [...svg.matchAll(/ d="([^"]+)"/g)].map((m) => m[1]);

describe('icon svg export', () => {
    it('writes one file per icon', () => {
        expect(names).toHaveLength(19);
        expect(readdirSync(dir).sort()).toEqual(names.map((n) => `${n}.svg`).sort());
    });

    it('names files in kebab-case', () => {
        expect(iconFileName('chevronDownIcon')).toBe('chevron-down');
        expect(iconFileName('xMarkIcon')).toBe('x-mark');
        expect(iconFileName('fullscreenArrowExitIcon')).toBe('fullscreen-arrow-exit');
    });

    it.each(Object.entries(icons).filter(([k, v]) => k.endsWith('Icon') && v.paths))('%s matches the React Icon', (key, icon) => {
        const file = readFileSync(join(dir, `${iconFileName(key)}.svg`), 'utf8');
        const react = renderToStaticMarkup(createElement(Icon, { icon }));
        expect(ds(file)).toEqual(ds(react));
        expect(file).toContain(`viewBox="${icon.viewBox}"`);
        expect(file).toContain('fill="currentColor"');
    });

    it('strokes the warning outline', () => {
        const svg = readFileSync(join(dir, 'warning.svg'), 'utf8');
        expect(svg).toContain('fill="none" stroke="currentColor" stroke-width="1.8897638"');
    });
});
