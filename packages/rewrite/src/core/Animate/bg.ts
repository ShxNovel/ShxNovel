import { collector } from '../collector';
import { AnimateArgs, AnimateUnit, RewriteAnimate } from './animate';

export interface BgMethods {
    animate(args: AnimateArgs): void;
}

export class BgImpl implements BgMethods {
    id: string;

    constructor(id: string) {
        this.id = id;
    }

    animate(args: AnimateArgs) {
        const Item: RewriteAnimate = {
            id: this.id,
            kind: 'bg',
            args: {
                ...args,
            },
        };

        collector.push({
            type: 'animate',
            content: [Item],
        } satisfies AnimateUnit);
    }
}

export function bg(name: string) {
    return new BgImpl(name) as BgMethods;
}
