import type { TextMethod } from './character';

export interface Text {
    type: 'text';
    name: string | null;
    quote: boolean;
    content: RewriteText[];
}

export type RewriteText =
    | string
    | {
          type: keyof RewriteTextType;
          args: Record<PropertyKey, unknown>;
      };

type DefaultRewriteTextType = {
    [K in keyof TextMethod]: never;
};

export interface RewriteTextType extends DefaultRewriteTextType {
    pause: never;
    fast: never;
    until: never;
}

export function until(str: string | null = null): RewriteText {
    return { type: 'until', args: { str } };
}
