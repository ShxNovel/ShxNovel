import { VisualHandle } from './instance/visual';
// import type gsap from 'gsap';
// import type * as THREE from 'three';

// type OmitFunctionsCompact<T> = {
//     [K in keyof T as T[K] extends Function ? never : K]: T[K];
// };
// export type some = OmitFunctionsCompact<Parameters<typeof gsap.to>[1]>;

// export type EaseType = NonNullable<Parameters<typeof gsap.to>[1]>['ease'];

// prettier-ignore
export type EaseStringLiteral =
    | "none"
    | "power1" | "power1.in" | "power1.out" | "power1.inOut"
    | "power2" | "power2.in" | "power2.out" | "power2.inOut"
    | "power3" | "power3.in" | "power3.out" | "power3.inOut"
    | "power4" | "power4.in" | "power4.out" | "power4.inOut"
    | "back" | "back.in" | "back.out" | "back.inOut"
    | "bounce" | "bounce.in" | "bounce.out" | "bounce.inOut"
    | "circ" | "circ.in" | "circ.out" | "circ.inOut"
    | "elastic" | "elastic.in" | "elastic.out" | "elastic.inOut"
    | "expo" | "expo.in" | "expo.out" | "expo.inOut"
    | "sine" | "sine.in" | "sine.out" | "sine.inOut"
    | (string & {});

// @ts-ignore
export type TargetAble = VisualHandle<any>;

export interface AnimateUnit {
    type: 'animate';
    content: RewriteAnimate[];
    meta?: Record<string, any>;
}

export type RewriteAnimate = {
    kind: keyof EntityRefKind;
    target: string;
    timelabel?: string | number;
    args?: Array<unknown> | Record<PropertyKey, unknown> | AnimatePatchs;
    [key: string]: unknown;
};

export interface EntityRefKind {
    enter: any;
    leave: any;
    instant: any;
    animate: any;

    timelabel: any;
}
export interface AnimatePatchs {
    position?: Vector3;
    scale?: Vector3;
    rotation?: Vector3 | Quaternion;
    uniforms?: Record<string, any>;
}

//

export type Vector3 = {
    x?: number;
    y?: number;
    z?: number;
    // order?: THREE.EulerOrder;
};

export type Quaternion = {
    x?: number;
    y?: number;
    z?: number;
    w?: number;
};
