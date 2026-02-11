// data
export declare namespace GameData {
    interface InGame {}

    interface Global {}

    interface Impl {
        inGame: InGame;
        global: Global;
        // [x: string]: any;
    }
}

//
export declare namespace Animate {
    /* visual */
    interface VisualMap {
        // test: {
        //     pose: 'enter' | 'leave';
        //     expr: 'epxr1' | 'expr2';
        // };
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
        // 'scene:main': any;
    }
    type SceneKey = keyof SceneMap;

    /* camera */
    interface CameraMap {
        // 'co:main': 'o';
        // 'co:some1': 'o';
        // 'cp:some2': 'p';
    }
    type CameraKey = PersCameraKey | OrthCameraKey;
    type PersCameraKey = KeysOfValue<CameraMap, 'p'>;
    type OrthCameraKey = KeysOfValue<CameraMap, 'o'>;

    interface RTMap {
        // screen: any;
    }
    type RTKey = keyof RTMap;

    interface PipelineMap {
        // main: any;
    }
    type PipelineKey = keyof PipelineMap;
}

// | (string /* magic */ & {});

type KeysOfValue<T, TCondition> = keyof {
    [K in keyof T as T[K] extends TCondition ? K : never]: T[K];
};
