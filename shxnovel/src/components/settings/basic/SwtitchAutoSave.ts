import { LitElement, css, html } from 'lit';
// import { nuiConfig } from '../../../lib/nuiData.js';

// import * as nuiBase from '../../../lib/nuiBase.js';
// import * as nuiScene from '../../../lib/nuiScene.js';

import '@shoelace-style/shoelace/dist/components/switch/switch.js';

export class SwtitchAutoSave extends LitElement {
    static properties = {};

    static styles = css``;

    constructor() {
        super();
    }

    render() {
        return html` <sl-switch size="large" help-text="自动保存" checked disabled>总是</sl-switch> `;
    }
}
customElements.define('switch-auto-save', SwtitchAutoSave);
