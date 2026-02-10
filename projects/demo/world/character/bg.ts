import { regVisual } from '@shxnovel/world';
import { p0, p1, p2, p3 } from '../texture/bg';

regVisual('bg').nodes({
    body: {
        variants: {
            p0: p0,
            p1: p1,
            p2: p2,
            p3: p3,
        },
        pos: [1, 1, 1]
    },
});
