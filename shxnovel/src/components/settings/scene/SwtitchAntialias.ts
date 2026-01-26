import { LitElement, css, html } from 'lit';
import { shxConfig } from '../../../data/index.js';

// import * as nuiBase from '../../../lib/nuiBase.js';
import * as canoe from '@shxnovel/canoe/index.ts';

import '@shoelace-style/shoelace/dist/components/switch/switch.js';

export class SwtitchAntialias extends LitElement {
    static properties = {};

    static styles = css``;

    constructor() {
        super();
    }

    antialias() {
        shxConfig.scene.antialias = !shxConfig.scene.antialias;

        // canoe.mainRenderer.antialias = shxConfig.scene.antialias;

        canoe.rendSomeFrames();
        this.requestUpdate();
    }

    render() {
        return html`
            <sl-switch
                size="large"
                help-text="反锯齿"
                ?checked=${shxConfig.scene.antialias}
                @sl-change=${this.antialias}
                >${shxConfig.scene.antialias ? '开启' : '关闭'}</sl-switch
            >
        `;
    }
}
customElements.define('switch-antialias', SwtitchAntialias);
