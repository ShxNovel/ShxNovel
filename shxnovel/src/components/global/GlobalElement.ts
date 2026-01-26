import { LitElement, html } from 'lit';
import { customElement, query } from 'lit/decorators.js';

import './PageTransition';
import './HotFix';

import { PageTransition } from './PageTransition';
import { HotFix } from './HotFix';

@customElement('global-element')
export class GlobalElement extends LitElement {
    @query('page-transition', true)
    pageTansition!: PageTransition;

    @query('hot-fix', true)
    hotFix!: HotFix;

    render() {
        return html`
            <!-- <page-transition></page-transition> -->
            <hot-fix></hot-fix>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'global-element': GlobalElement;
    }
}
