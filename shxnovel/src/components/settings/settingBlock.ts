import { LitElement, css, html } from 'lit';
// import * as core from '@shxnovel/pages/index.js';
import * as coreData from '../../data/index.js';

import '@shoelace-style/shoelace/dist/components/tab/tab.js';
import '@shoelace-style/shoelace/dist/components/tab-panel/tab-panel.js';
import '@shoelace-style/shoelace/dist/components/tab-group/tab-group.js';

import './settingBasic.js';
import './settingScene.js';
import './settingSound.js';

export class SettingBlock extends LitElement {
    static properties = {
        dispaly: {},
    };

    static styles = css`
        :host {
            height: inherit;
        }

        sl-tab::part(base) {
            font-size: 2rem;
        }

        sl-tab {
            padding: 0.5rem 0;
        }

        sl-tab-group {
            padding: 5rem;
            background-color: #ffffffdd;
            height: inherit;
        }
    `;

    constructor() {
        super();

        window.shxConfig = coreData.shxConfig;
    }

    render() {
        return html` <sl-tab-group placement="start" activation="manual">
            <sl-tab slot="nav" panel="basic">通用设置</sl-tab>
            <sl-tab slot="nav" panel="scene">画面显示</sl-tab>
            <sl-tab slot="nav" panel="sound">声音控制</sl-tab>

            <sl-tab-panel name="basic"><setting-basic></setting-basic></sl-tab-panel>
            <sl-tab-panel name="scene"><setting-scene></setting-scene></sl-tab-panel>
            <sl-tab-panel name="sound"><setting-sound></setting-sound></sl-tab-panel>
        </sl-tab-group>`;
    }
}
customElements.define('setting-block', SettingBlock);
