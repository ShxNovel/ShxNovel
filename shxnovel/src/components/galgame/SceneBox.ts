import { LitElement, css, html } from 'lit';
import { styleMap } from 'lit/directives/style-map.js';
import { customElement, property } from 'lit/decorators.js';

import './game/GameMenu';
import './game/GameSpeaker';
import './game/GameIcon';
import './game/GameDialogue';
import './game/GameBottomTool';
import './game/GameBacklog';
import { boxConnection } from './game/connection';
import { SceneTrack } from './SceneTrack';

// import { SceneTrack } from './SceneTrack.js';

@customElement('scene-box')
export class SceneBox extends LitElement {
    @property({ type: Boolean })
    internal_event_block: boolean;

    @property({ type: Boolean })
    selfDisplay: boolean;

    @property({ type: Boolean })
    backlogDisplay: boolean;

    controller = new SceneTrack(this);

    static styles = css`
        :host {
            position: relative;
            display: block;
            width: 100%;
            height: 100%;
        }

        .unvis {
            display: none;
        }

        .hov {
            position: fixed;
            width: 100%;
            height: 100%;
            z-index: 1500;
        }

        .bottom {
            position: absolute;

            width: 100%;
            height: calc(25% + 5rem);

            left: 0;
            bottom: 0;

            background-color: #ffffffbb;
            background: linear-gradient(to top, #ffffffee, #ffffffbb 70%, #ffffff00);

            overflow: visible;
        }
    `;

    constructor() {
        super();

        this.selfDisplay = true;
        this.internal_event_block = false;
        this.backlogDisplay = false;

        boxConnection.set('box', this);

        this.setupListener();
    }

    render() {
        const stylesMain = {
            display: this.selfDisplay && !this.backlogDisplay ? 'block' : 'none',
        };

        const styleBacklog = {
            display: this.backlogDisplay ? 'block' : 'none',
        };

        return html`
            <div style=${styleMap(stylesMain)}>
                <game-menu>
                    <a class="menu-item" slot="a" href="./options.html">选项菜单</a>
                    <a class="menu-item" slot="b" href="#">游戏存档</a>
                    <a class="menu-item" slot="c" href="./gallery.html">鉴赏系统</a>
                    <a class="menu-item" slot="d" href="./home.html">标题界面</a>
                </game-menu>

                <div class="scene"></div>

                <div class="bottom">
                    <game-speaker></game-speaker>

                    <game-icon></game-icon>

                    <game-dialogue></game-dialogue>

                    <game-bottom-tool></game-bottom-tool>
                </div>
            </div>

            <game-backlog style=${styleMap(styleBacklog)}></game-backlog>
        `;
    }

    setupListener() {
        this.addEventListener('click', () => {
            if (this.shouldIgnore()) return;
            if (this.selfDisplay === false) {
                this.selfDisplay = true;
                return;
            }
            this.emitNextScene();
        });

        this.addEventListener('contextmenu', (event) => {
            event.preventDefault();
            if (this.shouldIgnore()) return;
            if (this.selfDisplay === false) return;
            this.selfDisplay = false;
        });
    }

    shouldIgnore() {
        if (this.internal_event_block) return true;
        if (this.backlogDisplay) return true;
        return false;
    }

    toggle() {
        this.selfDisplay = !this.selfDisplay;
    }

    vis() {
        this.selfDisplay = true;
    }

    unvis() {
        this.selfDisplay = false;
    }

    _scroll_event = (event: WheelEvent) => {
        if (this.shouldIgnore()) return;

        if (this.selfDisplay) {
            if (event.deltaY < 0) {
                this.openBacklog();
                // backlog.toggle();
                // this.internal_event_block = true;
            } else if (event.deltaY > 0) {
                this.emitNextScene();
            }
        } else {
            if (event.deltaY < 0) {
                if (this.backlogDisplay) {
                    // { ... }
                } else {
                    this.toggle();
                }
            } else if (event.deltaY > 0) {
                if (this.backlogDisplay) {
                    // { ... }
                } else {
                    this.toggle();
                }
            }
        }
    };

    _keydown_event = (event: KeyboardEvent) => {
        if (this.shouldIgnore()) return;

        if (event.key === 'Control') {
            const tools = boxConnection.get('toolbox');
            if (!tools) return;

            if (this.selfDisplay === false) {
                this.toggle();
                return;
            }

            tools.ctrl_down = true;
            if (tools.isActive('auto')) tools.removeActive('auto');
            tools.addActive('fast');
            return;
        }
    };

    _keyup_event = (event: KeyboardEvent) => {
        if (this.shouldIgnore()) return;

        if (event.key === 'Control') {
            const tools = boxConnection.get('toolbox');
            if (!tools) return;

            if (this.selfDisplay === false) {
                return;
            }

            tools.ctrl_down = false;
            tools.removeActive('fast');
        }
    };

    openBacklog() {
        this.unvis();
        this.emitOpenWidget('backlog');
    }

    emitOpenWidget(name: string) {
        if (this.shouldIgnore()) return;
        this.dispatchEvent(
            new CustomEvent(`open-widget-${name}`, {
                bubbles: true,
                composed: true,
            })
        );
    }

    emitNextScene() {
        if (this.shouldIgnore()) return;
        this.dispatchEvent(new CustomEvent('next-scene'));
    }

    connectedCallback() {
        super.connectedCallback();
        window.addEventListener('wheel', this._scroll_event);
        window.addEventListener('keydown', this._keydown_event);
        window.addEventListener('keyup', this._keyup_event);
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        window.removeEventListener('wheel', this._scroll_event);
        window.removeEventListener('keydown', this._keydown_event);
        window.removeEventListener('keyup', this._keyup_event);
    }
}
