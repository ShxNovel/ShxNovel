import { AnimateUnit, bg, stand, tl } from './Animate';
import { label, LabelUnit } from './Label';
import { system, SysUnit } from './Sys';
import { character, TextUnit } from './Text';
import { rewriteContext } from './RewriteContext';

export type UnitLike = { type: string; args: Record<PropertyKey, unknown>; [key: string]: unknown };
export type ChapterUnit = TextUnit | SysUnit | AnimateUnit | LabelUnit | UnitLike;

export function useChapter(name: string) {
    const _cache = rewriteContext.newChapter(name);

    if (!_cache) {
        throw new Error(`Chapter ${name} is blank, or already exists`);
    }

    const cache = _cache;

    const ChapterImpl = {
        dump() {
            return { name, cache };
        },

        // character
        character,

        // system
        system,

        // animate
        stand,
        bg,
        tl,

        // label
        label,
    };

    return ChapterImpl;
}
