import { collector } from '../collector';

export function tl(timelabel: string) {
    collector.push({
        type: 'animate',
        args: {
            timelabel,
        },
    });
}
