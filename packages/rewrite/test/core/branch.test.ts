import { assert, expectTypeOf, assertType, expect, test, describe } from 'vitest';
import { fail } from 'assert';
import { useChapter, character, branch } from '../../src/core';

test('single branch', () => {
    const { dump } = useChapter('1.1.1');

    const aside = character(null);
    const me = character('me');

    branch({
        Condition: function () {
            return 'c';
            return 'b';
            return 'a' as const;
        },
        a: function () {
            me`aa`;
        },
        b: '12',
        c: function (likely) {
            me`cc`;
        },
    });

    const opt = dump().cache.get('1.1.1');
    // console.dir(opt, { depth: null });
    expect(opt).toMatchSnapshot();
});

test('multi branch', () => {
    const { dump } = useChapter('1.1.2');

    const aside = character(null);
    const me = character('me');

    aside`some 1`;

    branch({
        Condition: function () {
            return 'c';
            return 'b';
            return 'a' as const;
        },
        a: () => {
            me`1 aa`;
        },
        b: '1 12',
        c: (likely) => {
            me`1 cc`;
            branch({
                Condition: () => {
                    return 'cc';
                    return 'bb';
                    return 'aa' as const;
                },
                aa: () => {
                    me`2 aa`;
                },
                bb: '2 12',
                cc: (likely) => {
                    me`2 cc`;
                },
            });
        },
    });

    aside`some 2`;

    const opt = dump().cache.get('1.1.2');
    console.dir(opt, { depth: null });
    expect(opt).toMatchSnapshot();
});
