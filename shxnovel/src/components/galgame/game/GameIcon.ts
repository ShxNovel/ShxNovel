import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { boxConnection } from './connection';

// import { unsafeHTML } from 'lit/directives/unsafe-html.js';
// import * as nuiBase from '../../lib/nuiBase.js';

export interface IconJSON {
    icon: string;
}

@customElement('game-icon')
export class GameIcon extends LitElement {
    static properties = {};

    @property({ type: Number })
    using: number;

    @property({ type: Array })
    iconName: string[];

    static styles = css`
        .icon {
            position: absolute;
            display: inline-block;
            clear: both;
            width: 25%;
            height: 100%;
            isolation: isolate;
        }

        .icon img {
            position: absolute;
            min-height: 100%;
            width: 100%;
            object-position: 100% 20%;
            object-fit: cover;
            mix-blend-mode: multiply;
            transition: 0.5s;
        }
    `;

    constructor() {
        super();
        this.using = 2;
        this.iconName = [
            '',
            '',
            '',
            '',
            // '博丽灵梦（萃梦想立绘）.png',
            // '博丽灵梦（绯想天立绘）.png',
        ];
    }

    firstUpdated() {
        boxConnection.set('icon', this);
    }

    getNowIcon() {
        return this.iconName[this.using];
    }

    getImgElement(id: number | string) {
        const name = `.icon_${id}`;
        return this.shadowRoot!.querySelector(name);
    }

    changeIcon(name: string, fade = true) {
        const now = this.using;
        const nxt = now ^ 1;

        if (name == this.iconName[now]) return;

        if (fade === false) {
            this.iconName[now] = name;
            this.requestUpdate();
            return;
        }

        this.iconName[nxt] = name;
        this.getImgElement(now)!.setAttribute('style', 'opacity: 0;');
        this.getImgElement(nxt)!.setAttribute('style', 'opacity: 1;');

        this.using ^= 1;
        this.requestUpdate();
    }

    dump(): IconJSON {
        return { icon: this.getNowIcon() };
    }

    restore(content: IconJSON) {
        this.changeIcon(content.icon, false);
    }

    render() {
        return html` <div class="icon">
            <img class="icon_0" src="/icon/${this.iconName[0]}" alt="" />
            <img class="icon_2" src="/icon/${this.iconName[2]}" alt="" />
            <img class="icon_3" style="opacity: 0;" src="/icon/${this.iconName[3]}" alt="" />
        </div>`;
    }
}
