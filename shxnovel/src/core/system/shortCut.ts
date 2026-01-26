import { getCurrentWindow } from '@tauri-apps/api/window';

const appWebview = getCurrentWindow();

document.addEventListener('keydown', async function (event) {
    if (event.key === 'F11') {
        event.preventDefault();
        let isF = await appWebview.isFullscreen();
        await appWebview.setFullscreen(!isF);
    } else if (event.key === 'Escape') {
        await getCurrentWindow().setSkipTaskbar(false);
        await getCurrentWindow().minimize();
    }
});
