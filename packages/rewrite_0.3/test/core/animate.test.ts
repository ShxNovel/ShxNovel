import { assert, expectTypeOf, assertType, expect, test, describe } from 'vitest';
import { fail } from 'assert';
import { useChapter, character, system, visual, timelabel } from '../../src/core';

test('plain patch', () => {
    const { dump } = useChapter('1.1.1');

    const aside = character(null);
    const me = character('me');

    const s_sofa = visual('stand:sofa');

    {
        aside`say aside`;

        timelabel('a');

        s_sofa
            .patch({
                position: { x: 0, y: 0 },
                duration: 1000,
            })
            .onlabel('a');
    }

    me`say me`;

    console.dir(dump(), { depth: null });

    expect(dump()).toMatchSnapshot();
});
