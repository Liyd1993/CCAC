import { useState, useEffect } from 'react'
import { Session } from '@supabase/supabase-js'
import { supabase } from './lib/supabase'
import LoginForm from './components/LoginForm'
import ContentForm from './components/ContentForm'
import ContentList from './components/ContentList'

function App() {
  const [session, setSession] = useState<Session | null>(null)

  useEffect(() => {
    // 获取当前会话
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    // 监听认证状态变化
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">
          简单内容记录应用
        </h1>

        {!session ? (
          <LoginForm />
        ) : (
          <>
            <div className="bg-white rounded-lg shadow p-4 mb-4">
              <div className="flex justify-between items-center">
                <p className="text-gray-600">
                  已登录：{session.user.email}
                </p>
                <button
                  onClick={() => supabase.auth.signOut()}
                  className="text-red-600 hover:text-red-800"
                >
                  登出
                </button>
              </div>
            </div>
            <ContentForm />
            <ContentList userId={session.user.id} />
          </>
        )}
      </div>
    </div>
  )
}

export default App
