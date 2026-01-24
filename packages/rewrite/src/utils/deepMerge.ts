/**
 * 简单判断是否为对象（排除 null 和 数组）
 */
function isObject(item: any): item is Record<string, any> {
    return item && typeof item === 'object' && !Array.isArray(item);
}

/**
 * 深度合并函数
 */
export function deepMerge<T extends object, S extends object>(target: T, source: S): T & S {
    // 创建一个浅拷贝作为基础，避免直接修改原对象
    // const output = { ...target } as any;
    const output = target as any;

    if (isObject(target) && isObject(source)) {
        Object.keys(source).forEach((key) => {
            const sourceValue = (source as any)[key];
            const targetValue = (target as any)[key];

            if (isObject(sourceValue) && key in target) {
                // 如果双方都是对象，则递归合并
                output[key] = deepMerge(targetValue, sourceValue);
            } else {
                // 否则直接覆盖（包括 sourceValue 是基本类型或数组的情况）
                output[key] = sourceValue;
            }
        });
    }

    return output as T & S;
}
