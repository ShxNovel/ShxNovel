import { LitElement, css, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';

@customElement('hot-fix')
export class HotFix extends LitElement {
    static styles = css`
        div {
            position: absolute;
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
        }

        .fill {
            background-color: #1e2226;
        }
    `;

    constructor() {
        super();

        if (!window.shxNovel) window.shxNovel = {};
    }

    render() {
        const classes = { fill: false };

        const host = window.location.host;
        const domain = window.location.hostname;
        const isPure =
            window.location.pathname === '/' || window.location.pathname === '';

        if (isPure) window.shxNovel.main = true;

        if (!isPure && !window.shxNovel.main) {
            window.location.href = `http://${host}`;
        }

        if (domain === 'tauri.localhost') {
            // release
        } else if (domain === 'localhost') {
            // debug
        } else {
            // idk
        }

        return html`<div class=${classMap(classes)}></div>`;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'hot-fix': HotFix;
    }
}
