import { collector } from './collector';
import { SysUnit } from './Sys';
import { TextUnit } from './Text';

export type UnitLike = { type: string; args: Record<PropertyKey, unknown>; [key: string]: unknown };
export type ChapterUnit = TextUnit | SysUnit | UnitLike;

export function useChapter(name: string) {
    const _cache = collector.newChapter(name);

    if (!_cache) {
        throw new Error(`Chapter ${name} is blank, or already exists`);
    }

    const cache = _cache;

    const ChapterImpl = {
        dump() {
            return { name, cache };
        },
    };

    return ChapterImpl;
}
