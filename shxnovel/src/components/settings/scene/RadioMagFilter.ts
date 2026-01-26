import { LitElement, css, html } from 'lit';
import { shxConfig } from '../../../data';

// import * as nuiBase from '../../../lib/nuiBase.js';
import * as canoe from '@shxnovel/canoe/index.ts';

import '@shoelace-style/shoelace/dist/components/radio-button/radio-button.js';
import '@shoelace-style/shoelace/dist/components/radio-group/radio-group.js';

export class RadioMagFilter extends LitElement {
    static properties = {};

    static styles = css``;

    constructor() {
        super();
    }

    solution(event: Event) {
        // @ts-ignore
        const value = Number(event.target.value);
        shxConfig.scene.magfilter = value;
        // @ts-ignore
        canoe.assets.textures.setMagFilter(value);
        canoe.rendSomeFrames();
        this.requestUpdate();
    }

    render() {
        // prettier-ignore
        return html`
            <sl-radio-group size="large"
                help-text="纹理放大采样行为"
                name="magFilter"
                value=${shxConfig.scene.magfilter}
                @sl-change=${this.solution}
            >
                <sl-radio-button value="1003" name="THREE.NearestFilter"
                    >点采样</sl-radio-button
                >
                <sl-radio-button value="1006" name="THREE.LinearFilter"
                    >双线性</sl-radio-button
                >
            </sl-radio-group>
        `;
    }
}
customElements.define('radio-magfilter', RadioMagFilter);
