export type CameraIR = OrthographicCameraIR | PerspectiveCameraIR;

export interface OrthographicCameraIR {
    name: string;
    kind: 'orthographic';

    /**
     * 左边界坐标
     * @default -960
     */
    left: number;
    /**
     * 右边界坐标
     * @default 960
     */
    right: number;
    /**
     * 上边界坐标
     * @default 540
     */
    top: number;
    /**
     * 下边界坐标
     * @default -540
     */
    bottom: number;

    /**
     * 近裁剪面
     * @default 0.1
     */
    near: number;
    /**
     * 远裁剪面
     * @default 2000
     */
    far: number;

    /**
     * 缩放倍数
     * @default 1
     */
    zoom: number;
}

export interface PerspectiveCameraIR {
    name: string;
    kind: 'perspective';

    /**
     * 垂直视场角，单位为度 (degrees)
     * @default 45
     */
    fov: number;
    /**
     * 视锥体长宽比 (width / height)
     * @default 16 / 9
     */
    aspect: number;
    /**
     * 近裁剪面
     * @default 0.1
     */
    near: number;
    /**
     * 远裁剪面
     * @default 10000
     */
    far: number;

    /**
     * 变焦倍数
     * @default 1
     */
    zoom: number;
    /**
     * 焦距，用于景深效果 (Depth of Field)
     * @default 10
     */
    // focus: number;
    /**
     * 胶片尺寸 (mm)
     * @default 35
     */
    filmGauge: number;
    /**
     * 水平偏心量 (mm)
     * @default 0
     */
    filmOffset: number;
}

export class CameraRegistry {
    static pool = new Map<string, CameraIR>();

    static reg(name: string, camera: CameraIR) {
        if (name.length === 0) {
            throw new Error('Camera name cannot be empty');
        }
        if (this.pool.has(name)) {
            throw new Error(`Camera ${name} already registered`);
        }
        this.pool.set(name, camera);
    }

    static finish() {
        // call only once
        this.finish = () => {
            return this.pool;
        };

        // const fianlPool = new Map<string, CameraIR>();

        // this.pool.forEach((camera, name) => {
        //     const suf = cleanString(name);
        //     if (camera.kind === 'orthographic') {
        //         fianlPool.set(`co:${suf}`, camera);
        //     } else if (camera.kind === 'perspective') {
        //         fianlPool.set(`cp:${suf}`, camera);
        //     }
        // });

        // this.pool = fianlPool;

        return this.pool;
    }
}

// const cleanString = (str: string) => {
//     return str.replace(/^(co:|cp:)/, '');
// };
