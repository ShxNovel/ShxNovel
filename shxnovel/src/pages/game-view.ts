import { LitElement, html, css, unsafeCSS, PropertyValues } from 'lit';
import { customElement, query, state } from 'lit/decorators.js';
import { Router } from '@vaadin/router';

// @ts-ignore
import inlineStyles from './game-view.css?inline';
import '../components';
import { GameLauncher, BootResolver, runtime } from '@shxnovel/canoe';

@customElement('game-view')
export class GameView extends LitElement {
    static styles = unsafeCSS(inlineStyles);

    @query('.CanvasBox', true) CanvasBox!: HTMLDivElement;

    async connectedCallback(): Promise<void> {
        super.connectedCallback();

        try {
            const intent = GameLauncher.consume();
            const context = await BootResolver.resolve(intent);
            await runtime.boot(context);

            console.log(runtime);
        } catch (e) {
            console.error(e);
            Router.go('/menu');
        }
    }

    render() {
        return html`
            <div class="body">
                <!-- <button @click=${() => Router.go('/menu')}>back</button> -->

                <game-top-menu></game-top-menu>

                <div class="CanvasBox"></div>

                <div class="bottom">
                    <game-dialogue></game-dialogue>
                    <game-bottom-tool></game-bottom-tool>
                </div>
            </div>
        `;
    }
}
