import { LitElement, css, html, nothing } from 'lit';
import * as nuiBase from '../../lib/nuiBase.js';

@customElements('game-menu')
export class GameMenu extends LitElement {
    static properties = {};

    static styles = css`
        :host {
            z-index: 4000;
            position: relative;
        }

        .menu {
            position: relative;
            top: 2rem;
            left: 2rem;
            overflow: visible;
        }

        .bars {
            position: relative;
            width: 2.6rem;
            padding: 0.5rem 0.7rem 0 0.7rem;
            height: 3.5rem;
            cursor: url('../icon/c_mouse.png'), pointer;
            background-color: rgb(86 125 232 / 15%);
            border-radius: 100%;
            overflow: visible;
        }

        .bars:hover .bar {
            background-color: white;
        }

        .bars.change:hover .bar {
            background-color: #f44336 !important;
        }

        .bar {
            z-index: 2000;
            position: relative;
            height: 0.35rem;
            width: 100%;
            background-color: #3f51b5;
            box-shadow: 1px 1px 1px 1px #9e9e9e;
            display: block;
            border-radius: 10rem;
            transition: 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
            margin: 0.5rem 0;
        }

        .change {
            display: block !important;
        }

        .change #bar-1 {
            background-color: white;
            transform: translateY(0.835rem) rotateZ(-45deg);
            box-shadow: none;
        }

        .change #bar-2 {
            opacity: 0;
        }

        .change #bar-3 {
            background-color: white;
            transform: translateY(-0.835rem) rotateZ(45deg);
            box-shadow: none;
        }

        .nav {
            position: relative;
            z-index: 2000;
            transition: 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
            display: none;
        }

        .nav ul {
            padding: 0 2.5rem;
        }

        .nav li {
            padding: 1.8rem 0;
            list-style: none;
            /* border-left: 4px solid white; */
        }

        #menu-bg {
            position: relative;
            z-index: 1000;
            top: -5rem;
            left: -0.3rem;
            width: 0;
            height: 0;
            margin: 3rem 0 2rem 2rem;
            /* background: radial-gradient(circle, #F44336, #9E9E9E); */
            background-color: rgb(30, 34, 38);
            border-radius: 50%;
            transition: 0.3s cubic-bezier(0.075, 0.82, 0.165, 1);
            /* transform: translate(-30rem, -45rem); */
        }

        .change-bg {
            width: 53rem !important;
            height: 53rem !important;
            transform: translate(-30rem, -45rem);
            border: 0.5rem ridge #607d8b;
        }
    `;

    constructor() {
        super();

        this.addEventListener('click', (event) => {
            event.preventDefault();
            event.stopPropagation();
            this.__remove();
        });
    }

    __remove() {
        this.renderRoot.querySelectorAll('.bars')[0].classList.remove('change');
        this.renderRoot.querySelector('#nav').classList.remove('change');
        this.renderRoot.querySelector('#menu-bg').classList.remove('change-bg');
    }

    __toggle(event) {
        if (event) event.stopPropagation();
        this.renderRoot.querySelectorAll('.bars')[0].classList.toggle('change');
        this.renderRoot.querySelector('#nav').classList.toggle('change');
        this.renderRoot.querySelector('#menu-bg').classList.toggle('change-bg');
    }

    _handleSlotchange(event) {
        event.target.addEventListener('click', (e) => {
            nuiBase.changeUrl(e.target.href);
        });
    }

    render() {
        // prettier-ignore
        return html`
            <div class="menu">
                <div class="bars" @click="${this.__toggle}">
                    <div class="bar" id="bar-1"></div>
                    <div class="bar" id="bar-2"></div>
                    <div class="bar" id="bar-3"></div>
                </div>
                <nav class="nav" id="nav">
                    <ul>
                        <li><slot name="a" @slotchange=${this._handleSlotchange}></slot></li>
                        <li><slot name="b" @slotchange=${this._handleSlotchange}></slot></li>
                        <li><slot name="c" @slotchange=${this._handleSlotchange}></slot></li>
                        <li><slot name="d" @slotchange=${this._handleSlotchange}></slot></li>
                    </ul>
                </nav>
                <div id="menu-bg"></div>
            </div>
        `;
    }
}
customElements.define('game-menu', GameMenu);
