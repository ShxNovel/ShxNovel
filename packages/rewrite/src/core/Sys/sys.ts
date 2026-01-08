import { ChapterUnit } from '../chapter';
import { addChainableMethods, bindContent, CleanFunction } from '../../utils';

export interface Sys {
    type: 'sys';
    content: RewriteSys[];
}

export type RewriteSys = {
    type: keyof RewriteSysType;
    args?: Record<PropertyKey, unknown>;
};

type DefaultRewriteSysType = {
    [K in keyof SysMethod]: never;
};

export interface RewriteSysType extends DefaultRewriteSysType {}

/**
 * Sys system methods
 */

export type LinkSys = CleanFunction<_LinkSys>;
type _LinkSysFn = (some?: TemplateStringsArray, ...values: RewriteSys[]) => LinkSys;
type _LinkSys = _LinkSysFn & SysMethod;

export interface SysMethod {
    /** This indicates that a new conversation will start from here.  */
    cut(): LinkSys;
}

export const sysMethods: Record<keyof SysMethod, (...args: any[]) => Sys> = {
    cut() {
        return { type: 'sys', content: [{ type: 'cut' }] };
    },
};

export function BuildSys(cache: ChapterUnit[]): LinkSys {
    function link() {
        return link as Partial<_LinkSys>;
    }

    const methods = bindContent(sysMethods, cache);

    return addChainableMethods(methods)(link) as LinkSys;
}
