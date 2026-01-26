import { ImageUtils } from 'three';

/**
 * Plugin `hack/ImageUtils` is an official plugin for dummy Three behaviour.
 * This modified the performance & performance(~100x) during serialization.
 */

const origionMethod = ImageUtils.getDataURL;

ImageUtils.getDataURL = function (image, type = 'image/png', origion = false) {
    if (origion) return origionMethod(image, type);

    // hack
    if (image instanceof HTMLImageElement || image instanceof HTMLVideoElement) return image.src;

    return origionMethod(image);
};
