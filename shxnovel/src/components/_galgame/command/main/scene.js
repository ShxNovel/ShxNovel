import { CommandCallback } from '../../SceneCommand';
import { scene, ShxObject, textureCache } from '../../../../lib/nuiScene';

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
export const CommandScene = {
    move: (options) => {
        const { track, timeline, unit, skip } = options;
        const time = unit.time;

        const [name, position, duration] = unit.args;

        const body = {
            duration: Number(duration),
            ...CommandCallback,
        };

        const [x, y, z] = position;
        if (x !== '+=0') body.x = x;
        if (y !== '+=0') body.y = y;
        if (z !== '+=0') body.z = z;

        const item = scene.get(name);
        timeline.add(item?.position, body, time);
    },
    opacity: (options) => {
        const { track, timeline, unit, skip } = options;
        const time = unit.time;

        const [name, opacity, duration] = unit.args;

        const item = scene.get(name);
        timeline.add(item, {
            opacity,
            duration: Number(duration),
            ...CommandCallback,
        });
    },
    animation: (options) => {},
    async changeTexture(options) {
        const { track, timeline, unit, skip, replay } = options;
        const time = unit.time;

        const [name, img_src, duration, shader, ease] = unit.args;

        /** @type {ShxObject}*/
        const item = scene.get(name);

        if (!replay) {
            Reflect.set(
                track.textureSnap,
                name,
                item.material.uniforms.texture2.value
            );
        }

        const texture = await textureCache.load(img_src);
        const ani = item.makeTransitionAnime(texture, duration, true, ease);

        timeline.call(() => {
            item.setFragmentShader(shader);
        }, time);
        timeline.sync(ani, time);
    },
};
