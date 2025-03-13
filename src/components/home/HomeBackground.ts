import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('home-background')
export class HomeBackground extends LitElement {
    static styles = css`
        .box {
            position: absolute;
            width: 100%;
            height: 100%;
            z-index: -1;
            background: url('/background/img1.png') 0% 0% / contain;
            background-repeat: no-repeat;
            background-position: center;
        }
    `;

    render() {
        return html`<div class="box"></div>`;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'home-background': HomeBackground;
    }
}
