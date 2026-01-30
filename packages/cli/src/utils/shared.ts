import * as fs from 'fs';
import * as path from 'path';
import { fileImport } from '../tools';

export interface ConfigResult {
    config: Record<string, any>;
    files: string[];
}

export async function getConfig(
    dirPath: string,
    configFileName: string = 'config'
): Promise<ConfigResult> {
    const config: Record<string, any> = {};
    const files: string[] = [];

    if (!fs.existsSync(dirPath)) {
        throw new Error(`Directory not found: ${dirPath}`);
    }

    const dirFiles = fs.readdirSync(dirPath);

    for (const file of dirFiles) {
        const fileName = file.replace(/\.[^.]+$/, '');

        if (fileName === configFileName) {
            const configPath = path.join(dirPath, file);
            try {
                const result = (await fileImport(configPath)) as { default: any };
                Object.assign(config, result.default || result);
            } catch (error) {
                throw new Error(`Failed to load config from ${configPath}: ${error}`);
            }
            continue;
        }

        // ts 和 js 文件
        if (file.endsWith('.ts') || file.endsWith('.js')) {
            files.push(file);
        }
    }

    return { config, files };
}
