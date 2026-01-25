import { TextureKey } from '../..';

export interface IVisualKindMap {
    stand: any;
    bg: any;
    camera: any;
}

export const VisualKindMap = {
    stand: true,
    bg: true,
    camera: true,
} as IVisualKindMap;

export type VisualKind = keyof IVisualKindMap;

export interface VisualIR {
    name: string;
    kind: VisualKind;

    nodes: VisualNodesSpec;
    poses: VisualPosesSpec<any>;
    expressions: VisualExpressionsSpec<any>;
}

// // prettier-ignore
// export type VisualBuilder<K> =
//   K extends 'stand' ? StandVisualBuilder :
//   K extends 'bg' ? BgVisualBuilder :
//   K extends 'camera' ? CameraVisualBuilder :
//   never;

///
/// Nodes specification
///

export type VisualNodesSpec = {
    [nodeName: string]: {
        parent?: string;
        type?: 'sprite' | 'mesh' | 'spine' | 'live2d';
        variants?: {
            [variantName: string]:
                | TextureKey // user-convenient
                | {
                      texture?: TextureKey;
                      [key: string]: unknown;
                  };
        };
    };
};

///
/// Poses specification
///

export type VisualPosesSpec<N extends VisualNodesSpec> = {
    [poseName: string]: {
        $extends?: typeof poseName;
    } & {
        // K := nodeName
        [K in keyof N]?: {
            x?: number;
            y?: number;
            // zIndex?: number;
        };
    };
};

///
/// Expressions specification
///

export type VisualExpressionsSpec<N extends VisualNodesSpec> = {
    [expressionName: string]: ExpressionMeta & {
        [K in keyof N]?: N[K]['variants'] extends Record<infer V, any>
            ?
                  | V // variant ; user-convenient
                  | boolean // visible ; user-convenient
                  | NodeExpressionsPatch<V & string>
            : never;
    };
};

export type ExpressionMeta = {
    $duration?: number;
};

export interface NodeExpressionsPatch<V extends string = string> {
    variant?: V;
    visible?: boolean;
    material?: {
        opacity?: number;
        blendMode?: string;
        uniforms?: Record<string, number>;
    };
}
