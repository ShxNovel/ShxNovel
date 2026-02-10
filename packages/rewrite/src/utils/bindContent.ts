export function bindContent<R, T extends Record<string, (...args: any[]) => R>>(some: T, content: R[]): T {
    const boundMethods = {} as T;

    Object.keys(some).forEach((key) => {
        const method = some[key as keyof T];

        boundMethods[key as keyof T] = ((...args: any[]) => {
            const result = method(...args);
            content.push(result);
            return result; // okay
        }) as any;
    });

    return boundMethods;
}
