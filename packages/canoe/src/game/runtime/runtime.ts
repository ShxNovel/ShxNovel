import { BootContext, ScriptState } from '../boot-resolver';
import { FlagManager } from '../resource/flag-manager';
import { StoryManager } from '../resource/story-manager';
import { logger } from '../../logger';

export type RuntimeState =
    | 'idle' // 尚未启动
    | 'booting' // 正在初始化 / 预热
    | 'ready' // 世界已恢复，但尚未推进
    | 'running' // 正常执行 IR
    | 'paused' // 等待输入 / 系统暂停
    | 'error';

export interface RuntimeEventListener {
    onTick?: (data: any) => void;
    onVisual?: (data: any) => void;
    onStateChange?: (state: RuntimeState) => void;
}

export class Runtime {
    private script: ScriptState | null = null;
    private scene: any = null;
    private state: RuntimeState = 'idle';
    private context: BootContext | null = null;

    private instructions: any[] = [];
    private listeners: RuntimeEventListener[] = [];

    /**
     * Subscribe to runtime events
     */
    subscribe(listener: RuntimeEventListener): () => void {
        this.listeners.push(listener);
        return () => this.unsubscribe(listener);
    }

    /**
     * Unsubscribe from runtime events
     */
    unsubscribe(listener: RuntimeEventListener): void {
        this.listeners = this.listeners.filter((l) => l !== listener);
    }

    private emitStateChange(newState: RuntimeState) {
        if (this.state === newState) return;
        this.state = newState;
        this.listeners.forEach((l) => l.onStateChange?.(newState));
    }

    private emitTick(data: any) {
        this.listeners.forEach((l) => l.onTick?.(data));
    }

    private emitVisual(data: any) {
        this.listeners.forEach((l) => l.onVisual?.(data));
    }

    /**
     * Boot the runtime with a boot context
     * Flow: idle → booting → ready
     */
    async boot(context: BootContext): Promise<void> {
        if (this.state !== 'idle') {
            throw new Error(`Cannot boot in state '${this.state}', expected 'idle'`);
        }

        this.emitStateChange('booting');
        this.context = context;

        try {
            FlagManager.ensure();

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
            this.emitStateChange('ready');
        } catch (error) {
            logger.error('Boot failed', error);
            this.emitStateChange('error');
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
            logger.info('Debug mode: scene restored, not executing script');
            return;
        }

        // Editor 模式：只展示世界状态
        if (this.context?.meta?.isEditor) {
            logger.info('Editor mode: world state displayed, not executing script');
            return;
        }

        this.emitStateChange('running');

        try {
            // 如果是从 paused 恢复 (用户点击)，我们需要先跳过当前的 blocking instruction (tick)
            // 也就是 pc++，然后继续执行
            // 注意：executeLoop 的 stepOverCurrent 参数负责这个逻辑
            await this.executeLoop(true);
        } catch (error) {
            logger.error('Resume failed', error);
            this.emitStateChange('error');
            throw error;
        }
    }

    /**
     * Pause execution
     * Flow: running → paused
     */
    pause(): void {
        if (this.state !== 'running') {
            logger.warn(`Cannot pause in state '${this.state}', expected 'running'`);
            return;
        }

        this.emitStateChange('paused');
    }

    /**
     * The main execution loop
     * @param stepOverCurrent whether to increment PC before starting (used when resuming from a blocking instruction)
     */
    private async executeLoop(stepOverCurrent: boolean = false): Promise<void> {
        if (!this.script) {
            throw new Error('Script not loaded');
        }

        // 如果需要跳过当前指令（比如刚从 tick 恢复）
        if (stepOverCurrent && this.instructions[this.script.pc]?.type === 'tick') {
            this.script.pc++;
        }

        while (this.state === 'running') {
            const pc = this.script.pc;
            if (pc >= this.instructions.length) {
                logger.info('End of script reached');
                this.emitStateChange('idle');
                return;
            }

            const inst = this.instructions[pc];
            const shouldWait = await this.processInstruction(inst);

            if (shouldWait) {
                // 如果指令要求等待（例如 tick），我们将状态设为 paused 并退出循环
                // 注意：PC 停留在当前指令上
                this.emitStateChange('paused');
                return;
            }

            // 非阻塞指令，继续下一条
            this.script.pc++;
        }
    }

    /**
     * Process a single instruction
     * @returns true if the instruction is blocking (wait for input), false otherwise
     */
    private async processInstruction(inst: any): Promise<boolean> {
        logger.debug(`[VM] Executing op: ${inst.type} @ ${this.script?.pc}`);

        switch (inst.type) {
            case 'flag':
                // Label, no-op
                return false;

            case 'tick':
                // 1. Execute visual/text effects
                await this.performTick(inst);
                // 2. Yield execution (wait for input)
                return true;

            case 'jump':
                // usage: { type: 'jump', target: 'flagName' }
                await this.handleJump(inst);
                return false;

            case 'branch':
                // TODO: Handle branch
                return false;

            default:
                logger.warn(`Unknown instruction type: ${inst.type}`);
                return false;
        }
    }

    private async performTick(inst: any) {
        // Dispatch actions
        const { text, animate, system } = inst;

        if (text && text.length > 0) {
            this.emitTick(text);
        }

        if (animate && animate.length > 0) {
            this.emitVisual(animate);
        }

        if (system && system.length > 0) {
            // TODO: System ops
        }
    }

    private async handleJump(inst: any) {
        const targetFlag = inst.target;

        if (!targetFlag) {
            logger.error(`[VM] Jump instruction missing target`);
            this.emitStateChange('error');
            return;
        }

        logger.debug(`[VM] Jumping to flag: ${targetFlag}`);

        try {
            const dest = await FlagManager.getFlag(targetFlag);

            if (!dest) {
                throw new Error(`Flag '${targetFlag}' not found`);
            }

            // Check if we need to switch script files
            if (this.script && dest.name !== this.script.irId) {
                const newIrId = dest.name;

                logger.debug(`[VM] Switching script: ${this.script.irId} -> ${newIrId}`);

                this.instructions = await StoryManager.get(newIrId);
                this.script.irId = newIrId;
            }

            if (this.script) {
                // Set PC to one less than target, because the executeLoop will increment it immediately after this returns
                this.script.pc = dest.pc - 1;
            }
        } catch (err) {
            logger.error(`[VM] Failed to jump to ${targetFlag}:`, err);
            this.emitStateChange('error');
            throw err;
        }
    }

    /**
     * Reset the runtime state
     */
    reset(): void {
        this.script = null;
        this.scene = null;
        // 注意：reset 不应该清空 listeners，因为 UI 组件可能只挂载一次
        this.state = 'idle';
        this.context = null;
        this.instructions = [];

        // TODO: Reset all runtime state
        // - Clear scene objects
        // - Reset variables
    }

    /**
     * Preload resources (IR files, assets, etc.)
     */
    private async preload(context: BootContext): Promise<void> {
        logger.info('Preloading resources for:', context.script.irId);

        // Load the IR file
        this.instructions = await StoryManager.get(context.script.irId);

        if (!this.instructions) {
            throw new Error(`Failed to load instructions for ${context.script.irId}`);
        }

        // TODO: Preload assets (images, audio, etc.) based on manifest?
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
    }

    /**
     * Restore world state from snapshot
     */
    private async restoreWorld(snapshot: any): Promise<void> {
        this.scene = snapshot;
        // TODO: Restore scene state
    }

    /**
     * Restore runtime state from snapshot
     */
    // @ts-ignore
    private restoreRuntime(snapshot: any): void {
        // TODO: Restore runtime state
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
        };
    }
}

export const runtime = new Runtime();
