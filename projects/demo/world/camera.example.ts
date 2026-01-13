import { useCamera } from '@shxnovel/world';

useCamera('main')
    //
    .poses({
        // 全景
        default: { x: 0, y: 0, zoom: 1 },

        // 角色 A 的特写
        charA_closeup: {
            x: -200,
            y: 100,
            zoom: 1.5,
            transition: { duration: 800, ease: 'power2.out' },
        },
    })
    .expressions({
        reset: {
            position: { x: 0, y: 0 },
            zoom: 1,
        },

        shake: {
            shake: {
                amplitude: 12,
                frequency: 25,
            },
            duration: 0.4,
        },

        normal: { blur: 0, vignette: 0 },

        // 昏迷 / 回忆效果
        dizzy: {
            blur: 5,
            vignette: 0.5,
            chromaticAbberation: 0.02,
        },
    });
