import {
    ColorSpace,
    MagnificationTextureFilter,
    MinificationTextureFilter,
} from 'three';

export interface MothTextureJSON {
    type: 'texture';
    image: string;

    filter?: {
        magFilter: MagnificationTextureFilter;
        minFilter: MinificationTextureFilter;
        useConfig: boolean;
    };

    anisotropy?: number;
    generateMipmaps?: boolean;
    premultiplyAlpha?: boolean;
    filpY?: boolean;
    unpackAlignment?: number;
    colorSpace?: ColorSpace;
}
