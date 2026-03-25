import { useState, useEffect } from 'react'
import { supabase } from './supabase'
import CalendarView from './components/CalendarView'
import WorkoutLog from './components/WorkoutLog'
import TemplateView from './components/TemplateView'
import Login from './components/Login'
import './App.css'

function App() {
  const [session, setSession] = useState(undefined)
  const [selectedDate, setSelectedDate] = useState(null)
  const [isTemplateView, setIsTemplateView] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
    return () => subscription.unsubscribe()
  }, [])

  if (session === undefined) return <div className="app-loading">loading...</div>
  if (!session) return <Login />

  return (
    <div className="app">
      {!selectedDate && !isTemplateView && (
        <header className="app-header">
          <div className="logo">
            <span className="logo-icon">💪</span>
            <span className="logo-text">Routine Stamp</span>
          </div>
          <div>
            <button className="template-btn" onClick={() => setIsTemplateView(true)}>설정</button>
            <button className="logout-btn" onClick={() => supabase.auth.signOut()}>로그아웃</button>
          </div>
        </header>
      )}

      <main className="app-main">
        {isTemplateView ? (
          <TemplateView userId={session.user.id} onBack={() => setIsTemplateView(false)} />
        ) : selectedDate ? (
          <WorkoutLog
            date={selectedDate}
            userId={session.user.id}
            onBack={() => setSelectedDate(null)}
            onSaved={() => setSelectedDate(null)}
            onOpenTemplate={() => setIsTemplateView(true)}
          />
        ) : (
          <CalendarView
            userId={session.user.id}
            onSelectDate={setSelectedDate}
          />
        )}
      </main>
    </div>
  )
}

export default App
