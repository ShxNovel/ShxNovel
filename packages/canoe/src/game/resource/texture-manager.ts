import * as THREE from 'three';
import { logger } from '../../logger';

export class TextureManager {
    static loader = new THREE.TextureLoader();

    static base = '/assets/texture';

    static pool = new Map<string, Promise<THREE.Texture>>();

    static ensure(key: string): void {
        if (this.pool.has(key)) {
            logger.debug(`Hit cache for ${key}`);
            return;
        }

        const src = `${this.base}/${key}`;

        const loadingTask = this.loader.loadAsync(src).catch((err) => {
            this.pool.delete(key);

            logger.error(`Failed to load ${key}:`, err);

            throw err;
        });

        this.pool.set(key, loadingTask);

        logger.debug(`loading cache for ${key}`);
    }
}
