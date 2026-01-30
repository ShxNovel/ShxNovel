import * as path from 'path';
import { AssetList, AssetConfig } from '.';

/**
 * 规范化路径（使用 / 作为分隔符，确保跨平台一致性）
 */
function normalizePath(filePath: string): string {
    return filePath.replace(/\\/g, '/');
}

/**
 * 去除文件扩展名
 */
function removeExtension(filePath: string): string {
    const lastDotIndex = filePath.lastIndexOf('.');
    return lastDotIndex > 0 ? filePath.slice(0, lastDotIndex) : filePath;
}

/**
 * 获取目录路径
 */
// @ts-ignore
function getDirectoryPath(filePath: string): string {
    const lastSlashIndex = filePath.lastIndexOf('/');
    return lastSlashIndex >= 0 ? filePath.slice(0, lastSlashIndex + 1) : '';
}

export function generateDeclarationFile(
    assetList: AssetList,
    configs: Record<string, AssetConfig>,
    textureFilesByBaseName: Record<string, string[]>,
    audioFilesByBaseName: Record<string, string[]>
): string {
    const formatType = (files: string[], category: 'texture' | 'audio'): string => {
        if (files.length === 0) return ' ';

        const processedFiles = new Set<string>();
        const addedKeys = new Set<string>();
        const configKeys = new Set<string>();
        const filesByBaseName = category === 'texture' ? textureFilesByBaseName : audioFilesByBaseName;

        // 先处理有配置的资源
        const configLines: string[] = [];
        for (const [key, config] of Object.entries(configs)) {
            if (config.type === category) {
                const baseName = path.basename(key, '.json');
                configKeys.add(baseName);

                // 检查是否已经添加过这个键
                if (!addedKeys.has(config.name)) {
                    configLines.push(`        '${config.name}': never;`);
                    addedKeys.add(config.name);
                }

                // 标记已处理的文件（同名文件都被标记为已处理）
                if (filesByBaseName[baseName]) {
                    for (const file of filesByBaseName[baseName]) {
                        processedFiles.add(normalizePath(file));
                    }
                }
            }
        }

        // 处理没有配置的资源
        const normalLines: string[] = [];
        for (const file of files) {
            if (processedFiles.has(normalizePath(file))) {
                continue;
            }
            const baseName = path.basename(file, path.extname(file));

            // 如果这个文件的基础名称有配置，则跳过
            if (configKeys.has(baseName)) {
                continue;
            }

            const key = removeExtension(normalizePath(file));
            // 使用 Set 避免重复添加
            if (!addedKeys.has(key)) {
                normalLines.push(`        '${key}': never;`);
                addedKeys.add(key);
            }
        }

        // 合并配置资源和普通资源
        return [...configLines, ...normalLines].join('\n') || ' ';
    };

    const sections: string[] = [];

    if (assetList.texture.length > 0 || Object.values(configs).some((c) => c.type === 'texture')) {
        sections.push(
            `    namespace Texture {\n      interface Key {\n${formatType(assetList.texture, 'texture')}\n      }\n    }`
        );
    } else {
        sections.push(`    namespace Texture {\n      interface Key { }\n    }`);
    }

    if (assetList.audio.length > 0 || Object.values(configs).some((c) => c.type === 'audio')) {
        sections.push(
            `    namespace Audio {\n      interface Key {\n${formatType(assetList.audio, 'audio')}\n      }\n    }`
        );
    } else {
        sections.push(`    namespace Audio {\n      interface Key { }\n    }`);
    }

    return `import '@shxnovel/world';\n\ndeclare module "@shxnovel/world" {\n  namespace Assets {\n\n${sections.join('\n\n')}\n\n  }\n}\n`;
}
