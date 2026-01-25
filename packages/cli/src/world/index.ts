import * as fs from 'fs';
import * as path from 'path';
import format from 'json-stringify-pretty-compact';
import { fileImport, libImport } from '../tools';
import { solveDeclare } from './solveVisualMap';
import { solveList } from './solveList';

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

    // part 1

    const context = registry.visualCtx.finish();

    const DecleareOutput = solveDeclare(context, registry.InGameData, registry.GlobalData);

    /**
     * Write output to file
     */

    if (!fs.existsSync(dtsPath)) {
        fs.mkdirSync(dtsPath);
    }

    fs.writeFileSync(path.join(dtsPath, './world.d.ts'), DecleareOutput);

    // part 2

    const resourceList = solveList(registry);

    if (!fs.existsSync(worldIRPath)) {
        fs.mkdirSync(worldIRPath);
    }

    const worldIR = createWorldIR(resourceList, worldIRPath);

    // part 3
    const manifest = createManifest(worldIR);
    const manifestJson = format(manifest, {
        indent: 2,
        maxLength: 120,
    });
    fs.writeFileSync(path.join(dtsPath, './manifest.json'), manifestJson);
}

function createWorldIR(some: ReturnType<typeof solveList>, worldIRPath: string) {
    const result = {} as Record<string, any>;

    Object.entries(some.rt).forEach(([name, item]) => {
        const outPath = path.join(worldIRPath, encodeURIComponent(`${name}.ir.json`));
        const json = format(item, {
            indent: 2,
            maxLength: 120,
        });
        fs.writeFileSync(outPath, json);
        result[name] = { type: 'rt', path: path.join('worldIR', `${name}.ir.json`) };
    });
    Object.entries(some.camera).forEach(([name, item]) => {
        const outPath = path.join(worldIRPath, encodeURIComponent(`${name}.ir.json`));
        const json = format(item, {
            indent: 2,
            maxLength: 120,
        });
        fs.writeFileSync(outPath, json);
        result[name] = { type: 'camera', path: path.join('worldIR', `${name}.ir.json`) };
    });

    Object.entries(some.scene).forEach(([name, item]) => {
        const outPath = path.join(worldIRPath, encodeURIComponent(`${name}.ir.json`));
        const json = format(item, {
            indent: 2,
            maxLength: 120,
        });
        fs.writeFileSync(outPath, json);
        result[name] = { type: 'scene', path: path.join('worldIR', `${name}.ir.json`) };
    });

    Object.entries(some.visual).forEach(([name, item]) => {
        const outPath = path.join(worldIRPath, encodeURIComponent(`${name}.ir.json`));
        const json = format(item, {
            indent: 2,
            maxLength: 120,
        });
        fs.writeFileSync(outPath, json);
        result[name] = { type: 'visual', path: path.join('worldIR', `${name}.ir.json`) };
    });

    return result;
}

function createManifest(resourceList: ReturnType<typeof createWorldIR>) {
    const manifest = {
        meta: { version: '1.0', engine: 'ShxNovel' },
        resourceList,
    };

    return manifest;
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
