import { assert, expectTypeOf, assertType, expect, test, describe } from 'vitest';
import { fail } from 'assert';
import { useChapter, character, flag, jump } from '../../src/core';

test('jump', () => {
    const { dump } = useChapter('1.1.1');

    const aside = character(null);
    const me = character('me');

    aside`aa`;
    jump('1.1.2');
    me`bb`;

    console.dir(dump(), { depth: null });
});
