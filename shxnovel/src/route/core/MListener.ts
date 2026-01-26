class MListener {
    pool: Map<String, Array<Function>>;

    constructor() {
        this.pool = new Map();
    }

    on(event: string, fn: Function) {
        if (typeof event !== 'string') {
            return;
        }
        if (this.pool.has(event)) {
            this.pool.get(event).push(fn);
        } else {
            this.pool.set(event, [fn]);
        }
    }

    emit(event: string, ...args: any[]) {
        if (typeof event !== 'string') {
            return;
        }
        let aim = this.pool.get(event);
        if (!Array.isArray(aim)) {
            return;
        }
        for (let fn of aim) {
            fn(...args);
        }
    }

    async emitAsync(event: string, ...args: any[]) {
        if (typeof event !== 'string') {
            return;
        }
        let aim = this.pool.get(event);
        if (!Array.isArray(aim)) {
            return;
        }
        for await (let fn of aim) {
            await fn(...args);
        }
    }
}

const eventController = new MListener();
export { MListener, eventController };
