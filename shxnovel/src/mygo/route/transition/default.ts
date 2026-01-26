import gsap from 'gsap';
import { ITransitionPage } from '@barba/core';
import * as core from '@shxnovel/pages/index.ts';

export const defaultTransition: ITransitionPage = {
    name: 'default-transition',

    before() {
        core.setSPAInternalBlock(true);
    },

    async leave(data) {
        const element = document.querySelector('global-element');
        const one = element!.pageTansition.makeBegin();

        // const timeline = createTimeline({ defaults: { duration: 200 } })
        //     .label('begin')
        //     .add(data.current.container, { opacity: [1, 0] })
        //     .add(data.current.container, { display: 'none' })
        //     .sync(one, 'begin');

        const timeline = gsap
            .timeline({ defaults: { duration: 0.2 } })
            .addLabel('begin')
            .fromTo(data.current.container, { opacity: 1 }, { opacity: 0 })
            .set(data.current.container, { display: 'none' })
            .add(one, 'begin');

        await timeline;

        console.log('leave');

        return timeline;
    },

    async enter(data) {
        const element = document.querySelector('global-element');
        const one = element!.pageTansition.makeEnd();

        // const timeline = createTimeline({ defaults: { duration: 1000, ease: 'inOutExpo' } })
        //     .label('begin')
        //     .add(data.next.container, { opacity: [0, 1] })
        //     .sync(one, 'begin');

        const timeline = gsap
            .timeline({ defaults: { duration: 1, ease: 'expo.inOut' } })
            .addLabel('begin')
            .fromTo(data.next.container, { opacity: 0 }, { opacity: 1 })
            .add(one, 'begin');

        await timeline;

        console.log('enter 1');
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
