import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from './useAuth.jsx'

// ========== Categories Hook ==========
export function useCategories() {
  const { user } = useAuth()
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchCategories = useCallback(async () => {
    if (!user) return
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('sort_order', { ascending: true })
      
      if (error) throw error
      setCategories(data || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    fetchCategories()
  }, [fetchCategories])

  const addCategory = async (category) => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .insert([{ ...category, user_id: user.id }])
        .select()
      
      if (error) throw error
      setCategories(prev => [...prev, data[0]])
      return { data: data[0], error: null }
    } catch (err) {
      return { data: null, error: err }
    }
  }

  const updateCategory = async (id, updates) => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .update(updates)
        .eq('id', id)
        .select()
      
      if (error) throw error
      setCategories(prev => prev.map(c => c.id === id ? data[0] : c))
      return { data: data[0], error: null }
    } catch (err) {
      return { data: null, error: err }
    }
  }

  const deleteCategory = async (id) => {
    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id)
      
      if (error) throw error
      setCategories(prev => prev.filter(c => c.id !== id))
      return { error: null }
    } catch (err) {
      return { error: err }
    }
  }

  return { categories, loading, error, fetchCategories, addCategory, updateCategory, deleteCategory }
}

// ========== Websites Hook ==========
export function useWebsites() {
  const { user } = useAuth()
  const [websites, setWebsites] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchWebsites = useCallback(async (filters = {}) => {
    if (!user) return
    setLoading(true)
    try {
      let query = supabase
        .from('websites')
        .select('*')
        .order('created_at', { ascending: false })

      if (filters.mainCategory) {
        query = query.eq('main_category', filters.mainCategory)
      }
      if (filters.subCategory) {
        query = query.eq('sub_category', filters.subCategory)
      }
      if (filters.search) {
        query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`)
      }

      const { data, error } = await query
      if (error) throw error
      setWebsites(data || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    fetchWebsites()
  }, [fetchWebsites])

  const addWebsite = async (website) => {
    try {
      const { data, error } = await supabase
        .from('websites')
        .insert([{ ...website, user_id: user.id }])
        .select()
      
      if (error) throw error
      setWebsites(prev => [data[0], ...prev])
      return { data: data[0], error: null }
    } catch (err) {
      return { data: null, error: err }
    }
  }

  const updateWebsite = async (id, updates) => {
    try {
      const { data, error } = await supabase
        .from('websites')
        .update(updates)
        .eq('id', id)
        .select()
      
      if (error) throw error
      setWebsites(prev => prev.map(w => w.id === id ? data[0] : w))
      return { data: data[0], error: null }
    } catch (err) {
      return { data: null, error: err }
    }
  }

  const deleteWebsite = async (id) => {
    try {
      const { error } = await supabase
        .from('websites')
        .delete()
        .eq('id', id)
      
      if (error) throw error
      setWebsites(prev => prev.filter(w => w.id !== id))
      return { error: null }
    } catch (err) {
      return { error: err }
    }
  }

  return { websites, loading, error, fetchWebsites, addWebsite, updateWebsite, deleteWebsite }
}

// ========== RSS Sources Hook ==========
export function useRssSources() {
  const { user } = useAuth()
  const [sources, setSources] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchSources = useCallback(async () => {
    if (!user) return
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('rss_sources')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      setSources(data || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    fetchSources()
  }, [fetchSources])

  // 实时订阅：后台增删改 RSS 源后，自动刷新
  useEffect(() => {
    if (!user) return

    const channel = supabase
      .channel(`rss_sources:${user.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'rss_sources',
          filter: `user_id=eq.${user.id}`
        },
        () => {
          fetchSources()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [user, fetchSources])

  const addSource = async (source) => {
    try {
      const { data, error } = await supabase
        .from('rss_sources')
        .insert([{ ...source, user_id: user.id }])
        .select()
      
      if (error) throw error
      setSources(prev => [data[0], ...prev])
      return { data: data[0], error: null }
    } catch (err) {
      return { data: null, error: err }
    }
  }

  const updateSource = async (id, updates) => {
    try {
      const { data, error } = await supabase
        .from('rss_sources')
        .update(updates)
        .eq('id', id)
        .select()
      
      if (error) throw error
      setSources(prev => prev.map(s => s.id === id ? data[0] : s))
      return { data: data[0], error: null }
    } catch (err) {
      return { data: null, error: err }
    }
  }

  const deleteSource = async (id) => {
    try {
      const { error } = await supabase
        .from('rss_sources')
        .delete()
        .eq('id', id)
      
      if (error) throw error
      setSources(prev => prev.filter(s => s.id !== id))
      return { error: null }
    } catch (err) {
      return { error: err }
    }
  }

  return { rssSources: sources, loading, error, fetchRssSources: fetchSources, addRssSource: addSource, updateRssSource: updateSource, deleteRssSource: deleteSource }
}

// ========== YouTube Channels Hook ==========
export function useYoutubeChannels() {
  const { user } = useAuth()
  const [channels, setChannels] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchChannels = useCallback(async () => {
    if (!user) return
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('youtube_channels')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      setChannels(data || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    fetchChannels()
  }, [fetchChannels])

  const addChannel = async (channel) => {
    try {
      const { data, error } = await supabase
        .from('youtube_channels')
        .insert([{ ...channel, user_id: user.id }])
        .select()
      
      if (error) throw error
      setChannels(prev => [data[0], ...prev])
      return { data: data[0], error: null }
    } catch (err) {
      return { data: null, error: err }
    }
  }

  const updateChannel = async (id, updates) => {
    try {
      const { data, error } = await supabase
        .from('youtube_channels')
        .update(updates)
        .eq('id', id)
        .select()
      
      if (error) throw error
      setChannels(prev => prev.map(c => c.id === id ? data[0] : c))
      return { data: data[0], error: null }
    } catch (err) {
      return { data: null, error: err }
    }
  }

  const deleteChannel = async (id) => {
    try {
      const { error } = await supabase
        .from('youtube_channels')
        .delete()
        .eq('id', id)
      
      if (error) throw error
      setChannels(prev => prev.filter(c => c.id !== id))
      return { error: null }
    } catch (err) {
      return { error: err }
    }
  }

  return { youtubeChannels: channels, loading, error, fetchYoutubeChannels: fetchChannels, addYoutubeChannel: addChannel, updateYoutubeChannel: updateChannel, deleteYoutubeChannel: deleteChannel }
}

// ========== HTML Pages Hook ==========
export function useHtmlPages() {
  const { user } = useAuth()
  const [pages, setPages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchPages = useCallback(async (filters = {}) => {
    // 移除 user 检查，允许未登录用户查看博客列表
    setLoading(true)
    try {
      let query = supabase
        .from('html_pages')
        .select('*')
        .order('created_at', { ascending: false })

      if (filters.category) {
        query = query.eq('category', filters.category)
      }
      if (filters.search) {
        query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`)
      }

      const { data, error } = await query
      if (error) throw error
      setPages(data || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchPages()
  }, [fetchPages])

  // 上传 HTML 文件到 Storage
  const uploadHtmlFile = async (fileName, content) => {
    try {
      const filePath = `${user.id}/${Date.now()}_${fileName}.html`
      const blob = new Blob([content], { type: 'text/html' })
      
      const { data, error } = await supabase.storage
        .from('html-pages')
        .upload(filePath, blob)
      
      if (error) throw error
      return { path: data.path, error: null }
    } catch (err) {
      return { path: null, error: err }
    }
  }

  // 获取 HTML 文件内容
  const getHtmlContent = async (storagePath) => {
    try {
      const { data, error } = await supabase.storage
        .from('html-pages')
        .download(storagePath)
      
      if (error) throw error
      const content = await data.text()
      return { content, error: null }
    } catch (err) {
      return { content: null, error: err }
    }
  }

  // 获取 HTML 文件的公开 URL（用于 iframe 展示）
  const getHtmlUrl = (storagePath) => {
    const { data } = supabase.storage
      .from('html-pages')
      .getPublicUrl(storagePath)
    return data.publicUrl
  }

  const addPage = async (page, htmlContent) => {
    try {
      // 先上传 HTML 文件
      const { path, error: uploadError } = await uploadHtmlFile(page.title, htmlContent)
      if (uploadError) throw uploadError

      // 再创建数据库记录
      const { data, error } = await supabase
        .from('html_pages')
        .insert([{
          ...page,
          storage_path: path,
          file_size: new Blob([htmlContent]).size,
          user_id: user.id
        }])
        .select()
      
      if (error) throw error
      setPages(prev => [data[0], ...prev])
      return { data: data[0], error: null }
    } catch (err) {
      return { data: null, error: err }
    }
  }

  const updatePage = async (id, updates, newHtmlContent = null) => {
    try {
      let storagePath = updates.storage_path
      let fileSize = updates.file_size

      // 如果有新的 HTML 内容，先上传
      if (newHtmlContent) {
        const { path, error: uploadError } = await uploadHtmlFile(updates.title || 'page', newHtmlContent)
        if (uploadError) throw uploadError
        storagePath = path
        fileSize = new Blob([newHtmlContent]).size
      }

      const { data, error } = await supabase
        .from('html_pages')
        .update({ ...updates, storage_path: storagePath, file_size: fileSize })
        .eq('id', id)
        .select()
      
      if (error) throw error
      setPages(prev => prev.map(p => p.id === id ? data[0] : p))
      return { data: data[0], error: null }
    } catch (err) {
      return { data: null, error: err }
    }
  }

  const deletePage = async (id, storagePath) => {
    try {
      // 删除 Storage 文件
      if (storagePath) {
        await supabase.storage.from('html-pages').remove([storagePath])
      }
      
      // 删除数据库记录
      const { error } = await supabase
        .from('html_pages')
        .delete()
        .eq('id', id)
      
      if (error) throw error
      setPages(prev => prev.filter(p => p.id !== id))
      return { error: null }
    } catch (err) {
      return { error: err }
    }
  }

  return { 
    htmlPages: pages, 
    loading, 
    error, 
    fetchHtmlPages: fetchPages, 
    addHtmlPage: addPage, 
    updateHtmlPage: updatePage, 
    deleteHtmlPage: deletePage,
    uploadHtmlFile,
    getHtmlContent,
    getHtmlUrl
  }
}
