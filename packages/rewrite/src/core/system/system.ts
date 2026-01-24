import { rewriteContext } from '../RewriteContext';

export interface SystemUnit {
    type: 'system';
    content: RewriteSystem[];
}

export type RewriteSystem = {
    kind: keyof SysInterface;
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
        rewriteContext.push({ type: 'system', content: [{ kind: 'cut' }] });
        return this;
    }
}

export function system() {
    return new SysImpl() as SysInterface;
}
