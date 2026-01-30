// import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { MainRenderer } from '../renderer';

const MainComposer = new EffectComposer(MainRenderer);
MainComposer.setSize(1920, 1080);

const fixedWidth = 1920;
const fixedHeight = 1080;

const renderTarget = new THREE.WebGLRenderTarget(fixedWidth, fixedHeight);

const copyScene = new THREE.Scene();
// @ts-ignore
const copyCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1); // 永远铺满 [-1, 1] 空间

const planeGeometry = new THREE.PlaneGeometry(2, 2);
const planeMaterial = new THREE.MeshBasicMaterial({
    map: renderTarget.texture, // 将渲染结果作为纹理
    depthTest: false,
    depthWrite: false,
});
const copyMesh = new THREE.Mesh(planeGeometry, planeMaterial);
copyScene.add(copyMesh);
// @ts-ignore
const mainCamera = new THREE.PerspectiveCamera(60, fixedWidth / fixedHeight, 0.1, 1000);
