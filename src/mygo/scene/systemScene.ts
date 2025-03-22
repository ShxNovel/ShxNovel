import { actions, addAction, Assets, sceneBunch } from '@/lib/scene';
import { make } from '@/lib/scene/ShxObjectTools/ShxObjectTools';
import { Scene } from 'three';

const texture = await Assets.textures.loadAsync('/textures/img1.json');

const background = make(texture);
background.name = 'background';

const systemScene = new Scene();
systemScene.add(background);

sceneBunch.set('system', systemScene);
