import { TextureIR, TextureRegistry } from './registry';

class defaultTexture implements TextureIR {
    constructor(name: string) {
        if (name.length === 0) {
            throw new Error('Texture name cannot be empty');
        }
        this.name = name;
    }

    name = 'any';

    variants = {};

    srgb = true;

    mipmap = false;
}

export type TextureHandler<T extends string> = {
    kind: 'texture';
    name: `tex_${T}`;
};

export function regTexture<T extends string>(name: T, f: (t: Omit<TextureIR, 'name'>) => void): TextureHandler<T> {
    const item = new defaultTexture(name);

    f(item);

    const Ex_name = `tex_${name}` as `tex_${T}`;

    item.name = Ex_name;

    TextureRegistry.reg(Ex_name, item);

    return { kind: 'texture', name: Ex_name };
}
