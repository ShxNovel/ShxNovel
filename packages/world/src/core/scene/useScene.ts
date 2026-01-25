import { WorldContext } from '../worldContext';

export const SceneCtx = new WorldContext<SceneOne>('Scene');

interface SceneOne {
    name: string;
    kind: 'scene';
}

export function useScene(name: string) {
    // rename
    name = `scene:${name}`;

    return SceneCtx.add(name, { name, kind: 'scene' });
}


