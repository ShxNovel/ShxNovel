import { useBg } from '@shxnovel/world';

useBg('school')
    .nodes({
        body: {
            variants: {
                bright: undefined,
                dark: undefined,
            },
        },
    })
    .poses({})
    .expressions({
        dayLight: {
            body: {
                variant: 'bright',
                material: { uniforms: { lightMap: 1.0 } },
            },
        },
        nightLight: {
            body: {
                variant: 'dark',
                material: { uniforms: { lightMap: 0.2 } },
            },
        },
    });
