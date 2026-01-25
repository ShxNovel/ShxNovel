export function solveList(registry: typeof import('@shxnovel/world').registry) {
    const result = {
        rt: {} as Record<string, any>,
        camera: {} as Record<string, any>,
        scene: {} as Record<string, any>,
        visual: {} as Record<string, any>,
    };

    registry.RTCtx.finish().forEach((item, name) => {
        result.rt[name] = item;
    });

    registry.CameraCtx.finish().forEach((item, name) => {
        result.camera[name] = item;
    });

    registry.SceneCtx.finish().forEach((item, name) => {
        result.scene[name] = item;
    });

    registry.visualCtx.finish().forEach((item, name) => {
        result.visual[name] = item;
    });

    return result;
}
