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
    /* visual */
    interface VisualMap {
        test: {
            pose: 'enter' | 'leave';
            expr: 'epxr1' | 'expr2';
        };
    }
    type VisualKey = keyof VisualMap;
    type VisualPoseName<T> = T extends keyof VisualMap ? VisualMap[T]['pose'] : never;
    type VisualExprName<T> = T extends keyof VisualMap ? VisualMap[T]['expr'] : never;

    interface VisualPositionMap {}
    type VisualPositionKey = keyof VisualPositionMap;

    interface VisualEffectMap {
        linear: {};
    }
    type VisualEffectKey = keyof VisualEffectMap;

    /* scene */
    interface SceneMap {
        'scene:main': any;
    }
    type SceneKey = keyof SceneMap;

    /* camera */
    interface CameraMap {
        'co:main': any;
    }

    /* rt */
    interface RTMap {
        screen: any;
    }
}

// | (string /* magic */ & {});
