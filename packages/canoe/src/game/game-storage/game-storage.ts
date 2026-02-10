import { SaveData } from '../boot-resolver';

export class GameStorage {
    // @ts-ignore
    static async save(saveId: string, data: SaveData): Promise<void> {
        throw new Error('GameStorage.save() must be implemented by user');
    }

    // @ts-ignore
    static async load(saveId: string): Promise<SaveData> {
        throw new Error('GameStorage.load() must be implemented by user');
    }
}
