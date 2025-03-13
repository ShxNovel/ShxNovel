import { ITransitionPage } from '@barba/core';
import { createTimeline } from '@juliangarnierorg/anime-beta';
import * as core from '@/lib/core.js';

export const initTransition: ITransitionPage = {
    name: 'init-transition',

    before() {
        core.setSPAInternalBlock(true);
    },

    async leave(data) {
        const timeline = createTimeline({ defaults: { duration: 200 } })
            .add(data.current.container, { opacity: [1, 0] })
            .add(data.current.container, { display: 'none' });

        // @ts-expect-error
        await timeline;

        console.log('leave');
    },

    async enter(data) {
        // prettier-ignore
        const timeline = createTimeline({ defaults: { duration: 1000, ease: 'inOutExpo' } })
            .add(data.next.container, { opacity: [0, 1] });

        // @ts-expect-error
        await timeline;

        console.log('enter');
    },

    after() {
        core.setSPAInternalBlock(false);
    },
};

core.addTransition(initTransition);
