import { Mesh, Object3D, Material, Texture, BufferGeometry } from 'three';
import { dispose as MeshDispose } from '../THREE/dispose/Mesh';

import {
    isBufferGeometry,
    isMaterial,
    isMesh,
    isObject,
    isScene,
    isTexture,
} from '@/lib/core/typeCheck';
import { ShxCollections } from '../Shx';

interface IAssets {
    textutes: Texture[];
    material: Material[];
    geometry: BufferGeometry[];
}

export function getAssetsFromObject(
    item: unknown,
    result: IAssets = { textutes: [], material: [], geometry: [] }
) {
    /** check valid */
    if (!isObject(item)) return result;

    if (isTexture(item)) {
        result.textutes.push(item);
        return result;
    }

    if (isMaterial(item)) {
        result.material.push(item);
        return result;
    }

    if (isBufferGeometry(item)) {
        result.geometry.push(item);
        return result;
    }

    if (isMesh(item)) {
        return result;
    }

    if (isScene(item)) {
        if (isTexture(item.background)) {
            result.textutes.push(item.background);
        }

        if (isTexture(item.environment)) {
            result.textutes.push(item.environment);
        }

        return result;
    }

    /** solve child */
    if (Array.isArray(item.children)) {
        for (const child of item.children) {
            getAssetsFromObject(child, result);
        }
    }

    // check self (for complex part)
}
