import { LitElement, css, html } from 'lit';
import { shxConfig } from '../../../data';

// import * as nuiBase from '../../../lib/nuiBase.js';
import * as canoe from '@shxnovel/canoe/index.ts';

import '@shoelace-style/shoelace/dist/components/radio-button/radio-button.js';
import '@shoelace-style/shoelace/dist/components/radio-group/radio-group.js';

export class RadioMinFilter extends LitElement {
    static properties = {};

    static styles = css``;

    constructor() {
        super();
    }

    solution(event: Event) {
        // @ts-ignore
        const value = Number(event.target.value);
        shxConfig.scene.minfilter = value;
        // @ts-ignore
        canoe.assets.textures.setMinFilter(value);
        canoe.rendSomeFrames();
        this.requestUpdate();
    }

    render() {
        // prettier-ignore
        return html`
            <sl-radio-group size="large"
                help-text="纹理缩小采样行为"
                name="minFilter"
                value=${shxConfig.scene.minfilter}
                @sl-change=${this.solution}
            >
                <sl-tooltip placement="top" content="只有性能好">
                    <sl-radio-button value="1003" name="THREE.NearestFilter"
                    >点采样</sl-radio-button>
                </sl-tooltip>
                <sl-radio-button value="1004" name="THREE.NearestMipmapNearestFilter"
                    >最近邻 Mipmap 最近</sl-radio-button
                >
                <sl-radio-button value="1005" name="THREE.NearestMipmapLinearFilter"
                    >最近邻 Mipmap 线性</sl-radio-button
                >
                <sl-tooltip placement="top" content="不错的">
                    <sl-radio-button value="1006" name="THREE.LinearFilter"
                        >双线性</sl-radio-button
                    >
                </sl-tooltip>
                <sl-radio-button value="1007" name="THREE.LinearMipmapNearestFilter"
                    >线性 Mipmap 最近</sl-radio-button
                >
                <sl-tooltip placement="top" content="默认选项">
                    <sl-radio-button value="1008" name="THREE.LinearMipmapLinearFilter"
                        >线性 Mipmap 线性</sl-radio-button
                    >
                </sl-tooltip>
            </sl-radio-group>
        `;
    }
}
customElements.define('radio-minfilter', RadioMinFilter);
