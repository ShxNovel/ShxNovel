import { useChapter, collector } from '@shxnovel/rewrite';

const { character, label, bg, stand } = useChapter('1.1.2');

const aside = character(null);
const me = character('卡咖喱2');

const s_sofa = stand('sofa');

label('start2');
{
    aside`你好!`.pause(2000)`罚抄`.fast('!!!');

    me`今天为什么罚抄？`.pause(1000)`是不是因为上课没听讲？`;

    s_sofa.animate({ opacity: 1, duration: 1000 });
}
