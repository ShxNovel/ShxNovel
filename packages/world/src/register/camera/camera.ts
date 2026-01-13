import { useVisual } from '../visual';

export function useCamera(name: string) {
    return useVisual(name, 'camera').nodes({});
}
