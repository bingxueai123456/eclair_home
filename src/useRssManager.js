import { useCallback, useEffect, useMemo, useState } from 'react'
import { XMLParser } from 'fast-xml-parser'
import { useAuth } from './hooks/useAuth.jsx'
import { useRssSources } from './hooks/useDatabase.jsx'

const getProxyUrl = (url) => `https://corsproxy.io/?${encodeURIComponent(url)}`
const CACHE_TTL_MS = 30 * 60 * 1000

function getCacheKeys(userId) {
  const key = userId || 'anon'
  return {
    data: `rss-feeds-cache:${key}`,
    timestamp: `rss-feeds-timestamp:${key}`,
    signature: `rss-feeds-sources-sig:${key}`
  }
}

function buildSignature(sources) {
  return (sources || [])
    .map(s => `${s.id}:${s.url}:${String(s.is_active ?? true)}`)
    .join('|')
}

export default function useRssManager() {
  const { user, isAuthenticated } = useAuth()
  const { rssSources, loading: sourcesLoading, error: sourcesError } = useRssSources()

  const [rssFeeds, setRssFeeds] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [lastFetch, setLastFetch] = useState(null)

  const activeSources = useMemo(() => {
    const list = rssSources || []
    // 兼容未来的 is_active 字段：缺失则默认启用
    return list.filter(s => (s.is_active ?? true) === true)
  }, [rssSources])

  // 当 RSS 源变化时，初始化 feed 列表（保留已有 items 避免闪烁）
  useEffect(() => {
    if (!isAuthenticated) {
      setRssFeeds([])
      return
    }

    const initialFeeds = activeSources.map(source => {
      const prev = rssFeeds.find(f => f.id === source.id)
      return {
        id: source.id,
        name: source.name,
        url: source.url,
        description: source.description || '',
        items: prev?.items || [],
        lastUpdate: prev?.lastUpdate || null,
        error: prev?.error || null
      }
    })
    setRssFeeds(initialFeeds)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, activeSources])

  // 当源变化时，分用户缓存失效
  useEffect(() => {
    if (!isAuthenticated) return
    const keys = getCacheKeys(user?.id)
    const sig = buildSignature(activeSources)
    try {
      const prevSig = localStorage.getItem(keys.signature)
      if (prevSig !== sig) {
        localStorage.removeItem(keys.data)
        localStorage.removeItem(keys.timestamp)
        localStorage.setItem(keys.signature, sig)
      }
    } catch {
      // ignore
    }
  }, [isAuthenticated, user?.id, activeSources])

  // 获取单个 RSS 内容
  const fetchSingleRss = useCallback(async (feed) => {
    const parser = new XMLParser({ ignoreAttributes: false })
    try {
      const res = await fetch(getProxyUrl(feed.url))
      if (!res.ok) throw new Error(`网络错误: ${res.status}`)

      const xml = await res.text()
      const parsed = parser.parse(xml)

      let items = []
      let feedTitle = feed.name

      // 处理不同 RSS 格式
      if (parsed.rss && parsed.rss.channel) {
        // RSS 2.0
        const channel = parsed.rss.channel
        feedTitle = channel.title || feed.name
        items = channel.item || []
        if (!Array.isArray(items)) items = [items]

        items = items.slice(0, 10).map(item => ({
          title: item.title || '无标题',
          link: item.link || '',
          description: item.description || '',
          pubDate: item.pubDate || '',
          guid: item.guid || item.link || ''
        }))
      } else if (parsed.feed) {
        // Atom
        feedTitle = parsed.feed.title || feed.name
        items = parsed.feed.entry || []
        if (!Array.isArray(items)) items = [items]

        items = items.slice(0, 10).map(item => ({
          title: item.title || '无标题',
          link: item.link ? (item.link['@_href'] || item.link) : '',
          description: item.summary || item.content || '',
          pubDate: item.published || item.updated || '',
          guid: item.id || item.link || ''
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
        error: e?.message || String(e),
        lastUpdate: new Date().toLocaleString()
      }
    }
  }, [])

  const getCachedData = useCallback(() => {
    try {
      const keys = getCacheKeys(user?.id)
      const cached = localStorage.getItem(keys.data)
      const timestamp = localStorage.getItem(keys.timestamp)
      if (cached && timestamp) {
        const cacheAge = Date.now() - parseInt(timestamp, 10)
        if (cacheAge < CACHE_TTL_MS) {
          return JSON.parse(cached)
        }
      }
    } catch {
      // ignore
    }
    return null
  }, [user?.id])

  const setCachedData = useCallback((data) => {
    try {
      const keys = getCacheKeys(user?.id)
      localStorage.setItem(keys.data, JSON.stringify(data))
      localStorage.setItem(keys.timestamp, Date.now().toString())
    } catch {
      // ignore
    }
  }, [user?.id])

  const refreshAllFeeds = useCallback(async (forceRefresh = false) => {
    if (!isAuthenticated) return
    if (rssFeeds.length === 0) return

    setLoading(true)
    setError(null)

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
      const results = await Promise.all(rssFeeds.map(feed => fetchSingleRss(feed)))
      setRssFeeds(results)
      setCachedData(results)
      setLastFetch(new Date().toLocaleTimeString())
    } catch (e) {
      setError(e?.message || String(e))
    } finally {
      setLoading(false)
    }
  }, [fetchSingleRss, getCachedData, isAuthenticated, rssFeeds, setCachedData])

  const refreshSingleFeed = useCallback(async (id) => {
    const feed = rssFeeds.find(f => f.id === id)
    if (!feed) return

    const updatedFeed = await fetchSingleRss(feed)
    const updatedFeeds = rssFeeds.map(f => (f.id === id ? updatedFeed : f))
    setRssFeeds(updatedFeeds)
    setCachedData(updatedFeeds)
  }, [fetchSingleRss, rssFeeds, setCachedData])

  // 自动加载：当有源且未加载过 items 时刷新
  useEffect(() => {
    if (!isAuthenticated) return
    if (sourcesLoading) return
    if (rssFeeds.length > 0 && rssFeeds.every(feed => (feed.items || []).length === 0)) {
      refreshAllFeeds(false)
    }
  }, [isAuthenticated, sourcesLoading, rssFeeds, refreshAllFeeds])

  return {
    rssFeeds,
    loading: sourcesLoading || loading,
    error: sourcesError || error,
    lastFetch,
    refreshAllFeeds,
    refreshSingleFeed
  }
}