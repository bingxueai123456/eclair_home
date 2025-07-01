# RSS订阅添加指南

## 如何添加新的RSS源

在 `src/useRssManager.js` 文件中的 `RSS_SOURCES` 数组里添加新的RSS源配置。

### 配置格式

```javascript
{
  id: 'unique-id',        // 唯一标识符
  name: '显示名称',        // 在界面上显示的名称
  url: 'RSS链接',         // RSS feed的URL
  description: '描述信息'  // 可选的描述信息
}
```

### 示例

```javascript
const RSS_SOURCES = [
  // 现有的RSS源...
  
  // 添加新的RSS源
  {
    id: 'my-blog',
    name: '我的博客',
    url: 'https://myblog.com/rss.xml',
    description: '我的个人技术博客'
  },
  {
    id: 'tech-news',
    name: '科技新闻',
    url: 'https://technews.com/feed',
    description: '最新科技资讯'
  }
]
```

### 常用RSS源推荐

- **技术博客**
  - 阮一峰博客：`https://feeds.feedburner.com/ruanyifeng`
  - Tw93潮流周刊：`https://weekly.tw93.fun/rss.xml`
  - 少数派：`https://sspai.com/feed`

- **新闻资讯** 
  - 知乎日报：`https://rss.lilydjwg.me/zhihudaily`
  - HelloGitHub：`https://hellogithub.com/rss`

- **GitHub项目**
  - 大部分GitHub项目都支持RSS: `https://github.com/{user}/{repo}/releases.atom`

### 注意事项

1. 确保RSS链接有效且可访问
2. `id` 必须是唯一的
3. 某些RSS源可能需要代理才能访问
4. 系统会自动缓存RSS内容30分钟

### 测试RSS源

添加新RSS源后，启动开发服务器：

```bash
npm run dev
```

访问RSS订阅页面，点击"刷新全部"按钮测试新添加的RSS源是否正常工作。 