import { SceneIR, SceneRegistry } from './registry';

class defaultScene implements SceneIR {
    constructor(name: string) {
        if (name.length === 0) {
            throw new Error('Scene name cannot be empty');
        }
        this.name = name;
    }

    name = 'any';

    kind: SceneIR['kind'] = 'scene';
}

export type SceneHandler<T extends string> = {
    kind: 'scene';
    name: `s_${T}`;
};

export function regScene<T extends string>(name: T): SceneHandler<T> {
    const item = new defaultScene(name);

    const Ex_name: SceneHandler<T>['name'] = `s_${name}`;

    item.name = Ex_name;

    SceneRegistry.reg(Ex_name, item);

    return { kind: 'scene', name: Ex_name };
}
