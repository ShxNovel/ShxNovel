import { Cache, ImageLoader, ImageBitmapLoader, FileLoader } from 'three';

/**
 * Make sure before any THREE operation.
 * Only used by
 * {@link ImageLoader} {@link ImageBitmapLoader}
 * {@link FileLoader}
 *
 */

Cache.enabled = true;
