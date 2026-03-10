const INFO_OPEN_CLASS = 'info-open';
const ARIA_VISIBLE = 'false';
const ARIA_HIDDEN = 'true';
const ESCAPE_KEY = 'Escape';

export function initInfoPanel() {
    const infoToggle = document.getElementById('infoToggle');
    const infoOverlay = document.getElementById('infoOverlay');
    const infoBackdrop = document.getElementById('infoBackdrop');
    const infoClose = document.getElementById('infoClose');
    const body = document.body;

    if (!infoToggle || !infoOverlay || !infoBackdrop || !infoClose) {
        return;
    }

    const openInfoPanel = () => {
        body.classList.add(INFO_OPEN_CLASS);
        infoOverlay.setAttribute('aria-hidden', ARIA_VISIBLE);
    };

    const closeInfoPanel = () => {
        body.classList.remove(INFO_OPEN_CLASS);
        infoOverlay.setAttribute('aria-hidden', ARIA_HIDDEN);
    };

    infoToggle.addEventListener('click', () => {
        if (body.classList.contains(INFO_OPEN_CLASS)) {
            closeInfoPanel();
            return;
        }

        openInfoPanel();
    });

    infoClose.addEventListener('click', closeInfoPanel);
    infoBackdrop.addEventListener('click', closeInfoPanel);

    window.addEventListener('keydown', (event) => {
        if (event.key === ESCAPE_KEY && body.classList.contains(INFO_OPEN_CLASS)) {
            closeInfoPanel();
        }
    });
}
