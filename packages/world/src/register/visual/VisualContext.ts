import { VisualIR } from './types';

export class VisualContext<T extends VisualIR> {
    type: string = 'Item';
    context: Map<string, T> = new Map();

    constructor(type: string = 'Item') {
        this.type = type;
    }

    add(name: string, item: T) {
        if (name === '') {
            throw new Error('Name cannot be empty');
        }

        if (this.context.has(name)) {
            throw new Error(`${this.type} with name '${name}' already exists`);
        }

        return this.context.set(name, item);
    }

    finish() {
        this.context.forEach((item, _name) => {
            this.addNodeExpression(item);
        });
        return this.context;
    }

    /**
     * 将每个 node 里的每个 variants 添加进 expressions
     */
    addNodeExpression(item: T) {
        const { nodes, expressions } = item;

        const expressionMap = {} as Record<string, any>;

        Object.entries(nodes).forEach(([nodeName, node]) => {
            const { variants } = node;

            if (!variants) return;

            // 显示
            Object.entries(variants).forEach(([variantName, _variant]) => {
                const key = `${nodeName}:${variantName}`;
                const value = { [nodeName]: variantName };
                expressionMap[key] = value;
            });

            // 不显示
            Object.entries(variants).forEach(([variantName, _variant]) => {
                const key = `${nodeName}:${variantName}:hidden`;
                const value = { [nodeName]: variantName };
                expressionMap[key] = value;
            });
        });

        const common = getCommonProperties(expressionMap, expressions);
        if (common.length) {
            console.warn(`Conflict with auto expression: ${JSON.stringify(common)}`);
        }

        const mergedExpressions = { ...expressionMap, ...expressions };
        item.expressions = mergedExpressions;
    }
}

// 判断两个对象有没有共有属性
// @ts-ignore
function hasCommonProperties(obj1: Record<string, any>, obj2: Record<string, any>): boolean {
    return Object.keys(obj1).some((key) => obj2.hasOwnProperty(key));
}

// 获取两个对象的共有属性
function getCommonProperties(obj1: Record<string, any>, obj2: Record<string, any>): string[] {
    return Object.keys(obj1).filter((key) => obj2.hasOwnProperty(key));
}
