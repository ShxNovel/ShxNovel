// data
export declare namespace GameData {
    interface InGame {}

    interface Global {}

    interface Impl extends Record<string, any> {
        inGame: InGame;
        global: Global;
    }
}

//
export declare namespace Animate {
    interface VisualMap {}

    interface VisualPosition {}

    interface VisualEffectMap {
        linear: {};
    }
}

export type VisualKey = keyof Animate.VisualMap;

export type VisualPosition = keyof Animate.VisualPosition;

export type VisualEffect = keyof Animate.VisualEffectMap;

// | (string /* magic */ & {});
