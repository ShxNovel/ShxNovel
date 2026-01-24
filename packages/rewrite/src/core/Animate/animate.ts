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
    meta?: Record<string, any>;
}

export type RewriteAnimate = {
    kind: keyof EntityRefKind;
    target: string;
    timelabel?: string;
    args?: Array<unknown> | Record<PropertyKey, unknown> | AnimatePatchs;
    [key: string]: unknown;
};
export interface EntityRefKind {
    enter: any;
    leave: any;
    pose: any;
    expression: any;
    timelabel: any;
    patch: any;
}

export interface AnimatePatchs {
    opacity?: number;
    position?: Vector3;
    scale?: Vector3;
    rotation?: Vector3 | Quaternion;
    ease?: EaseType;
    duration?: number;
    delay?: number;
}

//

export type Vector3 = {
    x?: number;
    y?: number;
    z?: number;
    order?: THREE.EulerOrder;
};

export type Quaternion = {
    x?: number;
    y?: number;
    z?: number;
    w?: number;
};
