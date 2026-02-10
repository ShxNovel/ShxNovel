import { Animate } from '../../../types';

export interface SceneInstance {
    type: 'scene';
    name: string;
}

export function scene(name: Animate.SceneKey) {
    return {
        type: 'scene',
        name,
    } satisfies SceneInstance;
}
