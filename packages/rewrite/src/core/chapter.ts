import type { Text } from './text';
import { Collector, collector } from './collector';
import { BuildCharacter, InitLinkText } from './character';
import { BuildSys, LinkSys, Sys } from './Sys';

export type UnitLike = { type: string; args: Record<PropertyKey, unknown>; [key: string]: unknown };
export type ChapterUnit = Text | Sys | UnitLike;

/** */
export interface BasicChapter {
    name: string;
    cache: ChapterUnit[];

    dump(): { name: string | null; cache: ChapterUnit[] };

    /** @param name character name  @param quote show quote */
    character(name?: string | null, quote?: boolean): InitLinkText;
    character(quote: boolean): InitLinkText;
    character(): InitLinkText;

    system(): LinkSys;
    // ink(some: TemplateStringsArray, ...values: RewriteInk[]): LinkInk;
    // prompt(some: TemplateStringsArray, ...values: RewritePrompt[]): LinkPrompt;
    label(name: string): void;
}

export function useChapter(name: string, source: Collector = collector) {
    const _cache = source.newChapter(name);

    if (!_cache) {
        throw new Error(`Chapter ${name} is blank, or already exists`);
    }

    const ChapterImpl: BasicChapter = {
        name: name,
        cache: _cache,

        dump() {
            return { name: name, cache: _cache };
        },

        character: BuildCharacter(_cache),

        system: BuildSys(_cache),

        label(name: string) {
            _cache.push({ type: 'label', args: { name } });
        },

        ...ExtChapterImpl,
    };

    // Bind all own properties that are functions to the chapter instance
    Object.entries(ChapterImpl).forEach(([key, value]) => {
        if (typeof value === 'function') {
            (ChapterImpl as any)[key] = value.bind(ChapterImpl);
        }
    });

    return ChapterImpl;
}

const ExtChapterImpl: Record<string, (this: BasicChapter) => unknown> = {};

export function useChapterExtension(args: Record<string, (this: BasicChapter) => unknown>) {
    Object.assign(ExtChapterImpl, args);
}
