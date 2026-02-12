useChapter("1.1.1");

const aside = character(null);
const me = character("卡咖喱");

const stage = scene("s_main");
const school = visual("v_bg");

flag("start");
{
  aside`你好!`.pause(2000)`罚抄`.fast("!!!");

  school.enter(p => {
    p.into(stage);
    p.expr("body:p0");
  });

  school.animate(p => {
    p.expr("body:p1");
  });

  me`今天为什么罚抄？`.pause(1000)`是不是因为上课没听讲？`;

  school.leave();
}

jump("start2");
