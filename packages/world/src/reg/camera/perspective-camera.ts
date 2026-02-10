import { PerspectiveCameraIR, CameraRegistry } from './registry';

class defaultCamera implements PerspectiveCameraIR {
    constructor(name: string) {
        if (name.length === 0) {
            throw new Error('Camera name cannot be empty');
        }
        this.name = name;
    }

    name = 'any';

    kind: PerspectiveCameraIR['kind'] = 'perspective';

    fov = 45;
    aspect = 16 / 9;

    near = 0.1;
    far = 10000;

    zoom = 1;
    // focus = 10;
    filmGauge = 35;
    filmOffset = 0;
}

export type PerspectiveCameraHandler<T extends string> = {
    kind: 'camera';
    name: `c_${T}`;
};

export function regPerspectiveCamera<T extends string>(
    name: T,
    config?: (t: Omit<PerspectiveCameraIR, 'name' | 'kind'>) => void
): PerspectiveCameraHandler<T> {
    const item = new defaultCamera(name);

    if (config) config(item);

    let Ex_name: PerspectiveCameraHandler<T>['name'];

    Ex_name = `c_${name}`;

    CameraRegistry.reg(Ex_name, item);

    return { kind: 'camera', name: Ex_name };
}
