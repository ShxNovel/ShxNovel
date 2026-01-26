import { CommandCallback } from '../../SceneCommand';
import { CommandBottom } from './bottom';
import { CommandFlow } from './flow';
import { CommandScene } from './scene';

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
export const CommandMain = {
    ...CommandBottom,
    ...CommandFlow,
    ...CommandScene,
};
