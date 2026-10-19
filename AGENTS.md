# AGENTS.md

本文件为 AI 代理在本仓库中工作时提供指导。

## 命令

- `npm run dev` — 开发服务器；`npm run build` — 生产构建；`npm run preview` — 预览构建结果。
- `npm test` — 运行常量与算法测试（Node 内置 `node:test`，零依赖，无需安装）。**改动了 `src/constants/` 下的游戏数值后必须跑一次。**
- 项目**没有 lint**。UI 改动后仍需通过 `npm run dev` 手动验证相关页面。

## 架构

- 纯前端 Vue 3 应用（Composition API、`<script setup>`、纯 JS，无 TypeScript）。无后端、无状态管理库、无 API 调用。
- 页面位于 `src/pages/`，每个功能工具一个页面；需同时注册到 `src/router/index.js`（懒加载路由）并添加到首页入口。新增工具这两处都要改。
- 路由使用 **hash 模式**（`createWebHashHistory`），静态构建可部署到任意静态服务器无需额外配置。不要改成 history 模式。
- `vite.config.js` 中 `base: './'`（相对路径）用于 GitHub Pages 子路径部署，必须保留。
- 推送到 `main` 会触发 GitHub Pages 自动部署（`.github/workflows/node.js.yml`）。不要把构建不过的代码推到 main。

## 约定

- UI 文案和游戏术语使用**中文**（如 史诗/神器/稀有 品级名）。
- 游戏概率与消耗数据一律存放在 `src/constants/`（`stoneData.js` 源石、`boxData.js` 超武盒子、`amplifyData.js` 增幅）。这些数值对应 DNF手游游戏内真实概率，是领域权威数据，重构时不要"修正"或取整。
- **不要在页面模板里手写游戏数值或概率文案**。页面的概率说明表必须由常量 `v-for` 渲染（已有：`crossGradeProbabilityTexts()`、`BOX_ITEMS`、`failureRuleSummaries()`），否则会与常量漂移。
- 需要原样展示的小数位（如 `0.0010`）不能只靠 JS 数值，JS 会把 `0.0010` 变成 `0.001`。这类数值在常量里同时提供 `display` 字段。
- 新增游戏数值时，同步在 `tests/constants.test.js` 补断言。
- 样式全部使用 Bootstrap 5（在 `src/main.js` 全局引入），另加 `src/style.css`，不引入其他 CSS 框架。

## 提交规范

Conventional Commits + 中文描述，例如 `feat(AmplifySimulator): 新增连续增幅成功庆祝弹窗`。scope 为页面/组件名，使用 PascalCase。
