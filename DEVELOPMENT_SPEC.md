# uni-app Vue3 + uView Pro 微信交友小程序 完整开发规范
> **主包 2MB 体积管控专用规范**
> 
> 本文档定义了本项目在微信小程序环境下的包体积控制、分包策略、三方组件引入以及静态资源管理的核心规范。所有后续开发及 AI 协作助手在修改代码、设计架构或引入新依赖时，**必须严格遵守此规范**。

---

## 一、 项目目录 & 分包强制规范（核心控体积）

为确保小程序主包体积控制在 **1.4MB** 以内（为后续业务留出空间），所有非常规启动页面和低频业务必须进行分包隔离。

### 1. 页面分包归属表

| 包类型 | 包含页面 | 限制条件 |
| :--- | :--- | :--- |
| **主包 (`pages/`)** | 匹配首页、动态广场、聊天会话列表、个人中心、登录弹窗页 | 仅存放 Tabbar 核心页面与全局登录页。**禁止新增页面丢入主包 pages 数组！** |
| **聊天分包 (`subpackages/sub-chat/`)** | 私聊详情、聊天气泡、表情包、音视频通话、聊天内礼物面板 | 隔离高频重度社交 UI 资源。 |
| **发布分包 (`subpackages/sub-publish/`)** | 动态发布、图片/视频上传、话题选择 | 隔离上传相关逻辑与库。 |
| **用户分包 (`subpackages/sub-user/`)** | 用户详情页、相亲筛选、相册、个人资料编辑、黑名单、粉丝关注列表 | 隔离非核心展示与交互页。 |
| **支付分包 (`subpackages/sub-pay/`)** | 会员充值、礼物商城、零钱提现、订单记录 | 隔离支付 SDK 与财务逻辑。 |
| **系统分包 (`subpackages/sub-setting/`)** | 设置、关于我们、隐私协议、意见反馈、客服 | 隔离低频次配置页。 |

### 2. 目录分层硬性规则

```text
├── pages/                    # 主包：仅存放核心 Tabbar 页面 + 全局登录页
├── static/                   # 主包静态资源：仅存放 Tabbar 图标、Logo，单图必须 ≤ 10KB
├── components/               # 主包全局轻量组件：单文件大小必须 ≤ 15KB（如全局 CustomNavbar）
├── store/                    # Pinia 全局状态管理
├── utils/                    # 全局通用轻量工具（请求拦截器、核心格式化）
├── uni_modules/uview-pro     # uView Pro 核心库，采用 easycom 按需编译
├── subpackages/              # 业务分包根目录
│   ├── sub-chat/             # 聊天相关页面、私有组件、本地表情包资源
│   ├── sub-publish/          # 动态发布页面、私有上传组件
│   ├── sub-user/             # 用户详情、相亲相册、资料编辑页
│   ├── sub-pay/              # 充值、商城、订单页面及私有逻辑
│   └── sub-setting/          # 设置、反馈、低频协议页面
```

### 3. 分包资源隔离规则
- **绝对隔离原则**：分包专属的图片、组件、JS 逻辑、SDK 必须存放在对应分包目录内，禁止放入主包 `static/` 或 `components/`。
- **引用单向性**：分包之间**禁止互相 import** 组件或 JS 逻辑；分包仅允许引用主包的公共资源（如主包 `utils/`、`store/`、`components/`）。

### 4. `pages.json` 强制配置项
- 必须在 `pages.json` 中配置分包，并开启分包优化和懒加载：
```json
{
  "easycom": {
    "autoscan": true,
    "custom": {
      "^u-(.*)": "uview-pro/components/u-$1/u-$1.vue"
    }
  },
  "pages": [
    // 仅存放 Tabbar 与登录页
  ],
  "subPackages": [
    {
      "root": "subpackages/sub-chat",
      "pages": [
        { "path": "chat-detail/index", "style": { "navigationBarTitleText": "私聊" } }
      ]
    }
    // 其他分包配置
  ],
  "preloadRule": {
    "pages/index/index": {
      "network": "all",
      "packages": ["subpackages/sub-chat"]
    }
  }
}
```

---

## 二、 uView Pro 组件库开发规范（防体积暴涨）

uView Pro 包含大量组件，若使用不当会直接撑爆主包。

### 1. 全局配置与按需引入
- **禁止全局全量注册组件**：虽然可以使用 `app.use(uviewPro)` 初始化 `$u` 挂载和主题（因为其 `install` 默认不全局注册组件，仅挂载核心 JS），但**严禁手动全局导入并注册所有组件**。
- **easycom 自动编译**：通过 `pages.json` 中的 `easycom` 配置，uni-app 会自动将模板中使用的组件（如 `<u-button>`）在编译阶段进行按需打包，未使用的组件不会进入最终代码包。

### 2. 样式按需导入
- [App.vue](file:///f:/project/friendshipApp/App.vue) 中仅引入 uView Pro 的核心样式（包括基础排版、flex 混入）：
  ```scss
  @import 'uview-pro/index.scss';
  ```
- **禁止**在 `uni.scss` 或 `App.vue` 中全局 `@import` 组件私有的具体 scss 样式，利用 easycom 会自动提取组件 `.vue` 中的 scoped 样式。

### 3. 冗余组件物理清理
- 在提审前，对于明确不使用的复杂组件（如 `u-calendar`、`u-select` 多级联动、`u-keyboard` 等），可将 `node_modules/uview-pro/components/` 对应文件夹彻底删除，减少依赖分析和编译的潜在体积。

---

## 三、 静态资源（图片 / 字体 / 表情包）硬性规范

静态资源是小程序包体积超限的第一大诱因，必须严格进行线上化与轻量化处理。

### 1. 图片资源红线
- **WebP 优先**：本地小图必须采用 WebP 格式；单张图片大小**禁止超过 10KB**。
- **主包 static 限制**：主包 `static/` 仅允许存放 Tabbar 未激活/激活图标、全局小 Logo 样式，总计体积不得超过 **100KB**。
- **CDN 线上化**：所有大图背景、礼物动效、引导页、相册默认图、表情包图片**必须全部上传至云端 CDN**，通过线上 URL 加载，绝对禁止放入代码仓。
- **分包局部存放**：若有分包特有的小图（如聊天气泡框等），必须存放在该分包的 `static/` 目录下，严禁丢入主包。

### 2. 字体文件配置
- **禁止打包**：自定义字体（TTF/WOFF）**一律禁止**打包进小程序。
- **线上加载**：字体库必须通过 CDN 引入，在页面中通过 `uni.loadFontFace` 异步动态加载。
- 优先使用系统默认字体，减少不必要的艺术字体引入。

### 3. 表情包与贴图
- 交友小程序的表情包系统，其本地仅保留极小（< 2KB）的占位缩略图，表情包大图全部使用 CDN 地址动态渲染。

---

## 四、 JS / 第三方依赖 / SDK 代码规范（防 JS 臃肿）

### 1. 导出规范（保证 Tree-Shaking 摇树优化）
- 编写公共工具类（如 `utils`）时，**必须**使用具名导出，以便打包工具识别并剔除无用代码：
  ```javascript
  // 推荐：具名导出（Tree-Shaking 友好）
  export function formatDate(time) { ... }
  
  // 严禁：默认导出整合成大对象
  export default { formatDate, encryptData, ... }
  ```

### 2. 大型第三方 SDK 的动态异步引入
- 针对腾讯 IM (TUIKit)、网易云信、支付宝/微信支付、人脸识别等大型 SDK，**严禁在主包 main.js 中全局 import**。
- 必须在分包的具体页面内，通过 `import()` 进行动态异步加载：
  ```javascript
  // 分包聊天页面异步导入 IM SDK 示例
  const initIM = async () => {
    // #ifdef MP-WEIXIN
    const { TIM } = await import('tencent-cloud-im-uniapp');
    // 进行 IM 初始化逻辑...
    // #endif
  }
  ```

### 3. 条件编译的精准使用
- 必须使用 `#ifdef MP-WEIXIN`、`#ifndef MP-WEIXIN` 等条件编译指令，在打包时直接将 H5 或 App 的冗余代码完全剔除。
- 不仅在 JS 中使用，在 `<template>` 和 `<style>` 中同样要隔离跨端代码。

### 4. 生产环境混淆与调试清除
- 生产环境打包必须开启 `terser` 或 `esbuild` 压缩，并开启 `drop_console` 和 `drop_debugger` 选项剔除所有调试日志。
- 禁止提交大段注释掉的废弃代码，无用逻辑必须彻底物理删除。

---

## 五、 组件拆分与页面开发规范

### 1. 组件分级架构
- **全局公用轻量组件**：仅将全局通用、高复用且体积极小（≤ 15KB）的组件放在主包 components/ 目录。
- **页面私有业务组件**：每个页面专属的业务组件（如匹配卡片、筛选抽屉等），必须存放在该页面所在的**分包同级目录**中，禁止提升到主包全局目录。

### 2. 长列表与信息流优化
- 交友小程序的“动态广场”与“匹配列表”拥有大量多图、长列表数据，必须使用虚拟滚动（如 `u-list`、`u-waterfall` 等）来复用 DOM，避免渲染全部数据导致小程序内存溢出与响应卡顿。
- 图片组件必须配置 `lazy-load` 懒加载属性，且按需分页拉取数据。

---

## 六、 Vite & manifest.json 打包构建强制配置规范

### 1. `manifest.json` 微信小程序端配置
必须在 manifest.json 的 `"mp-weixin"` 属性中配置以下压缩与优化项：
```json
"mp-weixin": {
  "setting": {
    "minifyWXML": true,
    "minifyWXSS": true,
    "minifyJS": true,
    "codeProtect": true,
    "es6": true
  },
  "optimization": {
    "subPackages": true
  },
  "lazyCodeLoading": "requiredComponents"
}
```

### 2. `vite.config.js` 编译与压缩配置
对于 Vue 3 + Vite 的 uni-app 项目，需在 `vite.config.js` 中配置以下选项以实现最大化压缩（若项目没有该文件，可参考新建配置）：
```javascript
import { defineConfig } from 'vite';
import uni from '@dcloudio/vite-plugin-uni';

export default defineConfig({
  plugins: [uni()],
  build: {
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    sourcemap: false,
    assetsInlineLimit: 1024, // 1KB 以下小图自动转 base64
    cssCodeSplit: true, // CSS 代码分割
  },
  define: {
    __VUE_OPTIONS_API__: false, // 禁用 Options API，减少 Vue 3 核心库打包体积
    __VUE_PROD_DEVTOOLS__: false, // 禁用生产环境 Devtools
  }
});
```

---

## 七、 上线前体积自检清单

在每次打包提审前，开发人员/AI 必须执行以下自检操作：
1. **分析包大小**：在 HBuilderX 中点击「发行」-> 「小程序 - 微信」，并在微信开发者工具中打开「代码依赖分析」，确保主包体积 **< 1.4MB**，分包大小 **< 1.5MB**。
2. **定位大体积文件**：查找是否有第三方库（如 `lodash`、`crypto-js` 等）被全量导入，确保使用了按需导入或替换为轻量版。
3. **核查组件依赖**：确认所有主包引入的自定义组件都不包含对分包专有 SDK 的直接 import，防止造成分包内依赖被提升到主包。
4. **清理冗余图片**：本地 `static` 目录下所有图片进行压缩与 CDN 迁移复核。
