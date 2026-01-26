import { initSPA } from './src/route';

export async function init() {
    // hack
    await import('./src/mygo/hack/spa');

    // plain
    await import('./src/mygo/resizeMain');

    // route
    await import('./src/mygo/route/transition/init');

    initSPA('spa');
}
