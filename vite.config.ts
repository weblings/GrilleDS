import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

// Library build. Consumers bundle React and React Aria themselves, so one copy of each is loaded.
export default defineConfig({
    plugins: [react()],
    build: {
        cssCodeSplit: false,
        sourcemap: true,
        minify: false,
        lib: {
            entry: { index: 'src/index.ts', tokens: 'src/tokens/generated/tokens.ts' },
            formats: ['es'],
            cssFileName: 'ui',
        },
        rolldownOptions: {
            external: [/^react($|\/)/, /^react-dom($|\/)/, /^react-aria-components/],
        },
    },
});
