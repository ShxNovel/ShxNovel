import { LitElement, html, css, unsafeCSS, PropertyValues } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { Router } from '@vaadin/router';

// @ts-ignore
import inlineStyles from './game-view.css?inline';
import '../components';

@customElement('game-view')
export class GameView extends LitElement {
    static styles = unsafeCSS(inlineStyles);

    render() {
        return html`
            <div class="body">
                <button @click=${() => Router.go('/menu')}>back</button>

                <div class="bottom">
                    <game-dialogue></game-dialogue>
                    <game-bottom-tool></game-bottom-tool>
                </div>
            </div>
        `;
    }
}
