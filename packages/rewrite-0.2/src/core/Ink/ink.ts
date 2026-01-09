import { ChapterUnit } from '../chapter';
import { buildbg } from './bg';
import { buildstand } from './stand';
import { buildtl } from './tl';

export interface Ink {
    type: 'ink';
    content: RewriteInk[];
}

export interface RewriteInk {
    type: keyof RewriteInkType;
    args?: Record<PropertyKey, unknown>;
}

export type RewriteInkType = InkInterface;

export interface InkInterface {
    bg: ReturnType<typeof buildbg>;
    stand: ReturnType<typeof buildstand>;
    tl: ReturnType<typeof buildtl>;
}

type InkMethodFactory = (cache: ChapterUnit[]) => any;

export const inkMethods: Record<keyof InkInterface, InkMethodFactory> = {
    bg: buildbg,
    stand: buildstand,
    tl: buildtl,
};

export function BuildInk(cache: ChapterUnit[]): InkInterface {
    const ink = {} as InkInterface;

    (Object.keys(inkMethods) as Array<keyof InkInterface>).forEach((key) => {
        ink[key] = inkMethods[key](cache);
    });

    return ink;
}
