// data
export declare namespace GameData {
    interface InGame {}

    interface Global {}
}

//
export declare namespace Animate {
    interface VisualMap {}
}

export type VisualKey = keyof Animate.VisualMap;
// | (string /* magic */ & {});
