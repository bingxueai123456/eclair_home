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
  faSpinner,
  faRss,
  faSignOutAlt,
  faUser,
  faFolder,
  faGlobe
} from '@fortawesome/free-solid-svg-icons'

import { faGithub, faYoutube } from '@fortawesome/free-brands-svg-icons'
import './styles/galaxy-theme.css'
import './styles/galaxy-components.css'
import useYoutubeRssFeed from './useYoutubeRssFeed'
import useRssManager from './useRssManager'
import { useGlobalSearch, SearchResults, SEARCH_TYPES } from './useGlobalSearch'
import { useAuth } from './hooks/useAuth.jsx'
import { useWebsites, useCategories, useHtmlPages } from './hooks/useDatabase.jsx'
import { Login, AdminPanel } from './components'

// 主题配置 - 只保留暗黑和白色
const themes = {
  dark: {
    name: '暗黑',
    icon: faMoon
  },
  light: {
    name: '白色',
    icon: faSun
  }
}

// RSS订阅组件
function RssFeeds({ 
  rssFeeds, 
  loading, 
  error, 
  lastFetch, 
  onRefreshAll, 
  onRefreshSingle 
}) {

  const formatDate = (dateStr) => {
    if (!dateStr) return ''
    try {
      const date = new Date(dateStr)
      const now = new Date()
      const diffHours = Math.floor((now - date) / (1000 * 60 * 60))
      
      if (diffHours < 1) return '1小时内'
      if (diffHours < 24) return `${diffHours}小时前`
      if (diffHours < 48) return '1天前'
      const diffDays = Math.floor(diffHours / 24)
      if (diffDays < 7) return `${diffDays}天前`
      return date.toLocaleDateString('zh-CN')
    } catch {
      return dateStr
    }
  }

  return (
    <div className="rss-feeds-section">
      <div className="rss-header">
        <div className="rss-subs-title">
          <h1>
            <FontAwesomeIcon icon={faRss} />
            RSS订阅
          </h1>
          <div className="rss-controls">
            {lastFetch && (
              <div className="last-update">
                最后更新: {lastFetch}
              </div>
            )}
            <button 
              className="refresh-btn"
              onClick={() => onRefreshAll(false)}
              disabled={loading}
            >
              <FontAwesomeIcon icon={loading ? faSpinner : faSync} className={loading ? 'spinning' : ''} />
              刷新
            </button>
            <button 
              className="refresh-btn force"
              onClick={() => onRefreshAll(true)}
              disabled={loading}
            >
              <FontAwesomeIcon icon={faSync} />
              强制刷新
            </button>
          </div>
        </div>
      </div>

      {loading && (
        <div className="loading-message">
          <FontAwesomeIcon icon={faSpinner} className="spinning" />
          正在获取RSS内容...
        </div>
      )}

      {error && (
        <div className="error-message">
          <FontAwesomeIcon icon={faSync} />
          {error}
        </div>
      )}

      {rssFeeds.length === 0 && !loading && !error && (
        <div className="feed-empty" style={{ padding: '24px', textAlign: 'center' }}>
          暂无 RSS 源，请在「管理后台 → RSS」添加
        </div>
      )}

      <div className="rss-feeds-container">
        {rssFeeds.map(feed => (
          <div key={feed.id} className="rss-feed-section">
            <div className="rss-feed-header">
              <h2>{feed.name}</h2>
              <div className="feed-actions">
                <button 
                  className="refresh-btn"
                  onClick={() => onRefreshSingle(feed.id)}
                  title="刷新此订阅"
                  disabled={loading}
                >
                  <FontAwesomeIcon icon={faSync} />
                </button>
              </div>
            </div>
            
            {feed.description && (
              <p className="feed-description">{feed.description}</p>
            )}
            
            {feed.error && (
              <div className="feed-error">
                <FontAwesomeIcon icon={faSync} />
                获取失败: {feed.error}
              </div>
            )}

            {feed.items && feed.items.length > 0 ? (
              <div className="rss-items-column">
                {feed.items.map((item, index) => (
                  <div key={item.guid || index} className="rss-item-card">
                    <div className="rss-item-content">
                      <h3 className="rss-item-title">
                        <a href={item.link} target="_blank" rel="noopener noreferrer">
                          {item.title}
                        </a>
                      </h3>
                      {item.description && (
                        <p className="rss-item-description">
                          {item.description.replace(/<[^>]*>/g, '').substring(0, 120)}
                          {item.description.replace(/<[^>]*>/g, '').length > 120 ? '...' : ''}
                        </p>
                      )}
                      {item.pubDate && (
                        <div className="rss-item-date">{formatDate(item.pubDate)}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              !feed.error && <div className="feed-empty">暂无内容</div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

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
  const { htmlPages, loading } = useHtmlPages()
  const [selectedCategory, setSelectedCategory] = useState('全部')

  // 获取所有分类
  const categories = ['全部', ...new Set(htmlPages.map(page => page.category).filter(Boolean))]

  // 过滤博客
  const filteredBlogs = selectedCategory === '全部'
    ? htmlPages
    : htmlPages.filter(page => page.category === selectedCategory)

  // 格式化日期
  const formatDate = (dateStr) => {
    if (!dateStr) return ''
    const date = new Date(dateStr)
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="blog-collection">
        <div className="loading">加载中...</div>
      </div>
    )
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
          filteredBlogs.map(page => (
            <div key={page.id} className="blog-card">
              <div className="blog-card-header">
                <h3 className="blog-title">{page.title}</h3>
                <span className="blog-date">{formatDate(page.created_at)}</span>
              </div>

              <div className="blog-meta">
                <span className="blog-category">{page.category}</span>
                <div className="blog-tags">
                  {(page.tags || []).map((tag, index) => (
                    <span key={index} className="blog-tag">#{tag}</span>
                  ))}
                </div>
              </div>

              <p className="blog-description">{page.description}</p>

              <div className="blog-actions">
                <a
                  href={page.storage_path}
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
        <p>💡 提示：在管理后台添加新的博客文章</p>
      </div>
    </div>
  )
}

function App() {
  // 使用 Supabase Auth
  const { loading: authLoading, signOut, isAuthenticated } = useAuth()
  
  // 使用数据库 hooks
  const { websites, loading: websitesLoading, fetchWebsites } = useWebsites()
  const { categories, loading: categoriesLoading } = useCategories()
  const { htmlPages } = useHtmlPages()
  
  const [searchTerm, setSearchTerm] = useState('')
  const [searchType, setSearchType] = useState(SEARCH_TYPES.ALL)
  const [selectedMainCategory, setSelectedMainCategory] = useState('')
  const [selectedSubCategory, setSelectedSubCategory] = useState('全部')
  const [expandedCategories, setExpandedCategories] = useState([])
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [viewMode, setViewMode] = useState('grid') // 'grid' or 'list'
  const [currentTheme, setCurrentTheme] = useState('dark')
  const [activeMenu, setActiveMenu] = useState('blog') // 初始默认博客页面，登录检查后会自动切换
  const [showAdminPanel, setShowAdminPanel] = useState(false)
  
  // 初始化默认分类
  useEffect(() => {
    if (categories.length > 0 && !selectedMainCategory) {
      setSelectedMainCategory(categories[0].name)
      setExpandedCategories([categories[0].name])
    }
  }, [categories, selectedMainCategory])
  
  // 登出处理 - 使用 Supabase Auth
  const handleLogout = async () => {
    await signOut()
  }

  // 当认证状态变化时更新菜单
  useEffect(() => {
    if (!authLoading) {
      if (isAuthenticated) {
        setActiveMenu('main')
      } else {
        setActiveMenu('blog')
      }
    }
  }, [isAuthenticated, authLoading])

  // 检查是否可以访问当前菜单（博客相关功能允许未登录访问）
  const canAccessMenu = (menu) => {
    if (menu === 'blog') {
      return true // 博客功能允许未登录访问
    }
    return isAuthenticated // 其他功能需要登录
  }

  // 获取YouTube数据
  const { feeds: youtubeFeeds, loading: youtubeLoading, error: youtubeError, lastFetch, refresh } = useYoutubeRssFeed()
  
  // RSS管理
  const { 
    rssFeeds, 
    loading: rssLoading, 
    error: rssError, 
    lastFetch: rssLastFetch,
    refreshAllFeeds, 
    refreshSingleFeed 
  } = useRssManager()
  
  // 使用按表搜索
  const searchResults = useGlobalSearch(searchTerm, websites, htmlPages, youtubeFeeds, searchType)

  // 初始化和更新主题
// 主题切换效果
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', currentTheme)
    document.body.setAttribute('data-theme', currentTheme)
  }, [currentTheme])

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
  const filteredLinks = websites.filter(site => {
    const matchesMainCategory = selectedMainCategory === '全部' || site.main_category === selectedMainCategory
    const matchesSubCategory = selectedSubCategory === '全部' || site.sub_category === selectedSubCategory
    return matchesMainCategory && matchesSubCategory
  })

  const updateRating = async (id, newRating) => {
    // 评分更新功能 - 后续可以实现
    console.log('Rating update:', id, newRating)
  }

  const handleCategorySelect = (mainCategory, subCategory) => {
    setSelectedMainCategory(mainCategory)
    setSelectedSubCategory(subCategory)
    setIsMobileMenuOpen(false) // 移动端选择后关闭菜单
    setActiveMenu('main') // 切回主内容
    setSearchTerm('') // 清除搜索词
  }

  // 处理搜索结果项点击
  const handleSearchItemClick = (type) => {
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

  // 如果正在检查登录状态，显示加载
  if (authLoading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
      </div>
    )
  }

  // 如果未登录且尝试访问需要登录的功能，显示登录页面
  // 博客功能（blog）允许未登录访问
  if (!isAuthenticated && (activeMenu === 'login-required' || !canAccessMenu(activeMenu))) {
    return <Login />
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


      <aside className={`sidebar ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-header">
          <h2>Eclair Collection</h2>
          <p>LIVE</p>
          {isAuthenticated && (
            <>
              <button 
                className="special-menu-btn admin"
                onClick={() => setShowAdminPanel(true)}
                title="管理后台"
              >
                <FontAwesomeIcon icon={faGears} />
                管理后台
              </button>
              <button 
                className="logout-btn"
                onClick={handleLogout}
                title="退出登录"
              >
                <FontAwesomeIcon icon={faSignOutAlt} />
                退出登录
              </button>
            </>
          )}
          {!isAuthenticated && (
            <>
              <div className="login-prompt">
                <p>登录以解锁更多功能</p>
              </div>
              <button 
                className="login-btn"
                onClick={() => setActiveMenu('login-required')}
                title="登录以解锁更多功能"
              >
                <FontAwesomeIcon icon={faUser} />
                <span>登录</span>
                <div className="login-btn-shine"></div>
              </button>
            </>
          )}
        </div>
        
        {isAuthenticated && (
          <div className="search-bar">
            <FontAwesomeIcon icon={faSearch} />
            <input
              type="text"
              placeholder="搜索网站、博客、视频..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
        )}

        {isAuthenticated && (
          <>
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
          </>
        )}
        
        {/* 特殊菜单区域 */}
        <div className="special-menus">
          <button
            className={`special-menu-btn youtube ${activeMenu === 'youtube' ? 'active' : ''}`}
            onClick={() => {
              if (canAccessMenu('youtube')) {
                setActiveMenu('youtube')
              } else {
                setActiveMenu('login-required')
              }
            }}
            disabled={!isAuthenticated}
            title={!isAuthenticated ? '需要登录' : ''}
          >
            <FontAwesomeIcon icon={faYoutube} />
            youtubo订阅
          </button>
          
          <button
            className={`special-menu-btn rss ${activeMenu === 'rss' ? 'active' : ''}`}
            onClick={() => {
              if (canAccessMenu('rss')) {
                setActiveMenu('rss')
              } else {
                setActiveMenu('login-required')
              }
            }}
            disabled={!isAuthenticated}
            title={!isAuthenticated ? '需要登录' : ''}
          >
            <FontAwesomeIcon icon={faRss} />
            RSS订阅
          </button>
          
          <button
            className={`special-menu-btn blog ${activeMenu === 'blog' ? 'active' : ''}`}
            onClick={() => setActiveMenu('blog')}
          >
            <FontAwesomeIcon icon={faFileText} />
            博客集
          </button>
        </div>
        
{isAuthenticated && (
          <nav className="category-nav">
            {categories.map(cat => (
              <div key={cat.id} className="category-group">
                <div
                  className="main-category"
                  data-expanded={expandedCategories.includes(cat.name)}
                  onClick={() => toggleCategory(cat.name)}
                >
                  <FontAwesomeIcon icon={faFolder} />
                  <span>{cat.name}</span>
                  <FontAwesomeIcon
                    icon={expandedCategories.includes(cat.name) ? faChevronDown : faChevronRight}
                    className="expand-icon"
                  />
                </div>
                {expandedCategories.includes(cat.name) && (
                  <div className="sub-categories">
                    <button
                      className={`sub-category ${activeMenu === 'main' && selectedMainCategory === cat.name && selectedSubCategory === '全部' ? 'active' : ''}`}
                      onClick={() => handleCategorySelect(cat.name, '全部')}
                    >
                      全部
                    </button>
                    {(cat.sub_categories || []).map(subCategory => (
                      <button
                        key={subCategory}
                        className={`sub-category ${activeMenu === 'main' && selectedMainCategory === cat.name && selectedSubCategory === subCategory ? 'active' : ''}`}
                        onClick={() => handleCategorySelect(cat.name, subCategory)}
                      >
                        {subCategory}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
        )}
      </aside>

      <main className="main-content">

        
{activeMenu === 'search' && (
          <SearchResults
            searchResults={searchResults}
            searchTerm={searchTerm}
            searchType={searchType}
            onSearchTypeChange={setSearchType}
            onItemClick={handleSearchItemClick}
          />
        )}
        
        {activeMenu === 'main' && (
          <>
            <div className="content-header">
              <h1>
                {selectedMainCategory && (
                  <>
                    <FontAwesomeIcon icon={faGears} />
                    {selectedMainCategory}
                  </>
                )}
                {selectedSubCategory !== '全部' && ` > ${selectedSubCategory}`}
              </h1>
            </div>

            <div className={`links-container ${viewMode}`}>
              {websitesLoading ? (
                <div className="loading">加载中...</div>
              ) : filteredLinks.length > 0 ? (
                filteredLinks.map(site => (
                  <div key={site.id} className="link-card">
                    <div className="link-header">
                      <div className="link-title">
                        <FontAwesomeIcon icon={faGlobe} className="link-icon" />
                        <h3>{site.title}</h3>
                      </div>
                      {renderStarRating(site.id, site.rating)}
                    </div>
                    <div className="link-tags">
                      <span className="category-tag">{site.main_category}</span>
                      <span className="category-tag">{site.sub_category}</span>
                      <span className="rating-badge">{site.rating || 5}⭐</span>
                    </div>
                    <p className="description">{site.description}</p>
                    <a href={site.url} target="_blank" rel="noopener noreferrer">
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
        {activeMenu === 'rss' && (
          <RssFeeds 
            rssFeeds={rssFeeds}
            loading={rssLoading}
            error={rssError}
            lastFetch={rssLastFetch}
            onRefreshAll={refreshAllFeeds}
            onRefreshSingle={refreshSingleFeed}
          />
        )}
        {activeMenu === 'blog' && (
          <BlogCollection />
        )}
        {/* 未登录用户提示 */}
        {!isAuthenticated && activeMenu === 'blog' && (
          <div className="guest-notice">
            <p>💡 当前以访客模式浏览博客，<button onClick={() => setActiveMenu('login-required')} className="inline-login-link">登录</button>以解锁更多功能</p>
          </div>
        )}
      </main>

      {/* 管理后台面板 */}
      <AdminPanel 
        isOpen={showAdminPanel} 
        onClose={() => setShowAdminPanel(false)} 
      />
    </div>
  )
}

export default App
