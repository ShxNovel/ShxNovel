import { gsap } from 'gsap';
import { renderScheduler } from './renderScheduler';

class RenderLoop {
    loopBlock = false;

    loop(t: number) {
        gsap.updateRoot(t / 1000);

        if (this.loopBlock) return;

        if (!renderScheduler.shouldRender()) return;

        renderScheduler.consume();

        // { todo Off-screen rendering }
        // { todo Render }
    }
}

export const renderLoop = new RenderLoop();
