import { assert, expectTypeOf, assertType, expect, test, describe } from 'vitest';
import { useChapter } from '../../src/core/chapter';

test('plain ink', () => {
    const { dump, character, system, label, ink } = useChapter('1.1.1');
    const { bg, stand, tp } = ink;

    const aside = character(null);
    const me = character('me');

    me`11`;

    bg('bg-x').change('aaa');

    tp('f1');

    stand('stand')
        .ease('bounce.in')
        .duration(1000)
        .tl('f1')

    bg('bg-y').change('bbb');

    aside `22`;

    console.dir(dump(), { depth: null });
});
