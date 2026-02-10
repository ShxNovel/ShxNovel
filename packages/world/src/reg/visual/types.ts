// import { TextureKey } from '../..';
import { TextureHandler } from '../texture';

export interface VisualIR {
    name: string;
    kind: 'visual';

    nodes: VisualNodesSpec;
    expressions: VisualExpressionsSpec<any>;
}

export type VisualNodesSpec = {
    [nodeName: string]: {
        // type?: 'sprite' | 'mesh' | 'spine' | 'live2d';
        parent?: string | 'root';
        variants: {
            [variantName: string]:
                | undefined //
                // | TextureKey // user-convenient
                | TextureHandler<any>;
        };
        pos?: [number, number, number?];
    };
};

///
/// Expressions specification
///

export type VisualExpressionsSpec<N extends VisualNodesSpec> = {
    [expressionName: string]: NodeExpressionConfig<N> | SelfExpressionConfig;

    // target: keyof N | 'self';
    // variant?: N[K]['variants'];
    // visible?: boolean;
    // opacity?: number;
    // duration?: number;

    // & {
    //     [K in keyof N]?: N[K]['variants'] extends Record<infer V, any>
    //         ?
    //               | V // variant ; user-convenient
    //               | boolean // visible ; user-convenient
    //               | number // opacity
    //               | NodeExpressionsPatch<V & string>
    //         : never;
    // };
};

type CommonExpressionProps = {
    visible?: boolean;
    opacity?: number;
    uniforms?: Record<string, number>;
};

type SelfExpressionConfig = CommonExpressionProps & {
    target: 'self';
    variant?: never;
};

type NodeExpressionConfig<N extends VisualNodesSpec> = {
    [K in keyof N]: CommonExpressionProps & {
        target: K;
        variant?: keyof N[K]['variants'];
    };
}[keyof N];

// export type ExpressionMeta = {
//     duration?: number;
// };

// export interface NodeExpressionsPatch<V extends string = string> {
//     variant?: V;
//     visible?: boolean;
//     opacity?: number;
//     uniforms?: Record<string, number>;
// }
