import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import {
    BLOOM_CONFIG,
    VIGNETTE_CONFIG,
    WALL_GLOW_CONFIG
} from '../config/constants.js';

export function createComposer(renderer, scene, camera) {
    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));

    const bloomPass = new UnrealBloomPass(
        new THREE.Vector2(window.innerWidth, window.innerHeight),
        BLOOM_CONFIG.strength,
        BLOOM_CONFIG.radius,
        BLOOM_CONFIG.threshold
    );
    composer.addPass(bloomPass);

    return composer;
}

export function createVignetteMesh() {
    const geometry = new THREE.PlaneGeometry(VIGNETTE_CONFIG.width, VIGNETTE_CONFIG.height);
    const material = new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        uniforms: {
            uColor: { value: new THREE.Color(VIGNETTE_CONFIG.color) }
        },
        vertexShader: `
            varying vec2 vUv;
            void main() {
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            varying vec2 vUv;
            uniform vec3 uColor;

            void main() {
                vec2 uv = vUv * 2.0 - 1.0;
                float dist = length(uv);

                float alpha = 1.0 - smoothstep(${VIGNETTE_CONFIG.smoothStart}, ${VIGNETTE_CONFIG.smoothEnd}, dist);
                alpha *= ${VIGNETTE_CONFIG.alpha};

                gl_FragColor = vec4(uColor, alpha);
            }
        `
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.z = VIGNETTE_CONFIG.zPosition;

    return { mesh, material };
}

export function createWallGlowMesh() {
    const geometry = new THREE.PlaneGeometry(WALL_GLOW_CONFIG.width, WALL_GLOW_CONFIG.height);
    const material = new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: {
            uColor: { value: new THREE.Color(WALL_GLOW_CONFIG.color) },
            uIntensity: { value: WALL_GLOW_CONFIG.intensity }
        },
        vertexShader: `
            varying vec2 vUv;
            void main() {
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            varying vec2 vUv;
            uniform vec3 uColor;
            uniform float uIntensity;

            void main() {
                vec2 uv = vUv * 2.0 - 1.0;
                float dist = length(vec2(uv.x * ${WALL_GLOW_CONFIG.xScale}, uv.y * ${WALL_GLOW_CONFIG.yScale}));
                float glow = 1.0 - smoothstep(0.0, 1.0, dist);
                glow = pow(glow, ${WALL_GLOW_CONFIG.exponent});

                gl_FragColor = vec4(uColor * uIntensity, glow * uIntensity);
            }
        `
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(
        WALL_GLOW_CONFIG.position.x,
        WALL_GLOW_CONFIG.position.y,
        WALL_GLOW_CONFIG.position.z
    );

    return { mesh, material };
}
