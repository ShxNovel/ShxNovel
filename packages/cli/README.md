# ShxNovel CLI

ShxNovel 的命令行工具，用于构建和管理视觉小说项目。

## 安装

CLI 作为工作区的一部分安装，无需单独安装。

## 使用方法

```bash
# 显示帮助信息
shx-cli --help

# 显示版本信息
shx-cli --version

# 启用详细输出
shx-cli -v <command>
shx-cli --verbose <command>

# Dry run 模式（不实际修改文件）
shx-cli -d <command>
shx-cli --dry-run <command>
```

## 命令

### `asset` - 处理资源文件

扫描 `assets` 目录并生成 TypeScript 类型声明文件。

```bash
shx-cli asset [base-dir]
```

**参数：**
- `base-dir`: 项目基础目录（可选，默认为当前目录）

**选项：**
- `-o, --output <path>`: 指定输出目录

**示例：**
```bash
# 处理当前项目的资源
shx-cli asset

# 处理指定项目的资源
shx-cli asset projects/demo

# 指定输出目录
shx-cli asset projects/demo -o ./output
```

### `story` - 处理故事脚本

编译 `story` 目录中的脚本文件，生成 IR（中间表示）文件。

```bash
shx-cli story [base-dir]
```

**参数：**
- `base-dir`: 项目基础目录（可选，默认为当前目录）

**选项：**
- `-o, --output <path>`: 指定输出目录
- `-w, --watch`: 监听文件变化（待实现）

**示例：**
```bash
# 编译当前项目的故事
shx-cli story

# 编译指定项目的故事
shx-cli story projects/demo

# 指定输出目录
shx-cli story projects/demo -o ./output
```

### `world` - 处理世界定义

编译 `world` 目录中的世界定义，生成类型声明和 IR 文件。

```bash
shx-cli world [base-dir]
```

**参数：**
- `base-dir`: 项目基础目录（可选，默认为当前目录）

**选项：**
- `-o, --output <path>`: 指定输出目录

**示例：**
```bash
# 编译当前项目的世界定义
shx-cli world

# 编译指定项目
shx-cli world projects/demo
```

### `use` - 创建开发链接

为开发环境创建符号链接，将构建输出链接到 Web 应用。

```bash
shx-cli use [from] [to]
```

**参数：**
- `from`: 源目录（可选，默认为当前目录）
- `to`: 目标目录（可选，默认为 `../../shxnovel/public`）

**示例：**
```bash
# 使用默认目标
shx-cli use projects/demo

# 指定源和目标
shx-cli use projects/demo ../webapp/public
```

### `build` - 完整构建

执行完整的构建流程（asset + story + world）。

```bash
shx-cli build [base-dir]
```

**参数：**
- `base-dir`: 项目基础目录（可选，默认为当前目录）

**选项：**
- `-o, --output <path>`: 指定输出目录
- `-w, --watch`: 监听文件变化（待实现）

**示例：**
```bash
# 完整构建当前项目
shx-cli build

# 完整构建指定项目
shx-cli build projects/demo
```

## 输出目录结构

构建完成后，会在项目目录下生成 `.vn` 目录：

```
.vn/
├── assets.d.ts               # 资源类型声明
├── assets.manifest.json      # 资源清单文件（新增）
├── world.d.ts               # 世界类型声明
├── manifest.json            # 全局清单
├── storyIR/                 # 故事 IR 文件
│   ├── config.json          # 故事配置
│   └── *.ir.json            # 各章节的 IR 文件
└── worldIR/                 # 世界 IR 文件
    └── *.ir.json            # 各世界定义的 IR 文件
```

### assets.manifest.json

自动生成的资源清单文件，包含所有纹理和音频资源的详细信息：

```json
{
  "texture": {
    "bg/school": {
      "src": "bg/school.png",
      "type": "image"
    }
  },
  "audio": {
    "bgm/main": {
      "src": "bgm/main.mp3",
      "type": "audio"
    }
  },
  "meta": {
    "version": "1.0",
    "generatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**使用方式：**
```typescript
import assets from './.vn/assets.manifest.json';

const bg = assets.texture['bg/school'];
console.log(bg.src); // "bg/school.png"
```

详细文档请参考 [ASSET_MANIFEST.md](ASSET_MANIFEST.md)。

## 日志级别

CLI 支持不同的日志级别：

- `[DEBUG]`: 调试信息（需要 `-v` 或 `--verbose`）
- `[INFO]`: 一般信息（默认）
- `[WARN]`: 警告信息
- `[ERROR]`: 错误信息
- `[SUCCESS]`: 成功信息

## 错误处理

CLI 提供详细的错误信息和错误代码：

| 错误代码 | 说明 | 退出码 |
|---------|------|--------|
| `VALIDATION_ERROR` | 输入验证失败 | 1 |
| `FILE_NOT_FOUND` | 文件或目录不存在 | 1 |
| `CONFIG_ERROR` | 配置文件错误 | 1 |

## 开发

### 构建项目

```bash
pnpm run build
```

### 运行测试

```bash
pnpm run test
```

## TODO

- [ ] 实现 watch 模式
- [ ] 添加性能统计
- [ ] 支持自定义配置文件
- [ ] 添加并行构建支持
- [ ] 实现增量构建
- [ ] 添加缓存机制
- [ ] 支持 WebAssembly 后端
