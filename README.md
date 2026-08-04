# Friendship App

一个 uni-app Vue 3 单应用，提供登录前的代理人端（A）与商家端（B）入口切换，并在登录后进入相应工作台。

## 运行与构建

```bash
npm run dev:h5
npm run dev:app

npm run build:h5
npm run build:app
npm run verify
```

## 登录场景

- 默认进入 B 端商家邮箱验证码登录页。
- 可在登录前切换至 A 端代理人登录页。
- 登录页支持邮箱验证码和密码两种方式；所有原型中的手机号字段均改为邮箱字段。
- A 端提供注册、找回密码和其他登录入口；B 端提供开店协助入口。
- 登录请求必须携带 `portal`（`agent` 或 `merchant`）。生产环境由后端确认账号拥有对应角色后，才可返回该端首页。

`services/auth.js` 目前是本地联调实现：验证码为 `123456`。接入后端时，只需将这个文件的模拟请求替换为真实接口；邮箱验证码发送和角色校验必须在服务端完成。

## 目录说明

- `pages/auth/`：登录、注册、重置密码、商家开店协助。
- `pages/agent/`：A 端代理人页面。
- `pages/merchant/`：B 端商家页面。
- `config/portals.js`：两端文案、主题、登录入口和首页映射。
- `core/`：会话、请求、存储和路由权限能力。
- `services/`：认证、上传、权限和运行时服务。

原有基础示例页保留在 `pages/index/index.vue`，不会参与默认登录流程。
