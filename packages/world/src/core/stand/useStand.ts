import { useVisual } from '../visual';

export function useStand(name: string) {
    const visualName = `s:${name}`;
    return useVisual(visualName, 'stand');
}
