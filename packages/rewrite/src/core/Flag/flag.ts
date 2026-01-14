import { rewriteContext } from '../RewriteContext';

export interface FlagUnit {
    type: 'flag';
    name: string;
}

export function flag(name: string) {
    rewriteContext.push({
        type: 'flag',
        name,
    } satisfies FlagUnit);
}
