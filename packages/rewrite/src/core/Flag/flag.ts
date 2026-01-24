import { rewriteContext } from '../RewriteContext';

export interface FlagUnit {
    type: 'flag';
    name: string;
}

export function flag(name: string, content?: () => void) {
    rewriteContext.push({
        type: 'flag',
        name: `${name}`,
    } satisfies FlagUnit);

    if (!content) return;

    content();
}
