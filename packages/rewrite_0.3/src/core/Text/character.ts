import type { RewriteText, TextUnit } from './text';
import { CleanFunction, bindContent, addChainableMethods } from '../../utils';
import { RewriteContext, rewriteContext } from '../RewriteContext';

/* Before initialization */
export type InitLinkText = CleanFunction<_InitLinkText>;
type _InitLinkText = _LinkTextFn & InitTextMethod;
export interface InitTextMethod {
    /** @param quote show quote */
    useQuote: (quote: boolean) => InitLinkText;
}

/* After initialization */
export type LinkText = CleanFunction<_LinkText>;
type _LinkTextFn = (some?: TemplateStringsArray, ...values: RewriteText[]) => LinkText;
type _LinkText = _LinkTextFn & TextMethod;
export interface TextMethod {
    /** @param ms The duration of the pause in milliseconds */
    pause(ms: number): LinkText;

    /** @param str The string content to be displayed */
    fast(str: string): LinkText;
}

export const textMethods: Record<keyof TextMethod, (this: LinkText, ...args: any[]) => RewriteText> = {
    pause: (ms: number) => {
        return { type: 'pause', args: { ms } };
    },
    fast: (str: string) => {
        return { type: 'fast', args: { str } };
    },
};

function CreateLink(content: RewriteText[]): LinkText {
    function link(some: TemplateStringsArray, ...values: RewriteText[]): Partial<_LinkText> {
        const len = some.length;
        content.push(some[0]);
        for (let i = 1; i < len; i++) {
            content.push(values[i - 1]);
            content.push(some[i]);
        }
        return link as Partial<_LinkText>;
    }

    const methods = bindContent(textMethods, content);

    return addChainableMethods(methods)(link) as LinkText;
}

export function character(name_: string | boolean | null = null, quote: boolean = false): InitLinkText {
    const cache: RewriteContext = rewriteContext;

    let name: string | null = null;

    if (typeof name_ === 'boolean') quote = name_;
    else if (typeof name_ === 'string') (name = name_), (quote = true);

    function init(some?: TemplateStringsArray, ...values: RewriteText[]): LinkText {
        const content: RewriteText[] = [];
        const talk: TextUnit = { type: 'text', name, quote, content };

        cache.push(talk);

        const link = CreateLink(content);

        if (!some) return link as LinkText;

        return link(some, ...values) as LinkText;
    }

    init.useQuote = (quote_: boolean): InitLinkText => {
        return character(name, quote_);
    };

    return init as InitLinkText;
}
