import { RenderHandle } from './RenderHandle';

interface ResourceRef {
    id: string;

    type: 'texture' | 'audio' | 'shader' | 'video';

    uri: string;

    usage?: ResourceUsage;
}

interface ResourceUsage {
    /** 是否需要在 spawn 前完成 */
    preload?: boolean;

    /** 可能被用作 GPU 热身 */
    warmup?: boolean;

    priority?: 'low' | 'normal' | 'high';

    /** hint for runtime */
    tags?: string[];
}

export interface SceneObjectKind {
    stand: never;
    bg: never;
    mesh: never;
    audio: never;
    video: never;
}

export interface WorldObject {
    readonly id: string;
    readonly kind: keyof SceneObjectKind;

    /** 资源声明（用于 warmup / 分析） */
    resources(): ResourceRef[];

    /** 构建渲染句柄（惰性） */
    createRenderHandle(): RenderHandle;
}

/*
export class StandObject implements WorldObject {
    kind = 'stand' as const;

    constructor(public id: string, public parts: StandPartSpec[]) {}

    resources() {
        return this.parts.map((p) => p.texture);
    }

    createRenderHandle() {
        return new StandRenderHandle(this);
    }
}
*/
