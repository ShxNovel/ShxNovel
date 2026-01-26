import { isObject } from './typeCheck';

/**
 * A Map records <string, V>.
 * Supports reverse lookup.
 */
export class BidirectionalMap<V extends object> {
    keyToObj: Map<string, V>;
    objToKey: WeakMap<V, string>;

    constructor() {
        this.keyToObj = new Map();

        this.objToKey = new WeakMap();
    }

    clear() {
        this.keyToObj.clear();
        this.objToKey = new WeakMap();
    }

    /**
     * **[Warn]** Due to the replacement,   \
     * Be cautious of memory leaks (especially on the GPU). \
     * And ensure that the <K,V> before replacement do not cause any leaks.
     */
    set(key: string, value: V) {
        let result = this._clean(key, value);
        this._set(key, value);
        return result;
    }

    _clean(newKey: string, newValue: V) {
        const oldValue = this.keyToObj.get(newKey);
        if (oldValue) this.objToKey.delete(oldValue);

        const oldKey = this.objToKey.get(newValue);
        if (oldKey) this.keyToObj.delete(oldKey);

        return oldValue;
    }

    _set(key: string, value: V) {
        this.keyToObj.set(key, value);
        this.objToKey.set(value, key);
    }

    /** @param {string} key  */
    getByKey(key: string) {
        return this.keyToObj.get(key);
    }

    /** @param {V} value  */
    getKeyByValue(value: V) {
        return this.objToKey.get(value);
    }

    /** @param {string} key  */
    deleteByKey(key: string) {
        const value = this.keyToObj.get(key);
        if (value) {
            this.keyToObj.delete(key);
            this.objToKey.delete(value);
            return value;
        }
        return false;
    }

    /** @param {V} value  */
    deleteByValue(value: V) {
        const key = this.objToKey.get(value);
        if (key) {
            this.objToKey.delete(value);
            this.keyToObj.delete(key);
            return value;
        }
        return false;
    }

    entries() {
        return Array.from(this.keyToObj.entries());
    }

    forEach(
        callbackfn: (value: V, key: string, map: Map<string, V>) => void,
        thisArg?: any
    ) {
        return this.keyToObj.forEach(callbackfn, thisArg);
    }

    get size() {
        return this.keyToObj.size;
    }
}
