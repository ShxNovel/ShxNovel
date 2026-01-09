import { ChapterUnit } from '../chapter';

export function buildtl(cache: ChapterUnit[]) {
    return (name: string) => {
        const args = { name };

        cache.push({ type: 'ink', content: [{ type: 'tl', args }] });
    };
}
