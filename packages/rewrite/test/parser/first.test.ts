import { assert, expectTypeOf, assertType, expect, test, describe } from 'vitest';
import { fail } from 'assert';
import { useChapter, character, system, visual, tl } from '../../src/core';
import { rewriteParser } from '../../src/parser';

test('parser solveOne ( with cut )', () => {
    const { dump } = useChapter('1.1.1');

    const aside = character(null);
    const me = character('me');

    const s_sofa = visual('stand:sofa');

    {
        aside`say aside`;

        tl('a');

        s_sofa.animate({
            position: { x: 0, y: 0 },
            duration: 1000,
            tl: 'a',
        });

        s_sofa.animate({
            position: { x: 0, y: 0 },
            duration: 1000,
            tl: 'b',
        });
    }

    me`say me`;

    system().cut();

    s_sofa.animate({
        position: { x: 0, y: 0 },
        duration: 1000,
        tl: 'a',
    });

    const { name, cache } = dump();
    // console.dir($, { depth: null });

    cache.forEach((c) => {
        rewriteParser.solveOne(name, c);
    });

    console.dir(rewriteParser.cache, { depth: null });

    expect(rewriteParser.cache).toMatchSnapshot();
});
