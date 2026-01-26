import { TauriEvent } from '@tauri-apps/api/event';
import { getCurrentWindow } from '@tauri-apps/api/window';

import { eventController } from './MListener';

const appWebview = getCurrentWindow();
let comfirmBox: any = null;
let useConfirmBox = true;

export function initConfirmBox(el: any) {
    comfirmBox = el;
}

export function setConfirmBoxActiveStatus(ok = true) {
    useConfirmBox = ok;
}

export async function tryExitGame() {
    await appWebview.close();
}

const unlisten = await appWebview.listen(TauriEvent.WINDOW_CLOSE_REQUESTED, async () => {
    if (comfirmBox && useConfirmBox) {
        await comfirmBox.ask();
    } else {
        await decideExitGame();
    }
});

export async function decideExitGame() {
    await eventController.emitAsync('exit');
    unlisten();
    await appWebview.destroy();
}
