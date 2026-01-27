import { LitElement, html, css, unsafeCSS, CSSResultGroup, PropertyValues } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';

// @ts-ignore
import Typewriter from 'typewriter-effect/dist/core';
import { TypewriterState, TypewriterClass } from 'typewriter-effect';

// @ts-ignore
import inlineStyles from './game-dialogue.css?inline';

@customElement('game-dialogue')
export class GameDialogue extends LitElement {
    static styles = unsafeCSS(inlineStyles);

    @query('.content') contentElement!: HTMLElement;
    @query('.content_cursor') cursorElement?: HTMLElement;

    @property({ type: Boolean }) useQuote = true;

    instance?: TypewriterClass;
    plainText = '';

    init() {
        if (this.instance) {
            this.instance.stop();
            this.instance = undefined;
        }

        const one = new Typewriter(this.contentElement, {
            cursor: '...',
            autoStart: false,
            loop: false,
            skipAddStyles: false,
            delay: 30,
            cursorClassName: 'content_cursor',
            wrapperClassName: 'content_html',
            onCreateTextNode: this.customNodeCreator,
        });

        this.instance = one;

        one.callFunction(() => {
            const aim = this.cursorElement;
            if (aim) aim.style.display = 'none';
        });

        if (this.useQuote) {
            this.addText('「 ');
            this.plainText += '「 ';
        }

        return one;
    }

    play() {
        if (!this.instance) return;

        if (this.useQuote) {
            this.addText(' 」');
            this.plainText += ' 」';
        }

        this.instance.callFunction(() => {
            const aim = this.cursorElement;
            if (aim) aim.style.display = 'block';
        });

        this.instance.callFunction(() => {
            // this.complete = true;
        });

        this.instance.start();
    }

    stop() {
        this.instance?.stop();
    }

    addText(s: string) {
        if (!this.instance) return;
        this.instance.typeString(s);
    }

    addInstantText(s: string) {
        if (!this.instance) return;
        this.instance.pasteString(s, null);
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

    customNodeCreator = (character: string): Element => {
        if (character === '\n') {
            return document.createElement('br');
        }
        let el = document.createElement('span');
        el.innerHTML = character;
        el.className = 'contentFadeIn';
        return el;
    };

    firstUpdated() {
        this.init();
        this.addText(`嗯——。地底鸦原来是吞噬了八咫乌的力量呢。\n那么强的神明应该能收集到不少信仰呢……\n`);
        this.addText('果然我家神社的神明也得有点比较体贴明了的恩惠才对');
        this.play();
    }

    render() {
        return html`<div class="content"></div>`;
    }
}
