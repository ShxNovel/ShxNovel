# Canoe Runtime Implementation

## Architecture Overview

The runtime is designed with a clear separation of concerns and a strict state machine:

```
GameLauncher → BootResolver → Runtime
```

## Runtime State Machine

The runtime follows a strict state machine to ensure proper initialization and execution flow:

```
idle (尚未启动)
  ↓
booting (正在初始化 / 预热)
  ↓
ready (世界已恢复，但尚未推进)
  ↓ resume()
running (正常执行 IR)
  ↓ pause()
paused (等待输入 / 系统暂停)
  ↓ error handling
error (错误状态)
```

### State Transitions

| Method | From → To | Description |
|--------|-----------|-------------|
| `boot()` | `idle` → `booting` → `ready` | Initialize and restore game state |
| `resume()` | `ready` → `running` → `tick()` | Start script execution and tick |
| `resume()` | `paused` → `running` → `tick()` | Resume from paused state |
| `resume()` | `ready` → `ready` | Debug/Editor mode (no script execution) |
| `pause()` | `running` → `paused` | Pause for user input |
| `reset()` | `any` → `idle` | Reset all state |

## Core Components

### 1. GameLauncher
**Location:** `src/game/game-launcher/game-launcher.ts`

Manages game launch intents and provides a clean API for starting the game.

```typescript
GameLauncher.launch({ type: 'new' });
const intent = GameLauncher.consume();
```

#### Supported Intents:
- `new`: Start a new game
- `continue`: Continue from latest save
- `load`: Load specific save by ID
- `debug`: Debug mode, start from specific chapter

### 2. BootResolver
**Location:** `src/game/boot-resolver/boot-resolver.ts`

Resolves launch intents into boot contexts with all necessary initialization data.

```typescript
const context = await BootResolver.resolve(intent);
```

#### Methods:
- `resolve(intent)`: Main entry point, delegates to appropriate handler
- `createNewContext()`: Creates context for new game
- `fromSave(save)`: Creates context from save data
- `fromChapter(chapterId)`: Creates context for debug mode

### 3. Runtime
**Location:** `src/runtime/index.ts`

The core runtime that manages game execution, script loading, and state management with strict state transitions.

```typescript
await runtime.boot(context);  // idle → booting → ready
await runtime.resume();       // ready → running → tick() (or paused → running → tick())
runtime.pause();              // running → paused
```

#### Boot Process (idle → booting → ready):
```typescript
async boot(context: BootContext) {
  assert(this.state === 'idle');
  this.state = 'booting';

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
}
```

#### Resume Process

**Normal Mode:**
```typescript
async resume() {
  assert(this.state === 'ready' || this.state === 'paused');
  this.state = 'running';
  this.tick();  // 执行一步脚本
}
```

**Debug/Editor Mode:**
```typescript
async resume() {
  if (meta?.isDebug || meta?.isEditor) {
    // 不执行脚本，只展示场景
    return;
  }
  this.state = 'running';
  this.tick();
}
```

#### Special Modes

**1. 读档后停在「点击继续」**
```typescript
context.meta = { waitForInput: true };
await runtime.boot(context);
await runtime.resume();  // 停在需要用户输入的地方
```

**2. 读档后立刻自动播放**
```typescript
context.meta = { autoPlay: true };
await runtime.boot(context);
await runtime.resume();  // 自动继续播放
```

**3. Debug 模式（只恢复场景，不跑脚本）**
```typescript
context.meta = { isDebug: true };
await runtime.boot(context);
await runtime.resume();  // 状态保持为 'ready'
```

**4. Editor 模式（只展示世界状态）**
```typescript
context.meta = { isEditor: true };
await runtime.boot(context);
await runtime.resume();  // 状态保持为 'ready'
```

## Usage Examples

### Start New Game
```typescript
import { GameLauncher } from '@shxnovel/canoe';
import { BootResolver } from '@shxnovel/canoe';
import { runtime } from '@shxnovel/canoe';

// Launch and start
GameLauncher.launch({ type: 'new' });
const intent = GameLauncher.consume();
const context = await BootResolver.resolve(intent);
await runtime.boot(context);
```

### Continue Game
```typescript
GameLauncher.launch({ type: 'continue' });
const intent = GameLauncher.consume();
const context = await BootResolver.resolve(intent);
await runtime.boot(context);
```

### Load Save
```typescript
GameLauncher.launch({ type: 'load', saveId: 'save-001' });
const intent = GameLauncher.consume();
const context = await BootResolver.resolve(intent);
await runtime.boot(context);
```

### Debug Mode
```typescript
GameLauncher.launch({ type: 'debug', chapterId: 'chapter-1' });
const intent = GameLauncher.consume();
const context = await BootResolver.resolve(intent);
await runtime.boot(context);
```

## Data Structures

### BootIntent
```typescript
type BootIntent =
    | { type: 'new' }
    | { type: 'continue' }
    | { type: 'load'; saveId: string }
    | { type: 'debug'; chapterId: string };
```

### BootContext
```typescript
interface BootContext {
    mode: 'new' | 'restore';
    script: {
        irId: string;        // IR file identifier
        pc: number;          // Program counter
        flags: Record<string, any>;  // Script flags
    };
    scene?: SceneSnapshot;   // Optional scene state
    runtime?: RuntimeSnapshot;  // Optional runtime state
    meta?: {
        saveId?: string;
        isAuto?: boolean;
        autoPlay?: boolean;      // 读档后是否自动播放
        waitForInput?: boolean;   // 读档后是否等待用户输入
        isDebug?: boolean;        // Debug 模式（只恢复场景）
        isEditor?: boolean;       // Editor 模式（只展示世界）
    };
}
```

### SaveData
```typescript
interface SaveData {
    id: string;
    timestamp: number;
    script: BootContext['script'];
    scene?: SceneSnapshot;
    runtime?: RuntimeSnapshot;
}
```

## TODO Items

### BootResolver
- [ ] Implement `SaveManager.loadLatest()` - Load most recent save
- [ ] Implement `SaveManager.load(saveId)` - Load save by ID
- [ ] Implement chapter ID parsing in `fromChapter()`
- [ ] Add save file validation

### Runtime
- [ ] Implement IR file loading
- [ ] Implement script interpreter
- [ ] Implement scene state restoration
- [ ] Implement runtime state restoration
- [ ] Integrate with render loop
- [ ] Add script execution engine
- [ ] Implement pause/resume logic
- [ ] Add error handling

### Save System
- [ ] Design save file format
- [ ] Implement save serialization
- [ ] Implement save validation
- [ ] Add auto-save functionality
- [ ] Add save metadata management

## Testing

See `examples/usage.ts` for complete usage examples.

## Next Steps

1. Implement SaveManager to handle save file operations
2. Implement script loading and IR file parsing
3. Implement scene and runtime state serialization
4. Integrate with the existing rendering system
5. Add comprehensive error handling
6. Write unit tests for each component
