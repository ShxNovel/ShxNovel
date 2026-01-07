import { assert, expectTypeOf, assertType, expect, test, describe } from 'vitest';
import { useChapter } from '../../src/core/chapter';

test('plain label', () => {
    const { dump, character, label } = useChapter('1.1.1');

    const aside = character(null);
    const me = character('me');


    label('label1');

    me  `11`

    aside `aa`
          `bb` 

    me  `22`
        .fast('xxxx')
        `33`
        .pause(1000)
        `44`;

    label('label2')

    aside() 
        .fast('yyyy');

    me  `` 
        .pause(1000);

    console.dir(dump(), { depth: null });

    expect(dump()).toMatchSnapshot();
});
