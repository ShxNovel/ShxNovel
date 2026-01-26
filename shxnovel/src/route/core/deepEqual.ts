/**
 * Compare with `a` and `b`.
 * Handled circular references.
 * @param {unknown} a
 * @param {unknown} b
 * @returns {boolean}
 */
export function deepEqual(a: unknown, b: unknown, seen = new WeakSet()): boolean {
    // If both are the same reference, return true
    if (a === b) return true;

    // If either is null or not an object, return false
    if (a === null || b === null || typeof a !== 'object' || typeof b !== 'object') {
        return false;
    }

    // If we've already seen these objects, return true to avoid infinite recursion
    if (seen.has(a) && seen.has(b)) return true;

    // Add the current objects to the seen set
    seen.add(a);
    seen.add(b);

    // Get the keys of both objects
    const keysA = Object.keys(a);
    const keysB = Object.keys(b);

    // If they have a different number of keys, return false
    if (keysA.length !== keysB.length) return false;

    // Check each key in A to see if it exists in B and if the values are equal
    for (let key of keysA) {
        if (!keysB.includes(key) || !deepEqual(a[key], b[key], seen)) {
            return false;
        }
    }

    return true;
}

/**
 * NOT Handled Circular References.
 * Compare with `a` and `b`
 * @param {unknown} a
 * @param {unknown} b
 * @returns {boolean}
 */
export function deepEqualNR(a: unknown, b: unknown): boolean {
    // If both are the same reference, return true
    if (a === b) return true;

    // If either is null or not an object, return false
    if (a === null || b === null || typeof a !== 'object' || typeof b !== 'object') {
        return false;
    }

    // Get the keys of both objects
    const keysA = Object.keys(a);
    const keysB = Object.keys(b);

    // If they have a different number of keys, return false
    if (keysA.length !== keysB.length) return false;

    // Check each key in A to see if it exists in B and if the values are equal
    for (let key of keysA) {
        if (!keysB.includes(key) || !deepEqualNR(a[key], b[key])) {
            return false;
        }
    }

    return true;
}
