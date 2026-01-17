import * as fs from 'fs';
import * as path from 'path';
import format from 'json-stringify-pretty-compact';
import { fileImport, libImport } from '../tools';

const { rewriteContext, rewriteParser, useChapter } =
    // sync with user runtime
    (await libImport('@shxnovel/rewrite')).default as typeof import('@shxnovel/rewrite');

function inject() {
    (global as any).useChapter = useChapter;
}

export async function storyCLI() {
    inject();

    const arg = process.argv[3] ? process.argv[3] : '';

    const inputPath = path.resolve(process.cwd(), arg, './story');
    const outputPath = path.resolve(process.cwd(), arg, './.vn', './storyIR');

    console.log(`story: ${outputPath}`);

    const dirFiles = fs.readdirSync(inputPath);

    const { config, storyFiles } = await getConfig(dirFiles, inputPath);

    console.log({ config, storyFiles });

    for (const file of storyFiles) {
        const filePath = path.join(inputPath, file);
        await fileImport(filePath);
    }

    // solve chapters
    rewriteContext.chapters.forEach((chapter, name) => {
        rewriteParser.solveOne(name, chapter);
    });

    console.log(rewriteParser.cache);

    /**
     * Write output to file
     */

    if (!fs.existsSync(outputPath)) {
        fs.mkdirSync(outputPath);
    }

    rewriteParser.cache.forEach((irs, name) => {
        const filePath = path.join(outputPath, `${name}.ir.json`);
        const json = format(irs, {
            indent: 2,
            maxLength: 120,
        });
        fs.writeFileSync(filePath, json);
    });
}

async function getConfig(files: string[], inputPath: string) {
    const config = {
        entry: '',
    };

    const storyFiles: string[] = [];

    for (const file of files) {
        const fileName = file.replace(/\.[^.]+$/, '');

        if (fileName === 'config') {
            const arg_path = path.join(inputPath, file);
            const result = (await fileImport(arg_path)) as { default: any };
            Object.assign(config, result.default);
            continue;
        }

        storyFiles.push(file);
    }

    // 正规化
    config.entry = path.join(config.entry);

    // 如果入口文件不存在：重置入口配置
    if (!fs.existsSync(path.join(inputPath, config.entry))) {
        config.entry = '';
    }

    // 如果没有 config 文件：默认使用第一个文件作为入口文件
    if (config.entry === '' && storyFiles[0]) {
        config.entry = storyFiles[0];
    }

    return { config, storyFiles };
}
