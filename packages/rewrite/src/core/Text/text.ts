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
          kind: keyof RewriteTextKind;
          args: Record<PropertyKey, any>;
      };

type DefaultRewriteTextKind = {
    [K in keyof TextMethod]: never;
};

interface RewriteTextKind extends DefaultRewriteTextKind {}
