import { assert, expectTypeOf, assertType, expect, test, describe } from 'vitest';
import { useChapterExtension, useChapter } from '../../src/core/chapter';

test('plain character', () => {
    const { dump, character } = useChapter('1.1.1');

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
    try {
        const { dump, character } = useChapter('1.1.1');
        assert(false);
    } catch (e) {}
});

test('extend character', () => {
    useChapterExtension({
        do_test() {
            return this.cache;
        },
    });

    const {
        dump,
        character,
        // @ts-expect-error
        do_test,
    } = useChapter('1.1.2');

    const aside = character(null);
    const me = character('me');

    me`11`;
    aside`aa``bb`;

    console.log(do_test());
    expect(do_test()).toMatchSnapshot();
});
