import { assert, expectTypeOf, assertType, expect, test, describe } from 'vitest';
import { useChapter } from '../../src/core/chapter';

test('plain character', () => {
    const { dump, character } = useChapter('1.1.1');

    const aside = character(null);
    const me = character('me');

    aside `11`

    me  `12`
        .fast('aaaa')
        `34`
        .pause(1000)
        `45`;

    console.dir(dump(), { depth: null });
});
