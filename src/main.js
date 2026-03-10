import * as THREE from 'three';
import { WALL_GLOW_CONFIG } from './config/constants.js';
import { createComposer, createVignetteMesh, createWallGlowMesh } from './scene/effects.js';
import { createSceneRuntime } from './scene/loop.js';
import { createNeonText } from './scene/neonText.js';
import { createCamera, createRenderer, createScene } from './scene/setup.js';
import { initInfoPanel } from './ui/infoPanel.js';

console.log('NEON STATIC VERSION LOADED');

initInfoPanel();

const scene = createScene();
const camera = createCamera();
const renderer = createRenderer();
const composer = createComposer(renderer, scene, camera);
const clock = new THREE.Clock();

const { mesh: vignetteMesh } = createVignetteMesh();
scene.add(vignetteMesh);

const { mesh: wallGlowMesh, material: wallGlowMaterial } = createWallGlowMesh();
scene.add(wallGlowMesh);

let neonText;

const runtime = createSceneRuntime({
    camera,
    renderer,
    composer,
    clock,
    onFrame: (time) => {
        if (!neonText) {
            return;
        }

        const { avgFlicker } = neonText.update(time);
        wallGlowMaterial.uniforms.uIntensity.value =
            WALL_GLOW_CONFIG.minIntensity + (avgFlicker * WALL_GLOW_CONFIG.intensityScale);
    }
});

window.addEventListener('resize', runtime.handleResize);

async function initScene() {
    try {
        neonText = await createNeonText(scene);
        runtime.start();
    } catch (error) {
        console.error('FONT LOAD FAILED', error);
    }
}

initScene();
