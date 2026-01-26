import { LitElement, PropertyValues, html, unsafeCSS } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { Router, Commands } from '@vaadin/router';

import gsap from 'gsap';
import { CustomEase } from 'gsap/CustomEase';
import { CustomBounce } from 'gsap/CustomBounce';

// @ts-ignore
import inlineStyles from './game-logo.css?inline';

gsap.registerPlugin(CustomEase, CustomBounce);

@customElement('game-logo')
export class GameLogo extends LitElement {
    static styles = unsafeCSS(inlineStyles);

    firstUpdated() {
        const q = gsap.utils.selector(this.shadowRoot);

        const tl = gsap.timeline({ defaults: { duration: 0.8, ease: 'power1.inOut' } });

        tl.eventCallback('onComplete', () => {
            Router.go('/menu');
        });

        tl.delay(0.5)
            .fromTo(
                q('.ml5 .line'),
                {
                    opacity: 0.5,
                    scaleX: 0,
                },
                {
                    opacity: 1,
                    scaleX: 1,
                    ease: 'inOutQuad',
                    duration: 0.7,
                }
            )
            .to(q('.ml5 .line'), {
                duration: 0.6,
                ease: 'expo.out',
                translateY: (i) => -0.625 + 0.625 * 2 * i + 'em',
            })
            .fromTo(
                q('.ml5 .ampersand'),
                {
                    opacity: 0,
                    scaleY: 0.5,
                },
                {
                    opacity: 1,
                    scaleY: 1,
                    ease: 'expo.out',
                    duration: 0.6,
                },
                '-=0.6'
            )
            .fromTo(
                q('.ml5 .letters-left'),
                {
                    opacity: 0,
                    translateX: '0.5em',
                },
                { opacity: 1, translateX: 0, ease: 'expo.out', duration: 0.6 },

                '-=0.3'
            )
            .fromTo(
                q('.ml5 .letters-right'),
                {
                    opacity: 0,
                    translateX: '-0.5em',
                },
                { opacity: 1, translateX: 0, ease: 'expo.out', duration: 0.6 },
                '-=0.6'
            )
            .to(q('.ml5'), {
                opacity: 0,
                duration: 1,
                ease: 'expo.out',
                delay: 1,
            });
    }

    render() {
        return html`
            <div class="boxout">
                <h1 class="ml5">
                    <span class="text-wrapper">
                        <span class="line line1"></span>
                        <span class="letters letters-left">Nuist</span>
                        <span class="letters ampersand">with</span>
                        <span class="letters letters-right">GalGame💞</span>
                        <span class="line line2"></span>
                    </span>
                </h1>
            </div>
        `;
    }
}
