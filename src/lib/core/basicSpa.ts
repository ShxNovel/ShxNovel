import barba from '@barba/core';
import type { IView, ITransitionPage } from '@barba/core';
import barbaRouter from '@barba/router';
// import barbaPrefetch from '@barba/prefetch';

/** f*** barba lost types/def */
interface IRoute {
    name?: string;
    path?: string;
}

const pageView: IView[] = [];
const pageTransition: ITransitionPage[] = [];
const pageRoutes: IRoute[] = [];

export let _internal_block_spa = false;

export function setSPAInternalBlock(status = true) {
    _internal_block_spa = status;
}

// barba.use(barbaPrefetch);

// export function prefetch(data: String) {
//     let href = undefined;

//     if (typeof data === 'string') {
//         href = data;
//     }

//     barba.prefetch(href);
// }

export function regView(obj: IView | IView[]) {
    if (Array.isArray(obj)) {
        pageView.push(...obj);
    } else {
        pageView.push(obj);
    }
}

export function addTransition(obj: ITransitionPage | ITransitionPage[]) {
    if (Array.isArray(obj)) {
        pageTransition.push(...obj);
        return;
    }
    pageTransition.push(obj);
}

export function addRoute(obj: IRoute | IRoute[]) {
    if (Array.isArray(obj)) {
        pageRoutes.push(...obj);
        return;
    }
    pageRoutes.push(obj);
}

export function initSPA(prefix = 'spa') {
    barba.use(barbaRouter, {
        routes: pageRoutes,
    });

    barba.init({
        schema: { prefix: `data-${prefix}` },
        transitions: pageTransition,
        views: pageView,
        cacheIgnore: true, // true, otherwise minor cache leak
        // preventRunning: true, // useless
    });
}

export function changeUrl(url: string, cb: Function = null): void {
    if (_internal_block_spa) return;
    if (cb instanceof Function) cb();
    barba.go(url);
}

export async function changeUrlAsync(url: string, f = null) {
    if (_internal_block_spa) return;
    if (f instanceof Function) await f();
    barba.go(url);
}

export function prefetchUrl(url: string) {
    barba.prefetch(url);
}

export let defaultHomeUrl = '/src/home.html';
export function goBackPage() {
    let pre = barba.history.previous;
    if (pre == null) {
        return changeUrl(defaultHomeUrl);
    }
    let url = pre.url;
    changeUrl(url);
}
