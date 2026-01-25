import { useRT } from '../rt';
import { WorldContext } from '../worldContext';

interface CameraArgs {
    kind?: 'perspective' | 'orthographic';
    defaultRT?: string;
}

interface CameraOne {
    name: string;
    kind: 'perspective' | 'orthographic';
    defaultRT: string;
}

export const CameraCtx = new WorldContext<CameraOne>('Camera');

export function useCamera(name: string, args?: CameraArgs) {
    let { kind = 'orthographic', defaultRT = undefined } = args ?? {};

    // noRT
    if (defaultRT == undefined) {
        defaultRT = `RT_${name}`;
        useRT(defaultRT);
    }

    // rename
    if (kind == 'orthographic') {
        name = `co:${name}`;
    } else if (kind == 'perspective') {
        name = `cp:${name}`;
    }

    const item = { name, kind, defaultRT } satisfies CameraOne;

    CameraCtx.add(name, item);
}
