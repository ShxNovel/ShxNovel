import { GameLauncher } from '../src/game/game-launcher';
import { BootResolver } from '../src/game/boot-resolver';
import { runtime } from '../src/runtime';

/**
 * Example: Starting a new game
 */
async function startNewGame() {
    // 1. Launch the game with 'new' intent
    GameLauncher.launch({ type: 'new' });

    // 2. Consume the intent and resolve boot context
    const intent = GameLauncher.consume();
    const context = await BootResolver.resolve(intent);

    // 3. Boot the runtime (idle → booting → ready)
    await runtime.boot(context);
    console.log('Runtime state after boot:', runtime.getState()); // 'ready'

    // 4. Start execution (ready → running → tick)
    await runtime.resume();
    console.log('Runtime state after resume:', runtime.getState()); // 'running'

    console.log('Game started!', context);
}

/**
 * Example: Continue from save (wait for input)
 * 读档后停在「点击继续」
 */
async function continueFromSave() {
    GameLauncher.launch({ type: 'continue' });

    const intent = GameLauncher.consume();
    const context = await BootResolver.resolve(intent);

    // 设置为等待用户输入模式
    context.meta = {
        ...context.meta,
        waitForInput: true,
    };

    await runtime.boot(context);
    console.log('Runtime state:', runtime.getState()); // 'ready'

    await runtime.resume();
    console.log('Runtime state:', runtime.getState()); // 'running'
    // 游戏会停在等待用户输入的状态
}

/**
 * Example: Continue from save (auto play)
 * 读档后立刻自动播放
 */
async function continueFromSaveAuto() {
    GameLauncher.launch({ type: 'continue' });

    const intent = GameLauncher.consume();
    const context = await BootResolver.resolve(intent);

    // 设置为自动播放模式
    context.meta = {
        ...context.meta,
        autoPlay: true,
    };

    await runtime.boot(context);
    console.log('Runtime state:', runtime.getState()); // 'ready'

    await runtime.resume();
    console.log('Runtime state:', runtime.getState()); // 'running'
    // 游戏会自动继续播放
}

/**
 * Example: Debug mode
 * 只恢复场景，不跑脚本
 */
async function debugChapter(chapterId: string) {
    GameLauncher.launch({ type: 'debug', chapterId });

    const intent = GameLauncher.consume();
    const context = await BootResolver.resolve(intent);

    // 设置为 Debug 模式
    context.meta = {
        ...context.meta,
        isDebug: true,
    };

    await runtime.boot(context);
    console.log('Runtime state after boot:', runtime.getState()); // 'ready'

    await runtime.resume();
    console.log('Runtime state after resume:', runtime.getState()); // 'ready'
    // 注意：仍然是 'ready'，因为 Debug 模式不执行脚本

    console.log('Debug mode: scene restored, script not executed');
}

/**
 * Example: Editor mode
 * 只展示世界状态
 */
async function editorMode(saveId: string) {
    GameLauncher.launch({ type: 'load', saveId });

    const intent = GameLauncher.consume();
    const context = await BootResolver.resolve(intent);

    // 设置为 Editor 模式
    context.meta = {
        ...context.meta,
        isEditor: true,
    };

    await runtime.boot(context);
    console.log('Runtime state after boot:', runtime.getState()); // 'ready'

    await runtime.resume();
    console.log('Runtime state after resume:', runtime.getState()); // 'ready'
    // 注意：仍然是 'ready'，因为 Editor 模式不执行脚本

    console.log('Editor mode: world state displayed, script not executed');
}

/**
 * Example: Pause and resume
 */
async function pauseAndResume() {
    // Start game
    GameLauncher.launch({ type: 'new' });
    const intent = GameLauncher.consume();
    const context = await BootResolver.resolve(intent);

    await runtime.boot(context);
    await runtime.resume();
    console.log('Runtime state:', runtime.getState()); // 'running'

    // Pause the game (running → paused)
    runtime.pause();
    console.log('Runtime state after pause:', runtime.getState()); // 'paused'

    // Resume (paused → running → tick)
    await runtime.resume();
    console.log('Runtime state after resume:', runtime.getState()); // 'running'
}

/**
 * Example: Accessing runtime state
 */
function getRuntimeState() {
    const state = runtime.getState();
    const scriptState = runtime.getScriptState();
    const fullRuntimeState = runtime.getRuntimeState();

    console.log('Runtime state:', state);
    console.log('Script state:', scriptState);
    console.log('Full runtime state:', fullRuntimeState);

    return { state, scriptState, fullRuntimeState };
}

/**
 * Example: State transition monitoring
 */
function monitorStateTransitions() {
    console.log('Current state:', runtime.getState());

    // Boot sequence
    // idle → booting → ready

    // Resume sequence
    // ready → running (or paused → running)
    // 如果是 Debug 或 Editor 模式：ready → ready (不执行脚本)

    // Pause sequence
    // running → paused

    // Reset sequence
    // any → idle
}

// Export examples
export {
    startNewGame,
    continueFromSave,
    continueFromSaveAuto,
    debugChapter,
    editorMode,
    pauseAndResume,
    getRuntimeState,
    monitorStateTransitions,
};
