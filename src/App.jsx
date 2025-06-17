import { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faBook, faGamepad, 
   faStar, faSearch,
  faChevronDown, faChevronRight, faBars, faTimes,
  faGrip, faList, faMoon, faSun, faPalette, faCheck,faGear,
  faGears,
  faNewspaper,
  faFilePowerpoint,
  faFileText,
  faSync,
  faSpinner
} from '@fortawesome/free-solid-svg-icons'

import { faCreativeCommonsNc, faGithub, faYoutube } from '@fortawesome/free-brands-svg-icons'
import './App.css'
import useYoutubeRssFeed from './useYoutubeRssFeed'
import { useGlobalSearch, SearchResults } from './useGlobalSearch'

const initialLinks = [
  {
    id: 1,
    title: 'vercel',
    url: 'https://vercel.com/eclairs-projects-e8134ecf',
    mainCategory: '研发',
    subCategory: '开发工具',
    description: 'Vercel 是一个云平台,用于构建、部署和扩展无服务器应用程序和静态网站',
    rating: 7,
    icon: faGear
  },
  {
    id: 2,
    title: 'happy-llm',
    url: 'https://github.com/datawhalechina/happy-llm/tree/main',
    mainCategory: 'github',
    subCategory: '经典项目',
    description: '从零开始的大语言模型原理与实践教程',
    rating: 5,
    icon: faGithub
  },
  {
    id: 3,
    title: 'llm-universe',
    url: 'https://github.com/datawhalechina/llm-universe',
    mainCategory: 'github',
    subCategory: '经典项目',
    description: '动手学大模型应用开发',
    rating: 5,
    icon: faGithub
  },
  {
    id: 4,
    title: '潮流周刊',
    url: 'https://weekly.tw93.fun/',
    mainCategory: '新闻',
    subCategory: '技术',
    description: '每周一更新一次',
    rating: 5,
    icon: faGithub
  },
  {
    id: 5,
    title: 'hello-github',
    url: 'https://hellogithub.com/',
    mainCategory: '新闻',
    subCategory: '技术',
    description: 'hello-github 是一个分享 GitHub 上有趣、入门级的开源项目',
    rating: 5,
    icon: faGithub
  },{
    id: 6,
    title: 'hello算法',
    url: 'https://www.hello-algo.com/',
    mainCategory: '研发',
    subCategory: '算法',
    description: '画图解、一键运行的数据结构与算法教程',
    rating: 5,
    icon: faBook
  },{
    id: 7,
    title: '科技爱好者周刊',
    url: 'https://github.com/ruanyf/weekly',
    mainCategory: '新闻/周刊',
    subCategory: '科技',
    description: '记录每周值得分享的科技内容，周五发布。',
    rating: 5,
    icon: faBook
  },
  {
    id: 8,
    title: 'FNJ',
    url: 'https://service.phoeniciatech.cn/new/',
    mainCategory: '友商',
    subCategory: '换电柜',
    description: 'FNJ',
    rating: 3,
  },
  {
    id:9,
    title: 'supabase',
    url: 'https://supabase.com/',
    mainCategory: '研发',
    subCategory: '开发工具',
    description: 'supabase 是一个开源的 Firebase 替代品，支持 PostgreSQL、MySQL、SQLite 和 MongoDB',
    rating: 5,
    icon: faGear
  },
  {
    id:10,
    title: 'feedMe',
    url: 'https://feedme.icu/',
    mainCategory: '新闻/周刊',
    subCategory: '技术',
    description: 'feedMe 是一个分享有趣、实用的github信息，linux do信息，科技咨询等等信息的平台',
    rating: 5,
    icon: faNewspaper
  },
  {
    id:11,
    title: 'Cap captcha',
    url: 'https://capjs.js.org/',
    mainCategory: 'github',
    subCategory: '工具类',
    description: '一个网页上的机器人识别工具，用作 CAPTCHA 方案，采用 SHA-256 工作量证明算法',
    rating: 3,
    icon: faGithub
  },
  {
    id:12,
    title: 'Pydoll',
    url: 'https://github.com/autoscrape-labs/pydoll',
    mainCategory: 'github',
    subCategory: '自动化',
    description: '一个操作浏览器的 Python 库，通过 Chrome DevTools Protocol，实现脚本操作本机的 Chrome 浏览器。',
    rating: 4,
    icon: faGithub
  },
  {
    id:13,
    title: 'AI每日资讯',
    url: 'https://justlovemaki.github.io/CloudFlare-AI-Insight-Daily/today/book/',
    mainCategory: '新闻/周刊',
    subCategory: '技术',
    description: 'AI每日资讯，每日更新',
    rating: 5,
    icon: faNewspaper
  },{
    id:14,
    title: 'Gotify',
    url: 'https://gotify.net/',
    mainCategory: '研发',
    subCategory: '开发工具',
    description: 'Gotify 是一个开源的推送通知服务，支持多种客户端',
    rating: 5,
    icon: faGear
  }, {
    id:15,
    title: 'Gamma.app',
    url: 'https://gamma.app/',
    mainCategory: '研发',
    subCategory: 'AI',
    description: '一个由 AI 驱动的新一代内容创建工具，可以看作是"AI 时代的 PowerPoint(PPT) ,Canva,webPage 创建',
    rating: 7,
    icon: faFilePowerpoint
  },{
    id:16,
    title: '去安卓应用开屏广告',
    url: 'https://github.com/gkd-kit/gkd',
    mainCategory: 'github',
    subCategory: '工具类',
    description: '自动去除各种软件开屏广告以及自动操作的工具',
    rating: 7,
    icon: faGithub
  },{
    id:17,
    title: 'PayQrcode',
    url: 'https://github.com/uxiaohan/PayQrcode',
    mainCategory: 'github',
    subCategory: '工具类',
    description: '一个合并微信、支付宝收款码的工具',
    rating: 7,
    icon: faGithub
  },{
    id:18,
    title: '图标库 Lucide',
    url: 'https://lucide.dev/',
    mainCategory: '研发',
    subCategory: 'UI',
    description: '需要风格统一，主题色一致，不想麻烦的选择 icon的一个图标库',
    rating: 7,
  },{
    id:19,
    title: '中国人民银行',
    url: 'http://www.pbc.gov.cn/',
    mainCategory: '新闻/周刊',
    subCategory: '经济',
    description: '中国人民银行官网,查看统计数据',
    rating: 7,
  },{
    id:20,
    title: '国家统计局',
    url: 'https://www.stats.gov.cn/sj/',
    mainCategory: '新闻/周刊',
    subCategory: '经济',
    description: '国家统计局官网,查看统计数据',
    rating: 7,
  },{
    id:21,
    title: '海关总署',
    url: 'http://www.customs.gov.cn/customs/syx/index.html/',
    mainCategory: '新闻/周刊',
    subCategory: '经济',
    description: '国家统计局官网,查看统计数据',
    rating: 7,
  }


]

// 分类配置
const categories = {
  '研发': {
    icon: faGears,
    subCategories: ['开发工具', 'AI', 'UI','后端','前端','数据库','运维','安全','算法','其他']
  },
  'github': {
    icon: faBook,
    subCategories: ['经典项目','工具类','自动化']
  },
  '新闻/周刊': {
    icon: faNewspaper,
    subCategories: ['技术','科技', '政治', '军事','经济']
  },
  '娱乐': {
    icon: faGamepad,
    subCategories: ['游戏', '影视']
  },
  '友商': {
    icon: faMoon,
    subCategories: ['换电柜']
  }
}

// 预设渐变主题
const gradientPresets = [
  {
    id: 'sunset',
    name: '日落',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
    primary: '#667eea'
  },
  {
    id: 'ocean',
    name: '海洋',
    background: 'linear-gradient(135deg, #0ea5e9 0%, #0891b2 50%, #0f766e 100%)',
    primary: '#0891b2'
  },
  {
    id: 'forest',
    name: '森林',
    background: 'linear-gradient(135deg, #10b981 0%, #059669 50%, #047857 100%)',
    primary: '#059669'
  },
  {
    id: 'fire',
    name: '火焰',
    background: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 50%, #dc2626 100%)',
    primary: '#ef4444'
  },
  {
    id: 'purple',
    name: '紫罗兰',
    background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 50%, #6d28d9 100%)',
    primary: '#7c3aed'
  },
  {
    id: 'aurora',
    name: '极光',
    background: 'linear-gradient(135deg, #06b6d4 0%, #8b5cf6 50%, #ec4899 100%)',
    primary: '#8b5cf6'
  }
]

// 主题配置
const themes = {
  light: {
    name: '明亮',
    icon: faSun,
    primary: '#1a73e8',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    cardBg: 'rgba(255, 255, 255, 0.9)',
    sidebarBg: 'rgba(255, 255, 255, 0.85)',
    textPrimary: '#3c4043',
    textSecondary: 'rgba(60, 64, 67, 0.8)'
  },
  dark: {
    name: '暗黑',
    icon: faMoon,
    primary: '#4285f4',
    background: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
    cardBg: 'rgba(45, 55, 72, 0.9)',
    sidebarBg: 'rgba(45, 55, 72, 0.85)',
    textPrimary: '#e2e8f0',
    textSecondary: 'rgba(226, 232, 240, 0.8)'
  },
  gradient: {
    name: '渐变',
    icon: faPalette,
    primary: '#667eea',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
    cardBg: 'rgba(255, 255, 255, 0.85)',
    sidebarBg: 'rgba(255, 255, 255, 0.8)',
    textPrimary: '#4a5568',
    textSecondary: 'rgba(74, 85, 104, 0.8)'
  }
}

// 博客文章数据配置
const initialBlogs = [
  {
    id: 1,
    title: '美元全球经济影响机制',
    url: '/html/美元全球经济影响机制.html',
    description: '分析美元在全球经济体系中的影响机制和作用',
    category: '经济分析',
    date: '2024-01-15',
    tags: ['经济', '美元', '全球化']
  }
  // 可以继续在这里添加更多博客文章
]

function YoutubeSubs({ feeds, loading, error, lastFetch, onRefresh }) {
  // 时间格式化
  const formatDate = (dateStr) => {
    if (!dateStr) return ''
    const d = new Date(dateStr)
    if (isNaN(d.getTime())) return ''
    return d.toISOString().slice(0,10)
  }

  return (
    <div className="youtube-subs-section">
      <div className="youtube-header">
        <div className="youtube-subs-title">youtubo订阅</div>
        <div className="youtube-controls">
          {lastFetch && (
            <span className="last-update">最后更新: {lastFetch}</span>
          )}
          <button 
            className="refresh-btn"
            onClick={() => onRefresh(false)}
            disabled={loading}
            title="刷新YouTube数据（使用缓存）"
          >
            <FontAwesomeIcon icon={loading ? faSpinner : faSync} spin={loading} />
            {loading ? '刷新中...' : '刷新'}
          </button>
          <button 
            className="refresh-btn force"
            onClick={() => onRefresh(true)}
            disabled={loading}
            title="强制刷新（忽略缓存）"
          >
            <FontAwesomeIcon icon={loading ? faSpinner : faSync} spin={loading} />
            强制刷新
          </button>
        </div>
      </div>
      {loading && <div className="loading-message">🔄 正在获取最新视频...</div>}
      {error && <div style={{color:'red'}}>YouTube加载失败: {error}</div>}
      
      {/* 调试信息 */}
      <div className="debug-info">
        <p>📊 频道数量: {feeds ? feeds.length : 0}</p>
        <p>🎬 总视频数: {feeds ? feeds.reduce((total, feed) => total + (feed.items?.length || 0), 0) : 0}</p>
        <p>💾 缓存状态: {localStorage.getItem('youtube-feeds-cache') ? '有缓存' : '无缓存'}</p>
      </div>
      
      {!loading && feeds && feeds.map(feed => (
        <div key={feed.channelId} className="youtube-channel-row">
          <div className="youtube-channel-title">{feed.channelTitle}</div>
          <div className="youtube-videos-row">
            {[...feed.items].sort((a,b)=>new Date(b.pubDate)-new Date(a.pubDate)).map(video => (
              <a
                key={video.link}
                className="youtube-video-card"
                href={video.link}
                target="_blank"
                rel="noopener noreferrer"
                title={video.title}
              >
                <img
                  src={video.thumbnail || `https://i.ytimg.com/vi/${video.link.split('v=')[1]}/hqdefault.jpg`}
                  alt={video.title}
                  className="youtube-video-thumb"
                />
                <div className="youtube-video-title">{video.title}</div>
                <div className="youtube-video-channel">{video.channelTitle}</div>
                <div className="youtube-video-date">{formatDate(video.pubDate)}</div>
              </a>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

function BlogCollection() {
  const [blogs] = useState(initialBlogs)
  const [selectedCategory, setSelectedCategory] = useState('全部')

  // 获取所有分类
  const categories = ['全部', ...new Set(blogs.map(blog => blog.category))]

  // 过滤博客
  const filteredBlogs = selectedCategory === '全部' 
    ? blogs 
    : blogs.filter(blog => blog.category === selectedCategory)

  // 格式化日期
  const formatDate = (dateStr) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="blog-collection">
      <div className="blog-header">
        <h1>
          <FontAwesomeIcon icon={faFileText} />
          博客集
        </h1>
        <p>静态网页文章收集</p>
      </div>

      {/* 分类筛选 */}
      <div className="blog-categories">
        {categories.map(category => (
          <button
            key={category}
            className={`category-filter-btn ${selectedCategory === category ? 'active' : ''}`}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      {/* 博客列表 */}
      <div className="blog-list">
        {filteredBlogs.length > 0 ? (
          filteredBlogs.map(blog => (
            <div key={blog.id} className="blog-card">
              <div className="blog-card-header">
                <h3 className="blog-title">{blog.title}</h3>
                <span className="blog-date">{formatDate(blog.date)}</span>
              </div>
              
              <div className="blog-meta">
                <span className="blog-category">{blog.category}</span>
                <div className="blog-tags">
                  {blog.tags.map((tag, index) => (
                    <span key={index} className="blog-tag">#{tag}</span>
                  ))}
                </div>
              </div>
              
              <p className="blog-description">{blog.description}</p>
              
              <div className="blog-actions">
                <a 
                  href={blog.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="blog-read-btn"
                >
                  <FontAwesomeIcon icon={faFileText} />
                  阅读文章
                </a>
              </div>
            </div>
          ))
        ) : (
          <div className="no-blogs">
            <FontAwesomeIcon icon={faFileText} />
            <p>暂无该分类下的文章</p>
          </div>
        )}
      </div>

      {/* 添加说明 */}
      <div className="blog-footer">
        <p>💡 提示：要添加新的博客文章，请在代码中的 initialBlogs 数组里添加相应配置</p>
      </div>
    </div>
  )
}

function App() {
  const [links, setLinks] = useState(initialLinks)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedMainCategory, setSelectedMainCategory] = useState('研发')
  const [selectedSubCategory, setSelectedSubCategory] = useState('全部')
  const [expandedCategories, setExpandedCategories] = useState(['研发'])
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [viewMode, setViewMode] = useState('grid') // 'grid' or 'list'
  const [currentTheme, setCurrentTheme] = useState('light')
  const [showGradientPicker, setShowGradientPicker] = useState(false)
  const [currentGradient, setCurrentGradient] = useState(gradientPresets[0])
  const [activeMenu, setActiveMenu] = useState('main') // 默认打开主页面
  
  // 获取YouTube数据
  const { feeds: youtubeFeeds, loading: youtubeLoading, error: youtubeError, lastFetch, refresh } = useYoutubeRssFeed()
  
  // 使用全局搜索
  const searchResults = useGlobalSearch(searchTerm, links, initialBlogs, youtubeFeeds)

  // 初始化和更新主题
  useEffect(() => {
    const appContainer = document.querySelector('.app-container')
    const body = document.body
    const root = document.documentElement
    
    if (currentTheme === 'gradient') {
      // 应用渐变主题
      const background = currentGradient.background
      const primary = currentGradient.primary
      
      // 多层次应用样式确保生效
      if (appContainer) {
        appContainer.style.setProperty('--background', background, 'important')
        appContainer.style.setProperty('--primary-color', primary, 'important')
        appContainer.style.background = background
      }
      if (body) {
        body.style.background = background
      }
      root.style.setProperty('--background', background, 'important')
      root.style.setProperty('--primary-color', primary, 'important')
    } else {
      // 清除渐变主题的动态样式，回到CSS定义的主题
      if (appContainer) {
        appContainer.style.removeProperty('--background')
        appContainer.style.removeProperty('--primary-color')
        appContainer.style.removeProperty('background')
      }
      if (body) {
        body.style.removeProperty('background')
      }
      root.style.removeProperty('--background')
      root.style.removeProperty('--primary-color')
    }
  }, [currentTheme, currentGradient])

  // 切回main时，若分类为null，自动设为默认
  useEffect(() => {
    if (activeMenu === 'main' && !selectedMainCategory) {
      setSelectedMainCategory('研发')
      setSelectedSubCategory('全部')
    }
  }, [activeMenu, selectedMainCategory])

  const toggleCategory = (category) => {
    setExpandedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    )
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  // 普通分类筛选（当没有搜索词时使用）
  const filteredLinks = links.filter(link => {
    const matchesMainCategory = selectedMainCategory === '全部' || link.mainCategory === selectedMainCategory
    const matchesSubCategory = selectedSubCategory === '全部' || link.subCategory === selectedSubCategory
    return matchesMainCategory && matchesSubCategory
  })

  const updateRating = (id, newRating) => {
    setLinks(links.map(link => 
      link.id === id ? { ...link, rating: newRating } : link
    ))
  }

  const handleCategorySelect = (mainCategory, subCategory) => {
    setSelectedMainCategory(mainCategory)
    setSelectedSubCategory(subCategory)
    setIsMobileMenuOpen(false) // 移动端选择后关闭菜单
    setActiveMenu('main') // 切回主内容
    setSearchTerm('') // 清除搜索词
  }

  // 处理搜索结果项点击
  const handleSearchItemClick = (type, item) => {
    setActiveMenu(type)
    setSearchTerm('') // 清除搜索词
    setIsMobileMenuOpen(false)
  }

  // 当搜索时，自动切换到搜索页面
  const handleSearchChange = (e) => {
    const term = e.target.value
    setSearchTerm(term)
    if (term.trim()) {
      setActiveMenu('search')
    } else if (activeMenu === 'search') {
      setActiveMenu('main') // 如果清空搜索，回到主页面
    }
  }

  const handleThemeChange = (theme) => {
    setCurrentTheme(theme)
    if (theme === 'gradient') {
      setShowGradientPicker(true)
    } else {
      setShowGradientPicker(false)
      // 清除内联样式，让CSS类生效
      const root = document.documentElement
      const properties = [
        '--background', '--primary-color', '--card-bg', '--sidebar-bg',
        '--text-primary', '--text-secondary', '--text-white', '--border-color', '--input-border'
      ]
      properties.forEach(prop => {
        root.style.removeProperty(prop)
      })
    }
  }

  const handleGradientSelect = (gradient) => {
    setCurrentGradient(gradient)
    setShowGradientPicker(false)
    
    // 确保当前主题是渐变模式
    if (currentTheme !== 'gradient') {
      setCurrentTheme('gradient')
    }
    
    // 延迟一帧执行，确保组件已更新
    setTimeout(() => {
      const appContainer = document.querySelector('.app-container')
      const body = document.body
      const root = document.documentElement
      
      const background = gradient.background
      const primary = gradient.primary
      
      // 多层次应用样式确保生效
      if (appContainer) {
        appContainer.style.setProperty('--background', background, 'important')
        appContainer.style.setProperty('--primary-color', primary, 'important')
        appContainer.style.background = background
      }
      if (body) {
        body.style.background = background
      }
      root.style.setProperty('--background', background, 'important')
      root.style.setProperty('--primary-color', primary, 'important')
    }, 0)
  }

  // 渲染星级评分组件
  const renderStarRating = (linkId, currentRating) => {
    return (
      <div className="star-rating">
        {[1, 2, 3, 4, 5, 6, 7].map(star => (
          <button
            key={star}
            className={`star-btn ${star <= currentRating ? 'active' : ''}`}
            onClick={() => updateRating(linkId, star)}
            title={`${star}星评级`}
          >
            <FontAwesomeIcon icon={faStar} />
          </button>
        ))}
      </div>
    )
  }

  return (
    <div className={`app-container theme-${currentTheme}`} data-theme={currentTheme}>
      {/* 移动端菜单按钮 */}
      <button className="mobile-menu-btn" onClick={toggleMobileMenu}>
        <FontAwesomeIcon icon={isMobileMenuOpen ? faTimes : faBars} />
      </button>

      {/* 移动端遮罩层 */}
      <div 
        className={`mobile-overlay ${isMobileMenuOpen ? 'active' : ''}`}
        onClick={closeMobileMenu}
      ></div>

      {/* 渐变选择器弹窗 */}
      {showGradientPicker && (
        <div className="gradient-picker-overlay" onClick={() => setShowGradientPicker(false)}>
          <div className="gradient-picker" onClick={(e) => e.stopPropagation()}>
            <div className="gradient-picker-header">
              <h3>选择渐变主题</h3>
              <button 
                className="close-btn"
                onClick={() => setShowGradientPicker(false)}
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
            <div className="gradient-grid">
              {gradientPresets.map(gradient => (
                <div
                  key={gradient.id}
                  className={`gradient-option ${currentGradient.id === gradient.id ? 'selected' : ''}`}
                  style={{ background: gradient.background }}
                  onClick={() => handleGradientSelect(gradient)}
                >
                  <div className="gradient-name">{gradient.name}</div>
                  {currentGradient.id === gradient.id && (
                    <div className="gradient-check">
                      <FontAwesomeIcon icon={faCheck} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <aside className={`sidebar ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-header">
          <h2>Eclair Collection</h2>
          <p>想想你为什么活着</p>
        </div>
        
        <div className="search-bar">
          <FontAwesomeIcon icon={faSearch} />
          <input
            type="text"
            placeholder="搜索网站、博客、视频..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>

        {/* 主题切换按钮 */}
        <div className="theme-toggle">
          <div className="theme-toggle-label">主题模式</div>
          <div className="theme-toggle-buttons">
            {Object.entries(themes).map(([themeKey, theme]) => (
              <button
                key={themeKey}
                className={`theme-toggle-btn ${currentTheme === themeKey ? 'active' : ''}`}
                onClick={() => handleThemeChange(themeKey)}
                title={theme.name}
              >
                <FontAwesomeIcon icon={theme.icon} />
              </button>
            ))}
          </div>
        </div>

        {/* 视图切换按钮 */}
        <div className="view-toggle">
          <div className="view-toggle-label">视图模式</div>
          <div className="view-toggle-buttons">
            <button
              className={`view-toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
              title="网格视图"
            >
              <FontAwesomeIcon icon={faGrip} />
            </button>
            <button
              className={`view-toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
              title="列表视图"
            >
              <FontAwesomeIcon icon={faList} />
            </button>
          </div>
        </div>
        
        {/* 特殊菜单区域 */}
        <div className="special-menus">
          <button
            className={`special-menu-btn youtube ${activeMenu === 'youtube' ? 'active' : ''}`}
            onClick={() => setActiveMenu('youtube')}
          >
            <FontAwesomeIcon icon={faYoutube} />
            youtubo订阅
          </button>
          
          <button
            className={`special-menu-btn blog ${activeMenu === 'blog' ? 'active' : ''}`}
            onClick={() => setActiveMenu('blog')}
          >
            <FontAwesomeIcon icon={faFileText} />
            博客集
          </button>
        </div>
        
        <nav className="category-nav">
          {Object.entries(categories).map(([category, { icon, subCategories }]) => (
            <div key={category} className="category-group">
              <div 
                className="main-category"
                data-expanded={expandedCategories.includes(category)}
                onClick={() => toggleCategory(category)}
              >
                <FontAwesomeIcon icon={icon} />
                <span>{category}</span>
                <FontAwesomeIcon 
                  icon={expandedCategories.includes(category) ? faChevronDown : faChevronRight} 
                  className="expand-icon"
                />
              </div>
              {expandedCategories.includes(category) && (
                <div className="sub-categories">
                  <button
                    className={`sub-category ${activeMenu === 'main' && selectedMainCategory === category && selectedSubCategory === '全部' ? 'active' : ''}`}
                    onClick={() => handleCategorySelect(category, '全部')}
                  >
                    全部
                  </button>
                  {subCategories.map(subCategory => (
                    <button
                      key={subCategory}
                      className={`sub-category ${activeMenu === 'main' && selectedMainCategory === category && selectedSubCategory === subCategory ? 'active' : ''}`}
                      onClick={() => handleCategorySelect(category, subCategory)}
                    >
                      {subCategory}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </aside>

      <main className="main-content">
        {activeMenu === 'search' && (
          <SearchResults 
            searchResults={searchResults}
            searchTerm={searchTerm}
            onItemClick={handleSearchItemClick}
          />
        )}
        
        {activeMenu === 'main' && (
          <>
            <div className="content-header">
              <h1>
                {selectedMainCategory !== '全部' && (
                  <>
                    <FontAwesomeIcon icon={categories[selectedMainCategory].icon} />
                    {selectedMainCategory}
                  </>
                )}
                {selectedSubCategory !== '全部' && ` > ${selectedSubCategory}`}
              </h1>
            </div>

            <div className={`links-container ${viewMode}`}>
              {filteredLinks.length > 0 ? (
                filteredLinks.map(link => (
                  <div key={link.id} className="link-card">
                    <div className="link-header">
                      <div className="link-title">
                        <FontAwesomeIcon icon={link.icon} className="link-icon" />
                        <h3>{link.title}</h3>
                      </div>
                      {renderStarRating(link.id, link.rating)}
                    </div>
                    <div className="link-tags">
                      <span className="category-tag">{link.mainCategory}</span>
                      <span className="category-tag">{link.subCategory}</span>
                      <span className="rating-badge">{link.rating}⭐</span>
                    </div>
                    <p className="description">{link.description}</p>
                    <a href={link.url} target="_blank" rel="noopener noreferrer">
                      访问网站
                    </a>
                  </div>
                ))
              ) : (
                <div className="no-results">
                  未找到匹配的网站
                </div>
              )}
            </div>
          </>
        )}
        {activeMenu === 'youtube' && (
          <YoutubeSubs 
            feeds={youtubeFeeds}
            loading={youtubeLoading}
            error={youtubeError}
            lastFetch={lastFetch}
            onRefresh={refresh}
          />
        )}
        {activeMenu === 'blog' && <BlogCollection />}
      </main>
    </div>
  )
}

export default App
