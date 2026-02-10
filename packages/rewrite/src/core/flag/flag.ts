import { deepMerge } from '../../utils/deepMerge';
import { getPathDiff } from '../../utils/getPathDiff';
import { getStack } from '../../utils/getStack';
import { rewriteContext } from '../RewriteContext';

export interface FlagUnit {
    type: 'flag';
    name: string;
    meta?: Record<string, any>;
}

export function flag(name: string, content?: () => void) {
    if (name === '') {
        throw new Error('Flag name cannot be empty');
    }

    let debug: null | string = null;
    if (process.env.RewriteInputPath) debug = getPathDiff(process.env.RewriteInputPath, getStack(flag));

    const item: FlagUnit = {
        type: 'flag',
        name: `${name}`,
    };

    if (process.env.RewriteInputPath) deepMerge(item, { meta: { debug } });

    rewriteContext.push(item);

    if (!content) return;

    content();
}
