import { LitElement, PropertyValues, html, unsafeCSS } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { Router, Commands } from '@vaadin/router';

import gsap from 'gsap';
import { CustomEase } from 'gsap/CustomEase';
import { CustomBounce } from 'gsap/CustomBounce';

// @ts-ignore
import inlineStyles from './game-setting.css?inline';

gsap.registerPlugin(CustomEase, CustomBounce);

@customElement('game-setting')
export class GameSetting extends LitElement {
    static styles = unsafeCSS(inlineStyles);

    render() {
        return html` <button @click=${() => Router.go('/menu')}>Back</button> `;
    }
}
