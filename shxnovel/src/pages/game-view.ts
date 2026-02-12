import { LitElement, html, css, unsafeCSS, PropertyValues } from 'lit';
import { customElement, query, state } from 'lit/decorators.js';
import { Router } from '@vaadin/router';
import { classMap } from 'lit/directives/class-map.js';
import { provide } from '@lit/context';

// @ts-ignore
import inlineStyles from './game-view.css?inline';
import '../components';
import { GameDialogue } from '../components/game/game-dialogue';
import { GameLauncher, BootResolver, runtime, RuntimeEventListener } from '@shxnovel/canoe';

import type { SceneBlock, TextUnit } from '@shxnovel/rewrite';
import { logger } from '@shxnovel/canoe/logger.js';
import { gameContext, GameContextType } from '../context/game-context';

type UnpackArray<T> = T extends (infer U)[] ? U : T;

@customElement('game-view')
export class GameView extends LitElement {
    static styles = [
        unsafeCSS(inlineStyles),
        css`
            .ui-layer {
                transition: opacity 0.1s ease-in-out;
                opacity: 1;
                pointer-events: auto;
            }
            .ui-hidden {
                opacity: 0;
                pointer-events: none;
            }
        `,
    ];

    @query('.CanvasBox', true) CanvasBox!: HTMLDivElement;
    @query('game-dialogue') dialogue!: GameDialogue;

    @state() private _uiHidden = false;
    @state() private _isAuto = false;
    @state() private _isFast = false;

    // Provide context to children
    @provide({ context: gameContext })
    @state()
    private _gameContext: GameContextType = {
        isAuto: false,
        isFast: false,
        toggleAuto: () => this._toggleAuto(),
        toggleFast: () => this._toggleFast(),
        stopAuto: () => this._stopAuto(),
    };

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
            logger.info('Auto-starting script');
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

    // --- Auto / Fast Logic ---

    private _updateContext() {
        this._gameContext = {
            ...this._gameContext,
            isAuto: this._isAuto,
            isFast: this._isFast,
        };
    }

    private _toggleAuto() {
        this._isAuto = !this._isAuto;
        if (this._isAuto) {
            this._isFast = false; // Mutual exclusive
            logger.info('Auto Mode: ON');
            // TODO: Start auto timer
        } else {
            logger.info('Auto Mode: OFF');
        }
        this._updateContext();
    }

    private _toggleFast() {
        this._isFast = !this._isFast;
        if (this._isFast) {
            this._isAuto = false; // Mutual exclusive
            logger.info('Fast Mode: ON');
            // TODO: Enable fast skipping
        } else {
            logger.info('Fast Mode: OFF');
        }
        this._updateContext();
    }

    private _stopAuto() {
        if (this._isAuto || this._isFast) {
            this._isAuto = false;
            this._isFast = false;
            logger.info('Auto/Fast Stopped');
            this._updateContext();
        }
    }

    // --- Input Handlers ---

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

        // Stop auto/fast modes on manual click
        this._stopAuto();

        // If dialogue is typing, finish it immediately
        if (this.dialogue && this.dialogue.isTyping) {
            this.dialogue.finish();
            return;
        }

        // Only allow resume if runtime is paused (waiting for input) or ready (waiting to start)
        const state = runtime.getState();
        if (state === 'paused' || state === 'ready') {
            runtime.resume();
        }
    };

    private _handleTick(data: SceneBlock['text']) {
        // ... (rest same)
        const ShouldQuote = data[0].quote;
        this.dialogue.useQuote = ShouldQuote;
        this.dialogue.init();

        const solveText = (c: UnpackArray<TextUnit['content']>) => {
            if (typeof c === 'string') {
                this.dialogue.addText(c);
            } else {
                // Handle other text commands
                switch (c.kind) {
                    case 'pause':
                        this.dialogue.addPause(c.args?.ms || 500);
                        break;

                    case 'fast':
                        this.dialogue.addInstantText(c.args?.str || '');
                        break;

                    default:
                        logger.error(`Unknown command: ${c.kind}`);
                        break;
                }
            }
        };

        for (const item of data) {
            if (item.type === 'text') {
                const content = item.content;

                if (Array.isArray(content)) {
                    content.forEach(solveText);
                } else if (typeof content === 'string') {
                    this.dialogue.addText(content);
                }
            }
        }

        this.dialogue.play();
    }

    private _stopProp = (e: Event) => {
        e.stopPropagation();
    };

    private _handleToggleUI = (e: Event) => {
        e.stopPropagation();
        this._uiHidden = !this._uiHidden;
    };

    private _handleBacklog = (e: Event) => {
        e.stopPropagation();
        console.log('TODO: Open Backlog');
    };

    private _handleSave = (e: Event) => {
        e.stopPropagation();
        console.log('TODO: Save Game');
    };

    // New handlers using context logic
    private _handleAuto = (e: Event) => {
        e.stopPropagation();
        this._toggleAuto();
    };

    private _handleFast = (e: Event) => {
        e.stopPropagation();
        this._toggleFast();
    };

    private _handleReplay = (e: Event) => {
        e.stopPropagation();
        console.log('TODO: Replay Voice');
    };

    private _handleQSave = (e: Event) => {
        e.stopPropagation();
        console.log('TODO: Quick Save');
    };

    render() {
        const uiClasses = {
            'ui-layer': true,
            'ui-hidden': this._uiHidden,
        };

        return html`
            <div class="body">
                <!-- <button @click=${() => Router.go('/menu')}>back</button> -->

                <game-top-menu class=${classMap(uiClasses)} @click=${this._stopProp}></game-top-menu>

                <div class="CanvasBox"></div>

                <div class="bottom ${classMap(uiClasses)}">
                    <game-dialogue></game-dialogue>
                    <game-bottom-tool 
                        @click=${this._stopProp}
                        @toggle=${this._handleToggleUI}
                        @backlog=${this._handleBacklog}
                        @save=${this._handleSave}
                        @auto=${this._handleAuto}
                        @fast=${this._handleFast}
                        @replay=${this._handleReplay}
                        @qsave=${this._handleQSave}
                    ></game-bottom-tool>
                </div>
            </div>
        `;
    }
}
