import { Scene, SceneJSON, ObjectLoader } from 'three';

export type SceneBunchJSON = {
    mainName: string;
    content: Record<string, SceneJSON>;
};

const loader = new ObjectLoader();

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
            super.set(key, loader.parse(value) as Scene);
        });
    }
}

export const sceneBunch = new SceneBunch();
sceneBunch.mainName = 'main';

const scene = new Scene();
sceneBunch.set('main', scene);
