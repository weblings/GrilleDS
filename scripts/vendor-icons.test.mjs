// Checks the vendored Vidstack paths in src/icons equal media-icons raw/ exactly (it reads files, so it lives outside src).
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import * as icons from '../src/icons/index';

const vidstack = {
    arrowLeftIcon: 'arrow-left', addIcon: 'add', chevronDownIcon: 'chevron-down', chevronUpIcon: 'chevron-up', xMarkIcon: 'x-mark',
    fullscreenArrowIcon: 'fullscreen-arrow', fullscreenArrowExitIcon: 'fullscreen-arrow-exit', playIcon: 'play', pauseIcon: 'pause',
    stopIcon: 'stop', searchIcon: 'search', menuHorizontalIcon: 'menu-horizontal', arrowUpIcon: 'arrow-up', arrowDownIcon: 'arrow-down',
};

describe('icon source', () => {
    it.each(Object.entries(vidstack))('%s matches media-icons raw/%s.svg', (key, file) => {
        const svg = readFileSync(`node_modules/media-icons/raw/${file}.svg`, 'utf8');
        const raw = [...svg.matchAll(/ d="([^"]+)"/g)].map((m) => m[1]);
        expect(icons[key].paths.map((p) => p.d)).toEqual(raw);
        expect(icons[key].viewBox).toBe('0 0 32 32');
    });

    it('exports all 20 icons', () => {
        expect(Object.keys(icons)).toHaveLength(20);
    });
});
