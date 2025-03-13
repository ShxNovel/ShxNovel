import * as core from '@/lib/core.js';

// import { scene, textureCache, rendSomeFrames } from '../../lib/nuiScene.js';

core.regView({
    namespace: 'about',
    async beforeEnter(data) {
        // const res = await textureCache.load('/background/default.png');
        // const background = scene.get('background');
        // background.playTextureTransitionAnime(res);
        console.log('beforeEnter about');
    },
});

core.regView({
    namespace: 'home',
    async beforeEnter(data) {
        // const res = await textureCache.load('/background/img1.png');
        // const background = scene.get('background');
        // background.playTextureTransitionAnime(res);
        console.log('beforeEnter home');
    },
    afterLeave(data) {},
});

core.regView({
    namespace: 'options',
    async beforeEnter(data) {
        // const res = await textureCache.load('/background/img2.jpg');
        // const background = scene.get('background');
        // background.playTextureTransitionAnime(res);
        console.log('beforeEnter options');
    },
});
