import { LitElement, css, html } from 'lit';
import { property } from 'lit/decorators.js';
// import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { styleMap } from 'lit/directives/style-map.js';
import { boxConnection } from './connection';

import { SceneBox } from '../SceneBox';

// import * as nuiBase from '../../lib/nuiBase.js';

export class GameBacklog extends LitElement {
    @property({ type: Boolean })
    selfDisplay: boolean;

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

    father: SceneBox;

    constructor() {
        super();
        this.selfDisplay = false;
        this.father = boxConnection.get('box')!;
    }

    openHandler = () => this._unbind_openHandler();

    _unbind_openHandler() {
        this.vis();
    }

    vis() {
        this.selfDisplay = true;
        this.father.backlogDisplay = true;
        this.father.unvis();
    }

    unvis() {
        this.selfDisplay = false;
        this.father.backlogDisplay = false;
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
        super.disconnectedCallback();
        window.removeEventListener('open-widget-backlog', this.openHandler);
    }

    render() {
        const styles = { display: this.selfDisplay ? 'block' : 'none' };

        return html` <div class="backlog" style=${styleMap(styles)}>
            <div class="btn close" @click="${this.unvis}">
                <a class="small">回到游戏</a>
                <a class="big">BACK</a>
            </div>
        </div>`;
    }
}
customElements.define('game-backlog', GameBacklog);
