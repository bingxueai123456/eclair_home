import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faCode, faTools, faBook, faGamepad, 
  faMusic, faVideo, faStar, faSearch,
  faChevronDown, faChevronRight
} from '@fortawesome/free-solid-svg-icons'
import { 
  faReact, faGithub, faStackOverflow,
  faYoutube, faSpotify, faSteam
} from '@fortawesome/free-brands-svg-icons'
import './App.css'

// 示例数据
const initialLinks = [
  {
    id: 1,
    title: 'React 官方文档',
    url: 'https://react.dev',
    mainCategory: '开发',
    subCategory: '前端',
    description: 'React 官方文档，包含完整的教程和API参考',
    starred: true,
    icon: faReact
  },
  {
    id: 2,
    title: 'Vite 官方文档',
    url: 'https://vitejs.dev',
    mainCategory: '开发',
    subCategory: '工具',
    description: '下一代前端构建工具',
    starred: false,
    icon: faTools
  },
  {
    id: 3,
    title: 'GitHub',
    url: 'https://github.com',
    mainCategory: '开发',
    subCategory: '工具',
    description: '全球最大的代码托管平台',
    starred: true,
    icon: faGithub
  },
  {
    id: 4,
    title: 'Stack Overflow',
    url: 'https://stackoverflow.com',
    mainCategory: '开发',
    subCategory: '社区',
    description: '程序员问答社区',
    starred: true,
    icon: faStackOverflow
  },
  {
    id: 5,
    title: 'YouTube',
    url: 'https://youtube.com',
    mainCategory: '娱乐',
    subCategory: '视频',
    description: '视频分享平台',
    starred: false,
    icon: faYoutube
  },
  {
    id: 6,
    title: 'Spotify',
    url: 'https://spotify.com',
    mainCategory: '娱乐',
    subCategory: '音乐',
    description: '音乐流媒体服务',
    starred: false,
    icon: faSpotify
  }
]

// 分类配置
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

function App() {
  const [links, setLinks] = useState(initialLinks)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedMainCategory, setSelectedMainCategory] = useState('开发')
  const [selectedSubCategory, setSelectedSubCategory] = useState('全部')
  const [expandedCategories, setExpandedCategories] = useState(['开发'])

  const toggleCategory = (category) => {
    setExpandedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    )
  }

  const filteredLinks = links.filter(link => {
    const matchesSearch = link.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         link.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesMainCategory = selectedMainCategory === '全部' || link.mainCategory === selectedMainCategory
    const matchesSubCategory = selectedSubCategory === '全部' || link.subCategory === selectedSubCategory
    return matchesSearch && matchesMainCategory && matchesSubCategory
  })

  const toggleStar = (id) => {
    setLinks(links.map(link => 
      link.id === id ? { ...link, starred: !link.starred } : link
    ))
  }

  return (
    <div className="app-container">
      <aside className="sidebar">
        <div className="sidebar-header">
          <h2>我的收藏夹</h2>
        </div>
        <div className="search-bar">
          <FontAwesomeIcon icon={faSearch} />
          <input
            type="text"
            placeholder="搜索..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <nav className="category-nav">
          {Object.entries(categories).map(([category, { icon, subCategories }]) => (
            <div key={category} className="category-group">
              <div 
                className="main-category"
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
                    className={`sub-category ${selectedSubCategory === '全部' ? 'active' : ''}`}
                    onClick={() => {
                      setSelectedMainCategory(category)
                      setSelectedSubCategory('全部')
                    }}
                  >
                    全部
                  </button>
                  {subCategories.map(subCategory => (
                    <button
                      key={subCategory}
                      className={`sub-category ${selectedSubCategory === subCategory ? 'active' : ''}`}
                      onClick={() => {
                        setSelectedMainCategory(category)
                        setSelectedSubCategory(subCategory)
                      }}
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

        <div className="links-grid">
          {filteredLinks.map(link => (
            <div key={link.id} className="link-card">
              <div className="link-header">
                <div className="link-title">
                  <FontAwesomeIcon icon={link.icon} className="link-icon" />
                  <h3>{link.title}</h3>
                </div>
                <button 
                  className={`star-btn ${link.starred ? 'starred' : ''}`}
                  onClick={() => toggleStar(link.id)}
                >
                  <FontAwesomeIcon icon={faStar} />
                </button>
              </div>
              <div className="link-tags">
                <span className="category-tag">{link.mainCategory}</span>
                <span className="category-tag">{link.subCategory}</span>
              </div>
              <p className="description">{link.description}</p>
              <a href={link.url} target="_blank" rel="noopener noreferrer">
                访问网站
              </a>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}

export default App
