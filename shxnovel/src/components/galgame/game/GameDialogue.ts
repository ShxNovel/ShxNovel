import { LitElement, css, html } from 'lit';
import { customElement } from 'lit/decorators.js';

// @ts-ignore
import Typewriter from 'typewriter-effect/dist/core';
import { TypewriterState, TypewriterClass } from 'typewriter-effect';
import { boxConnection } from './connection';

// import * as core from '@shxnovel/pages/index.js';
// import * as data from '../../../data';
// import { dialogueContext } from './sceneBox.js';

@customElement('game-dialogue')
export class GameDialogue extends LitElement {
    static properties = {
        addQuote: {},
        instance: {},
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

            text-shadow: 0.1rem 0.1rem 0.15rem var(--var-col), -0.1rem -0.1rem 0.15rem var(--var-col),
                -0.1rem 0.1rem 0.15rem var(--var-col), 0.1rem -0.1rem 0.15rem var(--var-col);
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

            text-shadow: 0.1rem 0.1rem 0.15rem var(--var-col), -0.1rem -0.1rem 0.15rem var(--var-col),
                -0.1rem 0.1rem 0.15rem var(--var-col), 0.1rem -0.1rem 0.15rem var(--var-col);
            overflow: visible;

            white-space: pre;
            display: inline-block;
            transition: 0.5s cubic-bezier(0.075, 0.82, 0.165, 1);
            animation: 0.3s contentFadeIn cubic-bezier(0.075, 0.82, 0.165, 1) forwards;
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

    playing: boolean;
    complete: boolean;
    addQuote: boolean;

    plainText: string;
    textCnt: number;
    instance: TypewriterClass | null;

    customNodeCreator(character: string): Text {
        let el = document.createElement('span');
        el.innerHTML = character;
        el.className = 'contentFadeIn';
        // @ts-ignore
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
        const el = this.renderRoot.querySelector(_el_class) as HTMLElement;

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

        this.instance!.callFunction(() => {
            const aim = that.renderRoot.querySelector('.content_cursor') as HTMLElement;
            aim.style.display = 'none';
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
            const aim = that.renderRoot.querySelector('.content_cursor') as HTMLElement;
            aim.style.display = 'block';
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

        const chtml = this.renderRoot.querySelector('.content_html')!;
        chtml.innerHTML = `${this.plainText}`;

        const aim = this.renderRoot.querySelector('.content_cursor') as HTMLElement;
        aim.style.display = 'block';
    }

    addText(s: string) {
        if (!this.instance) return;
        this.textCnt++;
        this.instance.typeString(s);
    }

    addInstantText(s: string) {
        if (!this.instance) return;
        this.textCnt++;
        this.instance.pasteString(s, null);
    }

    addPlainText(s: string) {
        this.plainText += s;
    }

    addPause(p: number) {
        if (!this.instance) return;
        this.instance.pauseFor(p);
    }

    setSpeed(s: number) {
        if (!this.instance) return;
        this.instance.changeDelay(s);
    }

    addBreakpoint() {
        if (!this.instance) return;
        this.instance.callFunction(() => {
            this.stop();
        });
    }
    addCallback(fn: (state: TypewriterState) => void) {
        if (!this.instance) return;
        this.instance.callFunction(fn);
    }

    constructor() {
        super();

        this.playing = false;
        this.complete = false;

        this.addQuote = true;
        this.plainText = '';
        this.textCnt = 0;

        this.instance = null;

        this.clean();
    }

    firstUpdated() {
        boxConnection.set('dialogue', this);

        this.createInstance('.content');
        this.addText(`嗯——。地底鸦原来是吞噬了八咫乌的力量呢。<br>那么强的神明应该能收集到不少信仰呢……<br>`);
        this.addText('果然我家神社的神明也得有点比较体贴明了的恩惠才对');
        this.play();
    }

    render() {
        return html`<div class="content"></div>`;
    }
}
