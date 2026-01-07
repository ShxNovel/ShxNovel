import type { Text } from './text';
import { Collector, collector } from './collector';
import { BuildCharacter, InitLinkText } from './character';

export type UnitLike = { type: string; args: Record<PropertyKey, unknown>; [key: string]: unknown };
// @ts-expect-error
export type ChapterUnit = Text | Ink | Prompt | UnitLike;

/** */
export interface BasicChapter {
    dump(): { name: string | null; cache: ChapterUnit[] };

    /** @param name character name  @param quote show quote */
    character(name?: string | null, quote?: boolean): InitLinkText;
    character(quote: boolean): InitLinkText;
    character(): InitLinkText;

    // ink(some: TemplateStringsArray, ...values: RewriteInk[]): LinkInk;
    // prompt(some: TemplateStringsArray, ...values: RewritePrompt[]): LinkPrompt;
    label(name: string): void;
}

export function useChapter(name: string, source: Collector = collector) {
    const _cache = source.newChapter(name);

    if (!_cache) {
        throw new Error(`Chapter ${name} is blank, or already exists`);
    }

    const cache = _cache;

    const ChapterImpl: BasicChapter = {
        dump() {
            return { name, cache };
        },

        character: BuildCharacter(cache),

        label: (name: string) => {
            cache.push({ type: 'label', args: { name } });
        },
    };

    return ChapterImpl;
}
