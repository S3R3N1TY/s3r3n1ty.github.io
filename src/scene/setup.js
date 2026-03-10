import * as THREE from 'three';
import {
    CAMERA_CONFIG,
    RENDERER_CONFIG,
    SCENE_CONFIG
} from '../config/constants.js';

export function createScene() {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(SCENE_CONFIG.backgroundColor);
    return scene;
}

export function createCamera() {
    const camera = new THREE.PerspectiveCamera(
        CAMERA_CONFIG.fov,
        window.innerWidth / window.innerHeight,
        CAMERA_CONFIG.near,
        CAMERA_CONFIG.far
    );

    camera.position.set(
        CAMERA_CONFIG.position.x,
        CAMERA_CONFIG.position.y,
        CAMERA_CONFIG.position.z
    );
    camera.lookAt(CAMERA_CONFIG.lookAt.x, CAMERA_CONFIG.lookAt.y, CAMERA_CONFIG.lookAt.z);

    return camera;
}

export function createRenderer() {
    const renderer = new THREE.WebGLRenderer({ antialias: RENDERER_CONFIG.antialias });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.outputColorSpace = RENDERER_CONFIG.outputColorSpace;
    renderer.toneMapping = RENDERER_CONFIG.toneMapping;
    renderer.toneMappingExposure = RENDERER_CONFIG.toneMappingExposure;
    renderer.setClearColor(RENDERER_CONFIG.clearColor, RENDERER_CONFIG.clearAlpha);
    document.body.appendChild(renderer.domElement);
    return renderer;
}
