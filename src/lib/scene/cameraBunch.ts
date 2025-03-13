import {
    PerspectiveCamera,
    OrthographicCamera,
    PerspectiveCameraJSON,
    OrthographicCameraJSON,
    // PerspectiveCameraJSONObject as PCJO,
    // OrthographicCameraJSONObject as OCJO,
    ObjectLoader,
} from 'three';

export type TCamera = PerspectiveCamera | OrthographicCamera;
export type TCameraJSON = PerspectiveCameraJSON | OrthographicCameraJSON;

export type CameraBunchJSON = {
    mainName: string;
    content: Record<string, TCameraJSON>;
};

const loader = new ObjectLoader();
// window.objectLoader = loader;

export class CameraBunch extends Map<string, TCamera> {
    mainName: string;

    get mainCamera() {
        return this.get(this.mainName);
    }

    toJSON(): CameraBunchJSON {
        const content = {};
        const result = { mainName: this.mainName, content };

        this.forEach((value, key) => {
            content[key] = value.toJSON();
        });

        return result;
    }

    remake(data: CameraBunchJSON) {
        super.clear();

        const { mainName, content } = data;

        this.mainName = mainName;

        Object.entries(content).forEach(([key, value]) => {
            super.set(key, loader.parse(value) as TCamera);
        });
    }
}

export const cameraBunch = new CameraBunch();
cameraBunch.mainName = 'main';
window.cameraBunch = cameraBunch;

const width = document.documentElement.clientWidth;
const height = document.documentElement.clientHeight;

const camera = new OrthographicCamera(
    width / -2,
    width / 2,
    height / 2,
    height / -2,
    1,
    1024
);

cameraBunch.set('main', camera);
