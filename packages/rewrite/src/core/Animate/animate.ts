import type gsap from 'gsap';
import * as THREE from 'three';

// type OmitFunctionsCompact<T> = {
//     [K in keyof T as T[K] extends Function ? never : K]: T[K];
// };
// export type some = OmitFunctionsCompact<Parameters<typeof gsap.to>[1]>;

type EaseType = NonNullable<Parameters<typeof gsap.to>[1]>['ease'];

export interface AnimateUnit {
    type: 'animate';
    content: RewriteAnimate[];
}

export interface EntityRefKind {
    stand: never;
    bg: never;
    camera: never;
}

export interface AnimateArgs {
    opacity?: number;
    position?: Vector3;
    scale?: Vector3;
    rotation?: Vector3 | Quaternion;
    ease?: EaseType;
    duration?: number;
    tl?: number | string;
}

export type RewriteAnimate = {
    kind: keyof EntityRefKind;
    id: string;
    args?: Record<PropertyKey, unknown> & AnimateArgs;
};

//

type Vector3 = {
    x?: number;
    y?: number;
    z?: number;
    order?: THREE.EulerOrder;
};

type Quaternion = {
    x?: number;
    y?: number;
    z?: number;
    w?: number;
};
