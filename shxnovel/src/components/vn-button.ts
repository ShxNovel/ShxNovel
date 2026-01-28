import { LitElement, html, css, unsafeCSS } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';

import '@lion/ui/define/lion-button.js';

import { LionButton } from '@lion/ui/button.js';

@customElement('vn-button')
export class VnButton extends LionButton {
    static get styles() {
        return [...super.styles, css``];
    }
}
