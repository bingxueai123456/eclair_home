## 🌌 Eclair Collection（Supabase 全栈版）

<div align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=white" alt="React">
  <img src="https://img.shields.io/badge/Vite-6-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite">
  <img src="https://img.shields.io/badge/Supabase-Auth%20%2B%20DB%20%2B%20Storage-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white" alt="Supabase">
  <img src="https://img.shields.io/badge/FontAwesome-6-339AF0?style=for-the-badge&logo=fontawesome&logoColor=white" alt="FontAwesome">
  <img src="https://img.shields.io/badge/RSS-Feed-FF6B35?style=for-the-badge&logo=rss&logoColor=white" alt="RSS Feed">
</div>

<p align="center"><strong>知识星图 · 信息聚合</strong></p>

## 📖 项目简介

Eclair Collection 是一个面向个人/小团队的「网站收藏 + 博客文章（HTML）+ RSS + YouTube」信息聚合平台。

本仓库已完成从 **纯前端 hardcode 配置** 到 **Supabase 全栈（Auth + Postgres + Storage + RLS）** 的重构：数据全部存数据库，管理入口在站内「管理后台」。

## ✅ 已实现功能（当前版本）

### 🎨 UI / 体验
- **Grok 星系/银河风格**：全站统一主题
- **主题模式**：仅保留 **暗黑 / 白色** 两种（白色主题已补齐文字对比度）
- **布局**：左侧导航 + 右侧内容区（响应式）

### 🔐 登录与权限
- **Supabase Auth**：邮箱 + 密码登录
- **无公开注册**：用户需由已登录管理员/控制台创建（便于未来多用户扩展）
- **RLS（行级权限）**：按 `user_id = auth.uid()` 隔离数据

### 🧩 业务模块（数据驱动）
- **网站收藏**：分类（主/子）+ 描述 + 评分 + CRUD（管理后台）
- **博客集（HTML）**：
  - 元数据存 `html_pages`
  - HTML 内容存 Supabase Storage：`html-pages` bucket
  - 兼容历史静态文章：当 `storage_path` 为 `/html/...` 时直接访问 `public/html/`
- **RSS 订阅**：
  - RSS 源从 Supabase `rss_sources` 表读取（管理后台配置）
  - 前端解析 RSS/Atom（`fast-xml-parser`），本地缓存 30 分钟（按用户隔离）
  - 支持实时同步：后台增删改 RSS 源后页面自动更新
- **搜索**：**按表搜索**（全部/网站/博客/视频），不再做“全局混搜所有模块”

## ⚠️ 已知限制 / 后续计划

- **YouTube 订阅**：
  - 当前视频抓取仍使用 `src/useYoutubeRssFeed.js` 内的本地 `YOUTUBE_CHANNELS` 列表
  - 管理后台已支持 `youtube_channels` 表 CRUD，但“视频抓取”尚未接入该表（下一步可做）
- **HTML 已迁移的历史文章**：如果仍指向 `/html/...`，属于“静态遗留”，后续可以逐篇搬到 Storage 并更新 `storage_path`

## 🚀 本地运行

### 前置要求
- Node.js 18+（推荐）
- npm

### 1) 安装依赖

```bash
npm install
```

### 2) 配置环境变量（不要提交密钥）

在项目根目录创建 `.env.local`：

```dotenv
VITE_SUPABASE_URL=YOUR_SUPABASE_PROJECT_URL
VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
```

### 3) 启动开发服务器

```bash
npm run dev
```

如果 `5173/5174` 被占用，Vite 会自动换端口（终端会提示实际地址，例如 `http://localhost:5175/`）。

## 🧰 管理后台使用

登录后左侧菜单显示「管理后台」，可配置：
- 分类（主分类 + 子分类数组）
- 网站收藏（CRUD）
- RSS 源（CRUD，RSS 页面实时同步）
- YouTube 频道（CRUD，当前仅配置，抓取未接入）
- HTML 文章（上传 HTML 内容到 Storage 并写入元数据）

## 🗄️ Supabase 数据结构（概要）

### 数据表
- `categories`
  - `name`（主分类名）
  - `sub_categories`（text[] 子分类数组）
- `websites`
  - `title` `url` `description` `rating`
  - `main_category` `sub_category`
- `rss_sources`
  - `name` `url` `description`
- `youtube_channels`
  - `name` `channel_id` `description`
- `html_pages`
  - `title` `description` `category` `tags`（text[]）
  - `storage_path`（Storage 路径，或历史 `/html/...`）

### Storage
- `html-pages` bucket：存 HTML 文件（路径形如 `${user.id}/${timestamp}_${title}.html`）

### 安全（RLS）
所有表启用 RLS，并以 `user_id = auth.uid()` 为核心策略进行隔离。

## 📂 目录结构（核心）

```
src/
  components/
    AdminPanel.jsx         # 管理后台
    Login.jsx              # 登录页（无注册）
  hooks/
    useAuth.jsx            # Supabase Auth
    useDatabase.jsx        # Supabase DB/Storage CRUD（含 RSS realtime）
  lib/
    supabase.js            # Supabase client
  styles/
    galaxy-theme.css       # 主题变量（暗黑/白色）
    galaxy-components.css  # 组件样式
  useRssManager.js         # RSS 拉取/解析（RSS 源来自 Supabase）
  useYoutubeRssFeed.js     # YouTube RSS 拉取（当前本地列表，待接 Supabase）
  useGlobalSearch.jsx      # 按表搜索（全部/网站/博客/视频）
  App.jsx
```

## 🙏 致谢

- [Supabase](https://supabase.com/) - Auth / Postgres / Storage
- [Vite](https://vitejs.dev/) - 构建工具
- [React](https://react.dev/) - 前端框架
- [FontAwesome](https://fontawesome.com/) - 图标库
- [fast-xml-parser](https://github.com/NaturalIntelligence/fast-xml-parser) - RSS/Atom 解析
- `corsproxy.io` - CORS 代理（RSS/YouTube 抓取使用）
