import type { shxObjectLoader } from './ShxObjectLoader';
import type { MothTextureJSON } from 'types/MothTextureJSON';

import { Texture, TextureLoader, WebGLRenderer } from 'three';
import { isObject, isTexture } from '../../core/typeCheck';

/**
 * A texture cache.
 * For texture reuse, and texture dispose.
 *
 * used internally by {@link shxObjectLoader}
 */
export class TexturePool {
    private cache: Map<string, Texture> = new Map();

    private textureLoader = new TextureLoader();

    useTexture(texture: Texture) {
        texture.userData.time = Date.now();
    }

    wrapTexture(texture: Texture, data: MothTextureJSON) {
        // lets make some three.js falvor ...

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

    /**
     * fetch a texture from a url. \
     * Causes side effect {@link useTexture}
     */
    async loadAsync(url: string) {
        if (this.cache.has(url)) {
            const texture = this.cache.get(url);

            this.useTexture(texture);
            return Promise.resolve(texture);
        }

        // E.G.  from http://localhost/:url
        // url = /textures/texture.json
        const href = new URL(url, window.location.origin).href;

        try {
            const response = await fetch(href, { cache: 'no-store' });
            if (!response.ok) {
                throw new Error(`no such file: ${href}`);
            }

            const data = (await response.json()) as MothTextureJSON;

            // E.G.  from http://localhost/textures/texture.json
            // url = ../images/image.png
            const imgHref = new URL(data.image, href).href;

            const texture = await this.textureLoader.loadAsync(imgHref);
            this.wrapTexture(texture, data);

            this.cache.set(url, texture);
            this.useTexture(texture);
            return texture;
        } catch (error) {
            console.error(
                'There was a problem with the fetch operation:',
                error
            );
        }
    }

    evict() {}

    forceDispose() {
        this.cache.forEach((texture) => {
            texture.dispose();
        });
    }
}

export const shxTexturePool = new TexturePool();
