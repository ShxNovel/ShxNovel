import { assets, sceneBunch } from '@shxnovel/canoe/index.ts';
import { make } from '@shxnovel/canoe/items/stands/index.ts';
import { Scene } from 'three';

const systemScene = new Scene();

const texture = await assets.textures.build('sys_bg0');
const background = make(texture);

background.name = 'background';

systemScene.add(background);

sceneBunch.set('system', systemScene);
