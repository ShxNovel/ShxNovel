import { rewriteContext } from '../RewriteContext';
import { RTInstance } from './instance/rt';
import { VisualInstance } from './instance/visual';

type LeaveTarget = VisualInstance<any, any> | RTInstance;

type LeaveOptions = {
    timelabel?: number | string;
    dispose?: boolean;
};

export function leave(target: LeaveTarget, options?: LeaveOptions): void {
    const { timelabel = undefined, dispose = false } = options || {};

    // IR header
    const id = target.id;

    rewriteContext.push({
        type: 'animate',
        content: [{ kind: 'leave', target: id, timelabel, args: { dispose } }],
    });
}
