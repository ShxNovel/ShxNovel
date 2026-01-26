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
export const CommandSub = {
    resolve: (options) => {
        const { track, timeline, unit, skip } = options;
        const str = unit.args[0];
        track.host.dialogue.addCallback(() => {
            if (skip) return;
            sTrack.makeResolveCmd(str);
            if (sTrack.promiseCmdSize() === 0) {
                timeline.play();
            }
        });
    },
    text: (options) => {
        const { track, timeline, unit, skip } = options;
        const str = unit.args[0];
        track.tryGenerateDialogue(2);
        track.host.dialogue.addText(str);
        track.host.dialogue.addPlainText(str);
    },
    instantText: (options) => {
        const { track, timeline, unit, skip } = options;
        const str = unit.args[0];
        track.tryGenerateDialogue(2);
        track.host.dialogue.addInstantText(str);
        track.host.dialogue.addPlainText(str);
    },
    instantSay: (options) => {
        const { track, timeline, unit, skip } = options;
        const str = unit.args[0];
        track.tryGenerateDialogue(1);
        track.host.dialogue.addInstantText(str);
        track.host.dialogue.addPlainText(str);
    },
    pause: (options) => {
        const { track, timeline, unit, skip } = options;
        const time = Number(unit.args[0]);
        track.host.dialogue.addPause(time);
    },
};
