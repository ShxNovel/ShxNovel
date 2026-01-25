import { Animate } from '../../../types';

export interface VisualInstance<T extends Animate.VisualKey, U extends string> {
    type: 'visual';
    name: T;
    id: `${T}@${U}`;
}

export function visual<T extends Animate.VisualKey>(name: T) {
    const instance = <U extends string>(id: U) => {
        return {
            type: 'visual',
            name,
            id: `${name}@${id}`,
        } satisfies VisualInstance<T, U>;
    };

    return { instance };
}
