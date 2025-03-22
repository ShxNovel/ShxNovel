import * as core from '@/lib/core.js';
import { Assets, sceneBunch } from '@/lib/scene';
import { textueTransition } from '@/lib/scene/ShxObjectTools/ShxObjectTools';
import { ShxObject } from 'types/shx';

core.regView({
    namespace: 'about',
    async beforeEnter(data) {
        sceneBunch.mainName = 'system';

        const scene = sceneBunch.get('system');
        const texture = await Assets.textures.loadAsync('/textures/img2.json');
        const bg = scene.getObjectByName('background') as ShxObject;

        textueTransition(bg, { texture, duration: 1000 });

        console.log('beforeEnter about');
    },
});

core.regView({
    namespace: 'home',
    async beforeEnter(data) {
        sceneBunch.mainName = 'system';

        const scene = sceneBunch.get('system');
        const texture = await Assets.textures.loadAsync('/textures/img1.json');
        const bg = scene.getObjectByName('background') as ShxObject;

        textueTransition(bg, { texture, duration: 1000 });

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
        sceneBunch.mainName = 'system';

        const scene = sceneBunch.get('system');
        console.log('beforeEnter options');
    },
});
