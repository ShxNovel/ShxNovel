import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { boxConnection } from './connection';

export interface SpeakerJSON {
    speaker: string;
}

@customElement('game-speaker')
export class GameSpeaker extends LitElement {
    static properties = {
        inner_item: {},
    };

    @property({ type: String })
    inner_item: string;

    static styles = css`
        .speaker {
            position: absolute;

            float: left;
            top: -2.5rem;

            min-width: 15%;
            width: fit-content;

            font-size: 2rem;
            border-radius: 0.5rem 0.5rem 1rem 1rem;
            border-top: 0.4rem solid #ffffff40;

            margin-left: 20%;
            padding: 0 2rem;

            text-align: center;
            color: white;
            background-color: #00000040;

            clip-path: circle(50% at 50% 50%);
        }

        .speaker {
            line-height: 1rem;
        }
    `;

    constructor() {
        super();

        this.inner_item = '永遠の巫女';
    }

    dump(): SpeakerJSON {
        return { speaker: this.inner_item };
    }

    restore(content: SpeakerJSON) {
        this.inner_item = content.speaker;
    }

    firstUpdated() {
        boxConnection!.set('speaker', this);
    }

    render() {
        return html`<div class="speaker">
            <p>${unsafeHTML(this.inner_item)}</p>
        </div>`;
    }
}
