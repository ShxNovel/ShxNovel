import * as THREE from 'three';
import { WorldObject } from './SceneObject';
import { RenderHandle } from './RenderHandle';

export class RuntimeBinding {
    constructor(public object: WorldObject, public handle: RenderHandle) {}

    attach(scene: THREE.Scene) {
        scene.add(this.handle.node);
        this.handle.warmup();
    }

    detach(scene: THREE.Scene) {
        scene.remove(this.handle.node);
    }

    update(dt: number) {
        this.handle.update?.(dt);
    }

    dispose(scene: THREE.Scene) {
        this.detach(scene);
        this.handle.dispose();
    }
}
