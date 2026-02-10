export interface PipelineIR {
    name: string;
    kind: 'pipeline';

    content: PipelineContent[];
}

type Vector4 = [number, number, number, number];

export interface PipelineContent {
    scene: string;
    camera: string;
    output: string;
    // will we support (Multiple Render Targets)?
    // [string, ...string[]];

    clear: boolean;
    clearColor: string;
    clearAlpha: number;

    viewport: Vector4;
    scissor: Vector4;
    scissorTest: boolean;
}

export class PipelineRegistry {
    static pool = new Map<string, PipelineIR>();

    static reg(name: string, pipeline: PipelineIR) {
        if (name.length === 0) {
            throw new Error('Pipeline name cannot be empty');
        }
        if (this.pool.has(name)) {
            throw new Error(`Pipeline ${name} already registered`);
        }
        this.pool.set(name, pipeline);
    }

    static finish() {
        return this.pool;
    }
}
