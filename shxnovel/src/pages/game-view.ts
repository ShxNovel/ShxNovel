import { LitElement, html, css, unsafeCSS, PropertyValues } from 'lit';
import { customElement, query, state } from 'lit/decorators.js';
import { Router } from '@vaadin/router';
import { classMap } from 'lit/directives/class-map.js';

// @ts-ignore
import inlineStyles from './game-view.css?inline';
import '../components';
import { GameDialogue } from '../components/game/game-dialogue';
import { GameLauncher, BootResolver, runtime, RuntimeEventListener } from '@shxnovel/canoe';

import type { SceneBlock } from '@shxnovel/rewrite';

@customElement('game-view')
export class GameView extends LitElement {
    static styles = [
        unsafeCSS(inlineStyles),
        css`
            .ui-layer {
                transition: opacity 0.2s ease-in-out;
                opacity: 1;
                pointer-events: auto;
            }
            .ui-hidden {
                opacity: 0;
                pointer-events: none;
            }
        `
    ];

    @query('.CanvasBox', true) CanvasBox!: HTMLDivElement;
    @query('game-dialogue') dialogue!: GameDialogue;

    @state() private _uiHidden = false;

    private _unsubscribe: () => void = () => {};

    // Runtime Event Listener
    private _runtimeListener: RuntimeEventListener = {
        onTick: (data: SceneBlock['text']) => {
            this._handleTick(data);
        },
        onVisual: (data: any) => {
            console.log('Visual update:', data);
        },
        onStateChange: (state) => {
            console.log('Runtime State:', state);
        },
    };

    async connectedCallback(): Promise<void> {
        super.connectedCallback();

        // 1. Subscribe to Runtime events
        this._unsubscribe = runtime.subscribe(this._runtimeListener);

        // 2. Bind user input
        this.addEventListener('click', this._handleUserClick);
        this.addEventListener('wheel', this._handleWheel);
        this.addEventListener('contextmenu', this._handleContextMenu);

        try {
            const intent = GameLauncher.consume();
            const context = await BootResolver.resolve(intent);
            await runtime.boot(context);

            // Auto-start the script
            await runtime.resume();
        } catch (e) {
            console.error(e);
            Router.go('/menu');
        }
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        this._unsubscribe();
        this.removeEventListener('click', this._handleUserClick);
        this.removeEventListener('wheel', this._handleWheel);
        this.removeEventListener('contextmenu', this._handleContextMenu);
        runtime.reset();
    }

    private _handleWheel = (e: WheelEvent) => {
        if (e.deltaY > 0) {
            // Scroll Down -> Trigger Click Logic
            // (If hidden: unhide; If visible: next)
            this._handleUserClick();
        } else if (e.deltaY < 0) {
            // Scroll Up -> Open Backlog
            // TODO: Open Backlog UI
            console.log('TODO: Open Backlog');
        }
    };

    private _handleContextMenu = (e: MouseEvent) => {
        e.preventDefault();
        // Right Click -> Hide UI
        if (!this._uiHidden) {
            this._uiHidden = true;
        }
    };

    private _handleUserClick = () => {
        // If hidden, just unhide and do nothing else
        if (this._uiHidden) {
            this._uiHidden = false;
            return;
        }

        // If dialogue is typing, finish it immediately
        if (this.dialogue && this.dialogue.isTyping) {
            this.dialogue.finish();
            return;
        }

        // Only allow resume if runtime is paused (waiting for input)
        if (runtime.getState() === 'paused') {
            runtime.resume();
        }
    };

    private _handleTick(data: SceneBlock['text']) {
        // Data is an array of text objects from the IR: [{ type: 'text', content: [...] }]
        // We need to parse this. For now, let's assume simple structure.

        // Clear previous text? Or maybe the dialogue component handles it?
        // Usually a new 'tick' means a new dialogue block.
        const ShouldQuote = data[0].quote;
        this.dialogue.useQuote = ShouldQuote;
        this.dialogue.init();

        for (const item of data) {
            if (item.type === 'text') {
                // item.content can be array of strings or commands
                const content = item.content;
                if (Array.isArray(content)) {
                    content.forEach((c) => {
                        if (typeof c === 'string') {
                            this.dialogue.addText(c);
                        } else if (c.kind === 'pause') {
                            this.dialogue.addPause(c.args?.ms || 500);
                        }
                        // Handle other text commands
                    });
                } else if (typeof content === 'string') {
                    this.dialogue.addText(content);
                }
            }
        }

        this.dialogue.play();
    }

    render() {
        const uiClasses = {
            'ui-layer': true,
            'ui-hidden': this._uiHidden
        };

        return html`
            <div class="body">
                <!-- <button @click=${() => Router.go('/menu')}>back</button> -->

                <game-top-menu class=${classMap(uiClasses)}></game-top-menu>

                <div class="CanvasBox"></div>

                <div class="bottom ${classMap(uiClasses)}">
                    <game-dialogue></game-dialogue>
                    <game-bottom-tool></game-bottom-tool>
                </div>
            </div>
        `;
    }
}
