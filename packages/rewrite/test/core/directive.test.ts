import { assert, expectTypeOf, assertType, expect, test, describe } from 'vitest';
import { fail } from 'assert';
import { useChapter, character, flag, jump, directive } from '../../src/core';

test('jump', () => {
    const { dump } = useChapter('1.1.1');

    const aside = character(null);
    const me = character('me');

    aside`aa`;

    me`bb`;

    directive.SceneBindNext;
    directive.SceneBoundary;

    me`bb`;

    const opt = dump().cache.get('1.1.1');
    console.dir(opt, { depth: null });
    expect(opt).toMatchSnapshot();
});
