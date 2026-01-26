import type { SceneBox } from '../SceneBox';
import { GameBottomTool } from './GameBottomTool';
import type { GameDialogue } from './GameDialogue';
import { GameIcon } from './GameIcon';
import { GameSpeaker } from './GameSpeaker';

interface SlotItems {
    box: SceneBox | undefined;
    backlog: undefined;
    dialogue: GameDialogue | undefined;
    speaker: GameSpeaker | undefined;
    icon: GameIcon | undefined;
    toolbox: GameBottomTool | undefined;
}

class SlotConnection {
    items: SlotItems = {
        box: undefined,
        backlog: undefined,
        dialogue: undefined,
        speaker: undefined,
        icon: undefined,
        toolbox: undefined,
    };

    get unbindSize() {
        return Object.values(this.items).filter(Boolean).length;
    }

    init() {
        for (const key in this.items) {
            Reflect.set(this.items, key, undefined);
        }
    }

    set(name: keyof SlotItems, value: unknown) {
        Reflect.set(this.items, name, value);
        return this;
    }

    get<K extends keyof SlotItems>(name: K): SlotItems[K] {
        return Reflect.get(this.items, name) as SlotItems[K];
    }
}

export const boxConnection = new SlotConnection();
