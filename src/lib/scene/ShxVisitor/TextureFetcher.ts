import { isObject, isTexture } from '@/lib/core/typeCheck';
import { ShxCollections } from '../Shx';
import { Texture } from 'three';

export class TextureFetcher {
    fetchTexture(
        item: unknown,
        seen = new WeakSet(),
        result: Texture[] = []
    ): Texture[] {
        /** check valid */
        if (!isObject(item)) return;

        /** duplicated */
        if (seen.has(item)) return;
        seen.add(item);

        /** SPJ */
        if (isTexture(item)) {
            result.push(item);
            return result;
        }

        /** solve child */
        if (Array.isArray(item.children)) {
            for (const child of item.children) {
                this.fetchTexture(child, seen, result);
            }
        }

        /** solve self */

        // if shx specialized
        if (
            isObject(item.userData) &&
            typeof item.userData.type === 'string' &&
            item.userData.type in ShxCollections
        ) {
            ShxCollections[item.userData.type]?.fetchTexture(item, result);
            return result;
        }

        /**
         * else if THREE item
         * @todo
         */
        const type = item.type;

        if (typeof type !== 'string') return result;

        switch (type) {
            // case 'Mesh':
            //     break;

            default:
                for (const attr in item) {
                    if (Object.prototype.hasOwnProperty.call(item, attr)) {
                        const element = item[attr];
                        this.fetchTexture(element, seen, result);
                    }
                }
                break;
        }

        return result;
    }
}

export const textureFetcher = new TextureFetcher();
