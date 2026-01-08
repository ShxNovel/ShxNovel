import { exit } from 'process';
import { assetsCLI } from './assets';

const arg2 = process.argv[2];
// const arg3 = process.argv[3];

if (!arg2) {
    console.log('Usage: shx-cli <type> <?dir>');
    exit(1);
}

switch (arg2) {
    case 'assets':
        assetsCLI();
        break;
    case 'story':
        break;
}
