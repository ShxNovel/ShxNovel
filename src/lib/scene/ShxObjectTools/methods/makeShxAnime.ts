import * as THREE from 'three';
import {
    animate,
    createTimeline,
    eases,
    Timeline,
} from '@juliangarnierorg/anime-beta';

import { ShxObject } from 'types/shx';
import { Action } from '../../actions';
import * as Tool from './animeUtils';

type AnimeArgs = {
    texture: THREE.Texture;
    duration?: number;
    cb?: Action;
    ease?: string;
};

function makeArgs(defaultArgs: Partial<AnimeArgs>, userArgs: AnimeArgs) {
    return Object.assign(defaultArgs, userArgs);
}

export function makeTextureAnime(item: ShxObject, userArgs: AnimeArgs) {
    const { texture, duration, cb, ease } = makeArgs(
        { duration: 500, cb: true, ease: 'linear' },
        userArgs
    );

    const timeline = createTimeline({
        autoplay: false,
        defaults: { duration },
        onBegin: () => {
            item.material.uniforms.texture2.value = texture;
        },
        onComplete: () => {
            item.material.uniforms.texture1.value = texture;
        },
    })
        .add(item.material.uniforms.progress, {
            value: {
                from: 0,
                to: 1,
                ease: ease, // cubicBezier(0.34, 1, 0.57, 1),
            },
            composition: 'none',
        })
        .set(item.material.uniforms.progress, {
            value: 0,
            composition: 'none',
        });

    Tool.wrapAnime(item, timeline, cb);

    return timeline;
}

export function textueTransition(item: ShxObject, userArgs: AnimeArgs) {
    return makeTextureAnime(item, userArgs).play();
}
