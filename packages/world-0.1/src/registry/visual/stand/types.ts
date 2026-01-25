// import { TextureKey } from '../..';

// ///
// /// Nodes specification
// ///

// export type StandNodesSpec = {
//     [nodeName: string]: {
//         parent?: string;
//         type?: 'sprite' | 'mesh' | 'spine' | 'live2d';
//         variants?: {
//             [variantName: string]: {
//                 texture?: TextureKey;
//                 [key: string]: unknown;
//             };
//         };
//     };
// };

// ///
// /// Poses specification
// ///

// export type StandPosesSpec<N extends StandNodesSpec> = {
//     [poseName: string]: {
//         $extends?: typeof poseName;
//     } & {
//         // K := nodeName
//         [K in keyof N]?: {
//             x?: number;
//             y?: number;
//             zIndex?: number;
//         };
//     };
// };

// ///
// /// Expressions specification
// ///

// export type StandExpressionsSpec<N extends StandNodesSpec> = {
//     [expressionName: string]: ExpressionMeta & {
//         // K := nodeName
//         [K in keyof N]?: N[K]['variants'] extends Record<infer V, any>
//             ?
//                   | V // variant
//                   | boolean // visible
//                   | NodeExpressionsPatch<V & string>
//             : NodeExpressionsPatch;
//     };
// };

// export interface ExpressionMeta {
//     // $priority?: number;
// }

// export interface NodeExpressionsPatch<V extends string = string> {
//     variant?: V;
//     visible?: boolean;
//     material?: {
//         opacity?: number;
//         blendMode?: string;
//         uniforms?: Record<string, number>;
//     };
// }

// ///
// /// IR
// ///

// export interface StandIR {
//     name: string;
//     type: 'StandIR';
//     nodes: StandNodesSpec;
//     poses: StandPosesSpec<StandNodesSpec>;
//     expressions: StandExpressionsSpec<StandNodesSpec>;
// }

// ///
// /// Tools
// ///

// type InvalidSlotError<S, words> = {
//     __error: words;
//     providedValue: S;
// };

// // @ts-ignore
// type StrictSlot<R, K, words> = K extends keyof R ? R[K] : InvalidSlotError<K, words>;

// // type some = StrictSlot<{ a: 1 }, 'b', '你提供的插槽名不在定义范围内'>;

// // T: 传入的图对象
// // Curr: 当前追踪的节点
// // Visited: 当前路径中已访问过的节点集合（联合类型）
// type HasCycle<T extends Record<string, string>, Curr, Visited = never> =
//     // 如果当前节点已经在访问记录中，说明有环
//     Curr extends Visited
//         ? true
//         : // 如果当前节点是图中的一个 Key，继续往下追踪
//         Curr extends keyof T
//         ? HasCycle<T, T[Curr], Visited | Curr>
//         : // 如果当前节点不在图中（没有出向边），说明该路径终结，无环
//           false;

// // 遍历所有的 key，只要有一个起点触发了环，整个图就不是 DAG
// // @ts-ignore
// type IsDAG<T extends Record<string, string>> = true extends { [K in keyof T]: HasCycle<T, K> }[keyof T] ? false : true;
