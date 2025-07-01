# 🌟 Eclair Collection - 个人网站收藏与内容聚合平台

<div align="center">
  <img src="https://img.shields.io/badge/React-19+-61DAFB?style=for-the-badge&logo=react&logoColor=white" alt="React">
  <img src="https://img.shields.io/badge/Vite-6+-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite">
  <img src="https://img.shields.io/badge/FontAwesome-6+-339AF0?style=for-the-badge&logo=fontawesome&logoColor=white" alt="FontAwesome">
  <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" alt="CSS3">
  <img src="https://img.shields.io/badge/YouTube-RSS-FF0000?style=for-the-badge&logo=youtube&logoColor=white" alt="YouTube RSS">
  <img src="https://img.shields.io/badge/RSS-Feed-FF6B35?style=for-the-badge&logo=rss&logoColor=white" alt="RSS Feed">
</div>

<p align="center">
  <strong>想想你为什么活着</strong> - 一个现代化的个人内容聚合平台
</p>

## 📖 项目简介

Eclair Collection 是一个集网站收藏、YouTube 订阅、RSS订阅、博客管理于一体的现代化个人内容聚合平台。采用 Material Design 设计语言，支持多主题切换、全局搜索、响应式布局等特性，为用户提供优雅的内容管理和浏览体验。

## ✨ 核心特性

### 🎨 视觉设计
- **Material Design 3.0** - 遵循最新设计规范
- **玻璃拟态效果** - 半透明毛玻璃背景，现代感十足
- **6种主题模式** - 明亮、暗黑、6种渐变主题随心切换
- **响应式布局** - 完美适配桌面、平板、手机三端
- **统一设计语言** - 所有模块采用一致的视觉风格

### 🔧 功能特性

#### 📌 网站收藏管理
- **分层分类系统** - 支持主分类和子分类的两级管理
- **7星评级系统** - 为网站进行1-7星精准评分
- **双视图模式** - 网格视图（浏览）和列表视图（快速查找）
- **智能筛选** - 按分类、评分、描述等多维度筛选

#### 🎥 YouTube 订阅聚合
- **RSS Feed 集成** - 自动获取订阅频道最新视频
- **实时数据刷新** - 支持普通刷新和强制刷新
- **智能缓存机制** - 5分钟缓存，减少网络请求
- **视频卡片展示** - 缩略图、标题、频道、发布时间一目了然
- **跨域代理支持** - 使用 corsproxy.io 解决CORS问题

#### 📡 RSS订阅聚合
- **预设RSS源管理** - 代码中预设RSS源，支持扩展配置
- **多格式RSS支持** - 支持RSS 2.0和Atom格式自动解析
- **横向卡片布局** - 防止内容截断，优化阅读体验
- **智能缓存机制** - 30分钟缓存，减少重复请求
- **错误处理机制** - 优雅处理RSS源访问失败
- **文章预览展示** - 标题、描述、发布时间完整显示

#### 📝 博客集管理
- **静态文章收集** - 支持本地HTML文章管理
- **分类标签系统** - 多维度文章分类和标签
- **文章预览卡片** - 标题、描述、标签、发布时间
- **快速访问链接** - 一键打开本地或外部文章

#### 🔍 全局智能搜索
- **跨平台搜索** - 同时搜索网站、博客、YouTube视频、RSS文章
- **模糊匹配算法** - 支持标题、描述、分类、标签等字段
- **实时搜索结果** - 无需点击，输入即搜
- **分类结果展示** - 网站、博客、视频、RSS文章结果分组显示
- **统计信息显示** - 显示各类型结果数量

### 🎯 用户体验
- **流畅动画系统** - 所有交互都有平滑过渡效果
- **直观操作反馈** - 悬停、点击、加载状态清晰反馈
- **移动端友好** - 侧边栏抽屉式导航，手势操作
- **快捷键支持** - 支持常用快捷键操作
- **一键访问** - 外链新窗口打开，内链无缝跳转

## 🚀 快速开始

### 前置要求
- Node.js 16+ 
- npm 或 yarn
- 现代浏览器（支持ES6+）

### 安装步骤

1. **克隆项目**
```bash
git clone <your-repo-url>
cd eclair_home
```

2. **安装依赖**
```bash
npm install
```

3. **启动开发服务器**
```bash
npm run dev
```

4. **访问应用**
打开浏览器访问 `http://localhost:5173`

### 构建生产版本
```bash
npm run build
```

### 预览生产版本
```bash
npm run preview
```

## 📱 界面布局

### 主要区域
- **左侧导航栏**: 
  - 搜索框（全局搜索）
  - 主题切换器（6种主题）
  - 视图切换器（网格/列表）
  - 特殊菜单（YouTube订阅、RSS订阅、博客集）
  - 分类导航树（可折叠展开）

- **右侧主内容区**: 
  - 网站收藏卡片
  - YouTube视频流
  - RSS文章流
  - 博客文章列表
  - 全局搜索结果

### 主题展示
1. **明亮主题**: 清新蓝紫渐变，适合日间使用
2. **暗黑主题**: 深色护眼模式，适合夜间使用
3. **渐变主题**: 
   - 🌅 日落 - 蓝紫渐变
   - 🌊 海洋 - 蓝绿渐变  
   - 🌲 森林 - 绿色渐变
   - 🔥 火焰 - 橙红渐变
   - 💜 紫罗兰 - 紫色渐变
   - 🌌 极光 - 彩色渐变

## 🔧 配置指南

### 添加新网站

#### 1. 准备图标
选择合适的 FontAwesome 图标：

```javascript
// 品牌图标
import { faGithub, faYoutube, faReact } from '@fortawesome/free-brands-svg-icons'

// 通用图标  
import { faCode, faBook, faTools } from '@fortawesome/free-solid-svg-icons'
```

#### 2. 添加网站数据
在 `src/App.jsx` 的 `initialLinks` 数组中添加：

```javascript
{
  id: 23, // 确保ID唯一
  title: '网站名称',
  url: 'https://example.com',
  mainCategory: '研发', // 必须是已存在的主分类
  subCategory: '开发工具', // 必须是该主分类下的子分类  
  description: '网站详细描述，支持搜索',
  rating: 5, // 1-7星评级
  icon: faCode // FontAwesome图标
}
```

#### 3. 现有分类结构
```javascript
const categories = {
  '研发': {
    subCategories: ['开发工具', 'AI', 'UI', '后端', '前端', '数据库', '运维', '安全', '算法', '其他']
  },
  'github': {
    subCategories: ['经典项目', '工具类', '自动化']
  },
  '新闻/周刊': {
    subCategories: ['技术', '科技', '政治', '军事', '经济']
  },
  '娱乐': {
    subCategories: ['游戏', '影视']
  },
  '友商': {
    subCategories: ['换电柜']
  }
}
```

### 配置YouTube订阅

在 `src/useYoutubeRssFeed.js` 中修改频道列表：

```javascript
const YOUTUBE_CHANNELS = [
  'UCXZCJLdBC09xxGZ6gcdrc6A', // 现有频道ID
  'YOUR_NEW_CHANNEL_ID', // 新增频道ID
]
```

### 配置RSS订阅源

#### 1. 添加RSS源
在 `src/useRssManager.js` 的 `RSS_SOURCES` 数组中添加新的RSS源：

```javascript
const RSS_SOURCES = [
  // 现有RSS源...
  {
    id: 'unique-id',        // 唯一标识符
    name: '显示名称',        // 在界面上显示的名称
    url: 'RSS链接',         // 必须是有效的RSS/Atom feed URL
    description: '描述信息'  // 可选的描述信息
  }
]
```

#### 2. RSS源配置示例

```javascript
{
  id: 'tech-blog',
  name: '技术博客',
  url: 'https://example.com/rss.xml',
  description: '最新技术文章分享'
},
{
  id: 'news-site',
  name: '新闻网站',
  url: 'https://news.example.com/feed',
  description: '每日新闻更新'
}
```

#### 3. 注意事项

⚠️ **重要**: RSS URL必须是有效的RSS/Atom feed，不能是普通网页链接

- ✅ 正确: `https://example.com/rss.xml`
- ✅ 正确: `https://example.com/feed`
- ✅ 正确: `https://example.com/atom.xml`
- ❌ 错误: `https://example.com/index.html`

#### 4. 常用RSS源推荐

```javascript
// 技术博客
{
  id: 'ruanyf-weekly',
  name: '科技爱好者周刊',
  url: 'https://feeds.feedburner.com/ruanyifeng',
  description: '阮一峰的科技爱好者周刊'
},

// 新闻资讯
{
  id: 'sspai',
  name: '少数派',
  url: 'https://sspai.com/feed',
  description: '少数派最新文章'
},

// GitHub项目
{
  id: 'github-project',
  name: 'GitHub项目动态',
  url: 'https://github.com/{user}/{repo}/releases.atom',
  description: '项目发布动态'
}
```

#### 5. RSS功能特性

- **自动解析**: 支持RSS 2.0和Atom格式
- **智能缓存**: 30分钟缓存机制
- **错误处理**: 优雅处理访问失败的RSS源
- **横向布局**: 防止长文本截断
- **响应式设计**: 适配各种屏幕尺寸

### 添加博客文章

在 `src/App.jsx` 的 `initialBlogs` 数组中添加：

```javascript
{
  id: 2,
  title: '文章标题',
  url: '/html/article.html', // 相对路径或绝对URL
  description: '文章描述',
  category: '技术分析',
  date: '2024-01-15',
  tags: ['技术', '分析', '前端']
}
```

## 📂 项目结构

```
eclair_home/
├── public/                 # 静态资源
│   ├── html/              # 博客HTML文章
│   ├── icon.png           # 网站图标
│   └── vite.svg           # Vite logo
├── src/                   # 源代码
│   ├── App.jsx            # 主应用组件
│   ├── App.css            # 样式文件
│   ├── main.jsx           # 应用入口
│   ├── useGlobalSearch.jsx # 全局搜索Hook
│   ├── useYoutubeRssFeed.js # YouTube RSS Hook
│   ├── useRssManager.js   # RSS订阅管理Hook
│   └── assets/            # 静态资源
├── package.json           # 项目配置
├── vite.config.js         # Vite配置
├── eslint.config.js       # ESLint配置
├── RSS_GUIDE.md           # RSS配置指南
└── README.md              # 项目文档
```

## 🛠️ 技术栈

### 前端框架
- **React 19** - 最新版本，支持并发特性
- **Vite 6** - 极速构建工具
- **ES Modules** - 模块化开发

### UI 组件
- **FontAwesome 6** - 图标库
- **CSS3** - 现代CSS特性
- **CSS Grid & Flexbox** - 布局系统

### 数据处理
- **fast-xml-parser** - XML解析（YouTube RSS）
- **localStorage** - 本地缓存
- **CORS Proxy** - 跨域请求代理

### 开发工具
- **ESLint** - 代码规范检查
- **React Developer Tools** - 调试工具

## 🎨 功能特色

### YouTube订阅聚合
- ✅ 多频道RSS订阅
- ✅ 自动缓存机制（5分钟）
- ✅ 强制刷新功能
- ✅ 视频缩略图展示
- ✅ 发布时间排序
- ✅ 一键观看跳转

### RSS订阅聚合
- ✅ 代码预设RSS源
- ✅ 支持RSS 2.0和Atom格式
- ✅ 自动缓存机制（30分钟）
- ✅ 横向卡片布局
- ✅ 文章完整预览
- ✅ 错误状态处理
- ✅ 响应式设计
- ✅ 一键刷新功能

### 全局搜索引擎
- ✅ 跨平台统一搜索（网站+博客+YouTube+RSS）
- ✅ 模糊匹配算法
- ✅ 实时搜索建议
- ✅ 分类结果展示
- ✅ 搜索结果统计

### 主题系统
- ✅ 6种预设主题
- ✅ 实时主题切换
- ✅ 渐变主题选择器
- ✅ 主题状态持久化
- ✅ 响应式适配

### 分类管理
- ✅ 两级分类体系
- ✅ 可折叠导航树
- ✅ 智能分类筛选
- ✅ 分类统计显示

## 🚧 开发计划

### 即将推出
- [ ] RSS源动态添加功能
- [ ] RSS文章收藏功能
- [ ] 用户自定义主题
- [ ] 导入/导出配置
- [ ] 网站截图自动生成
- [ ] 标签云可视化
- [ ] 访问统计分析
- [ ] 离线模式支持

### 长期规划
- [ ] 多用户支持
- [ ] 云端数据同步
- [ ] PWA支持
- [ ] 移动端App
- [ ] 数据可视化
- [ ] AI推荐系统

## 🤝 贡献指南

欢迎贡献代码！请遵循以下步骤：

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 👨‍💻 作者

**Eclair** - 想想你为什么活着

## 📚 相关文档

- **[RSS配置指南](RSS_GUIDE.md)** - 详细的RSS源配置教程和常见问题解答

## 🙏 致谢

- [FontAwesome](https://fontawesome.com/) - 提供优秀的图标库
- [Vite](https://vitejs.dev/) - 极速的构建工具
- [React](https://reactjs.org/) - 强大的前端框架
- [fast-xml-parser](https://github.com/NaturalIntelligence/fast-xml-parser) - 强大的XML解析库
- [corsproxy.io](https://corsproxy.io/) - 跨域代理服务

---

<div align="center">
  <p>⭐ 如果这个项目对你有帮助，请给它一个星标！</p>
</div>
