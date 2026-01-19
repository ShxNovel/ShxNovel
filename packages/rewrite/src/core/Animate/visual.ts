import { rewriteContext } from '../RewriteContext';
import { AnimatePatchs, AnimateUnit, RewriteAnimate } from './animate';
import { Animate, VisualKey } from '../../types';

type labelFn = (timelabel: string) => void;
type onLabel = { onlabel: labelFn };

export interface VisualMethods<T> {
    patch(args: AnimatePatchs): onLabel;
    expr(...args: VisualExpressionArgs<T>[]): onLabel;
}

export type VisualExpressionArgs<T> = //
    T extends keyof Animate.VisualMap //
        ? Animate.VisualMap[T]
        : string;

export class VisualImpl<T> implements VisualMethods<T> {
    id: string;

    constructor(id: string) {
        this.id = id;
    }

    patch(args: AnimatePatchs) {
        const Item: RewriteAnimate = {
            id: this.id,
            kind: 'patch',
            args,
        };

        rewriteContext.push({
            type: 'animate',
            content: [Item],
        } satisfies AnimateUnit);

        const onlabel = buildTL(Item);
        return { onlabel };
    }

    expr(...args: VisualExpressionArgs<T>[]) {
        const Item: RewriteAnimate = {
            id: this.id,
            kind: 'expression',
            args,
        };

        rewriteContext.push({
            type: 'animate',
            content: [Item],
        } satisfies AnimateUnit);

        const onlabel = buildTL(Item);
        return { onlabel };
    }
}

function buildTL<T extends Record<string, unknown>>(item: T) {
    return (timelabel: string) => {
        Object.assign(item, { timelabel });
    };
}

export function visual<T extends VisualKey>(name: T) {
    return new VisualImpl<T>(name) as VisualMethods<T>;
}

// visual('_test').expr('a');
