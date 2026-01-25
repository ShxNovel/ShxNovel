// import { rewriteContext } from '../RewriteContext';
// import { AnimateUnit, RewriteAnimate, Vector3 } from './types';
// import { Animate } from '../../types';

// type WhenFn = ReturnType<typeof buildWhen>;

// export interface VisualMethods<T> {
//     /**
//      *
//      * {@link enter} is a  of {@link effect}
//      * ```ts
//      * visual('_test').enter('center');
//      * visual('_test').enter({ x: 0, y: 0, z: 0 }).when('label b');
//      * visual('_test').enter('left', {
//      *   effect: 'fadeIn',
//      *   patch: { duration: 1000 }
//      * }).when('label b')
//      * ```
//      */
//     enter(position: Animate.VisualPositionKey | Vector3, effect?: EffectArgs): { when: WhenFn };
//     leave(effect: EffectArgs): { when: WhenFn };
//     effect(name: Animate.VisualEffectKey, effect: PatchArgs): { when: WhenFn };
//     pose(name: Animate.VisualPoseName<T>, effect: EffectArgs): { when: WhenFn };
//     expr(name: Animate.VisualExprName<T>): {
//         when: WhenFn;
//         patch: ReturnType<typeof buildPatch>;
//     };
//     expr(...args: Animate.VisualExprName<T>[]): {
//         when: WhenFn;
//     };
// }

// export type PatchArgs = {
//     patch?: Record<string, any>;
// };

// export type EffectArgs = {
//     effect?: string;
//     patch?: PatchArgs;
// };

// export class VisualImpl<T> implements VisualMethods<T> {
//     id: string;

//     constructor(id: string) {
//         this.id = id;
//     }

//     private pushItem(item: RewriteAnimate) {
//         rewriteContext.push({
//             type: 'animate',
//             content: [item],
//         } satisfies AnimateUnit);
//     }

//     enter(position: Animate.VisualPositionKey | Vector3, effect?: EffectArgs) {
//         const ITEM: RewriteAnimate = {
//             target: this.id,
//             kind: 'enter',
//             position,
//             args: {
//                 ...effect,
//             },
//         };

//         this.pushItem(ITEM);

//         const when = buildWhen(ITEM);
//         return { when };
//     }

//     leave(effect?: EffectArgs) {
//         const ITEM: RewriteAnimate = {
//             target: this.id,
//             kind: 'leave',
//             args: {
//                 effect,
//             },
//         };

//         this.pushItem(ITEM);

//         const when = buildWhen(ITEM);
//         return { when };
//     }

//     effect(name: Animate.VisualEffectKey, effect: PatchArgs) {
//         const ITEM: RewriteAnimate = {
//             target: this.id,
//             kind: 'pose',
//             args: {
//                 name,
//                 effect,
//             },
//         };

//         this.pushItem(ITEM);

//         const when = buildWhen(ITEM);
//         return { when };
//     }

//     pose(name: Animate.VisualPoseName<T>, effect: EffectArgs) {
//         const ITEM: RewriteAnimate = {
//             target: this.id,
//             kind: 'pose',
//             args: {
//                 name,
//                 effect,
//             },
//         };

//         this.pushItem(ITEM);

//         const patch = buildPatch(ITEM);
//         const when = buildWhen(ITEM);
//         return { patch, when };
//     }

//     expr(...args: Animate.VisualExprName<T>[]) {
//         const ITEM: RewriteAnimate = {
//             target: this.id,
//             kind: 'expression',
//             args,
//         };

//         this.pushItem(ITEM);

//         const patch = buildPatch(ITEM);
//         const when = buildWhen(ITEM);
//         return { patch, when };
//     }
// }

// function buildPatch<T extends Record<string, any>>(item: T) {
//     return (args: Record<string, any>) => {
//         Object.assign(item, { patch: args });
//         return { when: buildWhen(item) };
//     };
// }

// function buildWhen<T extends Record<string, any>>(item: T) {
//     return (timelabel: string) => {
//         Object.assign(item, { timelabel });
//     };
// }

// export function visual<T extends Animate.VisualKey>(name: T) {
//     return new VisualImpl<T>(name) as VisualMethods<T>;
// }
