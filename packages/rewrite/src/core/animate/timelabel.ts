import { rewriteContext } from '../RewriteContext';
import { AnimateUnit } from './types';

export function timelabel(timelabel: string) {
    const item: AnimateUnit = {
        type: 'animate',
        content: [{ kind: 'timelabel', target: timelabel }],
    };
    rewriteContext.push(item satisfies AnimateUnit);
}
