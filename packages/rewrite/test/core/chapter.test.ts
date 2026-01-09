import { assert, expectTypeOf, assertType, expect, test, describe } from 'vitest';
import { fail } from 'assert';
import { useChapter, character } from '../../src/core';

test('plain character', () => {
    const { dump } = useChapter('1.1.1');

    const aside = character(null);
    const me = character('me');

    me`11`;
    aside`aa``bb`;
    me`22`.fast('xxxx')`33`.pause(1000)`44`;
    aside().fast('yyyy');
    me``.pause(1000);

    console.dir(dump(), { depth: null });

    expect(dump()).toMatchSnapshot();
});

test('overide character', () => {
    const name = `1.1.1`;
    try {
        const { dump } = useChapter(name);
        fail();
    } catch (e) {
        const m = (e as Error).message;
        expect(m).toEqual(`Chapter ${name} is blank, or already exists`);
    }
});


test('multiple character', () => {
    const { dump } = useChapter('1.1.2');

    const aside = character(null);
    const me = character('me');

    me`11`;
    aside`aa``bb`;
    me`22`.fast('xxxx')`33`.pause(1000)`44`;
    aside().fast('yyyy');
    me``.pause(1000);

    console.dir(dump(), { depth: null });

    expect(dump()).toMatchSnapshot();
});
