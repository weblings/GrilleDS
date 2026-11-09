import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Dev catalog only (npm run dev, cosmos-export). The library build uses vite.config.ts.
export default defineConfig({ plugins: [react()] });
