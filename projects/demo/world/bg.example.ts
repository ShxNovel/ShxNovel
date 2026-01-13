import { useBg } from '@shxnovel/world';

useBg('bg-name')
    // 在经典的 VN 场景中，背景一般只显示一张图（一个节点）
    .nodes({
        body: {
            parent: 'root',
            variants: {
                day: undefined,
                night: undefined,
            },
        },
    })
    // 对于普通背景，可以这样空着
    .poses({})

    .expressions({
        day: {
            body: 'day',
        },
        night: {
            body: 'night',
        },

        //
        dayLight: {
            body: {
                variant: 'day',
                material: { uniforms: { lightMap: 1.0 } },
            },
        },
        nightLight: {
            body: {
                variant: 'night',
                material: { uniforms: { lightMap: 0.2 } },
            },
        },
    });
