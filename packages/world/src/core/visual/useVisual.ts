import { VisualNodesSpec, VisualPosesSpec, VisualExpressionsSpec } from './types';
import { VisualKind } from './types';
import { visualCtx } from './visualContext';

export function useVisual<K extends VisualKind>(name: string, kind: K) {
    const result = {
        name,
        kind,
        nodes: {},
        poses: {},
        expressions: {},
    };

    visualCtx.add(name, result);

    // first function
    function nodes<N extends VisualNodesSpec>(nodes: N) {
        Object.assign(result.nodes, nodes);
        return { poses: poses<N>() };
    }

    // second function
    function poses<N extends VisualNodesSpec>() {
        return function <S extends VisualPosesSpec<N>>(poses: S) {
            Object.assign(result.poses, poses);
            return { expressions: expressions<N>() };
        };
    }

    // third function
    function expressions<N extends VisualNodesSpec>() {
        return function <E extends VisualExpressionsSpec<N>>(expressions: E) {
            Object.assign(result.expressions, expressions);
        };
    }

    return { nodes };
}
