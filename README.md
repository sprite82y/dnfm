# ⚔️ DNF手游工具集 ⚔️

一个为 DNF 手游玩家打造的纯前端工具集，提供源石合成模拟、团武属强伤害计算、超武盒子模拟、装备增幅模拟等实用功能。

## ✨ 功能模块

### 💎 源石合成模拟器
- 选择两个源石品级（史诗/神器/稀有）和皇冠词条数，模拟合成过程
- 支持单次和批量合成（10/50/100/500/1000 次）
- 实时统计皇冠词条分布概率
- 不同品级合成概率：史诗+神器 20.22%/6.37%、史诗+稀有 22.89%/4.21%、神器+稀有 23.57%/14.64%

### ⚔️ 团武属强伤害提升计算
- 输入当前属强和提升属强，计算最终伤害提升率
- 计算公式：增伤 = 0.05 + 属强/220
- 支持多条计算记录对比
- 自动计算团武白字1、白字2、白字总伤加成、最终加成

### 📦 超武盒子模拟器
- 模拟开启超武盒子，支持 100/200/500/1000/10000 个批量
- 汇总获得太古龙晶、龙之雷焰、矛盾的结晶体、深渊-调律之痕
- 各物品概率：太古龙晶 0.0010%~0.0101%、龙之雷焰 0.15%~9.25%、矛盾 10%、深渊 74.6286%

### 🔧 增幅模拟器
- 获取武器/非武器胚子，模拟装备增幅过程
- 增幅规则：1-4级 100% 成功，5-7级失败-1，8-10级失败-3，11-12级直接损坏
- 支持幸运符（+5%成功率）和一键增幅到 +10
- 汇总统计总消耗、损坏数量、平均成功率

## 🛠️ 技术栈

| 技术 | 版本 | 说明 |
|------|------|------|
| Vue | 3.5 | Composition API + `<script setup>` |
| Bootstrap | 5.3 | UI 样式框架 |
| Vue Router | 4.6 | Hash 模式路由 |
| Vite | 8 | 构建工具（rolldown） |

## 🚀 快速开始

```bash
# 安装依赖
npm install

# 开发模式
npm run dev

# 构建生产版本
npm run build

# 预览构建结果
npm run preview
```

## 📁 项目结构

```
src/
├── components/          # 可复用组件
│   ├── PageLayout.vue          # 页面统一布局（页头/内容/页脚）
│   ├── StoneConfigPanel.vue    # 源石配置面板
│   ├── SynthesisResult.vue     # 合成结果显示
│   └── SynthesisStats.vue      # 合成统计
├── constants/          # 常量配置
│   └── stoneData.js            # 源石概率数据
├── pages/              # 页面组件
│   ├── Home.vue                # 首页
│   ├── StoneSynthesis.vue      # 源石合成
│   ├── DamageCalculator.vue    # 伤害计算
│   ├── BoxSimulator.vue        # 超武盒子
│   └── AmplifySimulator.vue    # 增幅模拟
├── router/
│   └── index.js                # 路由配置
├── utils/
│   └── synthesis.js            # 合成算法
├── style.css                   # 主题补充样式（须在 Bootstrap 之后引入）
├── App.vue
└── main.js
```

## 🎨 样式约定

- `main.js` 中**必须先引 Bootstrap 再引 `style.css`**，否则项目样式会被 Bootstrap 带 `!important` 的工具类覆盖。
- Bootstrap 5 没有的品级配色统一加 `app-` 前缀（`app-bg-purple` / `app-bg-orange` / `app-bg-pink` / `app-border-purple` / `app-border-orange`），避免与 `.bg-gradient` 这类 Bootstrap 自带类撞名。
- Bootstrap JS 统一从 `bootstrap`(ESM) 引入，不要再用 `bootstrap/dist/js/bootstrap.bundle.min.js`，否则同一页面会出现两份互不相知的 Bootstrap 实例。

## 🌐 部署说明

项目使用相对路径（`base: './'`），可部署到 Nginx 的任意子路径下：

```bash
npm run build
# 将 dist/ 目录内容部署到服务器即可
```

路由采用 Hash 模式，无需服务器额外配置。

## 📱 响应式

- 电脑端（lg 及以上）：功能模块并列布局（8-4 栅格）
- 移动端：自动堆叠为单列布局

## 📄 License

MIT
