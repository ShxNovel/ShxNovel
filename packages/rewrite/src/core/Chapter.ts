import { TextUnit, character } from './text';
import { AnimateUnit, visual, timelabel } from './animate';
import { SystemUnit, system } from './system';
import { BranchUnit, branch } from './branch';
import { ChoiceUnit, choice } from './choice';
import { JumpUnit, jump } from './jump';
import { FlagUnit, flag } from './flag';
import { Directive, directive } from './directive';
import { rewriteContext } from './RewriteContext';

// export type UnitLike = { type: string; args: Record<PropertyKey, unknown>; [key: string]: unknown };
export type UnitLike = never;

// prettier-ignore

/**
 * The unit waiting for lowering.
 */
export type FlatNode =
    | TextUnit | AnimateUnit | SystemUnit   /* SceneBlock */
    | BranchUnit | ChoiceUnit | JumpUnit | FlagUnit    /* ControlBlock */
    | UnitLike   /* unknown */
    ;

/**
 * The unit with directive support.
 * {@link Directive} will not appear in the final output.
 */
export type ChapterUnit = FlatNode | Directive;

export function useChapter(name: string) {
    // chapter ctx
    const cache = rewriteContext.newChapter(name);

    // prettier-ignore
    // maybe use builder
    const ChapterImpl = {
        dump() {
            return { name, cache };
        },

        /* Text */
        character,

        /* Animate */
        visual, timelabel,

        /* System */
        system,

        /* Control */
        branch, choice, jump, flag,

        /* Directive */
        directive,
    };

    return ChapterImpl;
}
