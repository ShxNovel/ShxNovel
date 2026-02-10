import { VisualRegistry } from './registry';
import type { VisualNodesSpec, VisualExpressionsSpec, VisualIR } from './types';

export function regVisual(name: string) {
    const Ex_name = `v_${name}`;

    const result = {
        name: Ex_name,
        kind: 'visual',
        nodes: {},
        expressions: {},
    } satisfies VisualIR;

    VisualRegistry.reg(Ex_name, result);

    function nodes<N extends VisualNodesSpec>(nodes: N) {
        Object.assign(result.nodes, nodes);
        return { expressions: expressions<N>() };
    }

    function expressions<N extends VisualNodesSpec>() {
        return function <E extends VisualExpressionsSpec<N>>(expressions: E) {
            Object.assign(result.expressions, expressions);
        };
    }

    return { nodes };
}
