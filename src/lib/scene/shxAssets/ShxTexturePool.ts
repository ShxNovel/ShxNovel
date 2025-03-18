import { shxObjectLoader } from './shxObjectLoader';
import { Texture, TextureLoader, WebGLRenderer } from 'three';
import { isObject, isTexture } from '../../core/typeCheck';
import { MothTextureJSON } from 'types/MothTextureJSON';

/**
 * A texture cache.
 * For texture reuse, and texture dispose.
 *
 * used internally by {@link shxObjectLoader}
 */
export class TextureCache {
    cache: Map<string, Texture> = new Map();

    textureLoader = new TextureLoader();

    wrapTexture(texture: Texture, data: MothTextureJSON) {
        const filter = data.filter;
        if (filter && filter.useConfig) {
            texture.userData.filter_useConfig = true;
            if (filter.magFilter) texture.magFilter = filter.magFilter;
            if (filter.minFilter) texture.minFilter = filter.minFilter;
        }
        if (data.anisotropy) texture.anisotropy = data.anisotropy;
        // prettier-ignore
        if (data.generateMipmaps) texture.generateMipmaps = data.generateMipmaps;
        // prettier-ignore
        if (data.premultiplyAlpha) texture.premultiplyAlpha = data.premultiplyAlpha;
        if (data.filpY) texture.flipY = data.filpY;
        // prettier-ignore
        if (data.unpackAlignment) texture.unpackAlignment = data.unpackAlignment;
        if (data.colorSpace) texture.colorSpace = data.colorSpace;

        texture.needsUpdate = true;
    }

    async loadAsync(url: string) {
        if (this.cache.has(url)) {
            const texture = this.cache.get(url);
            return Promise.resolve(texture);
        }

        const href = new URL(url, window.location.origin + '/textures').href;

        try {
            const response = await fetch(href);
            if (!response.ok) {
                throw new Error(`no such file: ${href}`);
            }

            const data = (await response.json()) as MothTextureJSON;
            const texture = await this.textureLoader.loadAsync(data.image);
            this.wrapTexture(texture, data);

            this.cache.set(url, texture);
            return texture;
        } catch (error) {
            console.error(
                'There was a problem with the fetch operation:',
                error
            );
        }
    }

    /**
     * Dispose all texture, then clear the container.
     */
    clear() {
        this.cache.forEach((texture) => {
            texture.dispose();
        });
        this.cache.clear();
    }
}

export const shxTexturePool = new TextureCache();
