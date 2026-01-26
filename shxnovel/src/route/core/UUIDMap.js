/**
 * This map will auto generate the UUID as key.
 * User just need {@link set} the value.
 *
 * NO Long-term use ({@link uuid} may overflow)
 *
 * @class UUIDMap
 * @extends {Map}
 */
class UUIDMap extends Map {
    constructor(...args) {
        super(...args);

        this.uuid = 0;
    }

    clear() {
        super.clear();
        this.uuid = 0;
    }

    set(value) {
        const key = this.uuid++;
        super.set(key, value);
        return key;
    }
}
