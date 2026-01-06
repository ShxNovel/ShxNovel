import type { RewriteText, Text } from './text';
import { ChapterSystem, chapterSystem } from './chapterSystem';
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

    // lable(name: string): void;
}

export function useChapter(name: string, source: ChapterSystem = chapterSystem) {
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
    };

    return ChapterImpl;
}
