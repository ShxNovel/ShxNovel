/** wtf */
declare module '@types/barba/core' {
    export * from '@barba/core/dist/core/src/src';
    export * from '@barba/core/dist/core/src/src/core';
    export * from '@barba/core/dist/core/src/src/utils';
    export * from '@barba/core/dist/core/src/src/hooks';
    export * from '@barba/core/dist/core/src/src/defs';
    export * from '@barba/core/dist/core/src/src/prefetch';
    export * from '@barba/core/dist/core/src/src/polyfills';
    export * from '@barba/core/dist/core/src/src/schemas';
}

/** wtf */
declare module '@barba/core' {
    import { Core } from '@barba/core/dist/core/src/src/core';

    const barba: Core;

    export default barba;

    export * from '@types/barba/core';
}

/** wtf */
declare module '@barba/router' {
    import router from '@barba/router/dist/router/src/src/router';

    const barbaRouter: typeof router;
    export default barbaRouter;

    export * from '@barba/router/dist/router/src/router';
}
