export class WorldContext<T> {
    type: string = 'Unknown';
    context: Map<string, T> = new Map();

    constructor(type: string = 'Unknown') {
        this.type = type;
    }

    add(name: string, item: T) {
        if (name === '') {
            throw new Error('Name cannot be empty');
        }

        if (this.context.has(name)) {
            throw new Error(`${this.type} with name '${name}' already exists`);
        }

        return this.context.set(name, item);
    }

    finish() {
        return this.context;
    }
}
