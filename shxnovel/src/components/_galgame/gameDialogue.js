import { LitElement, css, html, nothing } from 'lit';
import Typewriter from 'typewriter-effect/dist/core';

import * as nuiBase from '../../lib/nuiBase.js';
import * as nuiData from '../../lib/nuiData.js';
import { dialogueContext } from './sceneBox.js';

export class GameDialogue extends LitElement {
    static properties = {
        addQuote: {},
        instance: {},
        // playing: {},
        // complete: {},
        // plainText: {},
    };

    static styles = css`
        .content {
            position: absolute;
            display: inline-block;
            width: 70%;
            word-break: break-all;
            margin: 3.5% 0 0 26%;
            overflow: visible;
            color: #ede1ea;
            --var-col: #2d3a87;
        }

        .content_html {
            overflow: visible;
            line-height: 4rem;
            font-size: 2rem;
            font-family: 'SarasaMonoSC';

            text-shadow: 0.1rem 0.1rem 0.15rem var(--var-col),
                -0.1rem -0.1rem 0.15rem var(--var-col),
                -0.1rem 0.1rem 0.15rem var(--var-col),
                0.1rem -0.1rem 0.15rem var(--var-col);
            overflow: visible;

            white-space: pre;
            display: inline-block;
            transition: 0.5s cubic-bezier(0.075, 0.82, 0.165, 1);
        }

        .content_cursor {
            position: absolute;
            right: 3.4rem;
            bottom: -1rem;
            color: black;
            display: none;
            animation: content_cursor 1s infinite;
        }

        @keyframes content_cursor {
            0% {
                opacity: 0;
            }

            50% {
                opacity: 1;
            }

            100% {
                opacity: 0;
            }
        }

        .contentFadeIn {
            display: inline-block;
            position: relative;
            line-height: 4rem;
            font-size: 2rem;
            font-family: 'SarasaMonoSC';

            text-shadow: 0.1rem 0.1rem 0.15rem var(--var-col),
                -0.1rem -0.1rem 0.15rem var(--var-col),
                -0.1rem 0.1rem 0.15rem var(--var-col),
                0.1rem -0.1rem 0.15rem var(--var-col);
            overflow: visible;

            white-space: pre;
            display: inline-block;
            transition: 0.5s cubic-bezier(0.075, 0.82, 0.165, 1);
            animation: 0.3s contentFadeIn cubic-bezier(0.075, 0.82, 0.165, 1)
                forwards;
        }

        @keyframes contentFadeIn {
            0% {
                transform: translateX(3000px);
                transform: translateY(-20px);
            }

            100% {
                transform: translateX(0px);
                transform: translateY(0px);
            }
        }
    `;

    customNodeCreator(character) {
        let el = document.createElement('span');
        el.innerHTML = character;
        el.className = 'contentFadeIn';
        return el;
    }

    clean() {
        this.playing = false;
        this.complete = false;
        this.plainText = '';
        this.textCnt = 0;
    }

    createInstance(_el_class = '.content') {
        const that = this;
        if (this.instance) {
            this.instance.stop();
            this.instance = null;
        }
        const el = this.renderRoot.querySelector(_el_class);
        this.instance = new Typewriter(el, {
            cursor: '...',
            autoStart: false,
            loop: false,
            skipAddStyles: false,
            delay: 30,
            cursorClassName: 'content_cursor',
            wrapperClassName: 'content_html',
            onCreateTextNode: that.customNodeCreator,
        });
        this.clean();
        this.instance.callFunction(() => {
            that.renderRoot.querySelector('.content_cursor').style.display =
                'none';
        });
        if (this.addQuote) {
            this.addText('「 ');
            this.plainText += '「 ';
        }
        return this.instance;
    }

    play() {
        const that = this;
        if (this.instance == null) return;
        this.playing = true;
        if (this.addQuote) {
            this.addText(' 」');
            this.plainText += ' 」';
        }
        this.instance.callFunction(() => {
            that.renderRoot.querySelector('.content_cursor').style.display =
                'block';
        });
        this.instance.callFunction(() => {
            that.complete = true;
        });
        this.instance.start();
    }

    stop() {
        this.playing = false;
        this.instance?.stop();
    }

    instantEnd() {
        this.stop();
        this.complete = true;

        const chtml = this.renderRoot.querySelector('.content_html');
        chtml.innerHTML = `${this.plainText}`;
        // chtml.appendChild(this.customNodeCreator(this.plainText));

        this.renderRoot.querySelector('.content_cursor').style.display =
            'block';
    }

    addText(s) {
        this.textCnt++;
        this.instance.typeString(s);
    }

    addInstantText(s) {
        this.textCnt++;
        this.instance.pasteString(s);
    }

    addPlainText(s) {
        this.plainText += s;
    }

    addPause(p) {
        this.instance.pauseFor(p);
    }

    setSpeed(s) {
        this.instance.changeDelay(s);
    }

    addBreakpoint() {
        this.instance.callFunction(() => {
            this.stop();
        });
    }
    addCallback(fn) {
        this.instance.callFunction(fn);
    }

    constructor() {
        super();

        this.addQuote = true;
        this.instance = null;

        this.clean();
    }

    firstUpdated() {
        document.querySelector('scene-box').dialogue = this;

        this.createInstance('.content');
        // this.addString(
        //     `嗯——。地底鸦原来是吞噬了八咫乌的力量呢。<br>那么强的神明应该能收集到不少信仰呢……<br>`
        // );
        // this.addString('果然我家神社的神明也得有点比较体贴明了的恩惠才对');
        // this.play();
    }

    render() {
        return html`<div class="content"></div>`;
    }
}
customElements.define('game-dialogue', GameDialogue);

if (import.meta.hot) {
    import.meta.hot.accept((mod) => mod.render());
}
