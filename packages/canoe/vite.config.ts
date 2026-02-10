/// <reference types="vitest/config" />
import { defineConfig } from 'vite';

export default defineConfig({
    test: {
        root: 'test',
        clearMocks: true,
        typecheck: {
            enabled: true,
        },
    },
    build: {
        lib: {
            entry: './src/index.ts',
            name: 'canoe',
            fileName: 'canoe',
            formats: ['es'],
        },
        rollupOptions: {
            external: ['gsap', 'three', 'stats.js'],
            // output: {
            //     inlineDynamicImports: false,
            //     preserveModules: true,
            //     entryFileNames: ({ name: fileName }) => {
            //         return `${fileName}.js`;
            //     },
            //     globals: {
            //         gsap: 'gsap',
            //         three: 'THREE',
            //         stats: 'Stats',
            //     },
            // },
        },
    },
});
