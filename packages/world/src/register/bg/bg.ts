import { useVisual } from '../visual';

export function useBg(name: string) {
    return useVisual(name, 'bg');
}
