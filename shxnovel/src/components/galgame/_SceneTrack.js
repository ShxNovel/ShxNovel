import * as THREE from 'three';
import { createTimeline } from '@juliangarnierorg/anime-beta';
import { LitElement, css, html, nothing } from 'lit';

import * as nuiBase from '../../lib/nuiBase.js';
import {
    nuiConfig,
    nuiCache,
    resetCache,
    stroyBus,
} from '../../lib/nuiData.js';
import {
    scene,
    camera,
    renderer,
    textureCache,
    ShxObject,
    rendSomeFrames,
} from '../../lib/nuiScene.js';

import { cmdHandler } from './SceneCommand.js';
import * as sTrack from './command/controller.js';

import { visitedScene } from '../../mygo/data/visitedScene.js';

/**
 * @typedef LastBeginPoint
 *
 *  @property {string} chapterName
 *  @property {string} chunkIndex
 *  @property {number} talkIndex
 *
 */

/**
 * When constructed, the SceneDriver will automatically call {@link pumpUntilNextScene}.
 *
 * This Track should record previous status for {@link replay}
 */
export class SceneTrack {
    hook_nextScene = this._unbind_hook_nextScene.bind(this);
    hook_tryNextScene = this._unbind_hook_tryNextScene.bind(this);
    hook_pointSave = this._unbind_hook_pointSave.bind(this);
    hook_replayScene = this._unbind_hook_replayScene.bind(this);

    /**
     * @param {import('./sceneBox.js').SceneBox} host
     */
    constructor(host) {
        (this.host = host).addController(this);

        this.doingAtomWork = false;

        this.running = false;
        this.endTime = 0;

        // 0 for no-text, 1 for talk, 2 for aside
        this.textType = 0;

        this.loading = false;
        this.skipping = false;
        this.loadingPromise = Promise.resolve([]);

        this.pumpUntilNextScene();

        /** @type {LastBeginPoint} */
        this.lastBegin = undefined;
        this.lastScene = undefined;

        /**
         * Object from {@link componentsDump}
         * for {@link componentsRestore}
         * @type {Object | undefined}
         */
        this.componentSnap = undefined;

        /** @type {object.<string, THREE.Texture>} */
        this.textureSnap = {};

        this.timeline = createTimeline({
            defaults: { duration: 750 },
        }).complete();
    }

    get isRunning() {
        return this.running;
    }

    get isLoading() {
        return this.loading;
    }

    /**
     * Normal dump for components status
     */
    componentsDump() {
        const o1 = this.host.speaker.dump();
        const o2 = this.host.icon.dump();
        return {
            ...o1,
            ...o2,
        };
    }

    componentsRestore(content) {
        this.host.speaker.restore(content);
        this.host.icon.restore(content);
    }

    /**
     * A fix for poor texture behaviour
     * Called by {@link replayScene}
     * User can modify {@link textureSnap} to inject this logic
     */
    textureFix() {
        for (const name in this.textureSnap) {
            /** @type {ShxObject} */
            const item = scene.get(name);
            const texture = this.textureSnap[name];

            /**
             * Equivalent way
             * ```js
             *  item.__instantCheck(true);
             *  item.material.uniforms.progress.value = 0;
             *  item.material.uniforms.texture1.value = texture;
             *  item.material.uniforms.texture2.value = texture;
             *  rendSomeFrames();
             * ```
             */
            item.playTextureTransitionAnime(texture, 500).complete();
        }
    }

    async replayScene() {
        if (this.loading) return;
        if (this.doingAtomWork) return;

        this.doingAtomWork = true;

        if (this.timeline) {
            if (!this.timeline.completed) this.timeline.complete();
            this.timeline.revert();
            this.timeline = null;
        }

        const content = await this.loadingPromise;

        this.componentsRestore(this.componentSnap);
        this.textureFix();
        rendSomeFrames();

        this.doingAtomWork = false;

        await this.playScene(content, true);
    }

    /**
     * If the previous scene is playing, instant finish it \
     * Then play the new scene. \
     *
     * @param {object[]} content
     */
    async playScene(content, replay = false) {
        console.log(content);

        const that = this;

        this.doingAtomWork = true;

        this.textType = 0;
        this.running = true;
        this.endTime = undefined;

        sTrack.clear();

        this.componentSnap = this.componentsDump();

        if (this.timeline) {
            if (!this.timeline.completed) this.timeline.complete();
            this.timeline = null;
        }

        const timeline = createTimeline({
            autoplay: false,
            defaults: { duration: 750 },
        });
        this.timeline = timeline;

        for (const unit of content) {
            const { type, id, item } = unit;

            if (id) {
                // add `id` to vised
                visitedScene.addPoint(id);
            }

            switch (type) {
                case 'b':
                    break;
                case 'e':
                    break;
                case 'a':
                    break;
                case 't':
                    this.tryGenerateDialogue(1);
                    this.host.dialogue.addText(item);
                    this.host.dialogue.addPlainText(item);
                    break;
                case 'c':
                    if (!item in cmdHandler) break;

                    const func = Reflect.get(cmdHandler, item);
                    await func({
                        track: that,
                        timeline: timeline,
                        unit: unit,
                        skip: that.skipping,
                        replay: replay,
                    });

                    break;
            }
        }

        timeline.call(() => {
            that.running = false;
            this.endTime = performance.now();
            console.log('track.running = false;');
        });

        if (this.host.dialogue.textCnt) {
            this.host.dialogue.play();
        }

        // timeline.init();
        timeline.play();

        this.doingAtomWork = false;

        return timeline;
    }

    /**
     * @param {number} type
     * @see textType
     */
    tryGenerateDialogue(type) {
        if (this.textType === 0) {
            this.textType = type;
            const addQuote = type === 1;
            this.host.dialogue.addQuote = addQuote;
            this.host.dialogue.createInstance();
        }
    }

    showAllText() {
        this.host.dialogue.instantEnd();
        sTrack.setTextSkipped();
        if (this.running) this.timeline?.play();
    }

    async endOfGame() {
        this.loading = true;
        nuiBase.changeUrl('./home.html');
    }

    pumpUntilNextScene() {
        if (this.loading) {
            return;
        }

        this.textureSnap = {};

        this.loading = true;
        this.loadingPromise = new Promise(async (resolve) => {
            const arr = [];

            if (stroyBus.nowTalk.type === 'e') {
                const hasNext = await stroyBus.nextTalkElement();
                if (!hasNext) {
                    await this.endOfGame();
                    resolve([]);
                    return;
                }
            }

            while (stroyBus.nowTalk.type !== 'e') {
                arr.push(stroyBus.nowTalk);
                const hasNext = await stroyBus.nextTalkElement();
                if (!hasNext) {
                    await this.endOfGame();
                    resolve([]);
                    return;
                }
            }

            if (stroyBus.nowTalk.type === 'e') {
                arr.push(stroyBus.nowTalk);
            }

            resolve(arr);
            this.loading = false;
        });
    }

    //
    // Event Part
    //

    /**
     * @todo
     * Play the next scene. \
     * If the scene is running, {@link showAllText}, \
     * otherwise, play the next scene. \
     */
    async _unbind_hook_nextScene(event) {
        if (this.host.dialogue.complete === false) {
            this.showAllText();
        } else {
            if (this.doingAtomWork) return;

            this.pumpUntilNextScene();
            const content = await this.loadingPromise;
            this.playScene(content);
        }
    }

    /**
     * Try to play next scene. \
     * Has no effect when the scene is running.
     *
     * @returns {boolean} `true` if next scene is played, `false` otherwise.
     */
    async _unbind_hook_tryNextScene(event) {
        if (this.running) return false;
        if (performance.now() - this.endTime < 1000) return false;
        await this._unbind_hook_nextScene(event);
        return true;
    }

    async _unbind_hook_replayScene(event) {
        await this.replayScene();
    }

    /**
     * @todo
     *
     * Auto-save should invoke this
     */
    _unbind_hook_pointSave(event) {
        nuiCache.chapter = stroyBus.chapterName;
        nuiCache.chunk = stroyBus.chunkName;
        nuiCache.index = stroyBus.talkIndex;

        const dumpData = scene.dump();
        nuiCache.sceneData = JSON.stringify(dumpData);
    }

    async waitComponents(interval) {
        if (
            this.host.dialogue === undefined ||
            this.host.speaker === undefined ||
            this.host.icon === undefined
        ) {
            return;
        }

        clearInterval(interval);

        const content = await this.loadingPromise;
        this.playScene(content); // no need await

        this.host.addEventListener('try-next-scene', this.hook_tryNextScene);
        this.host.addEventListener('next-scene', this.hook_nextScene);
        this.host.addEventListener('replay-scene', this.hook_replayScene);
        this.host.addEventListener('point-save', this.hook_pointSave);
    }

    hostConnected() {
        const interval = setInterval(() => {
            this.waitComponents(interval);
        }, 100);
    }

    hostDisconnected() {
        this.host.removeEventListener('try-next-scene', this.hook_tryNextScene);
        this.host.removeEventListener('next-scene', this.hook_nextScene);
        this.host.removeEventListener('replay-scene', this.hook_replayScene);
        this.host.removeEventListener('point-save', this.hook_pointSave);
    }
}
