import { useState, useEffect } from 'react'
import { supabase } from './supabase'
import CalendarView from './components/CalendarView'
import WorkoutLog from './components/WorkoutLog'
import Login from './components/Login'
import './App.css'

function App() {
  const [session, setSession] = useState(undefined) // undefined = loading
  const [selectedDate, setSelectedDate] = useState(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
    return () => subscription.unsubscribe()
  }, [])

  if (session === undefined) {
    return <div className="app-loading">loading...</div>
  }

  if (!session) {
    return <Login />
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="logo">
          <span className="logo-icon">💪</span>
          <span className="logo-text">Routine Stamp</span>
        </div>
        <button
          className="logout-btn"
          onClick={() => supabase.auth.signOut()}
        >
          로그아웃
        </button>
      </header>

      <main className="app-main">
        {selectedDate ? (
          <WorkoutLog
            date={selectedDate}
            userId={session.user.id}
            onBack={() => setSelectedDate(null)}
            onSaved={() => setSelectedDate(null)}
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
