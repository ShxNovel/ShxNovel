import { Animate } from '../../../types';

export interface SceneInstance {
    type: 'scene';
    name: string;
    id: string;
}

export function scene(name: Animate.SceneKey) {
    return {
        type: 'scene',
        name,
        id: name,
    } satisfies SceneInstance;
}
