import { makeTexture, preloadTextures } from '@shxnovel/canoe/index.js';
import { TextureLoader } from 'three';

const loader = new TextureLoader();

makeTexture('sys_bg0', () => {
    return loader.loadAsync('/images/default.png');
});

makeTexture('sys_bg1', () => {
    return loader.loadAsync('/images/img1.png');
});

makeTexture('sys_bg2', () => {
    return loader.loadAsync('/images/img2.jpg');
});

preloadTextures();
