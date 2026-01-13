import { useVisual } from '..';

/**
 *
 * @param name the stand name can be used in story - \@shxnovel/rewrite
 * @param rig
 */
export function useStand(name: string) {
    return useVisual(name, 'stand');
}
