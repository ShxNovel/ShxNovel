import { deepMerge } from '../../utils/deepMerge';
import { getPathDiff } from '../../utils/getPathDiff';
import { getStack } from '../../utils/getStack';
import { rewriteContext } from '../RewriteContext';

export interface JumpUnit {
    type: 'jump';
    target: string;
    meta?: Record<string, any>;
}

export function jump(name: string) {
    if (name === '') {
        throw new Error('Jump target cannot be empty');
    }

    let debug: null | string = null;
    if (process.env.RewriteInputPath) debug = getPathDiff(process.env.RewriteInputPath, getStack(jump));

    const item: JumpUnit = {
        type: 'jump',
        target: `${name}`,
    };

    if (process.env.RewriteInputPath) deepMerge(item, { meta: { debug } });

    rewriteContext.push(item);
}
