import { Mesh, PlaneGeometry, Scene } from 'three';
import { renderController, sceneBunch } from '@shxnovel/canoe/index.ts';

// build off screen
const geometry = new PlaneGeometry(1920, 1080, 1, 1);

const mesh = new Mesh(geometry, renderController.currentEffect);
sceneBunch.get('offscreen')!.add(mesh);