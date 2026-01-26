import { LitElement, html, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { Router } from '@vaadin/router';

// @ts-ignore
// import inlineStyles from './main-menu.css?inline';
// import { tryExitGame } from '../core/system';

@customElement('not-found')
export class NotFound extends LitElement {
    render() {
        return html`
            <div class="not-found">
                <h1>404 - Page Not Found</h1>
                <p>The page you are looking for does not exist.</p>
                <button @click=${() => Router.go('/menu')}>Go Home</button>
            </div>
        `;
    }
}
