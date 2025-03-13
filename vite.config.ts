import { defineConfig } from 'vite';
import topLevelAwait from 'vite-plugin-top-level-await';
import legacy from '@vitejs/plugin-legacy';
import babel from '@rollup/plugin-babel';

import { glob } from 'glob';
import { resolve, dirname, basename, normalize } from 'path';

import typescript from '@rollup/plugin-typescript';
import { compileLitTemplates } from '@lit-labs/compiler';

// process is a nodejs global
const host = process.env.TAURI_DEV_HOST;

// https://vitejs.dev/config/
export default defineConfig({
    // Vite options tailored for Tauri development and only applied in `tauri dev` or `tauri build`
    //
    // 1. prevent vite from obscuring rust errors
    clearScreen: false,
    // 2. tauri expects a fixed port, fail if that port is not available
    server: {
        port: 1420,
        strictPort: true,
        host: host || false,
        hmr: host
            ? {
                  protocol: 'ws',
                  host,
                  port: 1421,
              }
            : undefined,
        watch: {
            // 3. tell vite to ignore watching `src-tauri`
            ignored: ['**/src-tauri/**'],
        },
    },
    envPrefix: ['VITE_', 'TAURI_ENV_*'],

    // windows platform dont need topLevelAwait
    plugins: [
        legacy({
            renderLegacyChunks: false,
        }),
        topLevelAwait(),
    ],

    build: {
        target: 'es2017',

        minify: !process.env.TAURI_ENV_DEBUG ? 'esbuild' : false,
        sourcemap: !!process.env.TAURI_ENV_DEBUG,

        rollupOptions: {
            input: ['index.html', ...glob.sync('src/**/*.html')],
            plugins: [
                typescript({
                    transformers: {
                        before: [compileLitTemplates()],
                    },
                }),
            ],
        },
    },

    resolve: {
        alias: {
            '@/': resolve(__dirname, 'src'),
        },
    },
});
