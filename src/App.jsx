import { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faBook, faGamepad, 
   faStar, faSearch,
  faChevronDown, faChevronRight, faBars, faTimes,
  faGrip, faList, faMoon, faSun, faPalette, faCheck,faGear,
  faGears,
  faNewspaper
} from '@fortawesome/free-solid-svg-icons'

import { faGithub, faYoutube } from '@fortawesome/free-brands-svg-icons'
import './App.css'
import useYoutubeRssFeed from './useYoutubeRssFeed'

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
    subCategories: ['技术','科技', '政治', '军事']
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

function YoutubeSubs() {
  const { feeds: youtubeFeeds, loading: youtubeLoading, error: youtubeError } = useYoutubeRssFeed()
  // 时间格式化
  const formatDate = (dateStr) => {
    if (!dateStr) return ''
    const d = new Date(dateStr)
    if (isNaN(d.getTime())) return ''
    return d.toISOString().slice(0,10)
  }
  return (
    <div className="youtube-subs-section">
      <div className="youtube-subs-title">youtubo订阅</div>
      {youtubeLoading && <div>加载中...</div>}
      {youtubeError && <div style={{color:'red'}}>YouTube加载失败: {youtubeError}</div>}
      {!youtubeLoading && youtubeFeeds.map(feed => (
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

function App() {
  const [links, setLinks] = useState(initialLinks)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedMainCategory, setSelectedMainCategory] = useState('全部')
  const [selectedSubCategory, setSelectedSubCategory] = useState('全部')
  const [expandedCategories, setExpandedCategories] = useState([])
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [viewMode, setViewMode] = useState('grid') // 'grid' or 'list'
  const [currentTheme, setCurrentTheme] = useState('light')
  const [showGradientPicker, setShowGradientPicker] = useState(false)
  const [currentGradient, setCurrentGradient] = useState(gradientPresets[0])
  const [activeMenu, setActiveMenu] = useState('youtube') // 默认打开youtubo订阅

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

  const filteredLinks = links.filter(link => {
    const matchesSearch = link.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         link.description.toLowerCase().includes(searchTerm.toLowerCase())
    
    // 如果有搜索词，则进行全局搜索，忽略分类筛选
    if (searchTerm.trim()) {
      return matchesSearch
    }
    
    // 如果没有搜索词，则按分类筛选
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
            placeholder="全局搜索网站..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
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
        
        {/* 新增YouTube订阅菜单按钮 */}
        <div className="youtube-menu-entry">
          <button
            className={`youtube-menu-btn ${activeMenu === 'youtube' ? 'active' : ''}`}
            onClick={() => setActiveMenu('youtube')}
          >
            <FontAwesomeIcon icon={faYoutube} style={{color:'#e53935',marginRight:6}} />
            youtubo订阅
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
        {activeMenu === 'main' && (
          <>
            <div className="content-header">
              <h1>
                {searchTerm.trim() ? (
                  <>
                    <FontAwesomeIcon icon={faSearch} />
                    搜索结果: "{searchTerm}" 
                    <span style={{ fontSize: '0.8em', color: 'var(--text-secondary)', marginLeft: '8px' }}>
                      ({filteredLinks.length} 个结果)
                    </span>
                  </>
                ) : (
                  <>
                    {selectedMainCategory !== '全部' && (
                      <>
                        <FontAwesomeIcon icon={categories[selectedMainCategory].icon} />
                        {selectedMainCategory}
                      </>
                    )}
                    {selectedSubCategory !== '全部' && ` > ${selectedSubCategory}`}
                  </>
                )}
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
        {activeMenu === 'youtube' && <YoutubeSubs />}
      </main>
    </div>
  )
}

export default App
