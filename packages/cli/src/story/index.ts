import * as fs from 'fs';
import * as path from 'path';

/** @todo */
export function storyCLI() {
    const arg = process.argv[3] ? process.argv[3] : '';

    // const inputPath = path.resolve(process.cwd(), arg, './story');
    const outputPath = path.resolve(process.cwd(), arg, './.vn', './storyIR');

    console.log(`story: ${outputPath}`);

    /**
     * Write output to file
     */

    if (!fs.existsSync(outputPath)) {
        fs.mkdirSync(outputPath);
    }
}
