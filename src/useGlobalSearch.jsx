import { useMemo, useState } from 'react'

// 搜索类型
export const SEARCH_TYPES = {
  ALL: 'all',
  WEBSITES: 'websites',
  BLOGS: 'blogs',
  VIDEOS: 'videos'
}

// 按表搜索 hook
export const useGlobalSearch = (searchTerm, links, blogs, youtubeFeeds, searchType = SEARCH_TYPES.ALL) => {
  const searchResults = useMemo(() => {
    if (!searchTerm.trim()) {
      return {
        websites: [],
        blogs: [],
        videos: [],
        hasResults: false,
        totalCount: 0
      }
    }

    const term = searchTerm.toLowerCase()
    let websites = []
    let filteredBlogs = []
    let videos = []

    // 根据搜索类型执行搜索
    if (searchType === SEARCH_TYPES.ALL || searchType === SEARCH_TYPES.WEBSITES) {
      // 搜索网站（支持新的数据库字段名）
      websites = (links || []).filter(link => 
        (link.title && link.title.toLowerCase().includes(term)) ||
        (link.description && link.description.toLowerCase().includes(term)) ||
        (link.main_category && link.main_category.toLowerCase().includes(term)) ||
        (link.sub_category && link.sub_category.toLowerCase().includes(term)) ||
        // 兼容旧字段名
        (link.mainCategory && link.mainCategory.toLowerCase().includes(term)) ||
        (link.subCategory && link.subCategory.toLowerCase().includes(term))
      )
    }

    if (searchType === SEARCH_TYPES.ALL || searchType === SEARCH_TYPES.BLOGS) {
      // 搜索博客（支持新的数据库字段名）
      filteredBlogs = (blogs || []).filter(blog =>
        (blog.title && blog.title.toLowerCase().includes(term)) ||
        (blog.description && blog.description.toLowerCase().includes(term)) ||
        (blog.category && blog.category.toLowerCase().includes(term)) ||
        (blog.tags && blog.tags.some(tag => tag.toLowerCase().includes(term)))
      )
    }

    if (searchType === SEARCH_TYPES.ALL || searchType === SEARCH_TYPES.VIDEOS) {
      // 搜索YouTube视频
      if (youtubeFeeds && youtubeFeeds.length > 0) {
        youtubeFeeds.forEach(feed => {
          if (feed.items) {
            const matchingVideos = feed.items.filter(video =>
              (video.title && video.title.toLowerCase().includes(term)) ||
              (video.channelTitle && video.channelTitle.toLowerCase().includes(term))
            ).map(video => ({
              ...video,
              feedTitle: feed.channelTitle
            }))
            videos.push(...matchingVideos)
          }
        })
      }
    }

    const totalCount = websites.length + filteredBlogs.length + videos.length

    return {
      websites,
      blogs: filteredBlogs,
      videos,
      hasResults: totalCount > 0,
      totalCount
    }
  }, [searchTerm, links, blogs, youtubeFeeds, searchType])

  return searchResults
}

// 搜索结果渲染组件
export const SearchResults = ({ searchResults, searchTerm, searchType, onSearchTypeChange, onItemClick }) => {
  
  // 搜索类型选项
  const searchTypeOptions = [
    { value: SEARCH_TYPES.ALL, label: '全部', icon: '🔍' },
    { value: SEARCH_TYPES.WEBSITES, label: '网站', icon: '🌐' },
    { value: SEARCH_TYPES.BLOGS, label: '博客', icon: '📝' },
    { value: SEARCH_TYPES.VIDEOS, label: '视频', icon: '🎥' }
  ]

  return (
    <div className="search-results-container">
      {/* 搜索类型选择器 */}
      <div className="search-type-selector">
        <span className="selector-label">搜索范围：</span>
        <div className="search-type-buttons">
          {searchTypeOptions.map(option => (
            <button
              key={option.value}
              className={`search-type-btn ${searchType === option.value ? 'active' : ''}`}
              onClick={() => onSearchTypeChange(option.value)}
            >
              <span className="btn-icon">{option.icon}</span>
              <span className="btn-label">{option.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 搜索结果头部 */}
      <div className="search-results-header">
        <h2>搜索结果: &quot;{searchTerm}&quot;</h2>
        <span className="search-count">共找到 {searchResults.totalCount} 个结果</span>
      </div>

      {!searchResults.hasResults ? (
        <div className="search-no-results">
          <div className="no-results-icon">🔍</div>
          <h3>未找到搜索结果</h3>
          <p>尝试使用不同的关键词或切换搜索范围</p>
        </div>
      ) : (
        <div className="search-results">
          {/* 网站结果 */}
          {searchResults.websites.length > 0 && (
            <div className="search-section">
              <h3 className="search-section-title">
                <span className="section-icon">🌐</span>
                网站收藏 ({searchResults.websites.length})
              </h3>
              <div className="search-items">
                {searchResults.websites.map(website => (
                  <div key={`website-${website.id}`} className="search-item website">
                    <div className="search-item-header">
                      <h4>{website.title}</h4>
                      <div className="search-item-meta">
                        <span className="category">{website.main_category || website.mainCategory}</span>
                        <span className="subcategory">{website.sub_category || website.subCategory}</span>
                        <span className="rating">{website.rating || 5}⭐</span>
                      </div>
                    </div>
                    <p className="search-item-description">{website.description}</p>
                    <div className="search-item-actions">
                      <a 
                        href={website.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="search-action-btn"
                      >
                        访问网站
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 博客结果 */}
          {searchResults.blogs.length > 0 && (
            <div className="search-section">
              <h3 className="search-section-title">
                <span className="section-icon">📝</span>
                博客文章 ({searchResults.blogs.length})
              </h3>
              <div className="search-items">
                {searchResults.blogs.map(blog => (
                  <div key={`blog-${blog.id}`} className="search-item blog">
                    <div className="search-item-header">
                      <h4>{blog.title}</h4>
                      <div className="search-item-meta">
                        <span className="category">{blog.category}</span>
                      </div>
                    </div>
                    <p className="search-item-description">{blog.description}</p>
                    {blog.tags && blog.tags.length > 0 && (
                      <div className="search-item-tags">
                        {blog.tags.map((tag, index) => (
                          <span key={index} className="tag">#{tag}</span>
                        ))}
                      </div>
                    )}
                    <div className="search-item-actions">
                      <a 
                        href={blog.storage_path || blog.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="search-action-btn"
                      >
                        阅读文章
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* YouTube视频结果 */}
          {searchResults.videos.length > 0 && (
            <div className="search-section">
              <h3 className="search-section-title">
                <span className="section-icon">🎥</span>
                YouTube视频 ({searchResults.videos.length})
              </h3>
              <div className="search-items">
                {searchResults.videos.map((video, index) => (
                  <div key={`video-${index}`} className="search-item video">
                    <div className="search-item-header">
                      <h4>{video.title}</h4>
                      <div className="search-item-meta">
                        <span className="channel">{video.channelTitle}</span>
                        <span className="date">{video.pubDate}</span>
                      </div>
                    </div>
                    <div className="search-item-actions">
                      <a 
                        href={video.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="search-action-btn"
                      >
                        观看视频
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
