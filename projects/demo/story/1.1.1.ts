import { useChapter } from '@shxnovel/rewrite';

const { character, label, bg, stand } = useChapter('1.1.1');

const aside = character(null);
const me = character('卡咖喱');

const s_sofa = stand('sofa');

label('start');
{
    aside`你好!`.pause(2000)`罚抄`.fast('!!!');

    me`今天为什么罚抄？`.pause(1000)`是不是因为上课没听讲？`;

    s_sofa.animate({ opacity: 1, duration: 1000 });
}
