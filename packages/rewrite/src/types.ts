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
    type VisualKey = keyof VisualMap;
    type VisualPoseName<T> = T extends keyof VisualMap ? VisualMap[T]['pose'] : never;
    type VisualExpressionArgs<T> = T extends keyof VisualMap ? VisualMap[T]['expression'] : never;

    interface VisualPositionMap {}
    type VisualPositionKey = keyof VisualPositionMap;

    interface VisualEffectMap {
        linear: {};
    }
    type VisualEffectKey = keyof VisualEffectMap;
}

// | (string /* magic */ & {});
