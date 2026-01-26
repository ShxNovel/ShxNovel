import { Timeline } from '@juliangarnierorg/anime-beta';
import { CommandCallback } from '../../SceneCommand';
import * as sTrack from '../controller';

/**
 * @typedef SceneCommandOption
 *
 * @property {import('../../SceneTrack').SceneTrack} track
 * @property {Timeline} timeline
 * @property {object} unit
 * @property {boolean} skip
 *
 */

/**
 * @typedef {Object.<string, (options: SceneCommandOption) => any} CmdHandler
 */

/** @type {CmdHandler} */
export const CommandFlow = {
    await(options) {
        const { track, timeline, unit, skip } = options;
        const time = unit.time;

        const str = unit.args[0];

        function solve() {
            if (skip) return;
            sTrack.makePromiseCmd(str);
            if (sTrack.promiseCmdSize()) {
                timeline.pause();
            }
        }

        timeline.call(solve, time);
    },
    label(options) {
        const { track, timeline, unit, skip } = options;
        const time = unit.time;

        const str = unit.args[0];

        timeline.label(str, time);
    },
};
