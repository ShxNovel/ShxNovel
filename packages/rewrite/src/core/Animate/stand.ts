import { collector } from '../collector';
import { AnimateArgs, RewriteAnimate } from './animate';

export interface StandMethods {
    animate(args: AnimateArgs): void;
}

export class StandImpl implements StandMethods {
    id: string;

    constructor(id: string) {
        this.id = id;
    }

    animate(args?: AnimateArgs) {
        const Item: RewriteAnimate = {
            id: this.id,
            kind: 'stand',
            args: {
                ...args,
            },
        };

        collector.push({
            type: 'animate',
            content: [Item],
        });
    }
}

export function stand(name: string) {
    return new StandImpl(name) as StandMethods;
}
