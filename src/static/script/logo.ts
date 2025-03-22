import { createSpring, createTimeline } from '@juliangarnierorg/anime-beta';
import { changeUrl } from '@/lib/core';

var textWrapper = document.querySelector('.ml9 .letters');
textWrapper.innerHTML = textWrapper.textContent.replace(
    /\S/g,
    "<span class='letter'>$&</span>"
);

const tl = createTimeline({
    defaults: {
        ease: 'inOutQuad',
        duration: 800,
    },
    onComplete: () => {
        changeUrl('/src/home.html');
    },
});

tl.add({ duration: 500 })
    .add('.ml5 .line', {
        opacity: [0.5, 1],
        scaleX: [0, 1],
        ease: 'inOutQuad',
        duration: 700,
    })
    .add('.ml5 .line', {
        duration: 600,
        ease: 'outExpo',
        translateY: (el, i) => -0.625 + 0.625 * 2 * i + 'em',
    })
    .add('.ml5 .ampersand', {
        opacity: [0, 1],
        scaleY: [0.5, 1],
        ease: 'outExpo',
        duration: 600,
        offset: '-=600',
    })
    .add('.ml5 .letters-left', {
        opacity: [0, 1],
        translateX: ['0.5em', 0],
        ease: 'outExpo',
        duration: 600,
        offset: '-=300',
    })
    .add('.ml5 .letters-right', {
        opacity: [0, 1],
        translateX: ['-0.5em', 0],
        ease: 'outExpo',
        duration: 600,
        offset: '-=600',
    })
    .add('.ml5', {
        opacity: 0,
        duration: 1000,
        ease: 'outExpo',
        delay: 1000,
    })

    // .add({
    //     // targets: 'body',
    //     // backgroundColor: 'rgb(185, 92, 88)',
    //     delay: 1000,
    // })

    // .add('.round1', {
    //     scale: 10,
    //     duration: 1500,
    // })

    .add('.ml9 .letter', {
        scale: [0, 1.1],
        duration: 1500,
        // ease:
        // elasticity: 600,
        // ease: 'outElastic',
        ease: createSpring({
            mass: 1,
            stiffness: 100,
            damping: 10,
            velocity: 0,
        }),
        delay: (el, i) => 45 * (i + 1),
    })
    .add('.ml9', {
        opacity: 0,
        duration: 1000,
        ease: 'outExpo',
        delay: 1000,
    })
    .add(
        '.ml9 .letter',
        {
            scale: [1.1, 0.9],
            duration: 1500,
            // elasticity: 600,
            // ease: 'outElastic',
            ease: createSpring({
                mass: 1,
                stiffness: 100,
                damping: 10,
                velocity: 0,
            }),
            delay: (el, i) => 45 * (i + 1),
        },
        '-=1000'
    );
