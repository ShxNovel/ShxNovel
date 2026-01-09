import { collector } from '../collector';
import { AnimateUnit } from './animate';

export function tl(timelabel: string) {
    const item: AnimateUnit = {
        type: 'animate',
        content: [{ kind: 'timelabel', id: timelabel }],
    };
    collector.push(item satisfies AnimateUnit);
}
