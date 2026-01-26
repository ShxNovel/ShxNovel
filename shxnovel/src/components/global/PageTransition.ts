// import { createTimeline, stagger, svg } from '@juliangarnierorg/anime-beta';
import { gsap } from 'gsap';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';
import { LitElement, css, html } from 'lit';
import { customElement, property, query, queryAll } from 'lit/decorators.js';

gsap.registerPlugin(DrawSVGPlugin);

@customElement('page-transition')
export class PageTransition extends LitElement {
    static styles = css`
        .back {
            z-index: 5000;
            display: none;

            position: absolute;
            top: 0;

            width: 100%;
            height: 100%;

            background-color: royalblue;
        }

        .front {
            z-index: 5000;
            display: none;

            position: absolute;
            top: 0;
            left: 0;

            width: 100%;
            height: 100%;

            justify-content: space-around;
            flex-direction: row;
            align-items: center;
        }

        .poem {
            opacity: 1;
            color: white;
        }

        .poem object {
            width: 20rem;
            height: 20rem;
        }
    `;

    @property({ type: String })
    text?: string;

    @query('.back', true)
    back!: HTMLElement;

    @query('.front', true)
    front!: HTMLElement;

    @query('.poem', true)
    poem!: HTMLElement;

    @queryAll('.line')
    lines!: NodeListOf<Element>;

    constructor() {
        super();
    }

    makeBegin() {
        const timeline = gsap.timeline({ defaults: { duration: 0.8 } });

        timeline
            .set(this.back, { left: 0, display: 'flex' })
            .call(() => {
                this.back.style.removeProperty('right');
            })
            .set(this.front, { display: 'flex' })
            .addLabel('here')
            .fromTo(this.poem, { opacity: 1, translateY: '2em' }, { translateY: 0 }, 'here')
            // todo svg

            .fromTo(this.lines, { drawSVG: '0% 0%' }, { drawSVG: '0% 100%', ease: 'power1.inOut' }, 'here')

            .fromTo(this.back, { width: '0%' }, { width: '100%' }, 'here');

        return timeline;
    }

    makeEnd() {
        const timeline = gsap.timeline({ defaults: { duration: 0.8 } });
        timeline
            .set(this.back, {
                right: 0,
                display: 'flex',
                onComplete: () => {
                    this.back.style.removeProperty('left');
                },
            })
            .addLabel('here')
            .fromTo(this.poem, { translateY: 0 }, { opacity: 0, translateY: '+2em' }, 'here')
            .fromTo(this.back, { width: '100%' }, { width: '0%' }, 'here')
            .set(this.back, { display: 'none' })
            .set(this.front, { display: 'none' });

        return timeline;
    }

    render() {
        return html`<div class="back"></div>
            <div class="front">
                <p class="poem">
                    <svg viewBox="0 0 1024 1024" width="20rem" height="20rem">
                        <g
                            stroke="currentColor"
                            fill="none"
                            fill-rule="evenodd"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="1rem"
                        >
                            <path
                                d="M505.87 958.73l-421.19-475L241.65 277h530.07l156.73 206.68z m-393-476.2l393 441.3 393-441.3-138.7-182.4H253z"
                                class="line"
                            ></path>
                            <path
                                d="M815 449.24c-19.65 0-66.12 4.85-91.32 30.28s-30 77-30.51 94.32c0-17.8-3.47-69.35-31-97.56s-73-27.5-92.46-27.27a144.3 144.3 0 0 0 87.38-31.21c31.44-31.44 35.14-92.47 35.37-98.71 0 7.17-1.62 69.35 29.36 101 25.19 25.43 72.58 28.9 92.46 29.13z m-154-384a102 102 0 0 0 18.72 65.65 102.63 102.63 0 0 0 65.89 18.72 103.37 103.37 0 0 0-65 19.65 103.32 103.32 0 0 0-19.65 65 107.06 107.06 0 0 0-20.11-67 97.42 97.42 0 0 0-64.5-17.34 99.34 99.34 0 0 0 61.72-20.34 109.82 109.82 0 0 0 23.12-64.26zM882 231a69.3 69.3 0 0 0 12.48 44.85 69.35 69.35 0 0 0 44.85 12.72A69.36 69.36 0 0 0 895.16 302a69.37 69.37 0 0 0-13.41 44.16 72.16 72.16 0 0 0-13.63-46.24A66.41 66.41 0 0 0 824 288.11a69.32 69.32 0 0 0 42-13.87 74.62 74.62 0 0 0 15.72-43.69z"
                                class="line"
                            ></path>
                            <path
                                d="M505.87 845.46l-315.08-362.7L290 344.06h337.24a11.56 11.56 0 0 1 11.56 11.55 11.56 11.56 0 0 1-11.56 11.56H301.75l-81.6 113.74 285.72 329.64 277.41-310.92a11.31 11.31 0 0 1 16-0.16l0.17 0.16a11.11 11.11 0 0 1 0.5 15.69c-0.16 0.17-0.33 0.33-0.5 0.49z"
                                class="line"
                            ></path>
                        </g>
                    </svg>
                </p>
            </div>`;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'page-tansition': PageTransition;
    }
}
