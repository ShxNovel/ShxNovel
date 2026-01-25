import { WorldContext } from '../worldContext';
import { VisualIR } from './types';

export const visualCtx = new WorldContext<VisualIR>('Visual');

function getCommonProperties(obj1: Record<string, any>, obj2: Record<string, any>): string[] {
    return Object.keys(obj1).filter((key) => obj2.hasOwnProperty(key));
}

const old = visualCtx.finish;
visualCtx.finish = function () {
    // [side effect] make sure call this only once
    visualCtx.finish = old;

    this.context.forEach((item, _name) => {
        const { nodes, expressions } = item;

        const expressionMap = {} as Record<string, any>;

        Object.entries(nodes).forEach(([nodeName, node]) => {
            const { variants } = node;

            if (!variants) return;

            // display
            Object.entries(variants).forEach(([variantName, _variant]) => {
                const key = `${nodeName}:${variantName}`;
                const value = { [nodeName]: variantName };
                expressionMap[key] = value;
            });

            // undisplay
            {
                const key = `#${nodeName}`;
                const value = { [nodeName]: false };
                expressionMap[key] = value;
            }
        });

        const common = getCommonProperties(expressionMap, expressions);
        if (common.length) {
            console.warn(`Conflict with auto expression: ${JSON.stringify(common)}`);
        }

        const mergedExpressions = { ...expressionMap, ...expressions };
        item.expressions = mergedExpressions;
    });
    return this.context;
};
