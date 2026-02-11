import { assert, expectTypeOf, assertType, expect, test, describe } from 'vitest';
import { fail } from 'assert';
import { useChapter, character, system, visual, timelabel, directive } from '../../src/core';
import { rewriteParser } from '../../src/parser';

test('parser solveOne ( with SceneBoundary )', () => {
    const { dump } = useChapter('1.1.1');

    const aside = character(null);
    const me = character('me');

    // @ts-expect-error
    const s_sofa = visual('stand:sofa');

    {
        aside`say`.pause(1000)`aside`;

        timelabel('a');
    }

    me`say me`;

    // @ts-expect-error
    system().usePipeline('test');

    directive.SceneBoundary;

    // @ts-expect-error
    system().usePipeline('test2');

    timelabel('a');

    aside`more`;

    const { name, cache } = dump();
    // console.dir($, { depth: null });

    cache.forEach((c) => {
        rewriteParser.solveOne(name, c);
    });

    console.dir(rewriteParser.cache, { depth: null });

    expect(rewriteParser.cache).toMatchSnapshot();
});
