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

// make sure before any THREE operation
THREE.Cache.enabled = true;

// hack
await import('./src/mygo/hack/spa');
await import('./src/mygo/hack/ImageUtils');

// debug
await import('./src/mygo/scene/showFPS');

// plain
await import('./src/mygo/resizeMain');
await import('./src/mygo/resizeCanvas');
await import('./src/mygo/shortCut');

// scene

// route
await import('./src/mygo/route/transition/init');
await import('./src/mygo/route/transition/default');
await import('./src/mygo/route/others');
await import('./src/mygo/route/galgame');

initSPA('spa');
