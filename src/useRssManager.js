import { useState, useEffect } from 'react'
import { XMLParser } from 'fast-xml-parser'

// 预设的RSS源列表 - 你可以在这里添加更多RSS源
const RSS_SOURCES = [
  {
    id: 'pbc-news',
    name: '中国人民银行新闻',
    url: 'http://www.pbc.gov.cn/goutongjiaoliu/113456/2986536/index.html',
    description: '中国人民银行官方新闻RSS'
  },

  {
    id: 'ruanyf-weekly',
    name: '科技爱好者周刊',
    url: 'https://feeds.feedburner.com/ruanyifeng',
    description: '阮一峰的科技爱好者周刊'
  },
  
  // 要添加新的RSS源，在这里按照相同格式添加即可：
  // {
  //   id: 'unique-id',
  //   name: '显示名称',
  //   url: 'RSS链接',
  //   description: '描述信息'
  // }
]

const getProxyUrl = (url) => `https://corsproxy.io/?${encodeURIComponent(url)}`

export default function useRssManager() {
  const [rssFeeds, setRssFeeds] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [lastFetch, setLastFetch] = useState(null)

  // 初始化RSS源
  useEffect(() => {
    const initialFeeds = RSS_SOURCES.map(source => ({
      ...source,
      items: [],
      lastUpdate: null,
      error: null
    }))
    setRssFeeds(initialFeeds)
  }, [])

  // 自动加载RSS内容
  useEffect(() => {
    if (rssFeeds.length > 0 && rssFeeds.every(feed => feed.items.length === 0)) {
      refreshAllFeeds()
    }
  }, [rssFeeds.length])

  // 获取单个RSS内容
  const fetchSingleRss = async (feed) => {
    const parser = new XMLParser({ ignoreAttributes: false })
    
    try {
      const res = await fetch(getProxyUrl(feed.url))
      if (!res.ok) throw new Error(`网络错误: ${res.status}`)
      
      const xml = await res.text()
      const parsed = parser.parse(xml)
      
      let items = []
      let feedTitle = feed.name
      
      // 处理不同RSS格式
      if (parsed.rss && parsed.rss.channel) {
        // RSS 2.0 格式
        const channel = parsed.rss.channel
        feedTitle = channel.title || feed.name
        items = channel.item || []
        if (!Array.isArray(items)) items = [items]
        
        items = items.slice(0, 10).map(item => ({
          title: item.title || '无标题',
          link: item.link || '',
          description: item.description || '',
          pubDate: item.pubDate || '',
          guid: item.guid || item.link || '',
        }))
      } else if (parsed.feed) {
        // Atom 格式
        feedTitle = parsed.feed.title || feed.name
        items = parsed.feed.entry || []
        if (!Array.isArray(items)) items = [items]
        
        items = items.slice(0, 10).map(item => ({
          title: item.title || '无标题',
          link: item.link ? (item.link['@_href'] || item.link) : '',
          description: item.summary || item.content || '',
          pubDate: item.published || item.updated || '',
          guid: item.id || item.link || '',
        }))
      }
      
      return {
        ...feed,
        name: feedTitle,
        items,
        lastUpdate: new Date().toLocaleString(),
        error: null
      }
    } catch (e) {
      return {
        ...feed,
        items: [],
        error: e.message,
        lastUpdate: new Date().toLocaleString()
      }
    }
  }

  // 获取缓存数据
  const getCachedData = () => {
    try {
      const cached = localStorage.getItem('rss-feeds-cache')
      const timestamp = localStorage.getItem('rss-feeds-timestamp')
      if (cached && timestamp) {
        const cacheAge = Date.now() - parseInt(timestamp)
        // 缓存30分钟
        if (cacheAge < 30 * 60 * 1000) {
          return JSON.parse(cached)
        }
      }
    } catch (e) {
      console.warn('缓存读取失败:', e)
    }
    return null
  }

  // 保存缓存数据
  const setCachedData = (data) => {
    try {
      localStorage.setItem('rss-feeds-cache', JSON.stringify(data))
      localStorage.setItem('rss-feeds-timestamp', Date.now().toString())
    } catch (e) {
      console.warn('缓存保存失败:', e)
    }
  }

  // 刷新所有RSS
  const refreshAllFeeds = async (forceRefresh = false) => {
    if (rssFeeds.length === 0) return
    
    setLoading(true)
    setError(null)
    
    // 如果不是强制刷新，先尝试使用缓存
    if (!forceRefresh) {
      const cachedFeeds = getCachedData()
      if (cachedFeeds && cachedFeeds.length === rssFeeds.length) {
        setRssFeeds(cachedFeeds)
        setLoading(false)
        setLastFetch(new Date().toLocaleTimeString())
        return
      }
    }
    
    try {
      const results = await Promise.all(
        rssFeeds.map(feed => fetchSingleRss(feed))
      )
      
      setRssFeeds(results)
      setCachedData(results)
      setLastFetch(new Date().toLocaleTimeString())
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  // 刷新单个RSS
  const refreshSingleFeed = async (id) => {
    const feed = rssFeeds.find(f => f.id === id)
    if (!feed) return
    
    const updatedFeed = await fetchSingleRss(feed)
    const updatedFeeds = rssFeeds.map(f => f.id === id ? updatedFeed : f)
    
    setRssFeeds(updatedFeeds)
    setCachedData(updatedFeeds)
  }

  return {
    rssFeeds,
    loading,
    error,
    lastFetch,
    refreshAllFeeds,
    refreshSingleFeed
  }
} 