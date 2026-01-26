// import { createSpring, createTimeline } from '@juliangarnierorg/anime-beta';
import gsap from 'gsap';
import { CustomEase } from 'gsap/CustomEase';
import { CustomBounce } from 'gsap/CustomBounce';

import { changeUrl } from './route';

var textWrapper = document.querySelector('.ml9 .letters')!;
textWrapper.innerHTML = textWrapper.textContent!.replace(/\S/g, "<span class='letter'>$&</span>");

const tl = gsap.timeline({ defaults: { duration: 0.8, ease: 'power1.inOut' } });

gsap.registerPlugin(CustomEase, CustomBounce);

tl.eventCallback('onComplete', () => {
    changeUrl('/src/home.html');
});

tl.delay(0.5)
    .fromTo(
        '.ml5 .line',
        {
            opacity: 0.5,
            scaleX: 0,
        },
        {
            opacity: 1,
            scaleX: 1,
            ease: 'inOutQuad',
            duration: 0.7,
        }
    )
    .to('.ml5 .line', {
        duration: 0.6,
        ease: 'expo.out',
        translateY: (i) => -0.625 + 0.625 * 2 * i + 'em',
    })
    .fromTo(
        '.ml5 .ampersand',
        {
            opacity: 0,
            scaleY: 0.5,
        },
        {
            opacity: 1,
            scaleY: 1,
            ease: 'expo.out',
            duration: 0.6,
        },
        '-=0.6'
    )
    .fromTo(
        '.ml5 .letters-left',
        {
            opacity: 0,
            translateX: '0.5em',
        },
        { opacity: 1, translateX: 0, ease: 'expo.out', duration: 0.6 },

        '-=0.3'
    )
    .fromTo(
        '.ml5 .letters-right',
        {
            opacity: 0,
            translateX: '-0.5em',
        },
        { opacity: 1, translateX: 0, ease: 'expo.out', duration: 0.6 },
        '-=0.6'
    )
    .to('.ml5', {
        opacity: 0,
        duration: 1,
        ease: 'expo.out',
        delay: 1,
    });

// .fromTo(
//     '.ml9 .letter',
//     {
//         scale: 0,
//         duration: 1.5,
//         // ease:
//         // elasticity: 0.6,
//         // ease: 'outElastic',
//         // ease: createSpring({
//         //     mass: 1,
//         //     stiffness: 100,
//         //     damping: 10,
//         //     velocity: 0,
//         // }),
//     },
//     {
//         scale: 1.1,
//         ease: CustomBounce.create('myBounce', {
//             strength: 0.7,
//             endAtStart: false,
//             squash: 1,
//             squashID: 'myBounce-squash',
//         }),
//         delay: (i) => 0.045 * (i + 1),
//     }
// )
// .to('.ml9', {
//     opacity: 0,
//     duration: 1,
//     ease: 'expo.out',
//     delay: 1,
// })
// .fromTo(
//     '.ml9 .letter',
//     {
//         scale: 1.1,
//         duration: 1.5,
//         // elasticity: 0.6,
//         // ease: 'outElastic',
//         // ease: createSpring({
//         //     mass: 1,
//         //     stiffness: 100,
//         //     damping: 10,
//         //     velocity: 0,
//         // }),
//     },
//     {
//         scale: 0.9,
//         ease: CustomBounce.create('myBounce', {
//             strength: 0.7,
//             endAtStart: false,
//             squash: 1,
//             squashID: 'myBounce-squash',
//         }),
//         delay: (i) => 0.045 * (i + 1),
//     },
//     '-=1'
// );
