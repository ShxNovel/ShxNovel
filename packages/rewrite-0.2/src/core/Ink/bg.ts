import { ChapterUnit } from '../chapter';

export interface BgContext {
    args: Record<PropertyKey, unknown>;
    cache: ChapterUnit[];
}

export interface BgInterface {
    change(name: string): this;
    shader(name: string): this;
    duration(t: number): this;
    tl(pos: string): this;
}

export class bgImpl implements BgInterface {
    ctx: BgContext;

    constructor(ctx: BgContext) {
        this.ctx = ctx;
    }

    change(name: string) {
        this.ctx.args.change = name;
        return this;
    }

    shader(name: string) {
        this.ctx.args.shader = name;
        return this;
    }

    duration(t: number) {
        this.ctx.args.duration = t;
        return this;
    }

    tl(pos: string) {
        this.ctx.args.tl = pos;
        return this;
    }
}

export function buildbg(cache: ChapterUnit[]) {
    return (name: string): BgInterface => {
        const args = { name };

        cache.push({ type: 'ink', content: [{ type: 'bg', args }] });

        return new bgImpl({ args, cache });
    };
}
