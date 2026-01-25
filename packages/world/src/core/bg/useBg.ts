import { useVisual } from '../visual';

export function useBg(name: string) {
    const visualName = `b:${name}`;
    return useVisual(visualName, 'bg');
}
