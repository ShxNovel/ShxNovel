const promiseSet = new Set();
const resolveSet = new Set();
let textSkipped = false;

export function clear() {
    promiseSet.clear();
    resolveSet.clear();
    textSkipped = false;
}

/**
 * Called by main-Track
 *
 * @param {string} name
 *
 */
export function makePromiseCmd(name) {
    // already resolved
    if (resolveSet.has(name)) {
        return;
    }

    // wait to be resolved
    promiseSet.add(name);
}

/**
 * Called by sub-Track
 *
 * @param {string} name
 */
export function makeResolveCmd(name) {
    // resolve ALL
    if (name === 'ALL') {
        for (const element of promiseSet) {
            resolveSet.add(element);
        }
        promiseSet.clear();
        return;
    }

    promiseSet.delete(name);
    resolveSet.add(name);
}

export function setTextSkipped() {
    textSkipped = true;
}

export function promiseCmdSize() {
    if (textSkipped) return 0;
    return promiseSet.size;
}
