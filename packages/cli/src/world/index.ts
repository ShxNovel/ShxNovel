import * as fs from 'fs';
import * as path from 'path';
// import format from 'json-stringify-pretty-compact';
import { fileImport, libImport } from '../tools';

const { register } =
    // sync with user runtime
    (await libImport('@shxnovel/world')).default as typeof import('@shxnovel/world');

/** @todo */
export async function worldCLI() {
    const arg = process.argv[3] ? process.argv[3] : '';

    const inputPath = path.resolve(process.cwd(), arg, './world');
    const outputPath = path.resolve(process.cwd(), arg, './.vn');
    // const outputPath = path.resolve(process.cwd(), arg, './.vn', './worldIR');

    console.log(`world: ${outputPath}`);

    const dirFiles = fs.readdirSync(inputPath);

    const { config, worldFiles } = await getConfig(dirFiles, inputPath);

    console.log({ config, worldFiles });

    for (const file of worldFiles) {
        const filePath = path.join(inputPath, file);
        await fileImport(filePath);
    }

    const context = register.visualWorldContext.finish();

    console.dir(context, { depth: null });

    /**
     * Write output to file
     */

    if (!fs.existsSync(outputPath)) {
        fs.mkdirSync(outputPath);
    }

    // collection.d.ts
}

async function getConfig(files: string[], inputPath: string) {
    const config = {
        entry: '',
    };

    const worldFiles: string[] = [];

    for (const file of files) {
        const fileName = file.replace(/\.[^.]+$/, '');

        if (fileName === 'config') {
            const arg_path = path.join(inputPath, file);
            const result = (await fileImport(arg_path)) as { default: any };
            Object.assign(config, result.default);
            continue;
        }

        worldFiles.push(file);
    }

    // 正规化
    config.entry = path.join(config.entry);

    // 如果入口文件不存在：重置入口配置
    if (!fs.existsSync(path.join(inputPath, config.entry))) {
        config.entry = '';
    }

    // 如果没有 config 文件：默认使用第一个文件作为入口文件
    if (config.entry === '' && worldFiles[0]) {
        config.entry = worldFiles[0];
    }

    return { config, worldFiles };
}
