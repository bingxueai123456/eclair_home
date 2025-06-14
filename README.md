# 🌟 网站收藏夹 - 个人网站分类导航系统

<div align="center">
  <img src="https://img.shields.io/badge/React-18+-61DAFB?style=for-the-badge&logo=react&logoColor=white" alt="React">
  <img src="https://img.shields.io/badge/Vite-5+-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite">
  <img src="https://img.shields.io/badge/FontAwesome-6+-339AF0?style=for-the-badge&logo=fontawesome&logoColor=white" alt="FontAwesome">
  <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" alt="CSS3">
</div>

## 📖 项目简介

这是一个现代化的个人网站收藏夹系统，采用Google Material Design风格，支持多主题切换、响应式布局和7星评级系统。帮助用户更好地组织和管理自己的常用网站，提供优雅的浏览体验。

## ✨ 核心特性

### 🎨 视觉设计
- **Google Material Design** - 遵循现代设计语言
- **玻璃拟态效果** - 半透明毛玻璃背景
- **多主题支持** - 明亮、暗黑、渐变三种主题
- **响应式布局** - 完美适配桌面、平板、手机
- **统一菜单样式** - YouTube订阅和博客集采用统一设计

### 🔧 功能特性
- **分类管理** - 支持主分类和子分类
- **7星评级系统** - 为网站进行1-7星评分
- **双视图模式** - 网格视图和列表视图切换
- **实时搜索** - 支持标题和描述搜索
- **移动端友好** - 侧边栏抽屉式导航
- **YouTube订阅** - RSS feed集成，实时获取视频更新
- **博客集** - 静态HTML文章收集与管理

### 🎯 用户体验
- **流畅动画** - 所有交互都有平滑过渡效果
- **直观操作** - 点击星星即可评分
- **快速导航** - 分类折叠展开
- **视觉反馈** - 悬停和点击状态反馈
- **一键访问** - 外链直接新窗口打开

## 🚀 快速开始

### 前置要求
- Node.js 16+ 
- npm 或 yarn

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

## 📱 界面预览

### 主要界面
- **左侧栏**: 分类导航、搜索、主题切换、视图切换
- **右侧主区**: 网站卡片展示区域
- **网格视图**: 卡片式布局，适合浏览
- **列表视图**: 紧凑列表，适合快速查找

### 主题展示
- **明亮主题**: 清新蓝紫渐变背景
- **暗黑主题**: 深色系界面，护眼模式
- **渐变主题**: 彩色渐变，视觉丰富

## 🔧 如何添加新网站

### 步骤详解

#### 1. 准备图标 (Icon)

**方法一：使用 FontAwesome 图标**
1. 访问 [FontAwesome 官网](https://fontawesome.com/icons)
2. 搜索相关图标（如：react、github、youtube）
3. 选择合适的图标，记住图标名称
4. 在代码中导入图标：

```javascript
// 在 App.jsx 顶部导入区域添加
import { 
  faReact, faGithub, faYoutube  // 已有图标
  faNewIcon  // 新图标
} from '@fortawesome/free-brands-svg-icons'

// 或者从 solid 图标库导入
import { 
  faCode, faTools, faBook,  // 已有图标
  faNewSolidIcon  // 新图标
} from '@fortawesome/free-solid-svg-icons'
```

**图标库说明：**
- `free-brands-svg-icons`: 品牌图标（如：Google、Facebook、Twitter）
- `free-solid-svg-icons`: 实心图标（如：代码、工具、书籍）
- `free-regular-svg-icons`: 线条图标

#### 2. 添加网站数据

在 `src/App.jsx` 文件中找到 `initialLinks` 数组，添加新的网站对象：

```javascript
const initialLinks = [
  // ... 现有数据
  {
    id: 8,  // 确保ID唯一
    title: '网站名称',
    url: 'https://example.com',
    mainCategory: '开发',  // 必须是已存在的主分类
    subCategory: '前端',   // 必须是该主分类下的子分类
    description: '网站的详细描述，会显示在卡片中',
    rating: 5,  // 1-7星评级
    icon: faNewIcon  // 使用导入的图标
  }
]
```

#### 3. 字段说明

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `id` | Number | ✅ | 唯一标识符，不能重复 |
| `title` | String | ✅ | 网站标题，显示在卡片上 |
| `url` | String | ✅ | 网站链接，完整URL |
| `mainCategory` | String | ✅ | 主分类（开发、学习、娱乐） |
| `subCategory` | String | ✅ | 子分类，必须属于对应主分类 |
| `description` | String | ✅ | 网站描述，支持搜索 |
| `rating` | Number | ✅ | 评分（1-7星） |
| `icon` | FontAwesome | ✅ | FontAwesome图标对象 |

#### 4. 现有分类结构

```javascript
const categories = {
  '开发': {
    icon: faCode,
    subCategories: ['前端', '后端', '工具', '社区']
  },
  '学习': {
    icon: faBook,
    subCategories: ['编程', '设计', '语言']
  },
  '娱乐': {
    icon: faGamepad,
    subCategories: ['视频', '音乐', '游戏']
  }
}
```

#### 5. 添加新分类（可选）

如果需要添加新的主分类或子分类：

```javascript
const categories = {
  // ... 现有分类
  '新主分类': {
    icon: faNewCategoryIcon,  // 选择合适的图标
    subCategories: ['子分类1', '子分类2', '子分类3']
  }
}
```

### 完整示例

假设要添加 "掘金" 网站：

1. **选择图标**: 在 FontAwesome 搜索 "gem" 或类似图标
2. **导入图标**:
```javascript
import { faGem } from '@fortawesome/free-solid-svg-icons'
```

3. **添加数据**:
```javascript
{
  id: 8,
  title: '掘金',
  url: 'https://juejin.cn',
  mainCategory: '开发',
  subCategory: '社区',
  description: '中国最活跃的技术社区，分享技术干货',
  rating: 6,
  icon: faGem
}
```

## 📝 博客集管理

### 如何添加新博客文章

博客集功能用于管理你的静态HTML文章。要添加新的博客文章：

#### 1. 准备HTML文件
将你的HTML文章文件放置在 `src/html/` 目录下。

#### 2. 添加博客配置
在 `src/App.jsx` 文件中找到 `initialBlogs` 数组，添加新的博客配置：

```javascript
const initialBlogs = [
  // ... 现有文章
  {
    id: 2,  // 确保ID唯一
    title: '文章标题',
    url: './src/html/文章文件名.html',
    description: '文章描述',
    category: '文章分类',  // 如：'技术分析'、'经济观察'
    date: '2024-01-20',   // 发布日期 YYYY-MM-DD
    tags: ['标签1', '标签2', '标签3']  // 文章标签
  }
]
```

#### 3. 字段说明

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `id` | Number | ✅ | 唯一标识符 |
| `title` | String | ✅ | 文章标题 |
| `url` | String | ✅ | 文章文件路径 |
| `description` | String | ✅ | 文章简介 |
| `category` | String | ✅ | 文章分类 |
| `date` | String | ✅ | 发布日期 |
| `tags` | Array | ✅ | 标签数组 |

#### 4. 功能特点
- **自动分类**: 根据category字段自动生成分类筛选器
- **标签系统**: 支持多标签展示
- **日期排序**: 自动按日期显示
- **响应式**: 完美适配各种设备

## 🎥 YouTube订阅

集成RSS feed功能，实时获取YouTube频道更新。支持：
- 多频道订阅
- 视频缩略图展示
- 发布日期显示
- 直接跳转观看

配置位于 `useYoutubeRssFeed.js` hook中。

## 📖 使用指南

### 基本操作

#### 1. 浏览网站收藏
- 点击左侧分类菜单浏览不同类别的网站
- 使用搜索框快速查找特定网站
- 点击网站卡片上的"访问网站"按钮打开链接

#### 2. 网站评级
- 点击网站卡片上的星星进行1-7星评级
- 评级会实时保存（当前为前端存储）
- 可以随时修改评级

#### 3. 视图切换
- 网格视图：适合浏览和发现新网站
- 列表视图：适合快速查找特定网站

#### 4. 主题切换
- 明亮主题：适合白天使用
- 暗黑主题：适合夜间使用，保护视力
- 渐变主题：提供多种彩色渐变选择

#### 5. 移动端使用
- 点击左上角菜单按钮展开侧边栏
- 所有功能在移动端完全可用
- 触摸优化的交互体验

### 高级功能

#### YouTube订阅管理
1. 在 `useYoutubeRssFeed.js` 中配置YouTube频道
2. 系统自动获取最新视频
3. 点击视频卡片直接观看

#### 博客文章管理
1. 将HTML文件放入 `src/html/` 目录
2. 在代码中配置文章信息
3. 支持分类筛选和标签系统

## 🎨 自定义主题

### 修改现有主题

在 `src/App.jsx` 中找到 `themes` 对象：

```javascript
const themes = {
  light: {
    name: '明亮',
    icon: faSun,
    primary: '#1a73e8',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    // ... 其他颜色配置
  }
  // 修改这些值来自定义主题
}
```

### 添加新主题

```javascript
const themes = {
  // ... 现有主题
  ocean: {
    name: '海洋',
    icon: faWater,  // 需要导入对应图标
    primary: '#0891b2',
    background: 'linear-gradient(135deg, #0ea5e9 0%, #0891b2 100%)',
    cardBg: 'rgba(255, 255, 255, 0.9)',
    sidebarBg: 'rgba(255, 255, 255, 0.85)',
    textPrimary: '#164e63',
    textSecondary: 'rgba(22, 78, 99, 0.8)'
  }
}
```

## 📱 移动端使用

### 手机端操作
- 点击左上角菜单按钮打开侧边栏
- 选择分类后自动关闭侧边栏
- 支持触摸滑动和缩放
- 响应式布局自动适配

### 平板端操作
- 保持桌面端布局
- 触摸友好的按钮大小
- 优化的间距和字体

## 🛠️ 技术栈

- **Frontend**: React 19+ + Vite 6+
- **样式**: CSS3 + CSS Variables
- **图标**: FontAwesome 6+
- **构建**: Vite
- **包管理**: npm

## 📂 项目结构

```
eclair_home/
├── src/
│   ├── html/                 # 静态HTML文章目录
│   │   └── *.html           # 博客文章文件
│   ├── App.jsx              # 主组件
│   ├── App.css              # 主样式文件
│   ├── useYoutubeRssFeed.js # YouTube RSS Hook
│   ├── index.css            # 全局样式
│   └── main.jsx             # 入口文件
├── public/                  # 静态资源
├── package.json             # 依赖配置
└── README.md               # 项目文档
```

## 🎨 界面说明

### 侧边栏组件
- **搜索栏**: 全局搜索网站内容
- **主题切换**: 明亮/暗黑/渐变主题
- **视图切换**: 网格/列表视图模式
- **特殊菜单**: YouTube订阅和博客集（统一样式设计）
- **分类导航**: 可折叠的分类树结构

### 主内容区
- **网站卡片**: 包含标题、描述、分类、评级
- **博客文章**: 卡片式布局，支持分类筛选
- **YouTube视频**: RSS feed展示最新视频

## 🔄 更新日志

### v1.2.0 (Current)
- ✅ 统一菜单样式设计
- ✅ 博客集功能集成
- ✅ YouTube RSS订阅
- ✅ 完善的README文档

### v1.1.0
- ✅ 7星评级系统
- ✅ 三种主题模式
- ✅ 双视图切换
- ✅ 响应式设计

### v1.0.0
- ✅ 基础网站收藏功能
- ✅ 玻璃拟态效果
- ✅ 移动端支持

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 📞 联系方式

如有问题或建议，请通过以下方式联系：

- 创建 [Issue](../../issues)
- 发送邮件到：[your-email@example.com]

---

<div align="center">
  <p>⭐ 如果这个项目对你有帮助，请给它一个星星！</p>
  <p>Made with ❤️ by [Your Name]</p>
</div>
