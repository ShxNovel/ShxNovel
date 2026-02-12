import { CameraHandler } from '../camera';
import { RTHandler } from '../rt';
import { SceneHandler } from '../scene';
import { PipelineIR, PipelineRegistry, PipelineContent } from './registry';

class defaultPipeline implements PipelineIR {
    constructor(name: string) {
        if (name.length === 0) {
            throw new Error('Camera name cannot be empty');
        }
        this.name = name;
    }

    name = 'any';

    kind: PipelineIR['kind'] = 'pipeline';

    steps = [];
}

type PipelineConfigArgs = {
    scene: SceneHandler<any>;
    camera: CameraHandler<any>;
    output: RTHandler<any>;
    // will we support (Multiple Render Targets)?
    // [RTHandler<any>, ...RTHandler<any>[]];

    /** @default false */
    clear?: boolean;
    /** @default '#000000' */
    clearColor?: string;
    /** @default 0 */
    clearAlpha?: number;

    /**
     *  @default
     *  [0, 0, output.width, output.height]
     */
    viewport?: PipelineContent['viewport'];
    /**
     *  @default
     *  [0, 0, output.width, output.height]
     */
    scissor?: PipelineContent['scissor'];

    /** @default false */
    scissorTest?: boolean;
};

class PipelineConfig {
    constructor(public content: PipelineContent[]) {}

    add(args: PipelineConfigArgs) {
        const some = structuredClone(args);

        let result: PipelineContent;

        result = {
            scene: some.scene.name,
            camera: some.camera.name,
            output: some.output.name,

            clear: some.clear || true,
            clearColor: some.clearColor || '#000000',
            clearAlpha: some.clearAlpha || 0,

            viewport: some.viewport || [0, 0, some.output.width, some.output.height],
            scissor: some.scissor || [0, 0, some.output.width, some.output.height],
            scissorTest: some.scissorTest || false,
        };
        this.content.push(result);
    }
}

export type PipelineHandler<T extends string> = {
    kind: 'pipeline';
    name: `pipe_${T}`;
};

export function regPipeline<T extends string>(name: T, config?: (t: PipelineConfig) => void): PipelineHandler<T> {
    const item = new defaultPipeline(name);

    if (config) config(new PipelineConfig(item.steps));

    let Ex_name: PipelineHandler<T>['name'];

    Ex_name = `pipe_${name}`;

    PipelineRegistry.reg(Ex_name, item);

    return { kind: 'pipeline', name: Ex_name };
}
