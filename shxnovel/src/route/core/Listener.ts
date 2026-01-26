class Listener {
    pool: Array<Function>;

    constructor() {
        this.pool = [];
    }

    wait(fn: Function) {
        this.pool.push(fn);
    }

    emit(...args: any[]) {
        for (let fn of this.pool) {
            fn(...args);
        }
    }

    async emitAsync(...args: any[]) {
        for await (let fn of this.pool) {
            await fn(...args);
        }
    }
}

export { Listener };
