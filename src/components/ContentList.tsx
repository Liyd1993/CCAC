import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

interface Entry {
  id: string
  content: string
  created_at: string
}

export default function ContentList({ userId }: { userId: string }) {
  const [entries, setEntries] = useState<Entry[]>([])
  const [loading, setLoading] = useState(true)

  const fetchEntries = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('user_entries')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching entries:', error)
    } else {
      setEntries(data || [])
    }
    setLoading(false)
  }

  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from('user_entries')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting:', error)
    } else {
      fetchEntries()
    }
  }

  useEffect(() => {
    fetchEntries()

    // 监听内容保存事件
    const handler = () => fetchEntries()
    window.addEventListener('content-saved', handler)
    return () => window.removeEventListener('content-saved', handler)
  }, [userId])

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">历史记录</h2>

      {loading ? (
        <p className="text-gray-500">加载中...</p>
      ) : entries.length === 0 ? (
        <p className="text-gray-500">还没有保存的内容</p>
      ) : (
        <ul className="space-y-3">
          {entries.map((entry) => (
            <li
              key={entry.id}
              className="border border-gray-200 rounded-md p-3"
            >
              <div className="flex justify-between items-start">
                <p className="text-gray-800 whitespace-pre-wrap flex-1">
                  {entry.content}
                </p>
                <button
                  onClick={() => handleDelete(entry.id)}
                  className="ml-4 text-red-600 hover:text-red-800 text-sm"
                >
                  删除
                </button>
              </div>
              <p className="text-xs text-gray-400 mt-2">
                {new Date(entry.created_at).toLocaleString('zh-CN')}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
