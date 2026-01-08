/**
 * @TODO
 * Make it a CLI
 */

import * as fs from 'fs';
import * as path from 'path';
import { generateDeclarationFile } from './generateDeclarationFile';

const arg = process.argv[2] ? process.argv[2] : '';

const inputPath = path.resolve(process.cwd(), arg, './assets');
const outputPath = path.resolve(process.cwd(), arg, './.vn');

console.log(outputPath);

const audioPath = path.join(inputPath, 'audio');
const texturePath = path.join(inputPath, 'texture');

const audioFiles = fs.readdirSync(audioPath);
const textureFiles = fs.readdirSync(texturePath);

export type AssetList = {
    audio: string[];
    texture: string[];
};

const assetList: AssetList = {
    audio: audioFiles,
    texture: textureFiles,
};

const output = generateDeclarationFile(assetList);

fs.writeFileSync(path.join(outputPath, './assets.d.ts'), output);
