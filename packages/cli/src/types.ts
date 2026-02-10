import {
    useChapter as _useChapter,
    system as _system,
    character as _character,
    branch as _branch,
    choice as _choice,
    jump as _jump,
    flag as _flag,
    directive as _directive,

    //
    scene as _scene,
    visual as _visual,
    timelabel as _timelabel,
} from '@shxnovel/rewrite';

declare global {
    const useChapter: typeof _useChapter;
    /* Text */
    const character: typeof _character;

    /* Animate */
    const visual: typeof _visual;
    const timelabel: typeof _timelabel;

    /* System */
    const system: typeof _system;

    /* Control */
    const branch: typeof _branch;
    const choice: typeof _choice;
    const jump: typeof _jump;
    const flag: typeof _flag;

    /* Directive */
    const directive: typeof _directive;

    // @todo
    // rt
    // camera
    const scene: typeof _scene;
}

import {
    regTexture as _regTexture,
    regVisual as _regVisual,
    regCamera as _regCamera,
    regRT as _regRT,
    regScene as _regScene,
    regPipeline as _regPipeline,
} from '@shxnovel/world';
declare global {
    const regTexture: typeof _regTexture;
    const regVisual: typeof _regVisual;
    const regCamera: typeof _regCamera;
    const regRT: typeof _regRT;
    const regScene: typeof _regScene;
    const regPipeline: typeof _regPipeline;
}
