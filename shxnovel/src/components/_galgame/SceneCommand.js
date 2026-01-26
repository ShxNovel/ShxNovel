import { JSAnimation, Timeline } from '@juliangarnierorg/anime-beta';

import { stroyBus } from '../../lib/nuiData.js';
import { addAction, rendSomeFrames, rmvAction } from '../../lib/nuiScene.js';

import { CommandSub } from './command/sub/__sub.js';
import { CommandMain } from './command/main/__main.js';

/**
 * @typedef SceneCommandOption
 *
 * @property {import('./SceneTrack.js').SceneTrack} track
 * @property {Timeline} timeline
 * @property {object} unit
 * @property {boolean} skip
 *
 */

/**
 * @typedef {Object.<string, (options: SceneCommandOption) => any} CmdHandler
 */
const item = {};

/** used in {@link cmdHandler}, use ... to spread */
export const CommandCallback = {
    onBegin() {
        /** @type {JSAnimation} */
        const that = this;
        that.__nuiAction = addAction();
    },
    onComplete() {
        /** @type {JSAnimation} */
        const that = this;
        rmvAction(that.__nuiAction);
        rendSomeFrames();
    },
};

/** @type {CmdHandler} */
export const cmdHandler = {
    run: (options) => {
        const { track, timeline, unit, skip } = options;
        const _f = new Function(unit.args[0]);
        _f();
    },
    eval: (options) => {
        const { track, timeline, unit, skip } = options;
        eval(unit.args[0]);
    },
    goto: (options) => {
        const { track, timeline, unit, skip } = options;
        const anchor = unit.args[0];
        stroyBus.jumpAnchor(anchor);
    },
    ...CommandSub,
    ...CommandMain,
};
