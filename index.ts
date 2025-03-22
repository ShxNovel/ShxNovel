import * as THREE from 'three';
import { initSPA } from './src/lib/core';
import '@shoelace-style/shoelace/dist/themes/light.css';

/**
 *
 * For those modules that do not care about the order
 * + use `import "...";`
 *
 * If a loading sequence is required
 * + use `await import("...");`
 *
 */
export async function init() {
    // Should cache all Images?
    // If enabled, had better set before any THREE operation
    await import('./src/mygo/scene/enableCache');

    // hack
    await import('./src/mygo/hack/spa');
    await import('./src/mygo/hack/ImageUtils');

    // plain
    await import('./src/mygo/resizeMain');
    await import('./src/mygo/resizeCanvas');
    await import('./src/mygo/shortCut');

    // scene
    await import('./src/mygo/scene/showFPS');
    await import('./src/mygo/scene/systemScene');

    // route
    await import('./src/mygo/route/transition/init');
    await import('./src/mygo/route/transition/default');
    await import('./src/mygo/route/view/default');
    // await import('./src/mygo/route/galgame');

    initSPA('spa');

    return;
}
