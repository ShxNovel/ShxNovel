// import { generator } from '../../utils/splitmix32';
// import { rewriteContext } from '../RewriteContext';
// import { flag } from '../flag';
// import { jump } from '../jump';
// import { GameData } from '../../types';

interface ChoiceArgs {}

export interface ChoiceUnit {
    type: 'choice';
    choice: ChoiceArgs;
    /* end target, not in targets */
    ENDFLAG: string;
    targets: {
        [result: string]: string;
    };
}

// @ts-ignore
export function choice(args: any) {}
