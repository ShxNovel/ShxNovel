import { mainRenderer } from './scene/mainRenderer';

export * from './scene/actions';
export * from './scene/renderLoop';
export * from './scene/mainRenderer';
export * from './scene/cameraBunch';
export * from './scene/sceneBunch';

export function initDom(el: HTMLElement) {
    if (el === undefined) el = document.body;
    el.appendChild(mainRenderer.domElement);
}
