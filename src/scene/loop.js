export function createSceneRuntime({
    camera,
    renderer,
    composer,
    clock,
    onFrame
}) {
    let animationFrameId = null;

    const renderFrame = () => {
        const time = clock.getElapsedTime();

        onFrame(time);
        composer.render();

        animationFrameId = window.requestAnimationFrame(renderFrame);
    };

    const start = () => {
        if (animationFrameId !== null) {
            return;
        }

        renderFrame();
    };

    const stop = () => {
        if (animationFrameId === null) {
            return;
        }

        window.cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
    };

    const handleResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize(window.innerWidth, window.innerHeight);
        composer.setSize(window.innerWidth, window.innerHeight);
    };

    return {
        start,
        stop,
        handleResize
    };
}
