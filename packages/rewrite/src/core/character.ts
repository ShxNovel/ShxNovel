import type { RewriteText, Text } from './text';
import { ChapterUnit } from './chapter';

/** wtf vscode language service, not good */
type CleanFunction<T extends (...args: any[]) => any> = T & {
    /** @deprecated */ apply: never;
    /** @deprecated */ arguments: never;
    /** @deprecated */ bind: never;
    /** @deprecated */ call: never;
    /** @deprecated */ caller: never;
    /** @deprecated */ toString: never;
    /** @deprecated */ length: never;
    /** @deprecated */ name: never;
    /** @deprecated */ prototype: never;
    /** @deprecated */ [Symbol.hasInstance]: never;
};

/* Before initialization */
export type InitLinkText = CleanFunction<_InitLinkText>;
type _InitLinkText = _LinkTextFn & InitTextMethod;
export interface InitTextMethod {
    /** @param quote show quote */
    useQuote: (quote: boolean) => InitLinkText;
}

/** After initialization */
export type LinkText = CleanFunction<_LinkText>;
type _LinkTextFn = (some: TemplateStringsArray, ...values: RewriteText[]) => LinkText;
type _LinkText = _LinkTextFn & TextMethod;
export interface TextMethod {
    /** @param ms The duration of the pause in milliseconds */
    pause(ms: number): LinkText;

    /** @param str The string content to be displayed */
    fast(str: string): LinkText;
}

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

    const methods = {
        pause: (ms: number) => {
            content.push({ type: 'pause', args: { ms } });
        },
        fast: (str: string) => {
            content.push({ type: 'fast', args: { str } });
        },
    };

    return addChainableMethods(methods)(link) as LinkText;
}

export function BuildCharacter(cache: ChapterUnit[]) {
    const character = (name_: string | boolean | null = null, quote: boolean = true): InitLinkText => {
        let name: string | null = null;

        if (typeof name_ === 'boolean') quote = name_;
        else if (typeof name_ === 'string') name = name_;

        function init(some: TemplateStringsArray, ...values: RewriteText[]): LinkText {
            const content: RewriteText[] = [];
            const talk: Text = { type: 'text', name, quote, content };

            cache.push(talk);

            const link = CreateLink(content);

            return link(some, ...values) as LinkText;
        }

        init.useQuote = (quote_: boolean): InitLinkText => {
            return character(name, quote_);
        };

        return init as InitLinkText;
    };

    return character;
}

function addChainableMethods<M extends Record<string, (...args: any[]) => void>>(methods: M) {
    return function <T>(linkFunction: T) {
        type ChainableMethods = {
            [K in keyof M]: M[K] extends (...args: infer P) => void ? (...args: P) => T & ChainableMethods : never;
        };

        Object.entries(methods).forEach(([methodName, methodLogic]) => {
            (linkFunction as any)[methodName] = function (...args: any[]) {
                methodLogic(...args);
                return linkFunction; // return itself
            };
        });

        return linkFunction as T & ChainableMethods;
    };
}
