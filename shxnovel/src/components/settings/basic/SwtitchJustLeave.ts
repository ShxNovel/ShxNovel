import { LitElement, css, html } from 'lit';
import { shxConfig } from '../../../data';

import * as core from '@shxnovel/pages/index.ts';
// import * as nuiScene from '../../../lib/nuiScene.js';

import '@shoelace-style/shoelace/dist/components/switch/switch.js';

export class SwtitchJustLeave extends LitElement {
    static properties = {};

    static styles = css``;

    constructor() {
        super();
    }

    solution() {
        shxConfig.basic.keepLeaveMention = !shxConfig.basic.keepLeaveMention;
        core.setConfirmBoxActiveStatus(shxConfig.basic.keepLeaveMention);
        this.requestUpdate();
    }

    render() {
        return html`
            <sl-switch
                size="large"
                help-text="在退出游戏前, 弹出提示框"
                ?checked=${shxConfig.basic.keepLeaveMention}
                @sl-change=${this.solution}
                >${shxConfig.basic.keepLeaveMention ? '开启' : '关闭'}</sl-switch
            >
        `;
    }
}
customElements.define('switch-just-leave', SwtitchJustLeave);
