export * as registry from './registry';
export * as compiler from './compiler';
export * as shxnovel from './runtime';

export * from './registry'; // convenience re-export

export * from './types';

// global

import {
    useVisual as _useVisual, //
    useBg as _useBg,
    useStand as _useStand,
    useCamera as _useCamera,
} from './registry';

declare global {
    const useVisual: typeof _useVisual;
    const useBg: typeof _useBg;
    const useCamera: typeof _useCamera;
    const useStand: typeof _useStand;
}
