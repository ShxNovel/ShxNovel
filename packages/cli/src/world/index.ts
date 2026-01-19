import * as fs from 'fs';
import * as path from 'path';
// import format from 'json-stringify-pretty-compact';
import { fileImport, libImport } from '../tools';
import { solveVisualMap } from './solveVisualMap';
// import { useBg, useCamera, useStand, useVisual } from '@shxnovel/world';

const { registry, useVisual, useBg, useCamera, useStand } =
    // sync with user runtime
    (await libImport('@shxnovel/world')).default as typeof import('@shxnovel/world');

function inject() {
    (global as any).useVisual = useVisual;
    (global as any).useBg = useBg;
    (global as any).useCamera = useCamera;
    (global as any).useStand = useStand;
}

/** @todo */
export async function worldCLI() {
    inject();
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

    const context = registry.visualWorldContext.finish();

    const output = solveVisualMap(context);

    // console.dir(output, { depth: null });

    /**
     * Write output to file
     */

    if (!fs.existsSync(outputPath)) {
        fs.mkdirSync(outputPath);
    }

    fs.writeFileSync(path.join(outputPath, './world.d.ts'), output);
}

async function getConfig(files: string[], inputPath: string) {
    const config = {};

    const worldFiles: string[] = [];

    for (const file of files) {
        const fileName = file.replace(/\.[^.]+$/, '');

        if (fileName === 'config') {
            const arg_path = path.join(inputPath, file);
            const result = (await fileImport(arg_path)) as { default: any };
            Object.assign(config, result.default);
            continue;
        }

        // ts 和 js 文件
        if (file.endsWith('.ts') || file.endsWith('.js')) {
            worldFiles.push(file);
        }
    }

    return { config, worldFiles };
}
