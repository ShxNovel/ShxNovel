import { rewriteContext } from '../RewriteContext';

export interface LabelUnit {
    type: 'label';
    name: string;
}

export function label(name: string) {
    rewriteContext.push({
        type: 'label',
        name,
    } satisfies LabelUnit);
}
