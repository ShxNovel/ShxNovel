import * as THREE from 'three';
import { initSPA } from './src/lib/core';
import '@shoelace-style/shoelace/dist/themes/light.css';
import { shxObjectLoader } from '@/lib/scene/shxAssets/ShxObjectLoader.ts';

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
    // make sure before any THREE operation
    THREE.Cache.enabled = true;

    window.loader = shxObjectLoader;

    // hack
    await import('./src/mygo/hack/spa');
    await import('./src/mygo/hack/ImageUtils');

    // plain
    await import('./src/mygo/resizeMain');
    await import('./src/mygo/resizeCanvas');
    await import('./src/mygo/shortCut');

    // scene
    await import('./src/mygo/scene/showFPS');

    // route
    await import('./src/mygo/route/transition/init');
    await import('./src/mygo/route/transition/default');
    await import('./src/mygo/route/others');
    // await import('./src/mygo/route/galgame');

    initSPA('spa');

    return;
}
