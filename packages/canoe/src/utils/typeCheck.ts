import type { BufferGeometry, Material, Mesh, Scene, Texture } from 'three';

export function isObject(x: unknown): x is Record<string, unknown> {
    return x !== null && typeof x === 'object';
}

export function isFunction(x: unknown): x is Function {
    return typeof x === 'function';
}

/** THREE */

export function isTexture(x: unknown): x is Texture {
    return !!(isObject(x) && x.isTexture);
}

export function isBufferGeometry(x: unknown): x is BufferGeometry {
    return !!(isObject(x) && x.isBufferGeometry);
}

export function isMesh(x: unknown): x is Mesh {
    return !!(isObject(x) && x.isMesh);
}

export function isMaterial(x: unknown): x is Material {
    return !!(isObject(x) && x.isMaterial);
}

export function isScene(x: unknown): x is Scene {
    return !!(isObject(x) && x.isScene);
}
