import { useStand } from '@shxnovel/world';

useStand('Rinne')
    .nodes({
        body: {
            parent: 'root',
            variants: {
                normal: { texture: undefined },
                side: { texture: undefined },
            },
        },

        normal_eye: {
            parent: 'body',
            variants: {
                open: { texture: undefined },
                close: { texture: undefined },
                happy: { texture: undefined },
            },
        },

        side_eye: {
            parent: 'body',
            variants: {
                open: { texture: undefined },
                close: { texture: undefined },
                happy: { texture: undefined },
            },
        },
    })
    .poses({
        base: {
            body: { x: 0, y: 0 },
        },

        front: {
            extends: 'base',
            normal_eye: { x: -20, y: 10 },
        },

        side: {
            extends: 'base',
            side_eye: { y: -10 },
        },
    })
    .expressions({
        normal_happy: {
            body: 'normal',
            normal_eye: 'close',
        },

        side_shame: {
            body: 'side',
            side_eye: 'close',
            cheek: true,
            face: {
                material: { uniforms: { blush: 0.8 } },
            },
        },
    });
