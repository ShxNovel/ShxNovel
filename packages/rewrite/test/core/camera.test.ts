import { assert, expectTypeOf, assertType, expect, test, describe } from 'vitest';
import { fail } from 'assert';
import { useChapter, character, system, visual, timelabel, camera } from '../../src/core';
import { sortedArray } from 'three/src/animation/AnimationUtils.js';

test('plain patch', () => {
    const { dump } = useChapter('1.1.1');

    const aside = character(null);
    const me = character('me');

    // @ts-ignore
    const view = camera('co:main');

    {
        aside`say aside`;

        timelabel('a');

        view.animate((p) => {
            p.duration(1000);

            p.ease('sine');

            p.zoom(10);
        });

        view.instant((p) => {
            p.pos(10, 10);

            p.rotation({ x: 2, y: 3, z: 10 });

            p.timelabel('a');
        });
    }

    me`say me`;

    // console.dir(dump(), { depth: null });

    expect(dump()).toMatchSnapshot();
});
