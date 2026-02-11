import { assert, expectTypeOf, assertType, expect, test, describe } from 'vitest';
import { fail } from 'assert';
import { useChapter, character, flag } from '../../src/core';

test('flag', () => {
    const { dump } = useChapter('1.1.1');

    const aside = character(null);
    const me = character('me');

    me`11`;

    flag('flag 1');

    aside`aa``bb`;
    me`22`.fast('xxxx')`33`.pause(1000)`44`;

    flag('flag 2', () => {
        aside().fast('yyyy');
        me``.pause(1000);
    });

    aside`22``33`;

    // console.dir(dump(), { depth: null });

    expect(dump()).toMatchSnapshot();
});
