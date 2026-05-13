import { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function ContentForm() {
  const [content, setContent] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim()) return

    setSubmitting(true)
    setMessage('')

    // 获取当前用户
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      setMessage('请先登录')
      setSubmitting(false)
      return
    }

    const { error } = await supabase
      .from('user_entries')
      .insert({
        content: content.trim(),
        user_id: user.id
      })

    if (error) {
      setMessage('保存失败：' + error.message)
    } else {
      setContent('')
      setMessage('保存成功！')

      // 通知列表刷新
      window.dispatchEvent(new CustomEvent('content-saved'))
    }

    setSubmitting(false)
  }

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-4">
      <h2 className="text-xl font-semibold mb-4">输入内容</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="在这里输入你想记录的内容..."
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        />

        <button
          type="submit"
          disabled={submitting || !content.trim()}
          className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {submitting ? '保存中...' : '保存'}
        </button>
      </form>

      {message && (
        <p className={`mt-4 text-sm ${message.includes('成功') ? 'text-green-600' : 'text-red-600'}`}>
          {message}
        </p>
      )}
    </div>
  )
}
