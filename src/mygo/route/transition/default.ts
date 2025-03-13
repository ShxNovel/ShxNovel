import { ITransitionPage } from '@barba/core';
import { createTimeline } from '@juliangarnierorg/anime-beta';
import * as core from '@/lib/core.js';

export const defaultTransition: ITransitionPage = {
    name: 'default-transition',

    before() {
        core.setSPAInternalBlock(true);
    },

    async leave(data) {
        const element = document.querySelector('global-element');
        const one = element.pageTansition.makeBegin();

        const timeline = createTimeline({ defaults: { duration: 200 } })
            .label('begin')
            .add(data.current.container, { opacity: [1, 0] })
            .add(data.current.container, { display: 'none' })
            .sync(one, 'begin');

        // @ts-expect-error
        await timeline;

        console.log('leave');
    },

    async enter(data) {
        const element = document.querySelector('global-element');
        const one = element.pageTansition.makeEnd();

        // prettier-ignore
        const timeline = createTimeline({ defaults: { duration: 1000, ease: 'inOutExpo' } })
            .label('begin')
            .add(data.next.container, { opacity: [0, 1] })
            .sync(one, 'begin')

        // @ts-expect-error
        await timeline;

        console.log('enter');
    },

    after() {
        core.setSPAInternalBlock(false);
    },

    from: {
        custom: (data) => {
            return data.current.namespace !== 'logo';
        },
    },

    to: {
        custom: (data) => {
            return data.next.namespace !== 'logo';
        },
    },
};

core.addTransition(defaultTransition);
