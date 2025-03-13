import barba from '@barba/core';
const myHackClassName = 'thisIsMygoInsteadOfAve_mujica';

/**
 * Plugin `hack/spa` is an official plugin for dummy pjax behaviour.
 * This manually invokes <script> <link> <style> indifferently.
 *
 * Note:
 *   This file can be imported after `initSPA();`
 *   But lets call it before, both ok!
 */

// See https://barba.js.org/docs/advanced/hooks/
// call same hooks behaves like a queue, will NOT overload

barba.hooks.afterLeave((data) => {
    const Styles = data!.current.container.querySelectorAll('style');
    for (const style of Styles) {
        // fix for <style>
        style.remove();
    }
});

barba.hooks.beforeEnter((data) => {
    const htmlString = data!.next.html;
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, 'text/html');

    // FOUC (Flash of unstyled content)
    // @ts-ignore
    data.next.container.style.opacity = 0;

    // [clear] head
    const beforeModule = document.querySelectorAll(`head .${myHackClassName}`);
    for (const eL of beforeModule) {
        eL.remove();
    }

    // [start] inject
    const fragment = new DocumentFragment();

    /// process head style ( only link )
    const headStyles = doc.querySelectorAll('head link[rel=stylesheet]');

    for (const style of headStyles) {
        if (style.className === myHackClassName) {
            continue;
        }
        const one = document.createElement('link');
        const href = style.getAttribute('href');
        if (typeof href === 'string') one.href = href;
        one.rel = 'stylesheet';
        one.classList.add(myHackClassName);
        fragment.appendChild(one);
    }

    /// process container style
    const containerStyles = data!.next.container.querySelectorAll('style');
    for (const style of containerStyles) {
        if (style.className === myHackClassName) {
            continue;
        }
        const one = document.createElement('style');
        one.textContent = style.textContent;
        one.classList.add(myHackClassName);
        fragment.appendChild(one);
    }

    /// process head script ( only module )
    const headScripts = doc.querySelectorAll('head script[type="module"]');

    for (const script of headScripts) {
        if (script.className === myHackClassName) {
            continue;
        }
        const one = document.createElement('script');

        if (script.hasAttribute('src')) {
            const src = script.getAttribute('src');
            if (typeof src !== 'string') continue;
            if (src.includes('@vite')) {
                continue;
            } // skip src="/@vite/client"
            one.src = src;
        } else {
            one.textContent = script.textContent;
        }

        one.type = 'module';
        one.className = myHackClassName;
        fragment.appendChild(one);
    }

    /// process container script
    let js = data!.next.container.querySelectorAll('main script');
    for (const script of js) {
        const one = document.createElement('script');

        if (script.hasAttribute('src')) {
            if (window.VITE_HMR_DEBUG !== 1) continue;

            const src = script.getAttribute('src');
            if (typeof src !== 'string') continue;
            if (src.includes('@vite')) {
                continue;
            } // skip src="/@vite/client"
            one.src = src;
            one.type = 'module';
        } else {
            // module will be raised by vite
            // only confronted with non-module
            one.textContent = script.textContent;
        }

        one.className = myHackClassName;
        fragment.appendChild(one);
    }

    // fix for <link>
    data!.current.container.remove();

    // [finish] inejction
    document.head.appendChild(fragment);
});

barba.hooks.afterEnter((data) => {});
