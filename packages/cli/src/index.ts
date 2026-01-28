import { exit } from 'process';
import { assetCLI } from './asset';
import { storyCLI } from './story';
import { worldCLI } from './world';
import { useCLI } from './use';

export * from './types'; // hack

const arg2 = process.argv[2];

function bad() {
    console.log('Usage: shx-cli <type> <?base-dir>');
    console.log('type: asset | story | world | use');
    exit(1);
}

if (!arg2) {
    bad();
}

switch (arg2) {
    case 'asset':
        await assetCLI();
        break;
    case 'story':
        await storyCLI();
        break;
    case 'world':
        await worldCLI();
        break;
    case 'use':
        await useCLI();
        break;
    default:
        bad();
        break;
}
