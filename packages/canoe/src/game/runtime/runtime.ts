import { BootContext, ScriptState } from '../boot-resolver';

export type RuntimeState =
    | 'idle' // 尚未启动
    | 'booting' // 正在初始化 / 预热
    | 'ready' // 世界已恢复，但尚未推进
    | 'running' // 正常执行 IR
    | 'paused' // 等待输入 / 系统暂停
    | 'error';

export class Runtime {
    private script: ScriptState | null = null;
    private scene: any = null;
    private state: RuntimeState = 'idle';
    private context: BootContext | null = null;

    /**
     * Boot the runtime with a boot context
     * Flow: idle → booting → ready
     */
    async boot(context: BootContext): Promise<void> {
        if (this.state !== 'idle') {
            throw new Error(`Cannot boot in state '${this.state}', expected 'idle'`);
        }

        this.state = 'booting';
        this.context = context;

        try {
            // 1️⃣ 清空旧状态
            this.reset();

            // 2️⃣ 解析 & 预热资源（不触碰 IR）
            await this.preload(context);

            // 3️⃣ 构建世界（Three / Scene Graph）
            await this.restoreWorld(context.scene);

            // 4️⃣ 恢复运行时行为状态
            this.restoreRuntime(context.runtime);

            // 5️⃣ 设置脚本执行点
            this.loadScript(context.script);
            this.setPC(context.script.pc);

            // 6️⃣ 标记 ready，但不执行
            this.state = 'ready';
        } catch (error) {
            this.state = 'error';
            throw error;
        }
    }

    /**
     * Resume execution
     * Flow: ready || paused → running → tick()
     */
    async resume(): Promise<void> {
        if (this.state !== 'ready' && this.state !== 'paused') {
            throw new Error(`Cannot resume in state '${this.state}', expected 'ready' or 'paused'`);
        }

        // Debug 模式：只展示场景，不执行脚本
        if (this.context?.meta?.isDebug) {
            console.log('Debug mode: scene restored, not executing script');
            return;
        }

        // Editor 模式：只展示世界状态
        if (this.context?.meta?.isEditor) {
            console.log('Editor mode: world state displayed, not executing script');
            return;
        }

        this.state = 'running';

        try {
            this.tick();
        } catch (error) {
            this.state = 'error';
            throw error;
        }
    }

    /**
     * Pause execution
     * Flow: running → paused
     */
    pause(): void {
        if (this.state !== 'running') {
            console.warn(`Cannot pause in state '${this.state}', expected 'running'`);
            return;
        }

        this.state = 'paused';

        // TODO: Pause script execution
    }

    /**
     * Tick - execute one step of the script
     */
    tick(): void {
        if (!this.script) {
            throw new Error('Script not loaded');
        }

        // TODO: Execute one instruction at script.pc
        // TODO: Update pc
        // TODO: Check if we need to pause (wait for user input, etc.)
        console.log(`Executing instruction at pc=${this.script.pc}`);
    }

    /**
     * Reset the runtime state
     */
    reset(): void {
        this.script = null;
        this.scene = null;
        this.state = 'idle';
        this.context = null;

        // TODO: Reset all runtime state
        // - Clear scene objects
        // - Reset variables
        // - Clear event listeners
        // etc.
    }

    /**
     * Preload resources (IR files, assets, etc.)
     */
    private async preload(context: BootContext): Promise<void> {
        // TODO: Preload IR file based on context.script.irId
        // TODO: Preload assets (images, audio, etc.)
        // TODO: Warm up necessary resources

        console.log('Preloading resources for:', context.script.irId);
    }

    /**
     * Load script data
     */
    private loadScript(script: BootContext['script']): void {
        this.script = {
            irId: script.irId,
            pc: script.pc,
            flags: { ...script.flags },
        };

        // TODO: Load IR file based on irId
        // TODO: Initialize script interpreter
    }

    /**
     * Restore world state from snapshot
     */
    private async restoreWorld(snapshot: any): Promise<void> {
        this.scene = snapshot;

        // TODO: Restore scene state
        // - Background
        // - Characters
        // - Effects
        // etc.
    }

    /**
     * Restore runtime state from snapshot
     */
    private restoreRuntime(snapshot: any): void {
        // TODO: Restore runtime state
        // - Variables
        // - Internal state
        // - UI state
        // etc.

        if (snapshot) {
            console.log('Restoring runtime state');
        }
    }

    /**
     * Set program counter
     */
    private setPC(pc: number): void {
        if (!this.script) {
            throw new Error('Script not loaded');
        }
        this.script.pc = pc;
    }

    /**
     * Get current script state
     */
    getScriptState(): ScriptState | null {
        return this.script ? { ...this.script } : null;
    }

    /**
     * Get current runtime state
     */
    getState(): RuntimeState {
        return this.state;
    }

    /**
     * Get full runtime state for serialization
     */
    getRuntimeState(): any {
        return {
            state: this.state,
            script: this.script,
            scene: this.scene,
            // TODO: Add more runtime state
        };
    }
}

export const runtime = new Runtime();
