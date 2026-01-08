import * as THREE from 'three';

export interface RenderHandle {
    /** three.js 根节点 */
    readonly node: THREE.Object3D;

    /** 初始化 GPU 资源 */
    warmup(): void;

    /** 可选：动画 / 帧更新 */
    update?(dt: number): void;

    /** 销毁 GPU 资源 */
    dispose(): void;
}

/*
export class StandRenderHandle implements RenderHandle {
    node = new THREE.Group();

    constructor(private stand: StandObject) {
        this.build();
    }

    build() {
        for (const part of this.stand.parts) {
            const mesh = buildStandPartMesh(part);
            this.node.add(mesh);
        }
    }

    warmup() {
        // 触发材质、纹理上传
    }

    dispose() {
        this.node.traverse((obj) => {
            if ((obj as any).material) {
                (obj as any).material.dispose();
            }
        });
    }
}
*/
