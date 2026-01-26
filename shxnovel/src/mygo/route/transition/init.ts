import { ITransitionPage } from '@barba/core';
import gsap from 'gsap';
import * as core from '../../../route';

export const initTransition: ITransitionPage = {
    name: 'init-transition',

    before() {
        core.setSPAInternalBlock(true);
    },

    async leave(data) {
        const timeline = gsap
            .timeline({ defaults: { duration: 0.2 } })
            .fromTo(data.current.container, { opacity: 1 }, { opacity: 0 })
            .set(data.current.container, { display: 'none' })
            .play();

        // await timeline;

        console.log('leave');
        return timeline;
    },

    async enter(data) {
        const timeline = gsap
            .timeline({ defaults: { duration: 1, ease: 'expo.inOut' } })
            .fromTo(data.next.container, { opacity: 0 }, { opacity: 1 })
            .play();

        await timeline;

        console.log('enter init');
    },

    after() {
        core.setSPAInternalBlock(false);
    },
};

core.addTransition(initTransition);
