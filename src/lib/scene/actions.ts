/**
 * A data structure, designed to manage on-demand rendering.     \
 * At the beginning of each loop, all Actions are checked first. \
 * Maintain an internal data structure {@link actions}.
 *
 * [Note] each action will be checked, \
 * even if it has already been determined that rendering is required. \
 *
 * [E.g.]
 * ```js
 * // When your animation starts
 * const id = addAction(true); // or
 * const id = addAction(() => {
 *  // do something
 *  // ? change the uniforms passed to the shader
 * });
 *
 * // When your animation ends
 * rmvAction(id);
 * ```
 *
 * @module Actions
 */

import { isFunction } from '@/lib/core/typeCheck';

/**
 * Used to indicate whether the `RenderLoop` needs to render.
 */
export type Action = ActionCallback | boolean;

/**
 * If it's impossible to determine in advance whether rendering is needed. \
 * Using {@link ActionCallback}.
 */
export type ActionCallback = () => boolean;

export const actions: Map<number, Action> = new Map();
window.actions = actions;

/** internal couter */
let __actionsUID = 0;

/**
 * @param {Action} [cb=true]
 * @returns {number} this action UID
 */
export function addAction(cb: Action = true): number {
    __actionsUID++;
    actions.set(__actionsUID, cb);
    return __actionsUID;
}

/**
 * Accept Any value, but only number UUID will be accepted.
 * @param {any | number} thisActionUID
 */
export function rmvAction(thisActionUID: any | number) {
    return actions.delete(thisActionUID);
}

export function callActions(): boolean[] {
    const result: boolean[] = [];
    actions.forEach((value, key) => {
        if (isFunction(value)) {
            result.push(value());
        } else {
            result.push(value);
        }
    });
    return result;
}
