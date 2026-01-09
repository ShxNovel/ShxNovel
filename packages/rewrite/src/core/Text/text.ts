import { TextMethod } from './character';

export interface TextUnit {
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

interface RewriteTextType extends DefaultRewriteTextType {}
