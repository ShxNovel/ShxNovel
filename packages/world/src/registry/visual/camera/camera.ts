import { useVisual } from '../useVisual';

export function useCamera(name: string) {
    return useVisual(name, 'camera').nodes({});
}
