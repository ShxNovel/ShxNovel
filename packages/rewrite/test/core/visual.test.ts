import { assert, expectTypeOf, assertType, expect, test, describe } from 'vitest';
import { fail } from 'assert';
import { useChapter, character, system, visual, timelabel } from '../../src/core';
import { sortedArray } from 'three/src/animation/AnimationUtils.js';

test('plain patch', () => {
    const { dump } = useChapter('1.1.1');

    const aside = character(null);
    const me = character('me');

    // @ts-ignore
    const s_sofa = visual('stand:sofa');

    {
        aside`say aside`;

        timelabel('a');

        s_sofa.enter((p) => {
            p.pos(10, 10);
            p.rotation({ x: 2, y: 3, z: 10 });
            p.scale({ x: 1, y: 10, z: 2 });
        });

        s_sofa.instant((p) => {
            p.z(10);
            p.timelabel('a');
        });

        s_sofa.animate((p) => {
            // @ts-ignore
            p.expr('a', 'b');
            // @ts-ignore
            p.expr('a', 'd');

            p.ease('sine');
            p.renderOrder(114);
            p.duration(1000);
        });

        s_sofa.leave();
    }

    me`say me`;

    // console.dir(dump(), { depth: null });

    expect(dump()).toMatchSnapshot();
});
