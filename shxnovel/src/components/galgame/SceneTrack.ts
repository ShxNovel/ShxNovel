import gsap from 'gsap';
import { LitElement, ReactiveController } from 'lit';
import { boxConnection } from './game/connection';

export interface ComponentsJSON {
    icon?: object;
    speaker?: object;
}

export class SceneTrack implements ReactiveController {
    host: LitElement;

    componentSnap: ComponentsJSON = {};
    endTime: number | undefined = undefined;
    timeline: gsap.core.Timeline | null = null;

    get isRunning() {
        return this.timeline ? this.timeline.totalProgress() !== 1 : false;
    }

    constructor(host: LitElement) {
        (this.host = host).addController(this);
    }

    hostConnected() {
        const interval = setInterval(() => {
            this.waitComponents(interval);
        }, 100);
    }

    async waitComponents(interval: number | NodeJS.Timeout) {
        if (boxConnection.unbindSize) return;

        clearInterval(interval);

        this.initSelf();
    }

    hook_nextScene = () => {};
    hook_tryNextScene = () => {};
    hook_replayScene = () => {};
    hook_pointSave = () => {};

    initSelf() {
        this.host.addEventListener('try-next-scene', this.hook_tryNextScene);
        this.host.addEventListener('next-scene', this.hook_nextScene);
        this.host.addEventListener('replay-scene', this.hook_replayScene);
        this.host.addEventListener('point-save', this.hook_pointSave);

        // const content = await this.loadingPromise;
        // this.playScene(content); // no need await
    }

    hostDisconnected() {
        this.host.removeEventListener('try-next-scene', this.hook_tryNextScene);
        this.host.removeEventListener('next-scene', this.hook_nextScene);
        this.host.removeEventListener('replay-scene', this.hook_replayScene);
        this.host.removeEventListener('point-save', this.hook_pointSave);
    }

    /** clean old timeline content, re-init the status */
    cleanContent() {
        this.endTime = undefined;
        if (this.timeline) {
            this.timeline.progress(1);
            this.timeline.kill();
            this.timeline = null;
        }
    }

    /** */
    replayScene(content: object) {
        this.componentsRestore(this.componentSnap);
        return this.playScene(content, true);
    }

    /** */
    playScene(content: object, replay = false) {
        if (replay == false) this.componentSnap = this.componentsDump();
        this.cleanContent();

        const timeline = gsap.timeline({ paused: true });

        timeline.call(() => {
            this.endTime = performance.now();
            console.log('track.running = false;');
        });

        timeline.play();

        this.timeline = timeline;
        return timeline;
    }

    /** */
    componentsDump(): ComponentsJSON {
        return {};
    }

    /** */
    componentsRestore(contents: ComponentsJSON) {}
}
