import type { gsap } from 'gsap';
// import type * as THREE from 'three';

export type EaseType = NonNullable<Parameters<typeof gsap.to>[1]>['ease'];

export type TimelineLableType = Parameters<gsap.core.Timeline['addLabel']>[0];

export type PosType = { x?: number; y?: number; z?: number };

export type animateType = {
    type: 'animate';
    target: { kind: 'stand'; id: string };
    channel?: 'position' | 'rotation' | string;
    
};
