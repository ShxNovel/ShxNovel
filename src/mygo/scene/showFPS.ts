import Stats from 'stats.js';
import { addAction } from '@/lib/scene/actions';

const stats = new Stats();
document.body.appendChild(stats.dom);

addAction(() => {
    stats.update();
    return false;
});
