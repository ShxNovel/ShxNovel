import { Timeline } from '@juliangarnierorg/anime-beta';

import type { actions } from '../../actions';
import { Action, addAction, rmvAction } from '../../actions';
import { rendSomeFrames } from '../../renderLoop';
import { ShxObject } from 'types/shx';

/**
 *
 */
export function setAnime(item: ShxObject, anime: Timeline, cb: Action) {
    item.material.userData.timeline = anime;
    item.material.userData.runningID = addAction(cb); // add
    return item.material.userData.runningID;
}

/**
 * Behaviour:
 * 1. Always remove `runningID` from {@link actions}.
 * 2. Always remove internal runningID and timeline.
 *
 * Will not Stop the Timeline.
 */
export function removeAnime(item: ShxObject) {
    const { runningID } = item.material.userData;

    rmvAction(runningID); // if not exist, its alright
    item.material.userData.runningID = 0;
    item.material.userData.timeline = undefined;
    rendSomeFrames(); // unstable fix for loop diff
}

/**
 * Behaviour:
 * 1. Always remove `runningID` from {@link actions}.
 * 2. **Only** if `runningID` match `item`, remove internal runningID and timeline.
 *
 * Will not Stop the Timeline.
 */
export function removeAnimeById(item: ShxObject, runningID: any) {
    rmvAction(runningID); // if not exist, its alright
    if (runningID === item.material.userData.runningID) {
        item.material.userData.runningID = 0;
        item.material.userData.timeline = undefined;
    }
    rendSomeFrames(); // unstable fix for loop diff
}

/**
 * Try to halt the playing anime.
 * Internal use {@link removeAnime}
 */
export function haltCheck(item: ShxObject) {
    const { timeline } = item.material.userData;
    if (timeline instanceof Timeline) {
        if (!timeline.completed) timeline.complete();
    }
    removeAnime(item);
}

/**
 * Wrap given anime (for on-demand-render).
 */
export function wrapAnime(item: ShxObject, anime: Timeline, cb: Action) {
    const userOnBegin = anime.onBegin;
    anime.onBegin = (self) => {
        haltCheck(item);
        const id = setAnime(item, anime, cb); // add

        // @ts-expect-error
        self._shxId = id;

        userOnBegin(self);
    };

    const userOnComplete = anime.onComplete;
    anime.onComplete = (self) => {
        userOnComplete(self);

        // @ts-expect-error
        removeAnimeById(item, self._shxId); // rmv
    };
}
