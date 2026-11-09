// Branch review page: every Cosmos fixture, screenshotted at a base ref and at the
// working tree, sorted into New / Changed / Unchanged / Removed.
//
//   npm run review                      base = merge-base of HEAD and main
//   npm run review -- --base v0.1.0-dev.1 --out review-out
//
// The base ref is checked out into a temp git worktree. The viewer harness (Cosmos config,
// decorator) and the branch's fixtures are copied in, so both sides render identical fixture
// code against different component code. A fixture file that cannot build there is New.
// Fixture files that exist only at the base are Removed. (A fixture name dropped from a file
// that exists on both sides is not detected: the branch's version of the file is what renders.)
// Output is a static page: open <out>/index.html. Needs Playwright's chromium
// (npx playwright install chromium).
import { execFileSync, spawnSync } from 'node:child_process';
import { cpSync, existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, statSync, symlinkSync, writeFileSync } from 'node:fs';
import { createServer } from 'node:http';
import { tmpdir } from 'node:os';
import { dirname, extname, join, relative, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';
import { chromium } from 'playwright';

const repo = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const git = (...args) => execFileSync('git', args, { cwd: repo, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();

// ---- arguments -------------------------------------------------------------------------
const argv = process.argv.slice(2);
const opt = (name, fallback) => {
    const i = argv.indexOf(`--${name}`);
    return i >= 0 ? argv[i + 1] : fallback;
};
const outDir = resolve(repo, opt('out', 'review-out'));

function defaultBase() {
    for (const main of ['main', 'origin/main']) {
        try {
            return git('merge-base', 'HEAD', main);
        } catch {
            // try the next candidate
        }
    }
    throw new Error('No main or origin/main to take a merge-base with. Pass --base <ref>.');
}
const baseRef = opt('base', null) ?? defaultBase();
const baseSha = git('rev-parse', '--short', baseRef);
const headSha = git('rev-parse', '--short', 'HEAD');
const dirty = git('status', '--porcelain', '--untracked-files=no') !== '';

// ---- helpers ---------------------------------------------------------------------------
const run = (cmd, args, cwd, env = {}) =>
    spawnSync(cmd, args, { cwd, env: { ...process.env, ...env }, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });

const fixtureFiles = (root) => {
    const files = [];
    const visit = (dir) => {
        if (!existsSync(dir)) return;
        for (const name of readdirSync(dir)) {
            const p = join(dir, name);
            if (statSync(p).isDirectory()) visit(p);
            else if (name.endsWith('.fixture.tsx')) files.push(relative(root, p));
        }
    };
    visit(join(root, 'src'));
    return files.sort();
};

const types = { '.js': 'text/javascript', '.css': 'text/css', '.html': 'text/html', '.json': 'application/json', '.woff2': 'font/woff2', '.woff': 'font/woff', '.svg': 'image/svg+xml', '.map': 'application/json' };
function serve(root) {
    const server = createServer((req, res) => {
        const path = new URL(req.url, 'http://x').pathname;
        if (path === '/_list.html') {
            // Cosmos announces its fixture list to the parent window; this frame collects it.
            res.setHeader('content-type', 'text/html');
            return res.end('<iframe src="/renderer.html?locked=true" width="400" height="300"></iframe>');
        }
        const file = join(root, path === '/' ? 'index.html' : path);
        if (!file.startsWith(root) || !existsSync(file) || statSync(file).isDirectory()) {
            res.statusCode = 404;
            return res.end();
        }
        res.setHeader('content-type', types[extname(file)] ?? 'application/octet-stream');
        res.end(readFileSync(file));
    });
    return new Promise((ok) => server.listen(0, '127.0.0.1', () => ok({ server, url: `http://127.0.0.1:${server.address().port}` })));
}

/** The fixture ids a Cosmos export contains, read from the renderer's own announcement. */
async function listFixtures(browser, base) {
    const page = await browser.newPage();
    try {
        await page.addInitScript(() => {
            window.__lists = [];
            window.addEventListener('message', (e) => {
                if (e.data?.type === 'fixtureListUpdate') window.__lists.push(e.data.payload.fixtures);
            });
        });
        await page.goto(`${base}/_list.html`);
        await page.waitForFunction(() => window.__lists.length > 0, null, { timeout: 30000 });
        await page.waitForTimeout(500);
        const lists = await page.evaluate(() => window.__lists);
        const merged = Object.assign({}, ...lists);
        const ids = [];
        for (const [path, item] of Object.entries(merged)) {
            if (item.type === 'multi') for (const name of item.fixtureNames) ids.push({ path, name });
            else ids.push({ path });
        }
        return ids;
    } finally {
        await page.close();
    }
}

const keyOf = (id) => (id.name === undefined ? id.path : `${id.path}::${id.name}`);
const titleOf = (id) => `${id.path.replace(/^src\//, '').replace(/\.fixture\.tsx$/, '')}${id.name === undefined ? '' : ` / ${id.name}`}`;
const slugOf = (id) => keyOf(id).replace(/\.fixture\.tsx/, '').replace(/[^A-Za-z0-9]+/g, '-').replace(/^-|-$/g, '');
const rendererUrl = (base, id) => `${base}/renderer.html?fixtureId=${encodeURIComponent(JSON.stringify(id))}&locked=true`;

/** Screenshot one fixture. Returns null when the fixture throws instead of rendering. */
async function shoot(browser, base, id, file) {
    const context = await browser.newContext({ viewport: { width: 800, height: 600 }, deviceScaleFactor: 1, reducedMotion: 'reduce' });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', (e) => errors.push(String(e)));
    try {
        await page.goto(rendererUrl(base, id), { waitUntil: 'load' });
        await page.waitForFunction(() => (document.getElementById('root')?.childElementCount ?? 0) > 0, null, { timeout: 15000 }).catch(() => errors.push('nothing rendered'));
        await page.evaluate(() => document.fonts.ready);
        await page.waitForTimeout(500);
        if (errors.length) return null;
        await page.screenshot({ path: file, fullPage: true, animations: 'disabled' });
        return file;
    } finally {
        await context.close();
    }
}

/** Compare two PNGs. Differing sizes pad the smaller one, so the padding counts as different. */
function compare(beforeFile, afterFile, diffFile) {
    const a = PNG.sync.read(readFileSync(beforeFile));
    const b = PNG.sync.read(readFileSync(afterFile));
    const width = Math.max(a.width, b.width);
    const height = Math.max(a.height, b.height);
    const pad = (img) => {
        const out = new PNG({ width, height });
        PNG.bitblt(img, out, 0, 0, img.width, img.height, 0, 0);
        return out;
    };
    const [pa, pb] = [pad(a), pad(b)];
    const diff = new PNG({ width, height });
    const pixels = pixelmatch(pa.data, pb.data, diff.data, width, height, { threshold: 0.1 });
    const resized = a.width !== b.width || a.height !== b.height;
    if (pixels > 0 || resized) writeFileSync(diffFile, PNG.sync.write(diff));
    return { pixels, resized };
}

// ---- base worktree ---------------------------------------------------------------------
const harness = ['index.html', 'cosmos.config.json', 'cosmos.css', 'cosmos.decorator.tsx', 'vite.cosmos.config.ts'];

function buildBase(worktree, headFixtures) {
    symlinkSync(join(repo, 'node_modules'), join(worktree, 'node_modules'));
    for (const f of harness) cpSync(join(repo, f), join(worktree, f));
    const copied = headFixtures.filter((f) => !f.startsWith('viewer/'));
    for (const f of copied) {
        mkdirSync(dirname(join(worktree, f)), { recursive: true });
        cpSync(join(repo, f), join(worktree, f));
    }
    // Viewer-only fixtures in the base tree (none today) are not part of the review.
    const tokens = run('node', ['scripts/build-tokens.mjs'], worktree);
    if (tokens.status !== 0) throw new Error(`build-tokens failed at ${baseRef}:\n${tokens.stderr}`);

    // Rolldown stops at the first fixture that imports something the base lacks, so remove
    // each file the error names (it is New) and build again.
    const cannotBuild = new Set();
    for (let attempt = 0; attempt <= copied.length; attempt++) {
        const result = run(join(repo, 'node_modules/.bin/cosmos-export'), [], worktree);
        if (result.status === 0) return cannotBuild;
        const output = `${result.stdout}\n${result.stderr}`;
        const named = copied.filter((f) => !cannotBuild.has(f) && output.includes(f));
        if (!named.length) throw new Error(`cosmos-export failed at ${baseRef} and no fixture file is named:\n${output}`);
        for (const f of named) {
            cannotBuild.add(f);
            rmSync(join(worktree, f));
        }
        console.log(`  cannot build at ${baseRef}: ${named.join(', ')}`);
    }
    throw new Error('Too many fixture files failed to build at the base ref.');
}

// ---- main ------------------------------------------------------------------------------
console.log(`Review: ${baseRef} (${baseSha}) -> HEAD (${headSha})${dirty ? ' plus uncommitted changes' : ''}`);
rmSync(outDir, { recursive: true, force: true });
mkdirSync(join(outDir, 'img'), { recursive: true });

console.log('Building head export…');
const headBuild = run('npm', ['run', 'cosmos:export'], repo, { GRILLE_BASE_REF: baseRef });
if (headBuild.status !== 0) throw new Error(`Head export failed:\n${headBuild.stdout}\n${headBuild.stderr}`);
const headExport = join(repo, JSON.parse(readFileSync(join(repo, 'cosmos.config.json'), 'utf8')).exportPath);
cpSync(headExport, join(outDir, 'cosmos'), { recursive: true });

const worktree = mkdtempSync(join(tmpdir(), 'grille-review-'));
rmSync(worktree, { recursive: true });
git('worktree', 'add', '--detach', worktree, baseRef);

let browser;
const servers = [];
try {
    console.log(`Building base export in ${worktree}…`);
    const cannotBuild = buildBase(worktree, fixtureFiles(repo));

    browser = await chromium.launch();
    const head = await serve(join(outDir, 'cosmos'));
    const base = await serve(join(worktree, 'cosmos-export'));
    servers.push(head.server, base.server);

    const inReview = (id) => !id.path.startsWith('viewer/');
    const headIds = (await listFixtures(browser, head.url)).filter(inReview);
    const baseIds = (await listFixtures(browser, base.url)).filter(inReview);
    const baseKeys = new Set(baseIds.map(keyOf));
    const headKeys = new Set(headIds.map(keyOf));

    const result = { new: [], changed: [], unchanged: [], removed: [], broken: [] };
    for (const id of headIds) {
        const slug = slugOf(id);
        const entry = { id, title: titleOf(id), slug };
        const headFile = await shoot(browser, head.url, id, join(outDir, 'img', `${slug}.head.png`));
        if (!headFile) {
            result.broken.push(entry);
            continue;
        }
        const onBase = baseKeys.has(keyOf(id)) && !cannotBuild.has(id.path);
        const baseFile = onBase ? await shoot(browser, base.url, id, join(outDir, 'img', `${slug}.base.png`)) : null;
        if (!baseFile) {
            result.new.push(entry);
        } else {
            const { pixels, resized } = compare(baseFile, headFile, join(outDir, 'img', `${slug}.diff.png`));
            (pixels > 0 || resized ? result.changed : result.unchanged).push({ ...entry, pixels, resized });
        }
        console.log(`  ${titleOf(id)}: ${result.new.includes(entry) ? 'new' : result.changed.find((c) => c.slug === slug) ? 'changed' : 'unchanged'}`);
    }
    for (const id of baseIds.filter((i) => !headKeys.has(keyOf(i)))) {
        const slug = slugOf(id);
        const file = await shoot(browser, base.url, id, join(outDir, 'img', `${slug}.base.png`));
        if (file) result.removed.push({ id, title: titleOf(id), slug });
    }

    // The V3 tokens diff, as built into the head export against the same base ref.
    const tokensId = { path: 'viewer/Tokens.fixture.tsx', name: 'Tokens diff' };
    const tokensShot = await shoot(browser, head.url, tokensId, join(outDir, 'img', 'tokens-diff.png'));

    writeFileSync(join(outDir, 'index.html'), page({ result, tokensShot: tokensShot && 'img/tokens-diff.png', tokensId }));
    writeFileSync(
        join(outDir, 'review.json'),
        JSON.stringify(
            { base: baseRef, baseSha, headSha, dirty, ...Object.fromEntries(Object.entries(result).map(([k, v]) => [k, v.map((e) => e.title)])) },
            null,
            2,
        ),
    );
    console.log(
        `New ${result.new.length}, Changed ${result.changed.length}, Unchanged ${result.unchanged.length}, Removed ${result.removed.length}` +
            (result.broken.length ? `, Broken ${result.broken.length}` : ''),
    );
    console.log(`Open ${pathToFileURL(join(outDir, 'index.html')).href}`);
} finally {
    await browser?.close();
    for (const s of servers) s.close();
    try {
        git('worktree', 'remove', '--force', worktree);
    } catch {
        rmSync(worktree, { recursive: true, force: true });
        git('worktree', 'prune');
    }
}

// ---- the page --------------------------------------------------------------------------
function page({ result, tokensShot, tokensId }) {
    const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
    const live = (id) => `cosmos/index.html?fixtureId=${encodeURIComponent(JSON.stringify(id))}`;
    const img = (name, alt) => `<img src="img/${name}" alt="${esc(alt)}" loading="lazy">`;
    const heading = (e) => `<h3>${esc(e.title)} <a href="${live(e.id)}">live</a></h3>`;
    const section = (title, items, body, open = true, whole = null) =>
        items.length
            ? `<section><details ${open ? 'open' : ''}><summary><h2>${title} <span class="n">${items.length}</span></h2></summary>${whole ?? items.map(body).join('')}</details></section>`
            : `<section><h2>${title} <span class="n">0</span></h2></section>`;

    return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Grille branch review</title>
<style>
:root { color-scheme: light dark; --bg: #fff; --fg: #1b1b1f; --muted: #66666f; --line: #d8d8de; --accent: #2457d6; }
@media (prefers-color-scheme: dark) { :root { --bg: #17171a; --fg: #ececf0; --muted: #9a9aa5; --line: #34343b; --accent: #7aa2ff; } }
body { margin: 0 auto; max-width: 1000px; padding: 24px 16px 64px; background: var(--bg); color: var(--fg); font: 15px/1.5 system-ui, sans-serif; }
h1 { font-size: 22px; margin: 0 0 4px; } h2 { display: inline; font-size: 18px; } h3 { font-size: 14px; margin: 20px 0 8px; font-weight: 600; }
.meta { color: var(--muted); margin: 0 0 24px; } .n { color: var(--muted); font-weight: 400; }
section { border-top: 1px solid var(--line); padding: 16px 0; } summary { cursor: pointer; }
a { color: var(--accent); font-weight: 400; font-size: 13px; margin-left: 8px; }
img { max-width: 100%; border: 1px solid var(--line); background: #fff; display: block; }
.toggle button { font: inherit; font-size: 13px; padding: 2px 12px; border: 1px solid var(--line); background: none; color: var(--fg); cursor: pointer; }
.toggle button[aria-pressed="true"] { background: var(--accent); border-color: var(--accent); color: #fff; }
.toggle { margin-bottom: 8px; } .pair img[hidden] { display: none; }
.small { display: flex; flex-wrap: wrap; gap: 12px; } .small figure { margin: 0; width: 220px; font-size: 12px; } .small figcaption { margin-top: 4px; }
.warn { color: #b3261e; }
</style></head><body>
<h1>Branch review</h1>
<p class="meta">Base <code>${esc(baseRef)}</code> (${esc(baseSha)}) → HEAD ${esc(headSha)}${dirty ? ' plus uncommitted changes' : ''}. New ${result.new.length} · Changed ${result.changed.length} · Unchanged ${result.unchanged.length} · Removed ${result.removed.length}</p>
${result.broken.length ? `<p class="warn">Failed to render on the branch: ${result.broken.map((e) => esc(e.title)).join(', ')}</p>` : ''}
<section><h2>Tokens</h2><a href="${live(tokensId)}">live</a>${tokensShot ? img('tokens-diff.png', 'Token diff against the base ref') : '<p>Tokens diff did not render.</p>'}</section>
${section('New', result.new, (e) => `${heading(e)}${img(`${e.slug}.head.png`, e.title)}`)}
${section(
    'Changed',
    result.changed,
    (e) => `${heading(e)}<div class="pair">
<div class="toggle" role="group" aria-label="Show">
<button type="button" aria-pressed="false" data-show="base">Before</button><button type="button" aria-pressed="true" data-show="head">After</button><button type="button" aria-pressed="false" data-show="diff">Diff</button>
<span class="n">${e.pixels} px differ${e.resized ? ', size changed' : ''}</span></div>
<img data-img="base" src="img/${e.slug}.base.png" alt="${esc(e.title)} before" hidden loading="lazy">
<img data-img="head" src="img/${e.slug}.head.png" alt="${esc(e.title)} after" loading="lazy">
<img data-img="diff" src="img/${e.slug}.diff.png" alt="${esc(e.title)} difference" hidden loading="lazy"></div>`,
)}
${section('Unchanged', result.unchanged, null, false, `<div class="small">${result.unchanged
    .map((e) => `<figure>${img(`${e.slug}.head.png`, e.title)}<figcaption>${esc(e.title)}<a href="${live(e.id)}">live</a></figcaption></figure>`)
    .join('')}</div>`)}
${section('Removed', result.removed, (e) => `<h3>${esc(e.title)}</h3>${img(`${e.slug}.base.png`, e.title)}`)}
<script>
document.querySelectorAll('.pair').forEach((pair) => {
  pair.querySelectorAll('button').forEach((btn) => btn.addEventListener('click', () => {
    pair.querySelectorAll('button').forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));
    pair.querySelectorAll('img').forEach((i) => { i.hidden = i.dataset.img !== btn.dataset.show; });
  }));
});
</script>
</body></html>`;
}
