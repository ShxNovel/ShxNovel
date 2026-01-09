import { ChapterUnit } from '../chapter';

export interface Sys {
    type: 'sys';
    content: RewriteSys[];
}

export type RewriteSys = {
    type: keyof SysInterface;
    args?: Record<PropertyKey, unknown>;
};

/**
 * Sys system methods
 */

export interface SysContext {
    args: Record<PropertyKey, unknown>;
    cache: ChapterUnit[];
}

export interface SysInterface {
    cut(): this;
}

export class sysImpl implements SysInterface {
    ctx: SysContext;

    constructor(ctx: SysContext) {
        this.ctx = ctx;
    }

    cut() {
        this.ctx.cache.push({ type: 'sys', content: [{ type: 'cut' }] });
        return this;
    }
}

export function BuildSys(cache: ChapterUnit[]) {
    return () => {
        const args = {};

        return new sysImpl({ args, cache }) as SysInterface;
    };
}
