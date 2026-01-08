import { exit } from 'process';
import { assetsCLI } from './assets';
import { storyCLI } from './story';
import { worldCLI } from './world';

const arg2 = process.argv[2];

function bad() {
    console.log('Usage: shx-cli <type> <?dir>');
    console.log('type: assets | story | world');
    exit(1);
}

if (!arg2) {
    bad();
}

switch (arg2) {
    case 'assets':
        assetsCLI();
        break;
    case 'story':
        storyCLI();
        break;
    case 'world':
        worldCLI();
        break;
    default:
        bad();
        break;
}
