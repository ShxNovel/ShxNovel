import { useVisual } from '../visual';

export function useStand(name: string) {
    return useVisual(name, 'stand');
}
