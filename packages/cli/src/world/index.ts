import * as fs from 'fs';
import * as path from 'path';

/** @todo */
export function worldCLI() {
    const arg = process.argv[3] ? process.argv[3] : '';

    // const inputPath = path.resolve(process.cwd(), arg, './world');
    const outputPath = path.resolve(process.cwd(), arg, './.vn', './worldIR');

    console.log(`world: ${outputPath}`);

    /**
     * Write output to file
     */

    if (!fs.existsSync(outputPath)) {
        fs.mkdirSync(outputPath);
    }
}
