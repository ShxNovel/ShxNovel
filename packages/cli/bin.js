#!/usr/bin/env node

import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const CLI_DIST = path.join(__dirname, 'dist', 'cli.js');

const args = ['--no-warnings', '--import', 'tsx', CLI_DIST, ...process.argv.slice(2)];

const child = spawn(process.execPath, args, {
    stdio: 'inherit',
    shell: false,
});

child.on('exit', (code) => process.exit(code ?? 0));
