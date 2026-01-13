import { rewriteContext } from '../RewriteContext';
import { AnimateUnit } from './animate';

export function tl(timelabel: string) {
    const item: AnimateUnit = {
        type: 'animate',
        content: [{ kind: 'timelabel', id: timelabel }],
    };
    rewriteContext.push(item satisfies AnimateUnit);
}
