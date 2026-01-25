import { Animate } from '../../types';
import { rewriteContext } from '../RewriteContext';
import { VisualInstance, SceneInstance, RTInstance } from './instance';
import { AnimatePatchs, AnimateUnit, RewriteAnimate, Vector3 } from './types';

type EnterAim = VisualInstance<any, any> | RTInstance;

interface BasicEnterBuilder<ThisType> {
    /**
     * mount to scene
     */
    into: (scene: SceneInstance) => ThisType;

    /**
     * set properties (instant)
     */
    setProps: (props: AnimatePatchs, time?: string) => ThisType;

    // props Sugar
    position: (position: Vector3) => ThisType;
    scale: (scale: Vector3) => ThisType;
    alpha: (alpha: number) => ThisType;
}

interface RTEnterBuilder extends BasicEnterBuilder<RTEnterBuilder> {}

interface VisualEnterBuilder<T extends Animate.VisualKey> extends BasicEnterBuilder<VisualEnterBuilder<T>> {
    pose: (name: Animate.VisualPoseName<T>) => VisualEnterBuilder<T>;
    expr: (name: Animate.VisualExprName<T>) => VisualEnterBuilder<T>;
}

// Visual
export function enter<T extends Animate.VisualKey, U extends string>(aim: VisualInstance<T, U>): VisualEnterBuilder<T>;

// RT or other
export function enter(aim: RTInstance): RTEnterBuilder;

// Implementation
export function enter(aim: EnterAim, timelabel?: string | number): any {
    // IR header
    const id = aim.id;

    const ENTER: RewriteAnimate = {
        kind: 'enter',
        target: id,
        timelabel,
    };

    // generate IR content (with enter)
    const content: RewriteAnimate[] = [ENTER];

    const Unit: AnimateUnit = {
        type: 'animate',
        content,
    };

    rewriteContext.push(Unit);

    const baseBuilder: BasicEnterBuilder<any> = {
        into: (scene) => {
            content.push({
                kind: 'enter',
                target: id,
                args: { scene },
            });
            return result;
        },

        setProps: (args, timelabel) => {
            content.push({
                kind: 'set',
                target: id,
                timelabel,
                args,
            });
            return result;
        },

        position(position) {
            content.push({
                kind: 'set',
                target: id,
                args: { position },
            });
            return result;
        },

        scale: (scale) => {
            content.push({
                kind: 'set',
                target: id,
                args: { scale },
            });
            return result;
        },

        alpha(alpha) {
            content.push({
                kind: 'set',
                target: id,
                args: { alpha },
            });
            return result;
        },
    };

    let result = baseBuilder;

    // extend base builder
    if (aim.type === 'visual') {
        result = Object.assign(baseBuilder, {
            pose: (name: string) => {
                // SET_POSE
                content.push({
                    kind: 'pose',
                    target: id,
                    args: { name },
                });
                return result;
            },

            expr: (name: string) => {
                // SET_EXPR
                content.push({
                    kind: 'expression',
                    target: id,
                    args: { name },
                });
                return result;
            },
        });
    }

    return result;
}
