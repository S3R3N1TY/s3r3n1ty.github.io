import * as THREE from 'three';

export const SCENE_CONFIG = {
    backgroundColor: 0x171717
};

export const CAMERA_CONFIG = {
    fov: 50,
    near: 0.1,
    far: 100,
    position: { x: 0, y: -0.15, z: 4.2 },
    lookAt: { x: 0, y: -0.15, z: 0 }
};

export const RENDERER_CONFIG = {
    antialias: true,
    outputColorSpace: THREE.SRGBColorSpace,
    toneMapping: THREE.ReinhardToneMapping,
    toneMappingExposure: 1.0,
    clearColor: 0x171717,
    clearAlpha: 1
};

export const BLOOM_CONFIG = {
    strength: 0.9,
    radius: 0.25,
    threshold: 0.35
};

export const VIGNETTE_CONFIG = {
    width: 20,
    height: 12,
    color: 0x1c1c1c,
    alpha: 0.22,
    smoothStart: 0.2,
    smoothEnd: 1.1,
    zPosition: -2
};

export const WALL_GLOW_CONFIG = {
    width: 8.5,
    height: 4.5,
    color: 0xff8c1a,
    intensity: 0.32,
    xScale: 0.95,
    yScale: 1.25,
    exponent: 2.4,
    position: { x: 0, y: -0.15, z: -1.2 },
    minIntensity: 0.16,
    intensityScale: 0.18
};

export const TEXT_CONFIG = {
    value: 'S3R3N1TY',
    fontPath: './assets/kosan.typeface.json',
    fontSize: 0.8,
    letterSpacing: 0.08,
    baseColor: new THREE.Color(0xffb347),
    baseY: -0.15,
    initialColorScale: 1.2,
    opacity: {
        min: 0.6,
        scale: 0.4
    },
    brightness: {
        min: 0.3,
        scale: 0.95
    }
};

export const FLICKER_CONFIG = {
    startIntensity: 1.0,
    startTarget: 1.0,
    initialEventWindow: 0.3,
    microFreq1: { base: 30, range: 12 },
    microFreq2: { base: 12, range: 10 },
    microAmp1: 0.01,
    microAmp2: 0.008,
    wobbleFreq1: { base: 1.0, range: 2.0 },
    wobbleFreq2: { base: 0.8, range: 1.5 },
    wobbleAmp1: 0.015,
    wobbleAmp2: 0.01,
    smoothing: 0.18,
    events: {
        steady: {
            chance: 0.72,
            targetMin: 1.0,
            targetRange: 0,
            delayMin: 0.08,
            delayRange: 0.25
        },
        mildDip: {
            chance: 0.94,
            targetMin: 0.88,
            targetRange: 0.08,
            delayMin: 0.03,
            delayRange: 0.08
        },
        deepDip: {
            targetMin: 0.72,
            targetRange: 0.08,
            delayMin: 0.02,
            delayRange: 0.05
        }
    }
};
