import { LitElement, css, html, nothing } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { styleMap } from 'lit/directives/style-map.js';

import * as nuiBase from '../../lib/nuiBase.js';

export class GameBacklog extends LitElement {
    static properties = {
        internal_display: {},
    };

    static styles = css`
        .backlog {
            width: 100%;
            height: 100%;
            position: absolute;
            background-color: #000;
        }

        .btn {
            color: white;
            display: flex;
            flex-direction: column;
            align-items: center;

            .small {
            }

            .big {
                font-size: 2.5rem;
                font-family: 'AlimamaDongFangDaKai';
            }
        }
    `;

    constructor() {
        super();
        this.internal_display = false;

        /** @type {import('./sceneBox.js').SceneBox} */
        this.father = document.querySelector('scene-box');

        this.openHandler = this._unbind_openHandler.bind(this);
    }

    _unbind_openHandler() {
        this.vis();
    }

    vis() {
        this.internal_display = true;
        this.father.widget = this;
        this.father.unvis();
    }

    unvis() {
        this.internal_display = false;
        this.father.widget = null;
        this.father.vis();
    }

    firstUpdated() {
        window.addEventListener('open-widget-backlog', this.openHandler);

        // fix
        this.addEventListener('click', (event) => {
            event.preventDefault();
            event.stopPropagation();
        });
    }

    disconnectedCallback() {
        window.removeEventListener('open-widget-backlog', this.openHandler);

        super.disconnectedCallback();
    }

    render() {
        const styles = { display: this.internal_display ? 'block' : 'none' };

        return html` <div class="backlog" style=${styleMap(styles)}>
            <div class="btn close" @click="${this.unvis}">
                <a class="small">回到游戏</a>
                <a class="big">BACK</a>
            </div>
        </div>`;
    }
}
customElements.define('game-backlog', GameBacklog);
