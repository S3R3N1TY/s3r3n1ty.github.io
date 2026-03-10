import * as THREE from 'three';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { FLICKER_CONFIG, TEXT_CONFIG } from '../config/constants.js';

function randomInRange(base, range) {
    return base + (Math.random() * range);
}

function createLetterFlickerState(index) {
    return {
        flickerIntensity: FLICKER_CONFIG.startIntensity,
        targetFlicker: FLICKER_CONFIG.startTarget,
        nextFlickerEvent: Math.random() * FLICKER_CONFIG.initialEventWindow,
        microFreq1: randomInRange(FLICKER_CONFIG.microFreq1.base, FLICKER_CONFIG.microFreq1.range),
        microFreq2: randomInRange(FLICKER_CONFIG.microFreq2.base, FLICKER_CONFIG.microFreq2.range),
        microPhase1: Math.random() * Math.PI * 2,
        microPhase2: Math.random() * Math.PI * 2,
        wobbleFreq1: randomInRange(FLICKER_CONFIG.wobbleFreq1.base, FLICKER_CONFIG.wobbleFreq1.range),
        wobbleFreq2: randomInRange(FLICKER_CONFIG.wobbleFreq2.base, FLICKER_CONFIG.wobbleFreq2.range),
        wobblePhase1: Math.random() * Math.PI * 2,
        wobblePhase2: Math.random() * Math.PI * 2,
        index
    };
}

function updateLetterFlicker(state, time) {
    const microShimmer =
        1.0 +
        Math.sin(time * state.microFreq1 + state.microPhase1) * FLICKER_CONFIG.microAmp1 +
        Math.sin(time * state.microFreq2 + state.microPhase2) * FLICKER_CONFIG.microAmp2;

    const softWobble =
        1.0 +
        Math.sin(time * state.wobbleFreq1 + state.wobblePhase1) * FLICKER_CONFIG.wobbleAmp1 +
        Math.sin(time * state.wobbleFreq2 + state.wobblePhase2) * FLICKER_CONFIG.wobbleAmp2;

    if (time > state.nextFlickerEvent) {
        const randomEvent = Math.random();
        const { steady, mildDip, deepDip } = FLICKER_CONFIG.events;

        if (randomEvent < steady.chance) {
            state.targetFlicker = randomInRange(steady.targetMin, steady.targetRange);
            state.nextFlickerEvent = time + randomInRange(steady.delayMin, steady.delayRange);
        } else if (randomEvent < mildDip.chance) {
            state.targetFlicker = randomInRange(mildDip.targetMin, mildDip.targetRange);
            state.nextFlickerEvent = time + randomInRange(mildDip.delayMin, mildDip.delayRange);
        } else {
            state.targetFlicker = randomInRange(deepDip.targetMin, deepDip.targetRange);
            state.nextFlickerEvent = time + randomInRange(deepDip.delayMin, deepDip.delayRange);
        }
    }

    state.flickerIntensity += (state.targetFlicker - state.flickerIntensity) * FLICKER_CONFIG.smoothing;

    return microShimmer * softWobble * state.flickerIntensity;
}

export async function createNeonText(scene) {
    const loader = new FontLoader();
    const font = await loader.loadAsync(TEXT_CONFIG.fontPath);

    const textGroup = new THREE.Group();
    scene.add(textGroup);

    const letterMeshes = [];
    const tempData = [];
    let cursorX = 0;

    for (let index = 0; index < TEXT_CONFIG.value.length; index += 1) {
        const char = TEXT_CONFIG.value[index];
        const shapes = font.generateShapes(char, TEXT_CONFIG.fontSize);
        const geometry = new THREE.ShapeGeometry(shapes);

        geometry.computeBoundingBox();

        const bbox = geometry.boundingBox;
        const width = bbox ? (bbox.max.x - bbox.min.x) : 0;
        const height = bbox ? (bbox.max.y - bbox.min.y) : 0;

        if (bbox) {
            geometry.translate(-(bbox.min.x), -(bbox.min.y + (height / 2)), 0);
        }

        tempData.push({
            geometry,
            width,
            x: cursorX
        });

        cursorX += width + TEXT_CONFIG.letterSpacing;
    }

    const totalWidth = cursorX - TEXT_CONFIG.letterSpacing;

    for (let index = 0; index < tempData.length; index += 1) {
        const data = tempData[index];

        const material = new THREE.MeshBasicMaterial({
            color: TEXT_CONFIG.baseColor.clone().multiplyScalar(TEXT_CONFIG.initialColorScale),
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 1.0
        });

        const mesh = new THREE.Mesh(data.geometry, material);
        mesh.position.x = data.x - (totalWidth / 2);
        mesh.position.y = TEXT_CONFIG.baseY;

        const flickerState = createLetterFlickerState(index);

        letterMeshes.push({
            mesh,
            material,
            flickerState
        });

        textGroup.add(mesh);
    }

    const reusableColor = new THREE.Color();

    return {
        update(time) {
            let flickerSum = 0;

            for (const letter of letterMeshes) {
                const flicker = updateLetterFlicker(letter.flickerState, time);
                flickerSum += flicker;

                const brightness = TEXT_CONFIG.brightness.min + (TEXT_CONFIG.brightness.scale * flicker);
                letter.material.color.copy(reusableColor.copy(TEXT_CONFIG.baseColor).multiplyScalar(brightness));
                letter.material.opacity = TEXT_CONFIG.opacity.min + (TEXT_CONFIG.opacity.scale * flicker);
            }

            const avgFlicker = letterMeshes.length > 0 ? (flickerSum / letterMeshes.length) : 0;
            return { avgFlicker };
        }
    };
}
