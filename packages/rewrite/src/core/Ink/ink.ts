export interface Ink {
    type: 'ink';
    content: RewriteInk[];
}

export type RewriteInk = {
    type: keyof RewriteInkType;
    args: Record<PropertyKey, unknown>;
};

type DefaultRewriteInkType = {
    [K in keyof InkMethod]: never;
};

export interface RewriteInkType extends DefaultRewriteInkType {}
