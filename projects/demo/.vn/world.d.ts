import '@shxnovel/rewrite';

declare module "@shxnovel/rewrite" {

  namespace Animate {
    interface VisualMap {
      'b:school': {
        pose: never;
        expression: 'body:bright' | 'body:dark' | '#body' | 'dayLight' | 'nightLight';
      };

      's:Rinne': {
        pose: 'base' | 'front' | 'side';
        expression: 'body:normal' | 'body:side' | '#body' | 'normal_eye:open' | 'normal_eye:close' | 'normal_eye:happy' | '#normal_eye' | 'side_eye:open' | 'side_eye:close' | 'side_eye:happy' | '#side_eye' | 'normal_happy' | 'side_shame';
      };

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
