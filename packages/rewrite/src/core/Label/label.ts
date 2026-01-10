import { collector } from '../collector';

export interface LabelUnit {
    type: 'label';
    name: string;
}

export function label(name: string) {
    collector.push({
        type: 'label',
        name,
    } satisfies LabelUnit);
}
