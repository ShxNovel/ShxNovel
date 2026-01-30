useBg('school')
    .nodes({
        body: {
            variants: {
                bright: '104786518_p0',
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
