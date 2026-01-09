import { EaseType, PosType } from '../argTypes';
import { ChapterUnit } from '../chapter';

export interface StandContext {
    args: Record<PropertyKey, unknown>;
    cache: ChapterUnit[];
}

export interface StandInterface {
    /**  switch stand */
    face(name: string): this;

    /** move */
    move(pos: PosType): this;

    /** effect */
    effect(name: string, args: Record<PropertyKey, unknown>): this;

    /** effect ease type */
    ease(ease: EaseType): this;

    /** effect duration */
    duration(t: number): this;

    /** Timeline label */
    tl(label: string): this;
}

export class standImpl implements StandInterface {
    ctx: StandContext;

    constructor(ctx: StandContext) {
        this.ctx = ctx;
    }

    face(name: string) {
        this.ctx.args.face = name;
        return this;
    }

    move(pos: PosType) {
        this.ctx.args.move = pos;
        return this;
    }

    effect(name: string, args: Record<PropertyKey, unknown>) {
        this.ctx.args.effect = { name, args };
        return this;
    }

    ease(ease: EaseType) {
        this.ctx.args.ease = ease;
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

export function buildstand(cache: ChapterUnit[]) {
    return (name: string): StandInterface => {
        const args = { name };

        cache.push({ type: 'stand', args });

        return new standImpl({ args, cache });
    };
}
