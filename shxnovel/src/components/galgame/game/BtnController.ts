import { LitElement } from 'lit';

/**
 * Controller for managing button-related functionality in the game
 * Handles auto-play, fast-forward, and replay features
 */
export class BtnController {
    // Host element reference
    private host: LitElement;

    // Timing constants
    private static readonly AUTO_INTERVAL_MS: number = 1000;
    private static readonly FAST_INTERVAL_MS: number = 150;
    private static readonly FAST_DELAY_MS: number = 100;

    // Auto-play timer
    private autoInterval: number | undefined | NodeJS.Timeout = undefined;

    // Fast-forward timers
    private fastHotWait: number | undefined | NodeJS.Timeout = undefined;
    private fastInterval: number | undefined | NodeJS.Timeout = undefined;

    // Event handlers
    public hookAutoOn = () => this.startAutoInterval();
    public hookAutoOff = () => this.stopAutoInterval();
    public hookFastOn = () => this.startFastInterval();
    public hookFastOff = () => this.stopFastInterval();
    public hookReplayOn = () => {};

    /**
     * Creates a new button controller
     * @param host The LitElement host component
     */
    constructor(host: LitElement) {
        this.host = host;
        host.addController(this);
    }

    /**
     * Starts the fast-forward interval
     * Dispatches 'next-scene' events at a rapid pace
     */
    public startFastInterval(): void {
        clearTimeout(this.fastHotWait);
        this.fastHotWait = undefined;

        if (this.fastInterval) return;

        this.fastHotWait = setTimeout(() => {
            this.fastInterval = setInterval(() => {
                const ev = new CustomEvent('next-scene', {
                    bubbles: true,
                    cancelable: false,
                });
                this.host.dispatchEvent(ev);
            }, BtnController.FAST_INTERVAL_MS);
        }, BtnController.FAST_DELAY_MS);
    }

    /**
     * Stops the fast-forward interval
     */
    public stopFastInterval(): void {
        clearTimeout(this.fastHotWait);
        this.fastHotWait = undefined;

        clearInterval(this.fastInterval);
        this.fastInterval = undefined;
    }

    /**
     * Starts the auto-play interval
     * Dispatches 'try-next-scene' events at regular intervals
     */
    public startAutoInterval(): void {
        clearInterval(this.autoInterval);
        this.autoInterval = setInterval(() => {
            const ev = new CustomEvent('try-next-scene', {
                bubbles: true,
                cancelable: false,
            });
            this.host.dispatchEvent(ev);
        }, BtnController.AUTO_INTERVAL_MS);
    }

    /**
     * Stops the auto-play interval
     */
    public stopAutoInterval(): void {
        clearInterval(this.autoInterval);
        this.autoInterval = undefined;
    }

    /**
     * Lifecycle method called when the host element is connected to the DOM
     * Sets up event listeners for various button controls
     */
    public hostConnected(): void {
        this.host.addEventListener('fast-on', this.hookFastOn);
        this.host.addEventListener('fast-off', this.hookFastOff);

        this.host.addEventListener('auto-on', this.hookAutoOn);
        this.host.addEventListener('auto-off', this.hookAutoOff);

        this.host.addEventListener('replay-on', this.hookReplayOn);
    }

    /**
     * Lifecycle method called when the host element is disconnected from the DOM
     * Cleans up intervals and event listeners
     */
    public hostDisconnected(): void {
        // Clean up intervals
        this.stopFastInterval();
        this.stopAutoInterval();

        // Remove event listeners
        this.host.removeEventListener('fast-on', this.hookFastOn);
        this.host.removeEventListener('fast-off', this.hookFastOff);
        this.host.removeEventListener('auto-on', this.hookAutoOn);
        this.host.removeEventListener('auto-off', this.hookAutoOff);
        this.host.removeEventListener('replay-on', this.hookReplayOn);
    }
}
