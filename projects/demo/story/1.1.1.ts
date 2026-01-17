const { character, flag, visual, timelabel, system } = useChapter('1.1.1');

const aside = character(null);
const me = character('卡咖喱');

const s_sofa = visual('stand:sofa');

flag('start');
{
    aside`你好!`.pause(2000)`罚抄`.fast('!!!');

    me`今天为什么罚抄？`.pause(1000)`是不是因为上课没听讲？`;

    s_sofa.patch({ opacity: 1, duration: 1000 });
}
