import { LitElement, css, html, nothing } from 'lit';
import { customElement } from 'lit/decorators.js';
import * as core from '@shxnovel/pages/index.ts';

@customElement('banner-block')
export class BannerBlock extends LitElement {
    static properties = {
        title: {},
    };

    static styles = css`
        :host {
            width: 100%;
            height: 10%;
            background-color: #ffffffdd;
            position: relative;
            display: flex;
            justify-items: center;
            align-items: center;
            font-weight: bold;
            font-size: 2rem;
        }
        .back {
            width: fit-content;
            color: black;
            background-color: white;
            padding: 1%;
            margin-left: 3%;
            border-radius: 0.2rem;
        }
        .title {
            font-size: 150%;
            font-weight: bold;
            margin-left: 5%;
            text-shadow: white -0.2rem 0.2rem;
        }
    `;

    constructor() {
        super();
    }

    _back() {
        core.goBackPage();
    }

    render() {
        return html`
            <p class="back" @click="${this._back}">&lt;&lt;- 返回</p>
            <p class="title">${this.title}</p>
        `;
    }
}
