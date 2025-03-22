import { Scene, SceneJSON } from 'three';
import { shxObjectLoader } from './ShxAssets/ShxObjectLoader';

export type SceneBunchJSON = {
    mainName: string;
    content: Record<string, SceneJSON>;
};

export class SceneBunch extends Map<string, Scene> {
    mainName: string;

    get mainScene() {
        return this.get(this.mainName);
    }

    toJSON(): SceneBunchJSON {
        const content = {};
        const result = { mainName: this.mainName, content };

        this.forEach((value, key) => {
            content[key] = value.toJSON();
        });

        return result;
    }

    remake(data: SceneBunchJSON) {
        super.clear();

        const { mainName, content } = data;

        this.mainName = mainName;

        Object.entries(content).forEach(([key, value]) => {
            super.set(key, shxObjectLoader.parse(value) as Scene);
        });
    }
}

export const sceneBunch = new SceneBunch();
sceneBunch.mainName = 'main';
window.sceneBunch = sceneBunch;

const scene = new Scene();
sceneBunch.set('main', scene);
