import * as ShxObjectTools from './ShxObjectTools/ShxObjectTools';

export const ShxCollections = {
    shxObject: {
        make: ShxObjectTools.make,
        dispose: ShxObjectTools.dispose,
        fetchTexture: ShxObjectTools.fetchTexture,
    },
};

Object.freeze(ShxCollections);
