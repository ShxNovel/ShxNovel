import { isObject } from './typeCheck';

export function createDeepProxy<T>(
    target: T,
    handler: ProxyHandler<object>
): T {
    const proxyCache = new WeakMap();

    function getProxy(obj: unknown) {
        if (!isObject(obj)) return obj;

        if (proxyCache.has(obj)) {
            return proxyCache.get(obj);
        }

        const proxy = new Proxy(obj, {
            get(target, prop, receiver) {
                const value = Reflect.get(target, prop, receiver);
                return getProxy(value);
            },
            set(target, prop, value, receiver) {
                if (handler.set) {
                    handler.set(target, prop, value, receiver);
                }
                return Reflect.set(target, prop, value, receiver);
            },
        });

        proxyCache.set(obj, proxy);

        return proxy;
    }

    return getProxy(target);
}
