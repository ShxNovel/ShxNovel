import { loadJson } from '../../utils/loadFile';
import { BootIntent } from '../game-launcher';
import { GameStorage } from '../game-storage';

export interface SaveData {
    id: string;
    timestamp: number;
    script: ScriptState;
    scene?: SceneSnapshot;
    runtime?: RuntimeSnapshot;
}

export interface ScriptState {
    irId: string;
    pc: number;
    flags: Record<string, any>;
}

export interface SceneSnapshot {
    // Scene-related snapshot data
    [key: string]: any;
}

export interface RuntimeSnapshot {
    // Runtime-related snapshot data
    [key: string]: any;
}

export interface BootContext {
    mode: 'new' | 'restore';

    script: ScriptState;
    scene?: SceneSnapshot;
    runtime?: RuntimeSnapshot;

    meta?: {
        saveId?: string;
        autoPlay?: boolean; // 读档后是否自动播放
        waitForInput?: boolean; // 读档后是否等待用户输入
        isDebug?: boolean; // Debug 模式（只恢复场景）
        isEditor?: boolean; // Editor 模式（只展示世界）
    };
}

class SaveManager {
    static async newGame(): Promise<SaveData> {
        const { entry } = await loadJson('/game/storyIR/config.json');

        return {
            id: 'latest',
            timestamp: Date.now(),
            script: {
                irId: entry,
                pc: 0,
                flags: {},
            },
        };
    }

    static async loadLatest(): Promise<SaveData> {
        const res = await GameStorage.load('latest');
        return res;
    }

    static async load(saveId: string): Promise<SaveData> {
        const res = await GameStorage.load(saveId);
        return res;
    }
}

export class BootResolver {
    static async resolve(intent: BootIntent): Promise<BootContext> {
        if (intent.type == 'new') {
            const save = await SaveManager.newGame();
            return this.createNewContext(save);
        } else if (intent.type == 'continue') {
            const save = await SaveManager.loadLatest();
            return this.fromSave(save);
        } else if (intent.type == 'load') {
            const save = await SaveManager.load(intent.saveId);
            return this.fromSave(save);
        } else if (intent.type == 'debug') {
            return this.fromChapter(intent.chapterId);
        } else {
            throw new Error(`Unknown intent type: ${(intent as any).type}`);
        }
    }

    private static createNewContext(save: SaveData): BootContext {
        return {
            mode: 'new',
            script: save.script,
        };
    }

    private static fromSave(save: SaveData): BootContext {
        return {
            mode: 'restore',
            script: save.script,
            scene: save.scene,
            runtime: save.runtime,
            meta: {
                saveId: save.id,
            },
        };
    }

    private static fromChapter(chapterId: string): BootContext {
        // TODO: Parse chapter ID to get IR ID and PC
        return {
            mode: 'new',
            script: {
                irId: chapterId,
                pc: 0,
                flags: {},
            },
        };
    }
}
