## 代码仓库

这个仓库包括多个包和工具，用于支持视觉小说 VN 相关的开发工作。

```
仓库结构
├── ./shxnovel
└── ./packages
    ├── ./rewrite
    ├── ./world
    └── ./canoe
```

shxnovel 是流水线上最后一个包，负责添加用户界面，以及打包。
packages 包括多个包 `rewrite`，`canoe`，用于支持 shxnovel 的开发工作。

### packages

如下 packages 子包按顺序，构成流水线结构。
每个子包负责正交的一部分职责。

-   rewrite
    -   负责 User Script 用户脚本部分。
        提供剧本 DSL，支持设计剧情、动画、资源引用。
-   canoe
    -   负责 Runtime 运行时部分
        职责为接触 render loop / frame scheduling / scene orchestration 等
