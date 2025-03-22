import { isObject } from '@/lib/core/typeCheck';
import { ObjectLoader, Texture, Source, Object3D } from 'three';
import { shxTexturePool, TexturePool } from './ShxTexturePool';

//
// For internal hacks, dont care about @types/three
// Many internal arguments are not typed/exposed
//

interface SomeHackJSON {
    animations?;
    shapes?;
    geometries?;
    images?;
    textures?;
    materials?;
    object?;
    skeletons?;
}

class ShxObjectLoader extends ObjectLoader {
    async parseAsync(json: SomeHackJSON): Promise<Object3D> {
        const animations = this.parseAnimations(json.animations);

        // @ts-expect-error
        const shapes = this.parseShapes(json.shapes);

        // @ts-expect-error
        const geometries = this.parseGeometries(json.geometries, shapes);

        const images = await this.parseImagesAsync(json.images);

        //// modified-next-line
        //// add new async version of parseTextures
        const textures = await this.parseTexturesAsync(json.textures, images);
        const materials = this.parseMaterials(json.materials, textures);

        const object = this.parseObject(
            json.object,
            geometries,
            materials,
            textures,
            // @ts-expect-error
            animations
        );

        // @ts-expect-error
        const skeletons = this.parseSkeletons(json.skeletons, object);
        // @ts-expect-error
        this.bindSkeletons(object, skeletons);
        // @ts-expect-error
        this.bindLightTargets(object);

        return object;
    }

    async parseTexturesAsync(
        json: unknown,
        images: { [key: string]: Source }
    ): Promise<{ [key: string]: Texture }> {
        const textures = {};

        if (json !== undefined) {
            const defaultTextureData = [];
            const shxTextureData = [];
            const promises = [];

            // @ts-expect-error
            for (let i = 0, l = json.length; i < l; i++) {
                const data: Record<string, string> = json[i];

                if (data.image === undefined) {
                    console.warn(
                        'THREE.ObjectLoader: No "image" specified for',
                        data.uuid
                    );
                }

                if (images[data.image] === undefined) {
                    console.warn(
                        'THREE.ObjectLoader: Undefined image',
                        data.image
                    );
                }

                const source = images[data.image];
                const image = source.data;

                if (Array.isArray(image)) {
                    // CubeTexture
                    defaultTextureData.push(data);
                } else {
                    if (image && image.data) {
                        // DataTexture
                        defaultTextureData.push(data);
                    } else {
                        if (
                            isObject(data.userData) &&
                            data.userData.image !== undefined
                        ) {
                            // SHX SOLUTION
                            shxTextureData.push(data);
                        } else {
                            // normal Texture
                            defaultTextureData.push(data);
                        }
                    }
                }
            }

            // default
            Object.assign(
                textures,
                internalLoader.parseTextures(defaultTextureData, images)
            );

            // shx
            for (const data of shxTextureData) {
                promises.push(
                    shxTexturePool
                        .loadAsync(data.userData.url as string)
                        .then((texture) => {
                            textures[data.uuid] = texture;
                        })
                );
            }

            await Promise.all(promises);
        }

        return textures;
    }
}

const internalLoader = new ObjectLoader();

export const shxObjectLoader = new ShxObjectLoader();
window.loader = shxObjectLoader;
