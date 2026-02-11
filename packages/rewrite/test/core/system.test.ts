import { assert, expectTypeOf, assertType, expect, test, describe } from 'vitest';
import { fail } from 'assert';
import { useChapter, character, system } from '../../src/core';

test('sys cut', () => {
    const { dump } = useChapter('1.1.1');

    const aside = character(null);
    const me = character('me');

    me`11`;

    // @ts-ignore
    system().usePipeline('pipeline');

    me`122`;

    // @ts-ignore
    system().usePipeline('pipeline');
    // @ts-ignore
    system().usePipeline('pipeline');

    aside`22`;

    console.dir(dump(), { depth: null });

    expect(dump()).toMatchSnapshot();
});
