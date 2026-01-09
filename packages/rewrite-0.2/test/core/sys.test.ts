import { assert, expectTypeOf, assertType, expect, test, describe } from 'vitest';
import { useChapter } from '../../src/core/chapter';

test('plain sys', () => {
    const { dump, character, system, label } = useChapter('1.1.1');

    const aside = character(null);
    const me = character('me');

    me`11`;

    system().cut().cut();
    system().cut();

    me`122`;

    system().cut().cut();

    aside`22`;

    system().cut();

    console.dir(dump(), { depth: null });

    expect(dump()).toMatchSnapshot();
});
