/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import { builtinModules } from 'module';

export default defineConfig({
    test: {
        root: 'test',
        clearMocks: true,
        typecheck: {
            enabled: true,
        },
    },
    build: {
        target: 'node18',
        lib: {
            entry: './src/index.ts',
            name: 'assets-cli',
            fileName: 'assets-cli',
            formats: ['es'],
        },

        // 将 Node.js 内置模块标记为外部依赖
        rollupOptions: {
            external: [...builtinModules, ...builtinModules.map((m) => `node:${m}`)],
        },
    },
});
