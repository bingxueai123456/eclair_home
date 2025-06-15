import { useMemo } from 'react'

// 全局搜索hook
export const useGlobalSearch = (searchTerm, links, blogs, youtubeFeeds) => {
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

    // 搜索网站
    const websites = links.filter(link => 
      link.title.toLowerCase().includes(term) ||
      link.description.toLowerCase().includes(term) ||
      link.mainCategory.toLowerCase().includes(term) ||
      link.subCategory.toLowerCase().includes(term)
    )

    // 搜索博客
    const filteredBlogs = blogs.filter(blog =>
      blog.title.toLowerCase().includes(term) ||
      blog.description.toLowerCase().includes(term) ||
      blog.category.toLowerCase().includes(term) ||
      blog.tags.some(tag => tag.toLowerCase().includes(term))
    )

    // 搜索YouTube视频
    const videos = []
    if (youtubeFeeds && youtubeFeeds.length > 0) {
      youtubeFeeds.forEach(feed => {
        const matchingVideos = feed.items.filter(video =>
          video.title.toLowerCase().includes(term) ||
          video.channelTitle.toLowerCase().includes(term)
        ).map(video => ({
          ...video,
          feedTitle: feed.channelTitle
        }))
        videos.push(...matchingVideos)
      })
    }

    const totalCount = websites.length + filteredBlogs.length + videos.length

    return {
      websites,
      blogs: filteredBlogs,
      videos,
      hasResults: totalCount > 0,
      totalCount
    }
  }, [searchTerm, links, blogs, youtubeFeeds])

  return searchResults
}

// 搜索结果渲染组件
export const SearchResults = ({ searchResults, searchTerm, onItemClick }) => {
  if (!searchResults.hasResults) {
    return (
      <div className="search-no-results">
        <div className="no-results-icon">🔍</div>
        <h3>未找到搜索结果</h3>
        <p>尝试使用不同的关键词搜索 &quot;{searchTerm}&quot;</p>
      </div>
    )
  }

  return (
    <div className="search-results">
      <div className="search-results-header">
        <h2>搜索结果: &quot;{searchTerm}&quot;</h2>
        <span className="search-count">共找到 {searchResults.totalCount} 个结果</span>
      </div>

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
                    <span className="category">{website.mainCategory}</span>
                    <span className="subcategory">{website.subCategory}</span>
                    <span className="rating">{website.rating}⭐</span>
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
                  <button 
                    className="search-action-btn secondary"
                    onClick={() => onItemClick('main', website)}
                  >
                    查看详情
                  </button>
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
                    <span className="date">{blog.date}</span>
                  </div>
                </div>
                <p className="search-item-description">{blog.description}</p>
                <div className="search-item-tags">
                  {blog.tags.map((tag, index) => (
                    <span key={index} className="tag">#{tag}</span>
                  ))}
                </div>
                <div className="search-item-actions">
                  <a 
                    href={blog.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="search-action-btn"
                  >
                    阅读文章
                  </a>
                  <button 
                    className="search-action-btn secondary"
                    onClick={() => onItemClick('blog', blog)}
                  >
                    查看详情
                  </button>
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
                  <button 
                    className="search-action-btn secondary"
                    onClick={() => onItemClick('youtube', video)}
                  >
                    查看详情
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
} 