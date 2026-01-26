import { Animate } from '../../../types';
import { rewriteContext } from '../../RewriteContext';
import { AnimatePatchs, EaseStringLiteral } from '../types';
import { SceneInstance } from './scene';

export interface VisualEnterBuilder<T extends Animate.VisualKey> {
    into(stage: SceneInstance): this;
    layer(z: number): this;

    xy(x: number, y: number): this;
    alpha(a: number): this;
    pose(name: Animate.VisualPoseName<T>): this;
    expr(name: Animate.VisualExprName<T>): this;
    set(props: AnimatePatchs): this;
}

export interface VisualAnimateBuilder<T extends Animate.VisualKey> {
    time(ms: number): this;
    ease(fn: EaseStringLiteral): this;

    to(props: AnimatePatchs): this;

    pose(name: Animate.VisualPoseName<T>): this;
    expr(name: Animate.VisualExprName<T>): this;
}

export interface VisualHandle<T extends Animate.VisualKey, U extends string> {
    readonly type: 'visual';
    readonly name: T;
    readonly id: `${T}@${U}`;

    // instant setters
    set(props: AnimatePatchs): this;
    pose(name: Animate.VisualPoseName<T>): this;
    expr(name: Animate.VisualExprName<T>): this;

    // Action Chains
    // enter(girl)...
    enter(): VisualEnterBuilder<T>;

    // animate(girl)...
    animate(): VisualAnimateBuilder<T>;

    // leave(girl)
    leave(): void;
}

class VisualHandleImpl<T extends Animate.VisualKey, U extends string> implements VisualHandle<T, U> {
    public readonly type = 'visual';
    public readonly id: `${T}@${U}`;

    constructor(
        public readonly name: T,
        usedId: U
    ) {
        this.id = `${name}@${usedId}` as `${T}@${U}`;
    }

    // Direct Setters
    set = (props: AnimatePatchs) => {
        // pushIR('SET_PROP', this.id, props);
        rewriteContext.push({
            type: 'animate',
            content: [{ kind: 'set', target: this.id, args: props }],
        });
        return this;
    };

    pose = (name: Animate.VisualPoseName<T>) => {
        // pushIR('SET_POSE', this.id, { value: name });
        rewriteContext.push({
            type: 'animate',
            content: [{ kind: 'set', target: this.id, args: { pose: name } }],
        });
        return this;
    };

    expr = (name: Animate.VisualExprName<T>) => {
        // pushIR('SET_EXPR', this.id, { value: name });
        rewriteContext.push({
            type: 'animate',
            content: [{ kind: 'set', target: this.id, args: { expr: name } }],
        });
        return this;
    };

    // === 2. Enter Logic ===
    enter(): VisualEnterBuilder<T> {
        const targetId = this.id;
        const config = { stage: null as any, props: {} as any };

        rewriteContext.push({
            type: 'animate',
            content: [{ kind: 'enter', target: targetId, args: config }],
        });

        const builder: VisualEnterBuilder<T> = {
            into(stage) {
                config.stage = stage;
                return this;
            },
            layer(z) {
                config.props.layer = z;
                return this;
            },
            xy(x, y) {
                config.props.x = x;
                config.props.y = y;
                return this;
            },
            alpha(a) {
                config.props.alpha = a;
                return this;
            },
            set(p) {
                Object.assign(config.props, p);
                return this;
            },
            pose(name) {
                config.props.pose = name;
                return this;
            },
            expr(name) {
                config.props.expr = name;
                return this;
            },
        };

        return builder;
    }

    // Leave Logic
    leave() {
        const targetId = this.id;
        rewriteContext.push({
            type: 'animate',
            content: [{ kind: 'leave', target: targetId }],
        });
    }

    // Animate Logic
    animate(): VisualAnimateBuilder<T> {
        const targetId = this.id;

        const config = { duration: 0, ease: 'linear', props: {} as any };

        rewriteContext.push({
            type: 'animate',
            content: [{ kind: 'TWEEN', target: targetId, args: config }],
        });

        return {
            time(ms) {
                config.duration = ms;
                return this;
            },
            ease(fn) {
                config.ease = fn;
                return this;
            },
            to(props) {
                Object.assign(config.props, props);
                return this;
            },
            pose(name) {
                config.props.pose = name;
                return this;
            },
            expr(name) {
                config.props.expr = name;
                return this;
            },
        };
    }
}

export function visual<T extends Animate.VisualKey>(name: T) {
    const instance = <U extends string>(id: U): VisualHandle<T, U> => {
        return new VisualHandleImpl(name, id);
    };

    return { instance };
}
