interface Window {
    VITE_HMR_DEBUG?: any;
    shxNovel: any;
    actions: any;
    objectLoader: any;
    cameraBunch: any;
    sceneBunch: any;
    loader: any;
    mainRenderer: any;
}

/** wtf */
declare module '@types/barba/core' {
    export * from '@barba/core/dist/core/src/src';
    export * from '@barba/core/dist/core/src/src/core';
    export * from '@barba/core/dist/core/src/src/utils';
    export * from '@barba/core/dist/core/src/src/hooks';
    export * from '@barba/core/dist/core/src/src/defs';
    export * from '@barba/core/dist/core/src/src/modules';
    export * from '@barba/core/dist/core/src/src/polyfills';
    export * from '@barba/core/dist/core/src/src/schemas';
}

/** wtf */
declare module '@barba/core' {
    import { Core } from 'node_modules/@barba/core/dist/core/src/src/core';

    const barba: Core;

    export default barba;

    export * from '@types/barba/core';
}

/** wtf */
declare module '@barba/router' {
    import router from 'node_modules/@barba/router/dist/router/src/src/router';

    const barbaRouter: typeof router;
    export default barbaRouter;

    export * from 'node_modules/@barba/router/dist/router/src/router';
}
