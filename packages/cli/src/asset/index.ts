import * as fs from 'fs';
import * as path from 'path';
import { logger } from '../utils/logger';
import { progress } from '../utils/progress';
import { FileNotFoundError } from '../utils/errors';
import { ensureDirectory } from '../utils/config';
import { jsonStringify } from '../utils/json';
import { generateDeclarationFile } from './generateDeclarationFile';
import { generateManifestFile } from './generateManifestFile';

export type AssetList = {
    audio: string[];
    texture: string[];
};

export type AssetConfig = {
    name: string;
    type: 'texture' | 'audio';
    variants?: Record<string, { src: string }>;
    srgb?: boolean;
    mipmap?: boolean;
    [key: string]: any;
};

/**
 * 获取文件的配置文件（如果存在）
 */
function getAssetConfig(dirPath: string, filename: string): AssetConfig | null {
    const ext = path.extname(filename);
    const baseName = path.basename(filename, ext);
    const configPath = path.join(dirPath, `${baseName}.json`);

    if (fs.existsSync(configPath)) {
        try {
            const content = fs.readFileSync(configPath, 'utf-8');
            return JSON.parse(content);
        } catch (error) {
            logger.warn(`Failed to parse config file: ${configPath}`);
            return null;
        }
    }
    return null;
}

/**
 * 递归获取目录下所有文件及其配置
 */
function getFilesRecursively(
    dirPath: string,
    basePath: string = ''
): { files: string[]; configs: Record<string, AssetConfig>; filesByBaseName: Record<string, string[]> } {
    const files: string[] = [];
    const configs: Record<string, AssetConfig> = {};
    const filesByBaseName: Record<string, string[]> = {};

    if (!fs.existsSync(dirPath)) {
        return { files, configs, filesByBaseName };
    }

    const entries = fs.readdirSync(dirPath, { withFileTypes: true });

    for (const entry of entries) {
        const fullPath = path.join(dirPath, entry.name);
        const relativePath = basePath ? path.join(basePath, entry.name) : entry.name;
        // 规范化为正斜杠
        const normalizedRelativePath = relativePath.replace(/\\/g, '/');

        if (entry.isDirectory()) {
            // 递归遍历子目录
            const result = getFilesRecursively(fullPath, normalizedRelativePath);
            files.push(...result.files);
            Object.assign(configs, result.configs);
            // 合并 filesByBaseName
            for (const [baseName, fileList] of Object.entries(result.filesByBaseName)) {
                if (!filesByBaseName[baseName]) {
                    filesByBaseName[baseName] = [];
                }
                filesByBaseName[baseName].push(...fileList);
            }
        } else if (entry.isFile()) {
            const ext = path.extname(entry.name).toLowerCase();

            // 跳过 JSON 配置文件（它们会被单独处理）
            if (ext === '.json') {
                const config = getAssetConfig(dirPath, entry.name);
                if (config) {
                    // 使用文件名（不带扩展名）作为键
                    const key = normalizedRelativePath.replace(/\.json$/, '');
                    configs[key] = config;
                }
            } else {
                // 添加文件（使用相对路径）
                files.push(normalizedRelativePath);

                // 按文件名（不带扩展名和路径）分组
                const baseName = path.basename(entry.name, ext);
                if (!filesByBaseName[baseName]) {
                    filesByBaseName[baseName] = [];
                }
                filesByBaseName[baseName].push(relativePath);
            }
        }
    }

    return { files, configs, filesByBaseName };
}

export async function assetCLI(baseDir: string = '', outputDir?: string) {
    const spinner = progress.start('Processing assets...');

    try {
        const inputPath = path.resolve(process.cwd(), baseDir, './assets');
        const outputPath = outputDir
            ? path.resolve(process.cwd(), outputDir)
            : path.resolve(process.cwd(), baseDir, './.vn');

        logger.debug(`Input path: ${inputPath}`);
        logger.debug(`Output path: ${outputPath}`);

        // Validate input paths
        if (!fs.existsSync(inputPath)) {
            throw new FileNotFoundError(inputPath);
        }

        const audioPath = path.join(inputPath, 'audio');
        const texturePath = path.join(inputPath, 'texture');

        if (!fs.existsSync(audioPath)) {
            throw new FileNotFoundError(audioPath);
        }

        if (!fs.existsSync(texturePath)) {
            throw new FileNotFoundError(texturePath);
        }

        // Read asset files recursively
        spinner.text = 'Reading asset files...';
        const audioResult = getFilesRecursively(audioPath);
        const textureResult = getFilesRecursively(texturePath);

        logger.debug(`Found ${audioResult.files.length} audio files`);
        logger.debug(`Found ${Object.keys(audioResult.configs).length} audio config files`);
        logger.debug(`Found ${textureResult.files.length} texture files`);
        logger.debug(`Found ${Object.keys(textureResult.configs).length} texture config files`);

        const assetList: AssetList = {
            audio: audioResult.files,
            texture: textureResult.files,
        };

        const assetConfigs: Record<string, AssetConfig> = {
            ...audioResult.configs,
            ...textureResult.configs,
        };

        // Ensure output directory exists
        ensureDirectory(outputPath);

        // Generate declaration file
        spinner.text = 'Generating type declarations...';
        const declarationOutput = generateDeclarationFile(
            assetList,
            assetConfigs,
            textureResult.filesByBaseName,
            audioResult.filesByBaseName
        );
        fs.writeFileSync(path.join(outputPath, './assets.d.ts'), declarationOutput);

        // Generate manifest file
        spinner.text = 'Generating asset manifest...';
        const manifestOutput = generateManifestFile(
            assetList,
            assetConfigs,
            texturePath,
            audioPath
        );
        fs.writeFileSync(
            path.join(outputPath, './assets.manifest.json'),
            jsonStringify(manifestOutput)
        );

        progress.succeed(spinner, 'Assets processed successfully');
        logger.info(`Output written to: ${outputPath}`);
    } catch (error) {
        progress.fail(spinner, 'Failed to process assets');
        throw error;
    }
}
