#!/usr/bin/env node

export * from './types';

import { Command } from 'commander';
import { logger } from './utils/logger';
import { handleError } from './utils/errors';
import { assetCLI } from './asset';
import { storyCLI } from './story';
import { worldCLI } from './world';
import { useCLI } from './use';

const program = new Command();

program
    .name('shx-cli')
    .description('ShxNovel CLI tool for building visual novels')
    .version('0.1.0')
    .option('-v, --verbose', 'enable verbose output')
    .option('-d, --dry-run', 'show what would be done without making changes');

// Global error handler
process.on('unhandledRejection', (error) => {
    handleError(error);
});

process.on('uncaughtException', (error) => {
    handleError(error);
});

// Asset command
program
    .command('asset')
    .description('Process and generate asset declarations')
    .argument('[base-dir]', 'base directory path', '')
    .option('-o, --output <path>', 'output directory path')
    .action(async (baseDir, options) => {
        try {
            if (program.opts().verbose) {
                logger.setVerbose(true);
            }

            if (program.opts().dryRun) {
                logger.info('Dry run mode enabled - no files will be modified');
            }

            await assetCLI(baseDir, options.output);
        } catch (error) {
            handleError(error);
        }
    });

// Story command
program
    .command('story')
    .description('Process and compile story scripts')
    .argument('[base-dir]', 'base directory path', '')
    .option('-o, --output <path>', 'output directory path')
    .option('-w, --watch', 'watch for file changes')
    .action(async (baseDir, options) => {
        try {
            if (program.opts().verbose) {
                logger.setVerbose(true);
            }

            if (program.opts().dryRun) {
                logger.info('Dry run mode enabled - no files will be modified');
            }

            await storyCLI(baseDir, options.output, options.watch);
        } catch (error) {
            handleError(error);
        }
    });

// World command
program
    .command('world')
    .description('Process and compile world definitions')
    .argument('[base-dir]', 'base directory path', '')
    .option('-o, --output <path>', 'output directory path')
    .action(async (baseDir, options) => {
        try {
            if (program.opts().verbose) {
                logger.setVerbose(true);
            }

            if (program.opts().dryRun) {
                logger.info('Dry run mode enabled - no files will be modified');
            }

            await worldCLI(baseDir, options.output);
        } catch (error) {
            handleError(error);
        }
    });

// Use command
program
    .command('use')
    .description('Create directory links for development')
    .argument('[from]', 'source directory', '')
    .argument('[to]', 'target directory', '../../shxnovel/public')
    .action(async (from, to) => {
        try {
            if (program.opts().verbose) {
                logger.setVerbose(true);
            }

            if (program.opts().dryRun) {
                logger.info('Dry run mode enabled - no links will be created');
            }

            await useCLI(from, to);
        } catch (error) {
            handleError(error);
        }
    });

// Build command (runs all commands)
program
    .command('build')
    .description('Build the entire project (asset, story, world)')
    .argument('[base-dir]', 'base directory path', '')
    .option('-o, --output <path>', 'output directory path')
    .option('-w, --watch', 'watch for file changes')
    .action(async (baseDir, options) => {
        try {
            if (program.opts().verbose) {
                logger.setVerbose(true);
            }

            logger.info('Starting full build...');

            await assetCLI(baseDir, options.output);
            logger.success('Assets processed');

            await storyCLI(baseDir, options.output, options.watch);
            logger.success('Stories processed');

            await worldCLI(baseDir, options.output);
            logger.success('World processed');

            logger.success('Build complete!');
        } catch (error) {
            handleError(error);
        }
    });

program.parse(process.argv);
