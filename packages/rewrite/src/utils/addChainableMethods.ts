// prettier-ignore
export type Chainable<M, T> = {
    [K in keyof M]: M[K] extends (...args: infer P) => void
        ? (...args: P) => T & Chainable<M, T>
        : never;
};

export function addChainableMethods<M extends Record<string, (...args: any[]) => void>>(methods: M) {
    return function <T>(linkFunction: T): T & Chainable<M, T> {
        Object.entries(methods).forEach(([methodName, methodLogic]) => {
            (linkFunction as any)[methodName] = function (...args: any[]) {
                methodLogic(...args);
                return linkFunction;
            };
        });

        return linkFunction as T & Chainable<M, T>;
    };
}
