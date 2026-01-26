import { LitElement, css, html } from 'lit';
// import { nuiConfig } from '../../lib/nuiData.js';

// import * as nuiBase from '../../lib/nuiBase.js';
// import * as nuiScene from '../../lib/nuiScene.js';

import './scene/SwtitchAntialias.js';
import './scene/RadioMinFilter.js';
import './scene/RadioMagFilter.js';

import '@shoelace-style/shoelace/dist/components/tooltip/tooltip.js';

import '@shoelace-style/shoelace/dist/components/radio-button/radio-button.js';
import '@shoelace-style/shoelace/dist/components/radio-group/radio-group.js';

import '@shoelace-style/shoelace/dist/components/switch/switch.js';

export class SettingScene extends LitElement {
    static properties = {};

    static styles = css`
        .wrapper {
            padding-left: 10rem;
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            grid-auto-rows: minmax(8rem, auto);
            align-items: center;
        }

        switch-antialias {
            grid-column-start: 1;
            grid-column-end: 2;
        }

        radio-minfilter {
            grid-column-start: 2;
            grid-column-end: 4;
        }

        radio-magfilter {
            grid-column-start: 2;
            grid-column-end: 4;

            grid-row-start: 2;
            grid-row-end: 3;
        }
    `;

    constructor() {
        super();
    }

    render() {
        return html`
            <div class="wrapper">
                <switch-antialias></switch-antialias>
                <radio-minfilter></radio-minfilter>
                
                <radio-magfilter></radio-magfilter>
            </div>
        `;
    }
}
customElements.define('setting-scene', SettingScene);