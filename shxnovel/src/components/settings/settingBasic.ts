import { LitElement, css, html } from 'lit';
// import * as core from '@shxnovel/pages/index.js';
// import * as coreData from '../../data';

import './basic/SwtitchJustLeave.js';
import './basic/SwtitchAutoSave.js';

export class SettingBasic extends LitElement {
    static properties = {};

    static styles = css`
        .wrapper {
            padding-left: 10rem;
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            grid-auto-rows: minmax(8rem, auto);
            align-items: center;
        }
    `;

    constructor() {
        super();
    }

    render() {
        return html` <div class="wrapper">
            <switch-just-leave></switch-just-leave>
            <switch-auto-save></switch-auto-save>
        </div>`;
    }
}
customElements.define('setting-basic', SettingBasic);