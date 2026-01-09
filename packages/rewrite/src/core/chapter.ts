import type { Text } from './text';
import { Collector, collector } from './collector';
import { BuildCharacter, InitLinkText } from './character';
import { BuildSys, Sys } from './Sys';
import { BuildInk } from './Ink';

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

    ink: ReturnType<typeof BuildInk>;

    system: ReturnType<typeof BuildSys>;
    label(name: string): void;
}

export function useChapter(name: string, source: Collector = collector) {
    const _cache = source.newChapter(name);

    if (!_cache) {
        throw new Error(`Chapter ${name} is blank, or already exists`);
    }

    const cache = _cache;

    const ChapterImpl: BasicChapter = {
        name: name,
        cache: cache,

        dump() {
            return { name, cache };
        },

        character: BuildCharacter(cache),

        ink: BuildInk(cache),

        system: BuildSys(cache),

        label(name: string) {
            cache.push({ type: 'label', args: { name } });
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
