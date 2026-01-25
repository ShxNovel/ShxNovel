import { WorldContext } from '../worldContext';

interface CameraArgs {
    kind: 'perspective' | 'orthographic';
}

interface CameraOne {
    name: string;
    kind: 'perspective' | 'orthographic';
}

export const CameraCtx = new WorldContext<CameraOne>('Camera');

export function useCamera(name: string, args?: CameraArgs) {
    const { kind = 'orthographic' } = args ?? {};

    // rename
    name = `${kind}:${name}`;

    const item = { name, kind } satisfies CameraOne;

    CameraCtx.add(name, item);
}
