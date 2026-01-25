import { WorldContext } from '../worldContext';

export const RTCtx = new WorldContext<RTOne>('RenderTarget');

interface RTOne extends RTArgs {
    name: string;

    kind: 'RT';
}

type Vector4 = {
    x: number;
    y: number;
    z: number;
    w: number;
};

interface RTArgs {
    width?: number;
    height?: number;
    depth?: number;

    scissorTest?: boolean;
    scissor?: Vector4;
    viewport?: Vector4;

    samples?: number;
}

export function useRT(name: string, args?: RTArgs) {
    const {
        width = 1920,
        height = 1080,
        depth = 1,
        scissorTest = false,
        scissor = { x: 0, y: 0, z: 0, w: 0 },
        viewport = { x: 0, y: 0, z: 0, w: 0 },
        samples = 0,
    } = args ?? {};

    return RTCtx.add(name, { name, kind: 'RT', width, height, depth, scissorTest, scissor, viewport, samples });
}
