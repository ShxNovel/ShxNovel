import { ChapterUnit } from '../chapter';

export function buildtp(cache: ChapterUnit[]) {
    return (name: string) => {
        const args = { name };

        cache.push({ type: 'tp', args });
    };
}
