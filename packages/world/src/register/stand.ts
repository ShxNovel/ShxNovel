import { StandNodesSpec, StandPosesSpec, StandExpressionSpec as StandExpressionsSpec } from './types';

/**
 *
 * @param name the stand name can be used in story - \@shxnovel/rewrite
 * @param rig
 */
export function useStand(name: string, type = 'stand') {
    const result = {
        name,
        type,
        nodes: {},
        slot: {},
        expression: {},
    };

    // first function
    function nodes<N extends StandNodesSpec>(nodes: N) {
        result.nodes = nodes;
        return { poses: poses<N>() };
    }

    // second function
    function poses<N extends StandNodesSpec>() {
        return function <S extends StandPosesSpec<N>>(slot: S) {
            result.slot = slot;
            return { expressions: expressions<N>() };
        };
    }

    // third function
    function expressions<N extends StandNodesSpec>() {
        return function <S extends StandExpressionsSpec<N>>(expression: S) {
            result.expression = expression;
        };
    }

    return { nodes };
}

useStand('name')
    .nodes({
        body: {
            parent: 'root',
        },
        head: { parent: 'body' },
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
    .poses({
        front: {
            head: { x: 0, y: 150 },
            eye_l: { x: -20, y: 10 },
            p: { x: 0, y: 150 },
        },
        side: {
            extends: 'front',
            eye_l: { x: -10 },
        },
    })
    .expressions({
        // 最简单的：只改图片
        happy: {
            nodes: {
                eye_l: 'open', // 简写：直接对应 variant
                mouth: 'smile_wide',
            },
        },

        // 复杂的：涉及 Shader 和显示隐藏
        shame: {
            nodes: {
                eye_l: 'down',
                cheek: true, // 简写：直接对应 visible: true
                face: {
                    material: { uniforms: { blush: 0.8 } }, // 只有复杂的才写对象
                },
            },
        },
    });
