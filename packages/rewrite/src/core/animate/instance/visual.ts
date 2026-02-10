// import { deepMerge } from '../../../utils/deepMerge';
import { Animate } from '../../../types';
import { rewriteContext } from '../../RewriteContext';
import { EaseStringLiteral, Vector3 } from '../types';
import { SceneInstance } from './scene';

export interface VisualCommonBuilder<T extends Animate.VisualKey> {
    x(x: number): void;
    y(y: number): void;
    z(z: number): void;
    pos(x: number, y: number, z?: number): void;

    scale(s: Vector3): void;

    rotation(r: Vector3): void;

    uniforms(uniforms: Record<string, any>): void;

    renderOrder(order: number): void;

    expr(...names: Animate.VisualExprName<T>[]): void;

    timelabel(label: string | number): void;
}

export interface VisualEnterBuilder<T extends Animate.VisualKey> extends VisualCommonBuilder<T> {
    into(stage: SceneInstance): void;
}

export interface VisualAnimateBuilder<T extends Animate.VisualKey> extends VisualCommonBuilder<T> {
    /**
     *  duration
     *  @example p.duration(1000);
     */
    duration(ms: number): void;
    /**
     *  ease
     *  @example p.ease('back.in');
     */
    ease(fn: EaseStringLiteral): void;
}

export interface VisualHandle<T extends Animate.VisualKey> {
    readonly type: 'visual';
    readonly name: T;

    /**
     * instant
     */
    instant(f: (p: VisualCommonBuilder<T>) => void): void;
    /** animate */
    animate(f: (p: VisualAnimateBuilder<T>) => void): void;

    /** instant */
    enter(f: (p: VisualEnterBuilder<T>) => void): void;
    /** instant */
    leave(): void;
}

class VisualImpl<T extends Animate.VisualKey> implements VisualHandle<T> {
    readonly type = 'visual';

    constructor(public readonly name: T) {}

    private initArgs = () => {
        return {
            expr: [],
        };
    };

    private VCBuilder = (ref: Record<string, any>) => {
        return {
            x(x) {
                if (!ref.position) ref.position = {};
                ref.position.x = x;
            },
            y(y) {
                if (!ref.position) ref.position = {};
                ref.position.y = y;
            },
            z(z) {
                if (!ref.position) ref.position = {};
                ref.position.z = z;
            },
            pos(x, y, z) {
                if (!ref.position) ref.position = {};
                ref.position.x = x;
                ref.position.y = y;
                if (z) ref.position.z = z;
            },
            scale(s) {
                ref.scale = structuredClone(s);
            },
            rotation(r) {
                ref.rotation = structuredClone(r);
            },
            uniforms(uniforms) {
                ref.uniforms = structuredClone(uniforms);
            },
            renderOrder(order) {
                ref.renderOrder = order;
            },
            expr(...names) {
                (ref.expr as any[]).push(...names);
            },
            timelabel(label) {
                ref.timelabel = label;
            },
        } satisfies VisualCommonBuilder<T>;
    };

    private VABuilder = (ref: Record<string, any>) => {
        const VC = this.VCBuilder(ref);

        return {
            ...VC,
            duration(ms) {
                ref.duration = ms;
            },
            ease(fn) {
                ref.ease = fn;
            },
        } satisfies VisualAnimateBuilder<T>;
    };

    private VEBuilder = (ref: Record<string, any>) => {
        const VC = this.VCBuilder(ref);

        return {
            ...VC,
            into(stage) {
                ref.into = stage;
            },
        } satisfies VisualEnterBuilder<T>;
    };

    instant(f: (p: VisualCommonBuilder<T>) => void): void {
        const args = this.initArgs();

        rewriteContext.push({
            type: 'animate',
            content: [{ kind: 'instant', target: this.name, args }],
        });

        const VC = this.VCBuilder(args);

        f(VC);
    }

    animate(f: (p: VisualAnimateBuilder<T>) => void): void {
        const args = this.initArgs();

        rewriteContext.push({
            type: 'animate',
            content: [{ kind: 'animate', target: this.name, args }],
        });

        const VAB = this.VABuilder(args);

        f(VAB);
    }

    enter(f: (p: VisualEnterBuilder<T>) => void): void {
        const args = this.initArgs();

        rewriteContext.push({
            type: 'animate',
            content: [{ kind: 'enter', target: this.name, args }],
        });

        const VEB = this.VEBuilder(args);

        f(VEB);
    }

    leave(): void {
        rewriteContext.push({
            type: 'animate',
            content: [{ kind: 'leave', target: this.name }],
        });
    }
}

export function visual<T extends Animate.VisualKey>(name: T) {
    return new VisualImpl(name) as VisualHandle<T>;
}
