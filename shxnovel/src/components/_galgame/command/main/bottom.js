import { Timeline } from '@juliangarnierorg/anime-beta';
import { CommandCallback } from '../../SceneCommand';

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
export const CommandBottom = {
    speaker: (options) => {
        const { track, timeline, unit, skip } = options;
        const time = unit.time;
        const [str] = unit.args;
        function solve() {
            track.host.speaker.inner_item = str;
        }
        timeline.call(solve, time);
    },
    icon: (options) => {
        const { track, timeline, unit, skip } = options;
        const time = unit.time;
        const [ICON, fade] = unit.args;
        function solve() {
            track.host.icon.changeIcon(ICON, fade);
        }
        timeline.call(solve, time);
    },
};
