const { character, flag, visual } = useChapter('1.1.2');

const aside = character(null);
const me = character('卡咖喱2');

const s_sofa = visual("bg:school");

flag('start2');
{
    // const { character, flag, visual } = useChapter('1.1.2');

    const aside = character(null);
    const me = character('卡咖喱2');

    aside`你好! 罚抄!`.fast('!!!');

    me`今天为什么罚抄？`.pause(1000)`是不是因为上课没听讲？`;

    s_sofa.patch({ opacity: 1, duration: 1000 });
}
