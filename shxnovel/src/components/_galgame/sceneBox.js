import { LitElement, css, html } from 'lit';
import { styleMap } from 'lit/directives/style-map.js';
import { SceneTrack } from './SceneTrack.js';

export class SceneBox extends LitElement {
    static properties = {
        internal_event_block: {},
        internal_display: {},
        widget: {},
    };

    driver = new SceneTrack(this);

    /** @type {import('./gameDialogue.js').GameDialogue} */
    dialogue = undefined;
    /** @type {import('./gameSpeaker.js').GameSpeaker} */
    speaker = undefined;
    /** @type {import('./gameIcon.js').GameIcon} */
    icon = undefined;

    static styles = css`
        :host {
            position: relative;
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
    `;

    toggle() {
        this.internal_display = !this.internal_display;
    }

    vis() {
        this.internal_display = true;
    }

    unvis() {
        this.internal_display = false;
    }

    _unbind_scroll_event(event) {
        if (this.internal_event_block) return;
        if (this.widget) return;

        if (this.internal_display) {
            if (event.deltaY < 0) {
                this.toggle();
                this.emitOpenWidget('backlog');
                // backlog.toggle();
                // this.internal_event_block = true;
            } else if (event.deltaY > 0) {
                this.emitNextScene();
            }
        } else {
            if (event.deltaY < 0) {
                if (this.widget) {
                    // { ... }
                } else {
                    this.toggle();
                }
            } else if (event.deltaY > 0) {
                if (this.widget) {
                    // { ... }
                } else {
                    this.toggle();
                }
            }
        }
    }

    _unbind_keydown_event(event) {
        if (this.internal_event_block) return;
        if (this.widget) return;

        if (event.key === 'Control') {
            const tools = document.querySelector('game-bottom-tool');

            if (this.internal_display === false) {
                this.toggle();
                return;
            }

            tools.ctrl_down = true;
            if (tools.isActive('auto')) tools.removeActive('auto');
            tools.addActive('fast');
            return;
        }
    }

    _unbind_keyup_event(event) {
        if (this.internal_event_block) return;
        if (this.widget) return;

        if (event.key === 'Control') {
            const tools = document.querySelector('game-bottom-tool');

            if (this.internal_display === false) {
                return;
            }

            tools.ctrl_down = false;
            tools.removeActive('fast');
        }
    }

    emitOpenWidget(name) {
        if (this.internal_event_block) return;
        if (this.widget) return;

        this.dispatchEvent(
            new CustomEvent(`open-widget-${name}`, {
                bubbles: true,
                composed: true,
            })
        );
    }

    emitNextScene() {
        if (this.internal_event_block) return;
        if (this.widget) return;
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

    _handleSlotchange(e) {
        const childNodes = e.target.assignedNodes({ flatten: true });
        for (const el of childNodes) {
            // pass
        }
    }

    constructor() {
        super();

        this.internal_event_block = false;
        this.internal_display = true;
        this.widget = null;

        this._scroll_event = this._unbind_scroll_event.bind(this);
        this._keydown_event = this._unbind_keydown_event.bind(this);
        this._keyup_event = this._unbind_keyup_event.bind(this);

        this.addEventListener('click', (event) => {
            if (this.internal_event_block) return;
            if (this.widget) return;

            if (this.internal_display === false) {
                this.internal_display = true;
                return;
            }

            this.emitNextScene();
        });

        this.addEventListener('contextmenu', (event) => {
            event.preventDefault();
            if (this.internal_event_block) return;
            if (this.widget) return;

            if (this.internal_display === false) return;
            this.internal_display = false;
        });
    }

    render() {
        const styles = {
            display: this.internal_display && !this.widget ? 'block' : 'none',
        };

        return html`
            <div style=${styleMap(styles)}>
                <div class="hov unvis" @click=${this.toggle}></div>
                <slot @slotchange=${this._handleSlotchange}></slot>
            </div>
            <game-backlog></game-backlog>
        `;
    }
}
customElements.define('scene-box', SceneBox);

if (import.meta.hot) {
    import.meta.hot.accept((mod) => mod.render());
}
