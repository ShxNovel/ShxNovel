import * as fs from 'fs';
import * as path from 'path';
import format from 'json-stringify-pretty-compact';
import { fileImport, libImport } from '../tools';
import { solveDeclare } from './solveVisualMap';
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
    const dtsPath = path.resolve(process.cwd(), arg, './.vn');
    const worldIRPath = path.resolve(process.cwd(), arg, './.vn', './worldIR');

    // const outputPath = path.resolve(process.cwd(), arg, './.vn', './worldIR');

    console.log(`world: ${dtsPath}`);

    const dirFiles = fs.readdirSync(inputPath);

    const { worldFiles } = await getConfig(dirFiles, inputPath);

    // console.log({ config, worldFiles });

    for (const file of worldFiles) {
        const filePath = path.join(inputPath, file);
        await fileImport(filePath);
    }

    const context = registry.visualWorldContext.finish();

    const output = solveDeclare(context, registry.InGameData, registry.GlobalData);

    // console.dir(output, { depth: null });

    /**
     * Write output to file
     */

    if (!fs.existsSync(dtsPath)) {
        fs.mkdirSync(dtsPath);
    }

    fs.writeFileSync(path.join(dtsPath, './world.d.ts'), output);

    //

    if (!fs.existsSync(worldIRPath)) {
        fs.mkdirSync(worldIRPath);
    }

    context.forEach((visual, name) => {
        const outPath = path.join(worldIRPath, encodeURIComponent(`${name}.ir.json`));
        // console.log(outPath);
        const json = format(visual, {
            indent: 2,
            maxLength: 120,
        });
        fs.writeFileSync(outPath, json);
    });
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
