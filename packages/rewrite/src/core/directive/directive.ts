// import { getStack } from '../../utils/getStack';
import { rewriteContext } from '../RewriteContext';

export interface DirectiveName {
    'scene-boundary': any;
    'scene-bind-next': any;
}

export interface Directive {
    type: 'directive';
    name: keyof DirectiveName;
    meta?: Record<string, any>;
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
        return () => { };
    },

    get SceneBindNext() {
        rewriteContext.push({
            type: 'directive',
            name: 'scene-bind-next',
        } satisfies Directive);
        return () => { };
    },
};
