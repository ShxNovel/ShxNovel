import { WebGLRenderer } from 'three';

const width = document.documentElement.clientWidth;
const height = document.documentElement.clientHeight;

/** default renderer */
export const shxRenderer = new WebGLRenderer({
    // antialias: nuiConfig.scene.antialias,
    antialias: true,
});

window.mainRenderer = shxRenderer;

shxRenderer.setPixelRatio(window.devicePixelRatio);
shxRenderer.setSize(width, height);
