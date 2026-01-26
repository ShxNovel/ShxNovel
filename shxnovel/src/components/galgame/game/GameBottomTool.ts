import { LitElement, css, html } from 'lit';
// import * as core from '@shxnovel/pages/index.js';
import { BtnController } from './BtnController';
import { customElement, property } from 'lit/decorators.js';
import { boxConnection } from './connection';

/**
 * Emit `btn-on`, `btn-off` event \
 * Solves active issue here for incompatible btns.
 */
@customElement('game-bottom-tool')
export class GameBottomTool extends LitElement {
    static properties = {
        ctrl_down: {},
        active_btn: {},
    };

    controller = new BtnController(this);

    static styles = css`
        .tools {
            display: flex;
            position: absolute;
            justify-content: flex-end;
            overflow: visible;
            margin-left: 25%;
            width: 75%;
            /* height: 10%; */
            bottom: 0;
            margin-bottom: 1rem;
        }

        .tools svg {
            position: relative;
            display: inline-block;
            width: 1.5rem;
            height: fit-content;
            top: 0.2rem;
            right: 0.2rem;
        }

        .tool_btn {
            cursor: url('../icon/c_mouse.png'), pointer;

            height: fit-content !important;
            width: fit-content;
            text-align: center;

            font-family: 'AlimamaDongFangDaKai';

            margin-right: 0.5rem;
            padding: 0px 0.5rem 0.1rem 0.9rem;

            letter-spacing: 0.3rem;
            font-size: 1.5rem;
            font-weight: bold;

            display: block;
            overflow: hidden;
            position: relative;
            background-color: #88888833;
            color: #2c3e50;
            border-radius: 1rem;
            transition: cubic-bezier(0.075, 0.82, 0.165, 1) 0.1s;
        }

        .tool_btn::before {
            cursor: url('../icon/c_mouse.png'), pointer;
            content: '';
            position: absolute;
            width: 50px;
            height: 200%;
            background-color: rgba(255, 255, 255, 0.6);
            transform: skew(45deg) translate3d(-200px, 0, 0);
        }

        .tool_btn:hover {
            color: white;
            background-color: #2c3e50;
        }

        .tool_btn svg path {
            fill: #2c3e50;
        }

        .tool_btn:hover svg path {
            fill: white;
        }

        .tool_btn:hover::before {
            transition: ease-in-out 0.5s;
            transform: skew(45deg) translate3d(300px, 0, 0);
        }

        .tool_btn:active {
            transform: translate(0, 2px);
            box-shadow: 0px 1px 0px 0px #f39c12;
        }

        .active {
            color: white;
            background-color: #2c3e50;
            box-shadow: 0px 1px 0px 0px #f39c12;

            svg path {
                fill: white;
            }
        }
    `;

    active_btnName?: string;

    @property({ type: Boolean })
    ctrl_down: boolean;

    constructor() {
        super();

        this.ctrl_down = false;
        this.active_btnName = undefined;

        this.addEventListener('click', (event) => {
            event.stopPropagation();
        });
    }

    getBtnByIdName(idName: string) {
        const name = `btn_${idName}`;
        const btn = this.shadowRoot!.querySelector(`#${name}`);
        return { name, btn };
    }

    dispatch_btn_event(idName: string, status = false) {
        const name = `btn_${idName}`;
        const btn = this.shadowRoot!.querySelector(`#${name}`)!;
        const kind = btn.classList.contains('atcive') || status ? 'on' : 'off';
        const eventName = `${idName}-${kind}`;
        console.log(eventName);
        const ev = new CustomEvent(eventName, {
            bubbles: true,
            cancelable: false,
        });
        this.dispatchEvent(ev);
    }

    isActive(idName: string) {
        const { btn } = this.getBtnByIdName(idName);
        return btn!.classList.contains('active');
    }

    toggleActive(idName: string) {
        const { btn } = this.getBtnByIdName(idName);
        btn!.classList.toggle('active');
        this.dispatch_btn_event(idName, btn!.classList.contains('active'));
    }

    addActive(idName: string) {
        const { btn } = this.getBtnByIdName(idName);
        if (btn!.classList.contains('active')) return;
        btn!.classList.add('active');
        this.dispatch_btn_event(idName, true);
    }

    removeActive(idName: string) {
        const { btn } = this.getBtnByIdName(idName);
        if (!btn!.classList.contains('active')) return;
        btn!.classList.remove('active');
        this.dispatch_btn_event(idName);
    }

    firstUpdated() {
        boxConnection.set('toolbox', this);
        const btn_auto = this.shadowRoot!.querySelector('#btn_auto')!;
        const btn_fast = this.shadowRoot!.querySelector('#btn_fast')!;

        btn_auto.addEventListener('click', (event) => {
            if (this.ctrl_down) return;

            event.preventDefault();

            this.removeActive('fast');
            this.toggleActive('auto');
        });

        btn_fast.addEventListener('click', (event) => {
            if (this.ctrl_down) return;

            event.preventDefault();

            this.removeActive('auto');
            this.toggleActive('fast');
        });
    }

    _keep_no_active() {
        if (this.ctrl_down) {
            return false;
        }
        if (this.isActive('auto')) {
            this.removeActive('auto');
            return false;
        }
        if (this.isActive('fast')) {
            this.removeActive('fast');
            return false;
        }
        return true;
    }

    _hook_toggle = () => {
        if (this._keep_no_active() === false) return;
        // document.querySelector('scene-box')?.toggle();
        boxConnection.get('box')?.toggle();
    };

    _hook_replay = () => {
        if (this._keep_no_active() === false) return;
        const ev = new CustomEvent('replay-scene', {
            bubbles: true,
            cancelable: false,
            composed: true,
        });
        this.dispatchEvent(ev);
    };

    _hook_backlog = () => {
        const ev = new CustomEvent('open-widget-backlog', {
            bubbles: true,
            cancelable: false,
            composed: true,
        });
        this.dispatchEvent(ev);
    };

    render() {
        // prettier-ignore
        return html`
        <div class="tools">
            <div class="tool_btn" id="btn_auto"> <svg t="1706550390437" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4337" width="48" height="48"><path d="M596 359.008l160 128-39.968 49.984-160-128 39.968-49.984z" fill="#2c3e50" p-id="4338"></path><path d="M480 672l-480 0 0-320 480 0 0 64-416 0 0 192 416 0z" fill="#2c3e50" p-id="4339"></path><path d="M416 995.232l0-259.232 64 0 0 124.768 429.248-348.768-429.248-348.768 0 124.768-64 0 0-259.232 594.752 483.232z" fill="#2c3e50" p-id="4340"></path></svg>Auto</div>
            <div class="tool_btn" id="btn_fast"> <svg t="1706550653890" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1755" width="200" height="200"><path d="M269.223 905.85a15.997 15.997 0 0 1-12.61 6.15h-87.59c-6.67 0.01-10.42-7.68-6.31-12.93l301.93-386.44-302.93-387.7c-4.11-5.25-0.36-12.94 6.31-12.93h89.56c4.93 0 9.58 2.27 12.61 6.15l291.85 373.52c9.04 11.58 9.04 27.82 0 39.4l-292.82 374.78z m295 0a15.997 15.997 0 0 1-12.61 6.15h-87.59c-6.67 0.01-10.42-7.68-6.31-12.93l301.93-386.44-302.93-387.7c-4.11-5.25-0.36-12.94 6.31-12.93h89.56c4.93 0 9.58 2.27 12.61 6.15l291.85 373.52c9.04 11.58 9.04 27.82 0 39.4l-292.82 374.78z" p-id="1756" fill="#2c3e50"></path></svg>Fast</div>
            <div class="tool_btn" id="btn_replay" @click=${this._hook_replay}> <svg t="1706551128723" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2165" width="200" height="200"><path d="M880 512c0-129.794-67.195-243.894-168.697-309.41-8.881-5.733-10.588-18.274-3.114-25.748l34.376-34.376c5.296-5.296 13.577-6.234 19.785-2.043C881.592 220.92 960 357.303 960 512c0 247.424-200.576 448-448 448-39.204 0-77.233-5.036-113.473-14.496l137.078-137.078c4.205-4.205 11.365-2.515 13.246 3.127l21.293 63.879C745.757 847.558 880 695.456 880 512zM315.837 847.175c7.475-7.475 5.766-20.017-3.116-25.749C211.206 755.913 144 641.805 144 512c0-162.56 105.404-300.502 251.597-349.21l32.313 96.939c1.88 5.642 9.041 7.332 13.246 3.127L625.507 78.505C589.256 69.039 551.217 64 512 64 264.576 64 64 264.576 64 512c0 154.708 78.419 291.1 197.677 371.595 6.208 4.19 14.488 3.252 19.784-2.044l34.376-34.376z" p-id="2166"></path></svg>Replay</div>
            <div class="tool_btn" id="btn_backlog" @click=${this._hook_backlog}> <svg t="1706551109495" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1225" width="200" height="200"><path d="M64 64v704h512l256 192V768h128V64z m832 640H768v128L614.4 716.8 595.2 704H128V128h768zM256 256h512v64H256z m0 128h384v64H256z m0 128h384v64H256z" p-id="1226"></path></svg>Backlog</div>
            <div class="tool_btn" id="btn_q_save"> <svg t="1706551367372" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2457" width="200" height="200"><path d="M80 64c-8.84 0-16 7.16-16 16v768c0 8.84 7.16 16 16 16h367.47c-15.23-24.56-27.06-51.44-34.83-80H144V144h640v266.1c28.53 7.55 55.41 19.15 80 34.14V80c0-8.83-7.16-16-16-16H80z m880 640c0 141.38-114.62 256-256 256S448 845.38 448 704s114.62-256 256-256 256 114.62 256 256zM704 888c101.62 0 184-82.38 184-184s-82.38-184-184-184-184 82.38-184 184 82.38 184 184 184z m128-163.999c0 8.84-7.16 16-16 16h-76v76c0 8.84-7.16 16-16 16h-40c-8.84 0-16-7.16-16-16v-76h-76c-8.84 0-16-7.16-16-16v-40c0-8.84 7.16-16 16-16h76v-76c0-8.84 7.16-16 16-16h40c8.84 0 16 7.16 16 16v76h76c8.84 0 16 7.16 16 16v40z" p-id="2458"></path></svg>Q.save</div>
            <div class="tool_btn" id="btn_save"> <svg t="1706551159075" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2311" width="200" height="200"><path d="M942.708 542.817L953.57 524c4.42-7.65 4.42-16.35 0-24L743.43 136.02c-4.42-7.65-11.95-12-20.79-12H302.36c-8.84 0-16.37 4.35-20.79 12L71.43 500c-4.42 7.65-4.42 16.35 0 24l210.14 363.979c4.42 7.65 11.95 12 20.78 12h190.612c-21.726-23.384-39.612-50.385-52.656-80H334.69L156.88 512l177.81-307.98h355.62l138.87 240.534c45.97 22.22 85.137 56.299 113.528 98.263zM962 704c0 141.38-114.62 256-256 256S450 845.38 450 704s114.62-256 256-256 256 114.62 256 256zM706 888c101.62 0 184-82.38 184-184s-82.38-184-184-184-184 82.38-184 184 82.38 184 184 184z m36.001-72v-76H818c8.84 0 16-7.161 16-16v-40c0-8.84-7.16-16-16-16h-75.999v-75.999c0-8.84-7.161-16-16-16h-40c-8.841 0-16 7.16-16 16V668H594c-8.84 0-16 7.16-16 16v40c0 8.839 7.16 16 16 16h76.001v76c0 8.841 7.159 16 16 16h40c8.839 0 16-7.159 16-16z" p-id="2312"></path></svg>Save</div>
            <div class="tool_btn" id="btn_hide" @click=${this._hook_toggle}> <svg t="1706550916914" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2021" width="200" height="200"><path d="M449.774 512L169.76 231.986a7.997 7.997 0 0 1 0-11.314l50.911-50.911a7.999 7.999 0 0 1 11.314 0l280.014 280.014 280.008-280.008a7.997 7.997 0 0 1 11.314 0l50.911 50.911a7.998 7.998 0 0 1 0 11.313L574.224 512l280.009 280.009a7.999 7.999 0 0 1 0 11.314l-50.912 50.911a7.998 7.998 0 0 1-11.313 0L511.999 574.225 231.984 854.24a7.999 7.999 0 0 1-11.314 0l-50.911-50.912a7.998 7.998 0 0 1 0-11.313L449.774 512z" p-id="2022"></path></svg></div>
        </div>
        `;
    }
}
