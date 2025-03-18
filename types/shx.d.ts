import * as THREE from 'three';
import { Timeline } from '@juliangarnierorg/anime-beta';
import { TextureCache } from '@/lib/scene/TextureCache';

export type AllShxItem = ShxObject | ShxScene;

/** */
export type ShxObjectUserData = Record<string, any> & {
    type?: 'shxObject';

    vertexShader?: string;
    fragmentShader?: string;

    /**
     * one-scene anime
     * no persistence
     */
    runningID?: number;
    timeline?: Timeline | string;

    /**
     * long-scenes anime
     * need persistence
     */
};

export interface ShxObject extends THREE.Mesh {
    material: THREE.ShaderMaterial & {
        userData: ShxObjectUserData;
    };
}

/** */
export type ShxSceneUserData = Record<string, any> & {
    type?: 'shxScene';

    textureCache?: TextureCache;
};

export interface ShxScene extends THREE.Scene {
    userData: ShxSceneUserData;
}
