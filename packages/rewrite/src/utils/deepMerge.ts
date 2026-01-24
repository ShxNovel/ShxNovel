export function deepMerge<T extends Record<string, any>, K extends Record<string, any>>(target: T, source: K): T & K {
    const result = structuredClone(target) as T & K;

    for (const key in source) {
        if (!source.hasOwnProperty(key)) continue;

        const sourceValue = source[key];
        const targetValue = target[key];

        if (
            typeof sourceValue === 'object' &&
            sourceValue !== null &&
            !Array.isArray(sourceValue) &&
            typeof targetValue === 'object' &&
            targetValue !== null &&
            !Array.isArray(targetValue)
        ) {
            result[key] = deepMerge(targetValue, sourceValue);
        } else {
            result[key] = sourceValue as any;
        }
    }
    return result as T & K;
}
