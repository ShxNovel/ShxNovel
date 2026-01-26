import gsap from 'gsap';
import * as core from '@shxnovel/pages/index.ts';
import { applyAnime, makeTransitionAnime, assets, sceneBunch } from '@shxnovel/canoe/index.ts';
import { ShxObject } from '@shxnovel/canoe/items/stands/types.js';

core.regView({
    namespace: 'about',
    async beforeEnter(data) {
        sceneBunch.mainName = 'system';

        const scene = sceneBunch.get('system')!;
        const texture = await assets.textures.build('sys_bg2');
        const bg = scene.getObjectByName('background') as ShxObject;

        const anime = makeTransitionAnime(bg, { texture })
        applyAnime(bg as ShxObject, anime);

        console.log('beforeEnter about');
    },
});

core.regView({
    namespace: 'home',
    async beforeEnter(data) {
        sceneBunch.mainName = 'system';

        const scene = sceneBunch.get('system')!;
        const texture = await assets.textures.build('sys_bg1');
        const bg = scene.getObjectByName('background') as ShxObject;

        const anime = makeTransitionAnime(bg, { texture })
        applyAnime(bg as ShxObject, anime);

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
