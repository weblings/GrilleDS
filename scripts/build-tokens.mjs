// Builds tokens/tokens.json (DTCG) into generated CSS vars and a TS module.
import StyleDictionary from 'style-dictionary';

const out = 'src/tokens/generated/';

const sd = new StyleDictionary({
    source: ['tokens/tokens.json'],
    log: { verbosity: 'silent' },
    hooks: {
        transforms: {
            // Dimensions are authored as px numbers.
            'grille/dimension-px': {
                type: 'value',
                filter: (token) => token.$type === 'dimension',
                transform: (token) => `${token.$value}px`,
            },
            'grille/font-family-css': {
                type: 'value',
                filter: (token) => token.$type === 'fontFamily',
                transform: (token) =>
                    token.$value.map((f) => (/\s/.test(f) ? `'${f}'` : f)).join(', '),
            },
        },
        transformGroups: {
            grille: ['attribute/cti', 'name/kebab', 'grille/dimension-px', 'grille/font-family-css'],
            'grille-ts': ['attribute/cti', 'name/camel', 'grille/dimension-px', 'grille/font-family-css'],
        },
    },
    platforms: {
        css: {
            transformGroup: 'grille',
            prefix: 'ui',
            buildPath: out,
            files: [{ destination: 'tokens.css', format: 'css/variables', options: { outputReferences: true } }],
        },
        ts: {
            transformGroup: 'grille-ts',
            buildPath: out,
            files: [{ destination: 'tokens.ts', format: 'javascript/es6' }],
        },
    },
});

await sd.buildAllPlatforms();
