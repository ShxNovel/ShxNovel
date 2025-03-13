import { Object3D } from 'three';
import { ShxScene } from 'types/shx';
import { textureFetcher } from '../../ShxVisitor/TextureFetcher';

import { inform, uninform } from './inform';
import { shxDisposer } from '../../Shx';

export function add(scene: ShxScene, item: Object3D) {
    const result = textureFetcher.fetchTexture(item);

    inform(scene, result);

    scene.add(item);
}

/**
 * Remove item from scene. \
 * Which will also uninform textures from
 * If `clean` is true, dispose item and its children (recursivly).
 */
export function remove(scene: ShxScene, item: Object3D, clean = false) {
    const result = textureFetcher.fetchTexture(item);

    uninform(scene, result);

    for (const texture of result) texture.dispose();

    if (clean) shxDisposer.dispose(item);

    scene.remove(item);
}
