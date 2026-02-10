import { RenderTargetIR, RTRegistry } from './registry';

class defaultRT implements RenderTargetIR {
    constructor(name: string) {
        if (name.length === 0) {
            throw new Error('RenderTarget name cannot be empty');
        }
        this.name = name;
    }

    name = 'any';

    kind: RenderTargetIR['kind'] = 'RT';

    width = 1920;
    height = 1080;
    depth = 1;

    samples = 0;
}

export type RTHandler<T extends string> = {
    kind: 'RT';
    name: `rt_${T}`;
    width: number;
    height: number;
};

export function regRT<T extends string>(name: T, config?: (t: Omit<RenderTargetIR, 'name'>) => void): RTHandler<T> {
    const item = new defaultRT(name);

    if (config) config(item);

    const Ex_name: RTHandler<T>['name'] = `rt_${name}`;

    item.name = Ex_name;

    RTRegistry.reg(Ex_name, item);

    return { kind: 'RT', name: Ex_name, width: item.width, height: item.height } satisfies RTHandler<T>;
}
