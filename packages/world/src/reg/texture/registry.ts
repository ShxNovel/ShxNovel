import { TextureKey } from '../../types';

export type TextureIR = {
    /** 纹理名称 */
    name: string;
    /** 变体 */
    variants: TextureKey | Record<string, TextureKey>;
    srgb: boolean;
    mipmap: boolean;
};

export class TextureRegistry {
    static pool = new Map<string, TextureIR>();

    static reg(name: string, texture: TextureIR) {
        if (name.length === 0) {
            throw new Error('Texture name cannot be empty');
        }
        if (this.pool.has(name)) {
            throw new Error(`Texture ${name} already registered`);
        }
        this.pool.set(name, texture);
    }

    static finish() {
        return this.pool;
    }
}
