import { ChapterUnit } from '../chapter';

export interface StandContext {
    args: Record<PropertyKey, unknown>;
    cache: ChapterUnit[];
}
export interface StandInterface {
    position(): this;
    rotation(): this;
    effect(): this;
}

export class standImpl implements StandInterface {
    ctx: StandContext;

    constructor(ctx: StandContext) {
        this.ctx = ctx;
    }

    position() {
        return this;
    }

    rotation() {
        return this;
    }

    effect() {
        return this;
    }
}

export function buildstand(cache: ChapterUnit[]) {
    return (name: string): StandInterface => {
        const args = { name };

        cache.push({ type: 'ink', content: [{ type: 'stand', args }] });

        return new standImpl({ args, cache });
    };
}
