import { engine } from '@juliangarnierorg/anime-beta';

import { actions, callActions } from './actions';
import { sceneBunch } from './sceneBunch';
import { cameraBunch } from './cameraBunch';
import { mainRenderer } from './mainRenderer';

/** internal counter */
let _framesToRender = 0;

export function getFramesToRender() {
    return _framesToRender;
}

/** You should make sure the final value is non-negative */
export function _setFramesToRender(frames: number) {
    _framesToRender = frames;
}

/** You should make sure the final value is non-negative */
export function _addFramesToRender(frames: number = 5) {
    _framesToRender += frames;
}

export function rendSomeFrames(cnt = 60) {
    cnt = Math.ceil(Math.max(0, cnt));
    _addFramesToRender(cnt);
}

/** */

engine.useDefaultMainLoop = false;

let mainRendererBehaviour = function () {
    mainRenderer.setRenderTarget(null);
    mainRenderer.render(sceneBunch.mainScene, cameraBunch.mainCamera);
};

// maybe switch into some data-structure
export let beforeMainRenderer: Function[] = [];
export function rebuildBeforeMainRenderer(item) {
    beforeMainRenderer = item;
}

export let afterMainRenderer: Function[] = [];
export function rebuildAfterMainRenderer(item) {
    afterMainRenderer = item;
}

let _internal_block_loop = false;
export function setLoopBlock(stat = false) {
    _internal_block_loop = stat;
}

let renderLoop = function () {
    engine.update();

    if (_internal_block_loop) return;

    let flag = 0;

    if (actions.size) {
        const result = callActions();
        for (const item of result) {
            if (item) flag = 1;
        }
    }

    if (_framesToRender) {
        _framesToRender--;
        flag = 1;
    }

    if (flag) {
        /** can be used for off-screen rendering  */
        for (const fn of beforeMainRenderer) fn();

        /** main-scene */
        mainRendererBehaviour();

        /** more post-processing ??? */
        for (const fn of afterMainRenderer) fn();
    }
};

mainRenderer.setAnimationLoop(renderLoop);

/**
 * Change default main-renderer-behaviour \
 * Can be used for post-processing, using `EffectComposer` `xxxPass` ... \
 * **Dont Call this function, unless you know what you are doing**
 */
export function setMainRendererBehaviour(fn: () => void) {
    mainRendererBehaviour = fn;
}

/**
 * Change the total render loop. \
 * **Dont Call this function, unless you know what you are doing**
 */
export function setRenderLoop(fn: () => void) {
    renderLoop = fn;
}
