import { LitElement, html, css, unsafeCSS } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';

// 假设你的样式文件在同级目录
// @ts-ignore
import logoStyles from './vn-confirm-dialog.css?inline';
import { initConfirmBox } from '../core/system';

@customElement('vn-confirm-dialog')
export class VnConfirmDialog extends LitElement {
    // 使用 unsafeCSS 加载外部样式
    static styles = [
        unsafeCSS(logoStyles),
        // 添加一些组件内部必须的微调样式
        css`
            :host {
                display: block;
            }
        `,
    ];

    // 公开属性，允许从外部修改标题和按钮文字
    @property({ type: String }) titleText = '提示';
    @property({ type: String }) confirmText = '确定';
    @property({ type: String }) cancelText = '取消';

    // 控制显隐的状态
    @state() private _open = false;

    // 内部状态：标题和内容（每次调用时可覆盖）
    @state() private _message = '';

    // 存储 Promise 的 resolve 函数
    private _resolve: ((value: boolean) => void) | null = null;

    /**
     * 核心方法：弹出对话框并返回一个 Promise
     * @param message 提示内容
     * @param title (可选) 覆盖默认标题
     */
    async ask(message: string, title?: string): Promise<boolean> {
        this._message = message;
        if (title) this.titleText = title;
        this._open = true;

        return new Promise<boolean>((resolve) => {
            // 将 resolve 函数存起来，等用户点击按钮时再调用
            this._resolve = resolve;
        });
    }

    private _handleConfirm() {
        this._close(true);
    }

    private _handleCancel() {
        this._close(false);
    }

    private _close(result: boolean) {
        this._open = false;
        if (this._resolve) {
            this._resolve(result);
            this._resolve = null;
        }
    }

    firstUpdated() {
        initConfirmBox(this);
    }

    render() {
        // 使用 classMap 动态切换 class
        const classes = {
            wrapper: true,
            visible: this._open, // 当 _open 为 true 时，添加 .visible 类
        };

        return html`
            <div class=${classMap(classes)}>
                <!-- 遮罩层，点击遮罩也可以视为取消 -->
                <div class="backdrop" @click=${this._handleCancel}></div>

                <div class="dialog">
                    <div class="title">${this.titleText}</div>
                    <div class="content-text">
                        ${this._message}
                        <!-- 预留 Slot，万一你想放自定义 HTML (比如图片) -->
                        <slot></slot>
                    </div>

                    <div class="actions">
                        <button class="btn-cancel" @click=${this._handleCancel}>${this.cancelText}</button>
                        <button class="btn-confirm" @click=${this._handleConfirm}>${this.confirmText}</button>
                    </div>
                </div>
            </div>
        `;
    }
}
