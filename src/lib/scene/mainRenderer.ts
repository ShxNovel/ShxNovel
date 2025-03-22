import { WebGLRenderer } from 'three';

const width = document.documentElement.clientWidth;
const height = document.documentElement.clientHeight;

/** default renderer */
export const mainRenderer = new WebGLRenderer({
    // antialias: nuiConfig.scene.antialias,
    antialias: true,
});

window.mainRenderer = mainRenderer;

mainRenderer.setPixelRatio(window.devicePixelRatio);
mainRenderer.setSize(width, height);
