import { OrthographicCamera } from 'three';
import { hookEvent, getMediaRotateSize, ResizeInfoType } from '../lib/core';
import {
    rendSomeFrames,
    initDom,
    cameraBunch,
    mainRenderer,
} from '../lib/scene';

initDom(document.querySelector('.innerBody'));

const _camera = cameraBunch.mainCamera as OrthographicCamera;
_camera.position.x = 0;
_camera.position.z = 500;

mainRenderer.setClearColor(0x1e2226, 1);
// mainRenderer.setClearColor(0xffffff, 1);

function resize(data: ResizeInfoType) {
    const mainCamera = cameraBunch.mainCamera as OrthographicCamera;

    console.log('xxx');

    const frustumSize = 1080;
    const { iwidth, iheight } = data;

    let w: number, h: number, fw: number, fh: number;
    if (iwidth >= iheight) {
        (w = iwidth), (h = iheight);
    } else {
        (w = iheight), (h = iwidth);
    }

    // remind user `devicePixelRatio`
    fw = w / window.devicePixelRatio;
    fh = h / window.devicePixelRatio;

    const aspect = fw / fh;
    const cw = frustumSize * aspect;
    const ch = frustumSize;

    mainCamera.right = cw / 2;
    mainCamera.left = cw / -2;
    mainCamera.top = ch / 2;
    mainCamera.bottom = ch / -2;

    mainCamera.updateProjectionMatrix();
    mainRenderer.setSize(w, h);
}

resize(getMediaRotateSize());
hookEvent('resize', (data: ResizeInfoType) => {
    resize(data);
    rendSomeFrames();
});
