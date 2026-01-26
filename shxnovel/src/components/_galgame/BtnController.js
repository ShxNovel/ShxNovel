import { LitElement, css, html, nothing } from 'lit';

export class BtnController {
    host;

    // auto
    auto_interval = undefined;

    hook_autoOn = this.start_auto_interval.bind(this);
    hook_autoOff = this.stop_auto_interval.bind(this);

    // fast
    fast_hot_wait = undefined;
    fast_interval = undefined;
    hook_fastOn = this.start_fast_interval.bind(this);
    hook_fastOff = this.stop_fast_interval.bind(this);

    // replay
    // not here, directly emitted by button

    /**
     * @param {LitElement} host
     */
    constructor(host) {
        (this.host = host).addController(this);
    }

    start_fast_interval() {
        const that = this;

        clearTimeout(this.fast_hot_wait);
        this.fast_hot_wait = undefined;

        if (this.fast_interval) return;

        this.fast_hot_wait = setTimeout(() => {
            that.fast_interval = setInterval(() => {
                const ev = new CustomEvent('next-scene', {
                    bubbles: true,
                    cancelable: false,
                });
                that.host.dispatchEvent(ev);
            }, 150);
        }, 100);
    }

    stop_fast_interval() {
        clearTimeout(this.fast_hot_wait);
        this.fast_hot_wait = undefined;

        clearInterval(this.fast_interval);
        this.fast_interval = undefined;
        return;
    }

    start_auto_interval() {
        clearInterval(this.auto_interval);
        this.auto_interval = setInterval(() => {
            const ev = new CustomEvent('try-next-scene', {
                bubbles: true,
                cancelable: false,
            });
            this.host.dispatchEvent(ev);
        }, 1000);
    }

    stop_auto_interval() {
        clearInterval(this.auto_interval);
    }

    hostConnected() {
        this.host.addEventListener('fast-on', this.hook_fastOn);
        this.host.addEventListener('fast-off', this.hook_fastOff);

        this.host.addEventListener('auto-on', this.hook_autoOn);
        this.host.addEventListener('auto-off', this.hook_autoOff);

        this.host.addEventListener('replay-on', this.hook_replayOn);
    }

    hostDisconnected() {
        this.stop_fast_interval();
        this.stop_auto_interval();
    }
}
