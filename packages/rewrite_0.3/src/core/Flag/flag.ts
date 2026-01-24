import { rewriteContext } from '../RewriteContext';

export interface FlagUnit {
    type: 'flag';
    name: string;
}

export function flag(name: string, content?: () => boolean | void) {
    rewriteContext.push({
        type: 'flag',
        name: `b:${name}`, // begin
    } satisfies FlagUnit);

    // if no content, just push a begin flag unit
    if (content == undefined) {
        return;
    }

    const res = content();

    if (res == true) {
        return;
    }

    rewriteContext.push({
        type: 'flag',
        name: `e:${name}`, // end
    } satisfies FlagUnit);
}
