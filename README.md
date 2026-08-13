# Friendship App

一个 uni-app Vue 3 单应用，提供登录前的代理人端（A）与商家端（B）入口切换，并在登录后进入相应工作台。

## 运行与构建

```bash
npm run dev:h5
npm run dev:app
```

开发环境可将 `.env.example` 复制为被 Git 忽略的 `.env.local`。发布构建不会读取 `.env.local` 中的接口地址，必须由发布终端或 CI 显式提供真实 HTTPS 地址：

```powershell
$env:UNI_API_BASE_URL="https://api.your-domain.example"
npm run build:h5
npm run build:app
```

Linux、macOS 或 Bash CI：

```bash
export UNI_API_BASE_URL="https://api.your-domain.example"
npm run build:h5
npm run build:app
```

仅做源码、路由、单元测试和微信小程序编译检查时执行：

```bash
npm run verify
```

`verify` 使用保留域名 `https://api.invalid` 完成编译检查，不代表后端联调通过，也不会生成可发布的业务包。

## 登录场景

- 默认进入 B 端商家邮箱验证码登录页。
- 可在登录前切换至 A 端代理人登录页。
- 登录页支持邮箱验证码和密码两种方式；所有原型中的手机号字段均改为邮箱字段。
- A 端提供注册、找回密码和其他登录入口；B 端提供开店协助入口。
- 登录请求必须携带 `portal`（`agent` 或 `merchant`）；成功响应必须通过 `portal`、`role`、`roles` 或对应的 `account.agent` / `account.merchant` 资料明确证明该端权限，否则客户端拒绝建立会话。最终授权仍必须由服务端完成。
- 邮箱验证码、登录、注册、重置密码、刷新令牌和退出登录均调用服务端接口，项目不包含演示验证码或本地模拟登录。
- 登录与注册前必须主动勾选服务协议和隐私政策，协议地址由公开应用配置接口返回。

## 目录说明

- `pages/auth/`：登录、注册、重置密码、商家开店协助。
- `pages/agent/`：A 端代理人页面。
- `pages/merchant/`：B 端商家页面。
- `config/portals.js`：两端文案、主题、登录入口和首页映射。
- `core/`：会话、请求、存储和路由权限能力。
- `services/`：认证、上传、权限和运行时服务。

## 发布前检查

- 在 `manifest.json` 中配置 Android 包名、iOS Bundle ID、微信小程序 AppID、签名与所需平台能力。
- 在真实设备上验证登录刷新、扫码邀请、银行卡、提现、协议跳转和弱网重试；前端编译通过不能替代后端联调。
- `npm audit` 的剩余告警主要来自 uni-app 编译链。升级时应整组升级同一版本的 `@dcloudio/*` 包并完成三端回归，不要直接使用会降级框架包的强制修复。

原有基础示例页保留在 `pages/index/index.vue`，不会参与默认登录流程。
