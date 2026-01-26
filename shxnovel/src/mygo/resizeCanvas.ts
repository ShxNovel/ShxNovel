import { OrthographicCamera } from 'three';
import * as core from '@shxnovel/pages/index.ts';
import { rendSomeFrames, cameraBunch, mainRenderer } from '@shxnovel/canoe/index.ts';

export function initDom(el: HTMLElement) {
    if (el === undefined) el = document.body;
    el.appendChild(mainRenderer.domElement);
}

initDom(document.querySelector('.innerBody')!);

const _camera = cameraBunch.mainCamera as OrthographicCamera;
_camera.position.x = 0;
_camera.position.z = 500;

mainRenderer.setClearColor(0x1e2226, 1);
// mainRenderer.setClearColor(0xffffff, 1);

function resize(data: core.ResizeInfoType) {
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

resize(core.getMediaRotateSize());
core.hookEvent('resize', (data: core.ResizeInfoType) => {
    resize(data);
    rendSomeFrames();
});
