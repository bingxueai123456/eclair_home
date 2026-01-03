import { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faTimes, faPlus, faEdit, faTrash, faSave, faFolder,
  faGlobe, faRss, faFileAlt, faSearch,
  faChevronDown, faChevronRight, faStar, faLink
} from '@fortawesome/free-solid-svg-icons'
import { faYoutube } from '@fortawesome/free-brands-svg-icons'
import { useCategories, useWebsites, useRssSources, useYoutubeChannels, useHtmlPages } from '../hooks/useDatabase.jsx'
import './AdminPanel.css'

// 管理面板主组件
export default function AdminPanel({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('websites')
  
  if (!isOpen) return null

  return (
    <div className="admin-overlay" onClick={onClose}>
      <div className="admin-panel" onClick={e => e.stopPropagation()}>
        <div className="admin-header">
          <h2>管理后台</h2>
          <button className="close-btn" onClick={onClose}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        <div className="admin-tabs">
          <button 
            className={`tab-btn ${activeTab === 'websites' ? 'active' : ''}`}
            onClick={() => setActiveTab('websites')}
          >
            <FontAwesomeIcon icon={faGlobe} />
            网站管理
          </button>
          <button 
            className={`tab-btn ${activeTab === 'categories' ? 'active' : ''}`}
            onClick={() => setActiveTab('categories')}
          >
            <FontAwesomeIcon icon={faFolder} />
            分类管理
          </button>
          <button 
            className={`tab-btn ${activeTab === 'html' ? 'active' : ''}`}
            onClick={() => setActiveTab('html')}
          >
            <FontAwesomeIcon icon={faFileAlt} />
            HTML文章
          </button>
          <button 
            className={`tab-btn ${activeTab === 'rss' ? 'active' : ''}`}
            onClick={() => setActiveTab('rss')}
          >
            <FontAwesomeIcon icon={faRss} />
            RSS源
          </button>
          <button 
            className={`tab-btn ${activeTab === 'youtube' ? 'active' : ''}`}
            onClick={() => setActiveTab('youtube')}
          >
            <FontAwesomeIcon icon={faYoutube} />
            YouTube
          </button>
        </div>

        <div className="admin-content">
          {activeTab === 'websites' && <WebsiteManager />}
          {activeTab === 'categories' && <CategoryManager />}
          {activeTab === 'html' && <HtmlManager />}
          {activeTab === 'rss' && <RssManager />}
          {activeTab === 'youtube' && <YoutubeManager />}
        </div>
      </div>
    </div>
  )
}

// 分类管理组件
function CategoryManager() {
  const { categories, loading, fetchCategories, addCategory, updateCategory, deleteCategory } = useCategories()
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    sub_categories: '',  // 逗号分隔的字符串
    icon: '',
    sort_order: 0
  })
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchCategories()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    const submitData = {
      name: formData.name,
      sub_categories: formData.sub_categories.split(',').map(s => s.trim()).filter(s => s),
      icon: formData.icon || 'faFolder',
      sort_order: parseInt(formData.sort_order) || 0
    }
    if (editingId) {
      await updateCategory(editingId, submitData)
    } else {
      await addCategory(submitData)
    }
    resetForm()
    fetchCategories()
  }

  const handleEdit = (cat) => {
    setFormData({
      name: cat.name,
      sub_categories: (cat.sub_categories || []).join(', '),
      icon: cat.icon || '',
      sort_order: cat.sort_order || 0
    })
    setEditingId(cat.id)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('确定要删除这个分类吗？')) {
      await deleteCategory(id)
      fetchCategories()
    }
  }

  const resetForm = () => {
    setFormData({ name: '', sub_categories: '', icon: '', sort_order: 0 })
    setEditingId(null)
    setShowForm(false)
  }

  const filteredCategories = categories.filter(cat =>
    cat.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (cat.sub_categories || []).some(sub => sub.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  return (
    <div className="manager-section">
      <div className="manager-header">
        <h3>分类管理</h3>
        <button className="add-btn" onClick={() => setShowForm(true)}>
          <FontAwesomeIcon icon={faPlus} /> 添加分类
        </button>
      </div>

      <div className="search-box">
        <FontAwesomeIcon icon={faSearch} />
        <input
          type="text"
          placeholder="搜索分类..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>

      {showForm && (
        <form className="edit-form" onSubmit={handleSubmit}>
          <h4>{editingId ? '编辑分类' : '添加分类'}</h4>
          <div className="form-row">
            <div className="form-group">
              <label>主分类名称 *</label>
              <input
                type="text"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                placeholder="例如：研发、新闻/周刊"
                required
              />
            </div>
            <div className="form-group">
              <label>排序</label>
              <input
                type="number"
                value={formData.sort_order}
                onChange={e => setFormData({...formData, sort_order: e.target.value})}
                placeholder="0"
              />
            </div>
          </div>
          <div className="form-group full-width">
            <label>子分类（逗号分隔）*</label>
            <input
              type="text"
              value={formData.sub_categories}
              onChange={e => setFormData({...formData, sub_categories: e.target.value})}
              placeholder="开发工具, AI, UI, 前端"
              required
            />
          </div>
          <div className="form-group full-width">
            <label>图标（FontAwesome 名称）</label>
            <input
              type="text"
              value={formData.icon}
              onChange={e => setFormData({...formData, icon: e.target.value})}
              placeholder="faGears, faGithub, faNewspaper..."
            />
          </div>
          <div className="form-actions">
            <button type="submit" className="save-btn">
              <FontAwesomeIcon icon={faSave} /> {editingId ? '更新' : '保存'}
            </button>
            <button type="button" className="cancel-btn" onClick={resetForm}>
              取消
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="loading">加载中...</div>
      ) : (
        <div className="category-list">
          {filteredCategories.map(cat => (
            <div key={cat.id} className="category-group">
              <div className="main-cat-header">
                <FontAwesomeIcon icon={faFolder} />
                <span>{cat.name}</span>
                <span className="count">{(cat.sub_categories || []).length} 个子分类</span>
                <div className="item-actions">
                  <button onClick={() => handleEdit(cat)} title="编辑">
                    <FontAwesomeIcon icon={faEdit} />
                  </button>
                  <button onClick={() => handleDelete(cat.id)} title="删除" className="delete">
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </div>
              </div>
              <div className="sub-cats">
                {(cat.sub_categories || []).map((sub, idx) => (
                  <div key={idx} className="sub-cat-item">
                    <span className="sub-name">{sub}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
          {filteredCategories.length === 0 && (
            <div className="empty-state">暂无分类数据</div>
          )}
        </div>
      )}
    </div>
  )
}

// 网站管理组件
function WebsiteManager() {
  const { websites, loading, fetchWebsites, addWebsite, updateWebsite, deleteWebsite } = useWebsites()
  const { categories, fetchCategories } = useCategories()
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    url: '',
    main_category: '',
    sub_category: '',
    description: '',
    icon: '',
    rating: 5
  })
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchWebsites()
    fetchCategories()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (editingId) {
      await updateWebsite(editingId, formData)
    } else {
      await addWebsite(formData)
    }
    resetForm()
    fetchWebsites()
  }

  const handleEdit = (site) => {
    setFormData({
      title: site.title,
      url: site.url,
      main_category: site.main_category,
      sub_category: site.sub_category,
      description: site.description || '',
      icon: site.icon || '',
      rating: site.rating || 5
    })
    setEditingId(site.id)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('确定要删除这个网站吗？')) {
      await deleteWebsite(id)
      fetchWebsites()
    }
  }

  const resetForm = () => {
    setFormData({ title: '', url: '', main_category: '', sub_category: '', description: '', icon: '', rating: 5 })
    setEditingId(null)
    setShowForm(false)
  }

  const filteredWebsites = websites.filter(site =>
    site.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    site.url?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    site.main_category?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // 从数据库分类获取主分类列表
  const mainCategories = categories.map(c => c.name)
  // 获取当前主分类下的子分类
  const currentCategory = categories.find(c => c.name === formData.main_category)
  const subCategories = currentCategory?.sub_categories || []

  return (
    <div className="manager-section">
      <div className="manager-header">
        <h3>网站管理 <span className="count-badge">{websites.length}</span></h3>
        <button className="add-btn" onClick={() => setShowForm(true)}>
          <FontAwesomeIcon icon={faPlus} /> 添加网站
        </button>
      </div>

      <div className="search-box">
        <FontAwesomeIcon icon={faSearch} />
        <input
          type="text"
          placeholder="搜索网站名称、URL..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>

      {showForm && (
        <form className="edit-form" onSubmit={handleSubmit}>
          <h4>{editingId ? '编辑网站' : '添加网站'}</h4>
          <div className="form-row">
            <div className="form-group">
              <label>网站名称 *</label>
              <input
                type="text"
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
                placeholder="网站名称"
                required
              />
            </div>
            <div className="form-group">
              <label>URL *</label>
              <input
                type="url"
                value={formData.url}
                onChange={e => setFormData({...formData, url: e.target.value})}
                placeholder="https://example.com"
                required
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>主分类 *</label>
              <select
                value={formData.main_category}
                onChange={e => setFormData({...formData, main_category: e.target.value, sub_category: ''})}
                required
              >
                <option value="">选择主分类</option>
                {mainCategories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>子分类 *</label>
              <select
                value={formData.sub_category}
                onChange={e => setFormData({...formData, sub_category: e.target.value})}
                required
                disabled={!formData.main_category}
              >
                <option value="">选择子分类</option>
                {subCategories.map((sub, idx) => (
                  <option key={idx} value={sub}>{sub}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="form-group full-width">
            <label>描述</label>
            <textarea
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
              placeholder="网站描述..."
              rows={3}
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>图标</label>
              <input
                type="text"
                value={formData.icon}
                onChange={e => setFormData({...formData, icon: e.target.value})}
                placeholder="图标名称或URL"
              />
            </div>
            <div className="form-group">
              <label>评分 (1-7)</label>
              <div className="rating-input">
                {[1,2,3,4,5,6,7].map(n => (
                  <button
                    key={n}
                    type="button"
                    className={`star-btn ${formData.rating >= n ? 'active' : ''}`}
                    onClick={() => setFormData({...formData, rating: n})}
                  >
                    <FontAwesomeIcon icon={faStar} />
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="form-actions">
            <button type="submit" className="save-btn">
              <FontAwesomeIcon icon={faSave} /> {editingId ? '更新' : '保存'}
            </button>
            <button type="button" className="cancel-btn" onClick={resetForm}>
              取消
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="loading">加载中...</div>
      ) : (
        <div className="website-list">
          {filteredWebsites.map(site => (
            <div key={site.id} className="website-item">
              <div className="website-info">
                <h4>
                  <FontAwesomeIcon icon={faLink} />
                  {site.title}
                </h4>
                <a href={site.url} target="_blank" rel="noopener noreferrer" className="website-url">
                  {site.url}
                </a>
                <div className="website-meta">
                  <span className="category-tag">{site.main_category}</span>
                  <span className="sub-tag">{site.sub_category}</span>
                  <span className="rating">
                    {Array(site.rating || 5).fill(null).map((_, i) => (
                      <FontAwesomeIcon key={i} icon={faStar} />
                    ))}
                  </span>
                </div>
                {site.description && <p className="website-desc">{site.description}</p>}
              </div>
              <div className="item-actions">
                <button onClick={() => handleEdit(site)} title="编辑">
                  <FontAwesomeIcon icon={faEdit} />
                </button>
                <button onClick={() => handleDelete(site.id)} title="删除" className="delete">
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </div>
            </div>
          ))}
          {filteredWebsites.length === 0 && (
            <div className="empty-state">暂无网站数据</div>
          )}
        </div>
      )}
    </div>
  )
}

// HTML文章管理组件
function HtmlManager() {
  const { htmlPages, loading, fetchHtmlPages, addHtmlPage, updateHtmlPage, deleteHtmlPage, uploadHtmlFile } = useHtmlPages()
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    tags: ''
  })
  const [htmlContent, setHtmlContent] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchHtmlPages()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const pageData = {
      ...formData,
      tags: formData.tags.split(',').map(t => t.trim()).filter(t => t)
    }

    if (editingId) {
      // 更新文章
      if (htmlContent) {
        await uploadHtmlFile(editingId, htmlContent)
      }
      await updateHtmlPage(editingId, pageData)
    } else {
      // 新建文章
      const result = await addHtmlPage(pageData)
      if (result.data && htmlContent) {
        await uploadHtmlFile(result.data.id, htmlContent)
      }
    }
    
    resetForm()
    fetchHtmlPages()
  }

  const handleEdit = (page) => {
    setFormData({
      title: page.title,
      category: page.category || '',
      description: page.description || '',
      tags: (page.tags || []).join(', ')
    })
    setEditingId(page.id)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('确定要删除这篇文章吗？')) {
      await deleteHtmlPage(id)
      fetchHtmlPages()
    }
  }

  const resetForm = () => {
    setFormData({ title: '', category: '', description: '', tags: '' })
    setHtmlContent('')
    setEditingId(null)
    setShowForm(false)
  }

  const filteredPages = htmlPages.filter(page =>
    page.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    page.category?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="manager-section">
      <div className="manager-header">
        <h3>HTML文章管理 <span className="count-badge">{htmlPages.length}</span></h3>
        <button className="add-btn" onClick={() => setShowForm(true)}>
          <FontAwesomeIcon icon={faPlus} /> 添加文章
        </button>
      </div>

      <div className="search-box">
        <FontAwesomeIcon icon={faSearch} />
        <input
          type="text"
          placeholder="搜索文章..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>

      {showForm && (
        <form className="edit-form" onSubmit={handleSubmit}>
          <h4>{editingId ? '编辑文章' : '添加文章'}</h4>
          <div className="form-row">
            <div className="form-group">
              <label>标题 *</label>
              <input
                type="text"
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
                placeholder="文章标题"
                required
              />
            </div>
            <div className="form-group">
              <label>分类</label>
              <input
                type="text"
                value={formData.category}
                onChange={e => setFormData({...formData, category: e.target.value})}
                placeholder="例如：经济分析、技术"
              />
            </div>
          </div>
          <div className="form-group full-width">
            <label>描述</label>
            <textarea
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
              placeholder="文章简介..."
              rows={2}
            />
          </div>
          <div className="form-group full-width">
            <label>标签（逗号分隔）</label>
            <input
              type="text"
              value={formData.tags}
              onChange={e => setFormData({...formData, tags: e.target.value})}
              placeholder="标签1, 标签2, 标签3"
            />
          </div>
          <div className="form-group full-width">
            <label>HTML内容 {!editingId && '*'}</label>
            <textarea
              value={htmlContent}
              onChange={e => setHtmlContent(e.target.value)}
              placeholder="粘贴完整的 HTML 代码..."
              rows={10}
              className="code-input"
              required={!editingId}
            />
          </div>
          <div className="form-actions">
            <button type="submit" className="save-btn">
              <FontAwesomeIcon icon={faSave} /> {editingId ? '更新' : '保存'}
            </button>
            <button type="button" className="cancel-btn" onClick={resetForm}>
              取消
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="loading">加载中...</div>
      ) : (
        <div className="html-list">
          {filteredPages.map(page => (
            <div key={page.id} className="html-item">
              <div className="html-info">
                <h4>
                  <FontAwesomeIcon icon={faFileAlt} />
                  {page.title}
                </h4>
                <div className="html-meta">
                  {page.category && <span className="category-tag">{page.category}</span>}
                  {page.tags?.map(tag => (
                    <span key={tag} className="tag">{tag}</span>
                  ))}
                </div>
                {page.description && <p className="html-desc">{page.description}</p>}
              </div>
              <div className="item-actions">
                <button onClick={() => handleEdit(page)} title="编辑">
                  <FontAwesomeIcon icon={faEdit} />
                </button>
                <button onClick={() => handleDelete(page.id)} title="删除" className="delete">
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </div>
            </div>
          ))}
          {filteredPages.length === 0 && (
            <div className="empty-state">暂无文章数据</div>
          )}
        </div>
      )}
    </div>
  )
}

// RSS源管理组件
function RssManager() {
  const { rssSources, loading, fetchRssSources, addRssSource, updateRssSource, deleteRssSource } = useRssSources()
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    url: '',
    description: ''
  })

  useEffect(() => {
    fetchRssSources()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (editingId) {
      await updateRssSource(editingId, formData)
    } else {
      await addRssSource(formData)
    }
    resetForm()
    fetchRssSources()
  }

  const handleEdit = (source) => {
    setFormData({
      name: source.name,
      url: source.url,
      description: source.description || ''
    })
    setEditingId(source.id)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('确定要删除这个RSS源吗？')) {
      await deleteRssSource(id)
      fetchRssSources()
    }
  }

  const resetForm = () => {
    setFormData({ name: '', url: '', description: '' })
    setEditingId(null)
    setShowForm(false)
  }

  return (
    <div className="manager-section">
      <div className="manager-header">
        <h3>RSS源管理 <span className="count-badge">{rssSources.length}</span></h3>
        <button className="add-btn" onClick={() => setShowForm(true)}>
          <FontAwesomeIcon icon={faPlus} /> 添加RSS源
        </button>
      </div>

      {showForm && (
        <form className="edit-form" onSubmit={handleSubmit}>
          <h4>{editingId ? '编辑RSS源' : '添加RSS源'}</h4>
          <div className="form-row">
            <div className="form-group">
              <label>名称 *</label>
              <input
                type="text"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                placeholder="RSS源名称"
                required
              />
            </div>
            <div className="form-group">
              <label>Feed URL *</label>
              <input
                type="url"
                value={formData.url}
                onChange={e => setFormData({...formData, url: e.target.value})}
                placeholder="https://example.com/feed.xml"
                required
              />
            </div>
          </div>
          <div className="form-group full-width">
            <label>描述</label>
            <textarea
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
              placeholder="RSS源描述..."
              rows={2}
            />
          </div>
          <div className="form-actions">
            <button type="submit" className="save-btn">
              <FontAwesomeIcon icon={faSave} /> {editingId ? '更新' : '保存'}
            </button>
            <button type="button" className="cancel-btn" onClick={resetForm}>
              取消
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="loading">加载中...</div>
      ) : (
        <div className="rss-list">
          {rssSources.map(source => (
            <div key={source.id} className="rss-item">
              <div className="rss-info">
                <h4>
                  <FontAwesomeIcon icon={faRss} />
                  {source.name}
                </h4>
                <a href={source.url} target="_blank" rel="noopener noreferrer" className="rss-url">
                  {source.url}
                </a>
                {source.description && <p className="rss-desc">{source.description}</p>}
              </div>
              <div className="item-actions">
                <button onClick={() => handleEdit(source)} title="编辑">
                  <FontAwesomeIcon icon={faEdit} />
                </button>
                <button onClick={() => handleDelete(source.id)} title="删除" className="delete">
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </div>
            </div>
          ))}
          {rssSources.length === 0 && (
            <div className="empty-state">暂无RSS源数据</div>
          )}
        </div>
      )}
    </div>
  )
}

// YouTube频道管理组件
function YoutubeManager() {
  const { youtubeChannels, loading, fetchYoutubeChannels, addYoutubeChannel, updateYoutubeChannel, deleteYoutubeChannel } = useYoutubeChannels()
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    channel_id: '',
    description: ''
  })

  useEffect(() => {
    fetchYoutubeChannels()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (editingId) {
      await updateYoutubeChannel(editingId, formData)
    } else {
      await addYoutubeChannel(formData)
    }
    resetForm()
    fetchYoutubeChannels()
  }

  const handleEdit = (channel) => {
    setFormData({
      name: channel.name,
      channel_id: channel.channel_id,
      description: channel.description || ''
    })
    setEditingId(channel.id)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('确定要删除这个YouTube频道吗？')) {
      await deleteYoutubeChannel(id)
      fetchYoutubeChannels()
    }
  }

  const resetForm = () => {
    setFormData({ name: '', channel_id: '', description: '' })
    setEditingId(null)
    setShowForm(false)
  }

  return (
    <div className="manager-section">
      <div className="manager-header">
        <h3>YouTube频道管理 <span className="count-badge">{youtubeChannels.length}</span></h3>
        <button className="add-btn" onClick={() => setShowForm(true)}>
          <FontAwesomeIcon icon={faPlus} /> 添加频道
        </button>
      </div>

      {showForm && (
        <form className="edit-form" onSubmit={handleSubmit}>
          <h4>{editingId ? '编辑频道' : '添加频道'}</h4>
          <div className="form-row">
            <div className="form-group">
              <label>频道名称 *</label>
              <input
                type="text"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                placeholder="频道名称"
                required
              />
            </div>
            <div className="form-group">
              <label>频道ID *</label>
              <input
                type="text"
                value={formData.channel_id}
                onChange={e => setFormData({...formData, channel_id: e.target.value})}
                placeholder="UC..."
                required
              />
            </div>
          </div>
          <div className="form-group full-width">
            <label>描述</label>
            <textarea
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
              placeholder="频道描述..."
              rows={2}
            />
          </div>
          <div className="form-actions">
            <button type="submit" className="save-btn">
              <FontAwesomeIcon icon={faSave} /> {editingId ? '更新' : '保存'}
            </button>
            <button type="button" className="cancel-btn" onClick={resetForm}>
              取消
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="loading">加载中...</div>
      ) : (
        <div className="youtube-list">
          {youtubeChannels.map(channel => (
            <div key={channel.id} className="youtube-item">
              <div className="youtube-info">
                <h4>
                  <FontAwesomeIcon icon={faYoutube} />
                  {channel.name}
                </h4>
                <span className="channel-id">{channel.channel_id}</span>
                {channel.description && <p className="youtube-desc">{channel.description}</p>}
              </div>
              <div className="item-actions">
                <button onClick={() => handleEdit(channel)} title="编辑">
                  <FontAwesomeIcon icon={faEdit} />
                </button>
                <button onClick={() => handleDelete(channel.id)} title="删除" className="delete">
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </div>
            </div>
          ))}
          {youtubeChannels.length === 0 && (
            <div className="empty-state">暂无YouTube频道数据</div>
          )}
        </div>
      )}
    </div>
  )
}
