# AGENTS.md

本文件为 AI 代理在本仓库中工作时提供指导。

## 命令

- `npm run dev` — 开发服务器；`npm run build` — 生产构建；`npm run preview` — 预览构建结果。
- 项目**没有 lint 和测试**。改动后通过 `npm run dev` 手动验证相关页面。

## 架构

- 纯前端 Vue 3 应用（Composition API、`<script setup>`、纯 JS，无 TypeScript）。无后端、无状态管理库、无 API 调用。
- 页面位于 `src/pages/`，每个功能工具一个页面；需同时注册到 `src/router/index.js`（懒加载路由）并添加到首页入口。新增工具这两处都要改。
- 路由使用 **hash 模式**（`createWebHashHistory`），静态构建可部署到任意静态服务器无需额外配置。不要改成 history 模式。
- `vite.config.js` 中 `base: './'`（相对路径）用于 GitHub Pages 子路径部署，必须保留。
- 推送到 `main` 会触发 GitHub Pages 自动部署（`.github/workflows/node.js.yml`）。不要把构建不过的代码推到 main。

## 约定

- UI 文案和游戏术语使用**中文**（如 史诗/神器/稀有 品级名）。
- 游戏概率数据存放在 `src/constants/stoneData.js`（及类似常量文件）。这些数值对应 DNF手游游戏内真实概率，是领域权威数据，重构时不要"修正"或取整。
- 样式全部使用 Bootstrap 5（在 `src/main.js` 全局引入），另加 `src/style.css`，不引入其他 CSS 框架。

## 提交规范

Conventional Commits + 中文描述，例如 `feat(AmplifySimulator): 新增连续增幅成功庆祝弹窗`。scope 为页面/组件名，使用 PascalCase。
