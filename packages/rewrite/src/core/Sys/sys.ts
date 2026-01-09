import { collector } from '../collector';

export interface SysUnit {
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

export interface SysInterface {
    cut(): this;
}

export class SysImpl implements SysInterface {
    cut() {
        collector.push({ type: 'sys', content: [{ type: 'cut' }] });
        return this;
    }
}

export function system() {
    return new SysImpl() as SysInterface;
}
