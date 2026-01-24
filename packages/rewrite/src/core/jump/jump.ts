import { rewriteContext } from '../RewriteContext';

export interface JumpUnit {
    type: 'jump';
    target: string;
}

export function jump(name: string) {
    rewriteContext.push({
        type: 'jump',
        target: `${name}`,
    } satisfies JumpUnit);
}
