import { rewriteContext } from '../RewriteContext';

export interface Directive {
    type: 'directive';
    name: 'scene-boundary' | 'scene-bind-next' | (string & {});
}

export interface LoweringDirective {
    /**
     * Define a scene boundary.
     */
    SceneBoundary: () => void;
    /**
     * Tell the compiler that after this scene ends,\
     * it should automatically jump to the next scene.
     */
    SceneBindNext: () => void;
}

export const directive: LoweringDirective = {
    get SceneBoundary() {
        rewriteContext.push({
            type: 'directive',
            name: 'scene-boundary',
        } satisfies Directive);
        return () => {};
    },

    get SceneBindNext() {
        rewriteContext.push({
            type: 'directive',
            name: 'scene-bind-next',
        } satisfies Directive);
        return () => {};
    },
};
