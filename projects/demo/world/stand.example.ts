import { useStand } from '@shxnovel/world';

useStand('stand-name')
    // 先注册节点
    .nodes({
        body: {
            parent: 'root',
        },
        head: {
            parent: 'body',
            variants: {
                normal: { texture: undefined },
            },
        },

        // 推荐将同一类写在一起，比如 eye_l, eye_r
        eye_l: {
            parent: 'head',
            variants: {
                open: { texture: undefined },
                close: { texture: undefined },
                down: { texture: undefined },
            },
        },
    })
    // 为角色定义姿势（给节点绑定位置，相对于 parent）
    // 不写默认是 0
    .poses({
        front: {
            head: { x: 0, y: 150 },
            eye_l: { x: -20, y: 10 },
            p: { x: 0, y: 150 },
        },
        side: {
            // 通过继承其他姿势，减少重复的部分
            extends: 'front',

            eye_l: { x: -10 },
        },
    })
    // 定义表情组（在 story 中使用）
    .expressions({
        // 最简单的：只改图片
        happy: {
            head: 'normal', // 简写：直接对应 variant
            eye_l: 'close',
        },

        // 复杂的：涉及 Shader 和显示隐藏
        shame: {
            eye_l: 'down',
            cheek: true, // 简写：直接对应 visible: true
            face: {
                material: { uniforms: { blush: 0.8 } }, // 只有复杂的才写对象
            },
        },
    });
