import * as fs from 'fs';
import * as path from 'path';
import { generateDeclarationFile } from './generateDeclarationFile';

export type AssetList = {
    audio: string[];
    texture: string[];
};

export function assetCLI() {
    const arg = process.argv[3] ? process.argv[3] : '';

    const inputPath = path.resolve(process.cwd(), arg, './assets');
    const outputPath = path.resolve(process.cwd(), arg, './.vn');

    console.log(`asset: ${outputPath}`);

    const audioPath = path.join(inputPath, 'audio');
    const texturePath = path.join(inputPath, 'texture');

    const audioFiles = fs.readdirSync(audioPath);
    const textureFiles = fs.readdirSync(texturePath);

    const assetList: AssetList = {
        audio: audioFiles,
        texture: textureFiles,
    };

    const output = generateDeclarationFile(assetList);

    /**
     * Write output to file
     */

    if (!fs.existsSync(outputPath)) {
        fs.mkdirSync(outputPath);
    }

    fs.writeFileSync(path.join(outputPath, './assets.d.ts'), output);
}
