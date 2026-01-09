import { ChapterUnit } from '../chapter';
import { buildbg } from './bg';
import { buildstand } from './stand';
import { buildtp } from './tp';

export interface InkInterface {
    bg: ReturnType<typeof buildbg>;
    stand: ReturnType<typeof buildstand>;
    tp: ReturnType<typeof buildtp>;
}

type InkMethodFactory = (cache: ChapterUnit[]) => any;

export const inkMethods: Record<keyof InkInterface, InkMethodFactory> = {
    bg: buildbg,
    stand: buildstand,
    tp: buildtp,
};

export function BuildInk(cache: ChapterUnit[]): InkInterface {
    const ink = {} as InkInterface;

    (Object.keys(inkMethods) as Array<keyof InkInterface>).forEach((key) => {
        ink[key] = inkMethods[key](cache);
    });

    return ink;
}
