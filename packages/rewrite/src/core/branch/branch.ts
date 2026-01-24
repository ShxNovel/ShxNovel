import { generator } from '../../utils/splitmix32';
import { rewriteContext } from '../RewriteContext';
import { flag } from '../flag';
import { jump } from '../jump';
import { GameData } from '../../types';
import { getStack } from '../../utils/getStack';
import { deepMerge } from '../../utils/deepMerge';
import { getPathDiff } from '../../utils/getPathDiff';

export interface BranchUnit {
    type: 'branch';
    cond: string;
    /* end target, not in targets */
    ENDFLAG: string;
    targets: {
        [result: string]: string;
    };
    meta?: Record<string, any>;
}

/**
 * Create a branch
 * @param args Branching conditions and target function configuration
 *
 * @example
 * ```ts
 * branch({
 *   Condition: function () {
 *      if (this.a > 10) return "success";
 *      if (this.b > 10) return "error";
 *      return "idle";
 *   },
 *
 *   success: "chapter-2", // jump to chapter-2
 *   error: () => {        // chapter logic
 *      text `something wrong`
 *   },
 *   // use `[[likely]]` to mark likely branch
 *   idle: ([[likely]]) => {},
 * })
 * ```
 */
export function branch<K extends string, T extends GameData.Impl>(
    args: {
        Condition: (this: Readonly<T>) => K;
    } & Partial<Record<K, string | ((...args: any[]) => void)>>
) {
    const ConditionStr = args.Condition.toString();

    type Logic = string | ((...args: any[]) => void);

    const LikelyLabelMap = new Map<string, Logic>();
    const NormalLabelMap = new Map<string, Logic>();

    Object.entries(args).forEach(([key, value]: [string, Logic]) => {
        if (key === 'Condition') return;

        if (typeof value === 'string') {
            NormalLabelMap.set(key, value);
            return;
        }

        if (value.length) {
            LikelyLabelMap.set(key, value);
        } else {
            NormalLabelMap.set(key, value);
        }
    });

    function getLabel() {
        return generator().toString(36).slice(2);
    }

    const ENDFLAG = getLabel();

    let debug: null | string = null;
    if (process.env.RewriteInputPath) debug = getPathDiff(process.env.RewriteInputPath, getStack(branch));

    const item: BranchUnit = {
        type: 'branch',
        cond: ConditionStr,
        ENDFLAG: ENDFLAG,
        targets: {},
    };

    if (process.env.RewriteInputPath) deepMerge(item, { meta: { debug } });

    rewriteContext.push(item);

    function solve(key: string, value: Logic) {
        if (typeof value === 'string') {
            // if value is a label, just use it
            item.targets[key] = value;
            return;
        }
        const label = getLabel();
        flag(label, value);
        jump(ENDFLAG);
        item.targets[key] = label;
    }

    for (const [key, value] of LikelyLabelMap) {
        solve(key, value);
    }

    for (const [key, value] of NormalLabelMap) {
        solve(key, value);
    }

    flag(ENDFLAG);
}
