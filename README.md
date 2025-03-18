
# :warning: RoadMap

一个视觉小说框架。此项目仍处于极早期开发阶段，请稍后再来！

- [ ] Traditional
  - [x] SPA Wrapper with **barba**
    - [x] use Transition
    - [x] use View
    - [x] use Route
    - [x] support User Animation
  - [ ] Components with **Lit**
    - [ ] Gallery
      - [ ] Background
      - [ ] Music
    -  [ ] Setting
       -  [ ] normal
       -  [ ] scene
       -  [ ] sound, character
       -  [ ] text
    -  [ ] GalGame
       -  [ ] User Interact Paradigm
       -  [ ] todo
       -  [ ] todo
       -  [ ] todo
- [ ] Scene with **Three**
  - [ ] Render
    - [x] On-demand rendering
    - [x] Hookable Render Loop
      - [x] timing-hook (before, on, after, main-renderer)
      - [x] post-process (composer, pass)
  - [ ] Objects wrapper
    - [ ] camera
        - [ ] Serialization, deserialization
        - [ ] motion animation
    - [ ] shxScene
        - [ ] Serialization, deserialization
        - [ ] Assets management
    - [ ] shxObject(mesh)
      - [ ] Serialization, deserialization
      - [ ] motion animation
      - [ ] shader animation
  - [ ] Timeline with **Anime**
      - [ ] Replay
      - [ ] Fast
  - [ ] Parser
      - [ ] motion
      - [ ] sound
  - [ ] Garbage Collection
- [ ] Persistency
  - [ ] StroyBus
  - [ ] Visited Dialogue
  - [ ] Backlog
  - [ ] Save


----

<h1 align="center"> shxNovel </h1>

<h3 align="center"> Tauri 2 + ESNext + Vite 6 </h3>

## 简单介绍

项目名称来源于「神户小鸟」的拼音首字母。

我们的目标是制作一个视觉小说项目模版，具有较好的可扩展性，能简单地支持用户插件，一定程度上开箱即用。  

我们的项目 **实现或集成** 了较多的功能，并且内置了一些平凡算法，包括：
* 按需渲染、离屏渲染、后处理的简易管线，以及一些着色器包装。
* 演出时间轴，复杂动画，分支跳跃，变量。
* 脚本转译器，自定义指令，解析时 hook。
* 复杂华丽的页面切换动画，页面路由。

本质上，这个项目是基于一系列开源库的上层应用，试图验证技术栈的可行性

## 文档（WIP）

<!-- 如果不打算写代码，请参阅 [脚本文档](http://124.220.97.4/docs/command/format)。

我们鼓励您大幅度修改我们的代码，请参阅 [开发文档](http://124.220.97.4/docs/intro)。

我们主要采用珂朵莉树（颜色段合并）的平凡方法来存放数据，完成持久化，您可以阅读我们的文章 [1](http://124.220.97.4/blog/persistent-1)，[2](http://124.220.97.4/blog/persistent-2)，[3](http://124.220.97.4/blog/persistent-3)。希望可以帮到其他项目的开发者，也欢迎大家提出更好的算法。 -->

## 下载与使用

### 下载

克隆储存库，随后安装依赖。

```
git clone
npm i
```

**使用** 开发运行
```
npx tauri dev
```

## 技术栈

我们采用非主流的混合技术栈
* 采用 tauri2 完成跨平台，支持 `Windows`, `Linux`, `macOS`, `Android`, `IOS`。    
* 页面元素主要使用 Web Component 标准，避免过度水合。
  * 原生语法，开发/学习成本较低，响应式，组件黑盒化。
  * 可以较低成本地与现代流行框架集成。
* 通过 Pjax 实现 SPA，按需分片加载，利用本地 IO 提速，同时降低内存负担。
* 使用 Three.js，很好用（很难用）。

在项目初期，我们目前处于 JavaScript 和 Typescript 的混合使用阶段。   
* 我们使用 Typescript **不是**为了用类型体操换取健壮的提示，   
  **而是**为了使用位于 ESNext 的提案特性，如装饰器等。

## 许可与依赖

* shxNovel
  * 使用 MIT License 进行许可。
* 运行时 **(run-time)** 依赖以下开源项目：
  * [tauri](https://github.com/tauri-apps/tauri) Apache-2.0, MIT licenses
  * [flatted](https://github.com/WebReflection/flatted) ISC license
  * [howler](https://github.com/goldfire/howler.js) MIT license
  * [barba](https://github.com/barbajs/barba) MIT license
  * [three](https://github.com/mrdoob/three.js) MIT license
  * [typewriterjs](https://github.com/tameemsafi/typewriterjs) MIT license
  * [anime]() Mit license
  * [lit](https://github.com/lit/lit) BSD-3-Clause license
  * [material-web](https://github.com/material-components/material-web) Apache-2.0 license
  * [shoelace](https://github.com/shoelace-style/shoelace) MIT license
* 构建时 **(build-time)** 依赖以下开源项目：
  *  [tauri](https://github.com/tauri-apps/tauri) Apache-2.0, MIT licenses
  * [vite](https://github.com/vitejs/vite) MIT license
  * [node-glob](https://github.com/isaacs/node-glob) ISC license
  * [TypeScript](https://github.com/microsoft/TypeScript) Apache-2.0 license


## 已知问题

### T

由于 Three 的序列化并不容易使用，我们人为地修改了一些内置行为（以插件的外部形式）。   

目前对 Three 的资产处理比较 naive，可能存在一些轻微的内存泄露，我们会在 release 前解决这一问题。


#### T0

THREE 的序列化会把 image 变成 URI（以 base64 形式），而没有办法生成基于本地/网络地址的 URL。

我们在提 issue 无果后，只能手动在外部进行了简短的 hack，不影响其他任何模块的可用性。


### B

@Barba 的 types 文件放错了地方，我们在外部 hack 了一下，据说这一问题会在去年年底(?)修复。

~~但如果上游对这个问题进行修复，我们依然需要一次 breaking 的更新。~~

在一周（不是）的努力下，现在可以在导入路径不变的情况下 hack 类型提示，目前只要等待上游修复。。。

### F

由于我们依赖大量项目，因此健壮性更多地受到上游的影响，随着上游项目的完善，该项目也会不断增强。   