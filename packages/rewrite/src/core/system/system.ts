import { Animate } from '../../types';
import { rewriteContext } from '../RewriteContext';

export interface SystemUnit {
    type: 'system';
    content: RewriteSystem[];
    meta?: Record<string, any>;
}

export type RewriteSystem = {
    kind: keyof SysInterface;
    args?: Record<PropertyKey, unknown>;
};

/**
 * Sys system methods
 */

export interface SysInterface {
    usePipeline(pipeline: Animate.PipelineKey): this;
}

export class SysImpl implements SysInterface {
    usePipeline(pipeline: Animate.PipelineKey) {
        rewriteContext.push({ type: 'system', content: [{ kind: 'usePipeline', args: { pipeline } }] });
        return this;
    }
}

export function system() {
    return new SysImpl() as SysInterface;
}
