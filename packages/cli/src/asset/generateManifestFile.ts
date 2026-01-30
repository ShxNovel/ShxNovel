import * as path from 'path';
import * as fs from 'fs';
import { AssetList, AssetConfig } from '.';
import { logger } from '../utils/logger';

/**
 * 获取文件类型
 */
function getFileType(filename: string, category: 'texture' | 'audio'): string {
    const ext = path.extname(filename).toLowerCase();

    if (category === 'texture') {
        // 图片类型
        const imageExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.bmp', '.svg'];
        if (imageExtensions.includes(ext)) {
            return 'image';
        }
    } else if (category === 'audio') {
        // 音频类型
        const audioExtensions = ['.mp3', '.wav', '.ogg', '.aac', '.m4a', '.flac'];
        if (audioExtensions.includes(ext)) {
            return 'audio';
        }
    }

    return 'unknown';
}

/**
 * 规范化路径（使用 / 作为分隔符，确保跨平台一致性）
 */
function normalizePath(filePath: string): string {
    return filePath.replace(/\\/g, '/');
}

/**
 * 获取目录路径（用于计算 variants 中的相对路径）
 */
function getDirectoryPath(filePath: string): string {
    const lastSlashIndex = filePath.lastIndexOf('/');
    return lastSlashIndex >= 0 ? filePath.slice(0, lastSlashIndex + 1) : '';
}

/**
 * 校验 variants 中的文件是否存在
 */
function validateVariants(
    rootPath: string,
    dirPath: string,
    variants: Record<string, { src: string }>
): { validVariants: Record<string, { src: string }>; missingFiles: string[] } {
    const validVariants: Record<string, { src: string }> = {};
    const missingFiles: string[] = [];

    for (const [variantType, variant] of Object.entries(variants)) {
        // 计算完整路径：rootPath + dirPath + variant.src
        const relativePath = normalizePath(path.join(dirPath, variant.src));
        const fullPath = path.join(rootPath, relativePath);

        if (fs.existsSync(fullPath)) {
            validVariants[variantType] = variant;
        } else {
            missingFiles.push(relativePath);
        }
    }

    return { validVariants, missingFiles };
}

/**
 * 生成资源清单文件
 */
export function generateManifestFile(
    assetList: AssetList,
    configs: Record<string, AssetConfig>,
    _texturePath: string,
    _audioPath: string
): Record<string, any> {
    const manifest: Record<string, any> = {
        textures: {},
        audio: {},
        meta: {
            version: '1.0',
            generatedAt: new Date().toISOString(),
        },
    };

    const texturePath = _texturePath;
    const audioPath = _audioPath;

    // 处理纹理资源
    if (assetList.texture.length > 0) {
        // 先处理有配置的资源
        const processedFiles = new Set<string>();
        const addedKeys = new Set<string>();
        const configKeys = new Set<string>(); // 记录哪些 baseName 有配置

        for (const [key, config] of Object.entries(configs)) {
            if (config.type === 'texture') {
                const dirPath = getDirectoryPath(key);
                const baseName = path.basename(key, '.json');
                configKeys.add(baseName);

                // 校验 variants
                const { validVariants, missingFiles } = validateVariants(
                    texturePath,
                    dirPath,
                    config.variants || {}
                );

                if (missingFiles.length > 0) {
                    logger.warn(`Missing variant files for "${config.name}": ${missingFiles.join(', ')}`);
                }

                // 合并其他属性
                const assetConfig: Record<string, any> = {
                    name: config.name,
                };

                if (Object.keys(validVariants).length > 0) {
                    // 只保留存在的 variants
                    const normalizedVariants: Record<string, { src: string }> = {};
                    for (const [variantType, variant] of Object.entries(validVariants)) {
                        normalizedVariants[variantType] = {
                            src: normalizePath(path.join(dirPath, variant.src)),
                        };
                    }
                    assetConfig.variants = normalizedVariants;

                    // 标记已处理的文件
                    for (const variant of Object.values(validVariants)) {
                        const filePath = normalizePath(path.join(dirPath, variant.src));
                        processedFiles.add(filePath);
                    }
                }

                if (config.srgb !== undefined) {
                    assetConfig.srgb = config.srgb;
                }

                if (config.mipmap !== undefined) {
                    assetConfig.mipmap = config.mipmap;
                }

                // 复制其他自定义属性
                for (const [prop, value] of Object.entries(config)) {
                    if (
                        !['name', 'type', 'variants', 'srgb', 'mipmap'].includes(prop)
                    ) {
                        assetConfig[prop] = value;
                    }
                }

                // 避免重复添加相同名称的资源
                if (!addedKeys.has(config.name)) {
                    manifest.textures[config.name] = assetConfig;
                    addedKeys.add(config.name);
                }
            }
        }

        // 处理没有配置的纹理资源
        for (const file of assetList.texture) {
            if (processedFiles.has(normalizePath(file))) {
                continue;
            }

            // 如果这个文件的基础名称（不带扩展名）有配置，则跳过
            const baseName = path.basename(file, path.extname(file));
            if (configKeys.has(baseName)) {
                continue;
            }

            const type = getFileType(file, 'texture');
            const normalizedPath = normalizePath(file);
            const filenameWithoutExt = normalizedPath.replace(/\.[^.]+$/, '');

            // 使用 Set 避免重复添加
            if (!addedKeys.has(filenameWithoutExt)) {
                manifest.textures[filenameWithoutExt] = {
                    src: normalizedPath,
                    type: type,
                };
                addedKeys.add(filenameWithoutExt);
            }
        }
    }

    // 处理音频资源
    if (assetList.audio.length > 0) {
        // 先处理有配置的资源
        const processedFiles = new Set<string>();
        const addedKeys = new Set<string>();
        const configKeys = new Set<string>();

        for (const [key, config] of Object.entries(configs)) {
            if (config.type === 'audio') {
                const dirPath = getDirectoryPath(key);
                const baseName = path.basename(key, '.json');
                configKeys.add(baseName);

                // 校验 variants
                const { validVariants, missingFiles } = validateVariants(
                    audioPath,
                    dirPath,
                    config.variants || {}
                );

                if (missingFiles.length > 0) {
                    logger.warn(`Missing variant files for "${config.name}": ${missingFiles.join(', ')}`);
                }

                // 合并其他属性
                const assetConfig: Record<string, any> = {
                    name: config.name,
                };

                if (Object.keys(validVariants).length > 0) {
                    const normalizedVariants: Record<string, { src: string }> = {};
                    for (const [variantType, variant] of Object.entries(validVariants)) {
                        normalizedVariants[variantType] = {
                            src: normalizePath(path.join(dirPath, variant.src)),
                        };
                    }
                    assetConfig.variants = normalizedVariants;

                    // 标记已处理的文件
                    for (const variant of Object.values(validVariants)) {
                        const filePath = normalizePath(path.join(dirPath, variant.src));
                        processedFiles.add(filePath);
                    }
                }

                // 复制其他自定义属性
                for (const [prop, value] of Object.entries(config)) {
                    if (
                        !['name', 'type', 'variants', 'srgb', 'mipmap'].includes(prop)
                    ) {
                        assetConfig[prop] = value;
                    }
                }

                // 避免重复添加相同名称的资源
                if (!addedKeys.has(config.name)) {
                    manifest.audio[config.name] = assetConfig;
                    addedKeys.add(config.name);
                }
            }
        }

        // 处理没有配置的音频资源
        for (const file of assetList.audio) {
            if (processedFiles.has(normalizePath(file))) {
                continue;
            }

            // 如果这个文件的基础名称（不带扩展名）有配置，则跳过
            const baseName = path.basename(file, path.extname(file));
            if (configKeys.has(baseName)) {
                continue;
            }

            const type = getFileType(file, 'audio');
            const normalizedPath = normalizePath(file);
            const filenameWithoutExt = normalizedPath.replace(/\.[^.]+$/, '');

            // 使用 Set 避免重复添加
            if (!addedKeys.has(filenameWithoutExt)) {
                manifest.audio[filenameWithoutExt] = {
                    src: normalizedPath,
                    type: type,
                };
                addedKeys.add(filenameWithoutExt);
            }
        }
    }

    return manifest;
}
