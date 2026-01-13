import { useVisual } from '..';

export function useCamera(name: string) {
    return useVisual(name, 'camera').nodes({});
}
