import { rewriteContext } from '../RewriteContext';
import { AnimateUnit, RewriteAnimate, Vector3 } from './animate';
import { Animate, VisualEffect, VisualKey, VisualPosition } from '../../types';

type WhenFn = ReturnType<typeof buildWhen>;

export interface VisualMethods<T> {
    // prettier-ignore
    /**
     *
     * {@link enter} is a  of {@link effect}
     * ```ts
     * visual('_test').enter('center');
     * visual('_test').enter({ x: 0, y: 0, z: 0 }).when('label b');
     * visual('_test').enter('left', {
     *   effect: 'fadeIn',
     *   patch: { duration: 1000 }
     * }).when('label b')
     * ```
     */
    enter(position: VisualPosition | Vector3, effect?: EffectArgs): {
        when: WhenFn;
    };
    leave(effect: EffectArgs): {
        when: WhenFn;
    };
    // prettier-ignore
    effect(name: VisualEffect, effect: PatchArgs): {
        when: WhenFn;
    };
    pose(name: VisualPoseName<T>, effect: EffectArgs): {};
    expr(...args: VisualExpressionArgs<T>[]): {
        patch: ReturnType<typeof buildPatch>;
        when: WhenFn;
    };
}

// prettier-ignore
export type VisualPoseName<T> =
    T extends keyof Animate.VisualMap
        ? Animate.VisualMap[T]['pose']
        : never;

// prettier-ignore
export type VisualExpressionArgs<T> =
    T extends keyof Animate.VisualMap
        ? Animate.VisualMap[T]['expr']
        : never;

export type PatchArgs = {
    patch?: Record<string, any>;
};

export type EffectArgs = {
    effect?: string;
    patch?: PatchArgs;
};

export class VisualImpl<T> implements VisualMethods<T> {
    id: string;

    constructor(id: string) {
        this.id = id;
    }

    private pushItem(item: RewriteAnimate) {
        rewriteContext.push({
            type: 'animate',
            content: [item],
        } satisfies AnimateUnit);
    }

    enter(position: VisualPosition | Vector3, effect?: EffectArgs) {
        const ITEM: RewriteAnimate = {
            target: this.id,
            kind: 'enter',
            position,
            args: {
                ...effect,
            },
        };

        this.pushItem(ITEM);

        const when = buildWhen(ITEM);
        return { when };
    }

    leave(effect?: EffectArgs) {
        const ITEM: RewriteAnimate = {
            target: this.id,
            kind: 'leave',
            args: {
                effect,
            },
        };

        this.pushItem(ITEM);

        const when = buildWhen(ITEM);
        return { when };
    }

    effect(name: PatchArgs, effect: PatchArgs) {
        const when = buildWhen(Item);
        return { when };
    }

    pose(name: VisualPoseName<T>, effect: EffectArgs) {
        const ITEM: RewriteAnimate = {
            target: this.id,
            kind: 'pose',
            args: {
                name,
                effect,
            },
        };

        this.pushItem(ITEM);

        const patch = buildPatch(ITEM);
        const when = buildWhen(ITEM);
        return { patch, when };
    }

    expr(...args: VisualExpressionArgs<T>[]) {
        const ITEM: RewriteAnimate = {
            target: this.id,
            kind: 'expression',
            args,
        };

        this.pushItem(ITEM);

        const patch = buildPatch(ITEM);
        const when = buildWhen(ITEM);
        return { patch, when };
    }
}

function buildPatch<T extends Record<string, any>>(item: T) {
    return (args: Record<string, any>) => {
        Object.assign(item, { patch: args });
        return { when: buildWhen(item) };
    };
}

function buildWhen<T extends Record<string, any>>(item: T) {
    return (timelabel: string) => {
        Object.assign(item, { timelabel });
    };
}

export function visual<T extends VisualKey>(name: T) {
    return new VisualImpl<T>(name) as VisualMethods<T>;
}
