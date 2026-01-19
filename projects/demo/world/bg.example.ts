useBg('school')
    .nodes({
        body: {
            variants: {
                bright: 'a.jpg',
                dark: undefined,
            },
        },
    })
    .poses({})
    .expressions({
        dayLight: {
            body: {
                variant: 'dark',
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
