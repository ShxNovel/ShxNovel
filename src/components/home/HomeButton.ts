import { LitElement, css, html, nothing } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { customElement, property } from 'lit/decorators.js';

import { tryExitGame, changeUrl } from '../../lib/core';

// import { nuiConfig, nuiCache, resetCache, stroyBus } from '../lib/nuiData.js';

// async function loadData() {
//     const { chapter, chunk, index } = nuiCache;
//     await stroyBus.loadChunk(chapter, chunk);
//     stroyBus.talkIndex = index;
// }

const typeCB = {
    newGame: async () => {
        // resetCache();
        // await loadData();
    },
    coninueGame: async () => {
        // await loadData();
    },
    exitGame: async () => {
        await tryExitGame();
    },
};

@customElement('home-btn')
export class HomeBtn extends LitElement {
    @property({ type: Boolean })
    display?: boolean;

    @property({ type: String })
    text?: string;

    @property({ type: String })
    href?: string;

    @property({ type: String })
    action?: string;

    static styles = css`
        * {
            --btn: #ffb03a;
            --time: all 0.3s;
        }

        .field {
            height: fit-content;
        }

        .btn {
            display: block;
            text-decoration: none;
            font-weight: bold;
            padding: 0rem 3rem;
            font-size: 2rem;
            line-height: 6rem;
            letter-spacing: 0.2rem;
            text-align: center;
            transform: translateY(0rem);
            background-color: transparent;
            color: rgb(30, 34, 38);
            transition: 0.3s;
        }

        .btn:hover {
            color: #ffb03a;
            text-shadow: 1px 1px 2px #dfdfdf;
        }

        .btn::before {
            content: '';
            position: absolute;
            height: 100%;
            width: 0;
            top: 0;
            left: 0;
            box-sizing: border-box;
            border-top: 0.2rem solid var(--btn);
            border-left: 0.2rem solid var(--btn);
            background-color: transparent;
            transition: var(--time);
        }

        .btn::after {
            content: '';
            position: absolute;
            height: 100%;
            width: 0;
            bottom: 0;
            right: 0;
            box-sizing: border-box;
            border-bottom: 0.2rem solid var(--btn);
            border-right: 0.2rem solid var(--btn);
            background-color: transparent;
            transition: var(--time);
        }

        .btn:hover:before,
        .btn:hover:after {
            width: 100%;
            height: 0;
        }

        
    `;

    constructor() {
        super();

        this.text = this.textContent;
    }

    async _solve(e) {
        await this._action(e);
        this._goto(e);
    }

    async _action(e) {
        if (this.action in typeCB) {
            await typeCB[this.action]();
        }
    }

    firstUpdated() {
        // if (this.action == 'coninueGame') {
        //     if (
        //         nuiConfig.entry === nuiCache.chapter &&
        //         nuiCache.chunk === '1' &&
        //         nuiCache.index == 0
        //     ) {
        //         this.display = false;
        //     }
        // }
    }

    _goto(e) {
        this.href ? changeUrl(this.href) : nothing;
    }

    render() {
        this.style.display = this.display == false ? 'none' : undefined;

        return html`
            <div class="field">
                <a class="btn" @click="${this._solve}"> ${this.text} </a>
            </div>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'home-btn': HomeBtn;
    }
}
