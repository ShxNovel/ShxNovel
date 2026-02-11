import { Animate } from '../../../types';
import { rewriteContext } from '../../RewriteContext';
import { EaseStringLiteral, Vector3 } from '../types';

export interface CameraCommonBuilder {
    x(x: number): void;
    y(y: number): void;
    z(z: number): void;
    pos(x: number, y: number, z?: number): void;

    rotation(r: Vector3): void;

    zoom(z: number): void;

    timelabel(label: string | number): void;
}

export interface CameraAnimateBuilder extends CameraCommonBuilder {
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

export interface OtrhCameraHandle<T extends string> {
    readonly type: 'camera';
    readonly kind: 'orthographic';
    readonly name: T;

    instant(f: (p: CameraCommonBuilder) => void): void;
    animate(f: (p: CameraAnimateBuilder) => void): void;
}

export interface PersCameraHandle<T extends string> {
    readonly type: 'camera';
    readonly kind: 'perspective';
    readonly name: T;

    instant(f: (p: CameraCommonBuilder) => void): void;
    animate(f: (p: CameraAnimateBuilder) => void): void;
}

class OrthCameraImpl<T extends Animate.OrthCameraKey> implements OtrhCameraHandle<T> {
    readonly type = 'camera';
    readonly kind = 'orthographic';

    constructor(public readonly name: T) {}

    private initArgs = () => {
        return {};
    };

    private CBuilder = (ref: Record<string, any>) => {
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
            zoom(z) {
                ref.zoom = z;
            },
            rotation(r) {
                ref.rotation = structuredClone(r);
            },
            timelabel(label) {
                ref.timelabel = label;
            },
        } satisfies CameraCommonBuilder;
    };

    private CABuilder = (ref: Record<string, any>) => {
        const C = this.CBuilder(ref);

        return {
            ...C,
            duration(ms) {
                ref.duration = ms;
            },
            ease(fn) {
                ref.ease = fn;
            },
        } satisfies CameraAnimateBuilder;
    };

    instant(f: (p: CameraCommonBuilder) => void): void {
        const args = this.initArgs();

        rewriteContext.push({
            type: 'animate',
            content: [{ kind: 'instant', target: this.name, args }],
        });

        const C = this.CBuilder(args);

        f(C);
    }

    animate(f: (p: CameraAnimateBuilder) => void): void {
        const args = this.initArgs();

        rewriteContext.push({
            type: 'animate',
            content: [{ kind: 'animate', target: this.name, args }],
        });

        const CAB = this.CABuilder(args);

        f(CAB);
    }
}

class PersCameraImpl<T extends Animate.PersCameraKey> implements PersCameraHandle<T> {
    readonly type = 'camera';
    readonly kind = 'perspective';

    constructor(public readonly name: T) {}

    private initArgs = () => {
        return {};
    };

    private CBuilder = (ref: Record<string, any>) => {
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
            zoom(z) {
                ref.zoom = z;
            },
            rotation(r) {
                ref.rotation = structuredClone(r);
            },
            timelabel(label) {
                ref.timelabel = label;
            },
        } satisfies CameraCommonBuilder;
    };

    private CABuilder = (ref: Record<string, any>) => {
        const C = this.CBuilder(ref);

        return {
            ...C,
            duration(ms) {
                ref.duration = ms;
            },
            ease(fn) {
                ref.ease = fn;
            },
        } satisfies CameraAnimateBuilder;
    };

    instant(f: (p: CameraCommonBuilder) => void): void {
        const args = this.initArgs();

        rewriteContext.push({
            type: 'animate',
            content: [{ kind: 'instant', target: this.name, args }],
        });

        const C = this.CBuilder(args);

        f(C);
    }

    animate(f: (p: CameraAnimateBuilder) => void): void {
        const args = this.initArgs();

        rewriteContext.push({
            type: 'animate',
            content: [{ kind: 'animate', target: this.name, args }],
        });

        const CAB = this.CABuilder(args);

        f(CAB);
    }
}

export function camera<N extends Animate.OrthCameraKey>(name: N): OtrhCameraHandle<N>;
export function camera<N extends Animate.PersCameraKey>(name: N): PersCameraHandle<N>;

export function camera<N extends Animate.CameraKey>(name: N): OtrhCameraHandle<N> | PersCameraHandle<N> {
    if (isOrthName(name)) {
        return new OrthCameraImpl(name) as OtrhCameraHandle<N>;
    } else if (isPersName(name)) {
        return new PersCameraImpl(name) as PersCameraHandle<N>;
    } else {
        throw new Error(`Unknown camera name: ${name}`);
    }
}

function isOrthName(name: Animate.CameraKey): name is Animate.OrthCameraKey {
    return (name as string).startsWith('co:');
}

function isPersName(name: Animate.CameraKey): name is Animate.PersCameraKey {
    return (name as string).startsWith('cp:');
}