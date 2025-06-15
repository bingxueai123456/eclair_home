import { useState, useEffect } from 'react'
import { XMLParser } from 'fast-xml-parser'

const YOUTUBE_CHANNELS = [
  'UCXZCJLdBC09xxGZ6gcdrc6A',
  'UClkRzsdvg7_RKVhwDwiDZOA',
  'UCMHZVDxjTUi6u-1ZiqUNZ_A',
  'UCrDwWp7EBBv4NwvScIpBDOA',
  'UCK8sQmJBp8GCxrOtXWBpyEA',
  'UC2ggjtuuWvxrHHHiaDH1dlQ',
  'UCPpdGTNbIKdiWgxCrbka4Zw',
  'UCrB7UFnkosBjAhOg3a9NdWw',
]

const getRssUrl = (channelId) => `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`
const getProxyUrl = (url) => `https://corsproxy.io/?${encodeURIComponent(url)}`

export default function useYoutubeRssFeed() {
  const [feeds, setFeeds] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    const parser = new XMLParser({ ignoreAttributes: false })

    Promise.all(
      YOUTUBE_CHANNELS.map(async (channelId) => {
        try {
          const res = await fetch(getProxyUrl(getRssUrl(channelId)))
          if (!res.ok) throw new Error('网络错误')
          const xml = await res.text()
          const feed = parser.parse(xml)
          const channelTitle = feed.feed?.title || channelId
          let entries = feed.feed?.entry
          if (!entries) entries = []
          if (!Array.isArray(entries)) entries = [entries]
          return {
            channelId,
            channelTitle,
            items: entries.slice(0, 5).map(item => {
              // 解析视频ID
              let videoId = ''
              if (item['yt:videoId']) videoId = item['yt:videoId']
              else if (item['yt\:videoId']) videoId = item['yt\:videoId']
              // 解析封面
              let thumb = ''
              if (item['media:group'] && item['media:group']['media:thumbnail'] && item['media:group']['media:thumbnail']['@_url']) {
                thumb = item['media:group']['media:thumbnail']['@_url']
              } else if (videoId) {
                thumb = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`
              }
              // 解析链接
              let link = ''
              if (item.link && item.link['@_href']) link = item.link['@_href']
              else if (videoId) link = `https://www.youtube.com/watch?v=${videoId}`
              return {
                title: item.title || '',
                link,
                pubDate: item.published || '',
                thumbnail: thumb,
                channelTitle,
              }
            })
          }
        } catch (e) {
          return {
            channelId,
            channelTitle: channelId,
            items: [],
            error: e.message
          }
        }
      })
    ).then(results => {
      if (!cancelled) {
        setFeeds(results)
        setLoading(false)
      }
    }).catch(e => {
      if (!cancelled) {
        setError(e.message)
        setLoading(false)
      }
    })
    return () => { cancelled = true }
  }, [])

  return { feeds, loading, error }
} 