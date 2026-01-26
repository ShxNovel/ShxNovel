// @ts-ignore
import Stats from 'stats.js';
import { addAction } from '@shxnovel/canoe/index.ts';

const stats = new Stats();
document.body.appendChild(stats.dom);

addAction(() => {
    stats.update();
    return false;
});
