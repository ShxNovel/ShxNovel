import { TauriEvent } from '@tauri-apps/api/event';
import { getCurrentWindow } from '@tauri-apps/api/window';
import { eventController } from '../MListener';

type ConfirmBox = Element & { ask: (message: string, title?: string) => Promise<any> };

const appWebview = getCurrentWindow();
let comfirmBox: undefined | ConfirmBox;

let useConfirmBox = true;
export function initConfirmBox(ele: ConfirmBox) {
    comfirmBox = ele;
}

export function setConfirmBoxActiveStatus(ok = true) {
    useConfirmBox = ok;
}

export async function tryExitGame() {
    await appWebview.close();
}

const unlisten = await appWebview.listen(TauriEvent.WINDOW_CLOSE_REQUESTED, async () => {
    if (comfirmBox && useConfirmBox) {
        // lion bug
        const dialog = document.querySelector('vn-confirm-dialog') as any;

        if (!dialog) {
            console.error('no confirm dialog found');
            return;
        }

        let res = await dialog.ask('是否退出游戏?');
        if (res) await decideExitGame();
    } else {
        await decideExitGame();
    }
});

export async function decideExitGame() {
    unlisten();
    await eventController.emitAsync('exit');
    await appWebview.destroy();
}
