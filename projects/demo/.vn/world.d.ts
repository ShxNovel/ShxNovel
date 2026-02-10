import '@shxnovel/rewrite';

declare module "@shxnovel/rewrite" {

  namespace Animate {
    interface VisualMap {
      'v_bg': {
        pose: never;
        expr: 'body:p0' | 'body:p1' | 'body:p2' | 'body:p3' | 'v#body' | 'u#body' | '1#body' | '0#body' | '1#self' | '0#self';
      };

    }

    interface SceneMap {
      "sn_main": any;
    }

    interface CameraMap {
      "co_main": any;
    }

    interface RTMap {
      "RT_screen": any;
    }

  }

  namespace GameData {
    interface InGame {
      a: number;
      b: number;
    }

    interface Global {
      c: number;
      d: number;
    }
  }
}
