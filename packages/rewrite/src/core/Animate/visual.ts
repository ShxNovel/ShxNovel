import { rewriteContext } from '../RewriteContext';
import { AnimateArgs, AnimateUnit, RewriteAnimate } from './animate';

export interface VisualMethods {
    animate(args: AnimateArgs): void;
}

export class VisualImpl implements VisualMethods {
    id: string;

    constructor(id: string) {
        this.id = id;
    }

    animate(args?: AnimateArgs) {
        const Item: RewriteAnimate = {
            id: this.id,
            kind: 'visual',
            args: {
                ...args,
            },
        };

        rewriteContext.push({
            type: 'animate',
            content: [Item],
        } satisfies AnimateUnit);
    }
}

export function visual(name: string) {
    return new VisualImpl(name) as VisualMethods;
}
