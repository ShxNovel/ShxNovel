import { OrthographicCameraIR, CameraRegistry } from './registry';

class defaultCamera implements OrthographicCameraIR {
    constructor(name: string) {
        if (name.length === 0) {
            throw new Error('Camera name cannot be empty');
        }
        this.name = name;
    }

    name = 'any';

    kind: OrthographicCameraIR['kind'] = 'orthographic';

    left = -960;
    right = 960;
    top = 540;
    bottom = -540;

    near = 0.1;
    far = 2000;

    zoom = 1;
}

export type CameraHandler<T extends string> = {
    kind: 'camera';
    name: `co_${T}` | `cp_${T}`;
};

export function regCamera<T extends string>(
    name: T,
    config?: (t: Omit<OrthographicCameraIR, 'name' | 'kind'>) => void
): CameraHandler<T> {
    const item = new defaultCamera(name);

    if (config) config(item);

    let Ex_name: CameraHandler<T>['name'];

    if (item.kind === 'orthographic') Ex_name = `co_${name}`;
    else if (item.kind === 'perspective') Ex_name = `cp_${name}`;
    else throw new Error(`Unknown camera kind: ${item.kind}`);

    CameraRegistry.reg(Ex_name, item);

    return { kind: 'camera', name: Ex_name };
}
