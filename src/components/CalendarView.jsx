import { useState, useEffect } from 'react'
import { supabase } from '../supabase'
import './CalendarView.css'

const STAMP = '💪'

function CalendarView({ userId, onSelectDate }) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [stampedDates, setStampedDates] = useState(new Set())
  const [loading, setLoading] = useState(true)

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  useEffect(() => {
    fetchStampedDates()
  }, [year, month, userId])

  async function fetchStampedDates() {
    setLoading(true)
    const startOfMonth = `${year}-${String(month + 1).padStart(2, '0')}-01`
    const endOfMonth = `${year}-${String(month + 1).padStart(2, '0')}-31`

    const { data, error } = await supabase
      .from('workout_logs')
      .select('date')
      .eq('user_id', userId)
      .gte('date', startOfMonth)
      .lte('date', endOfMonth)

    if (!error && data) {
      setStampedDates(new Set(data.map((row) => row.date)))
    }
    setLoading(false)
  }

  function getDaysInMonth(y, m) {
    return new Date(y, m + 1, 0).getDate()
  }

  function getFirstDayOfMonth(y, m) {
    return new Date(y, m, 1).getDay()
  }

  function formatDate(d) {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
  }

  function isToday(d) {
    const t = new Date()
    return t.getFullYear() === year && t.getMonth() === month && t.getDate() === d
  }

  const daysInMonth = getDaysInMonth(year, month)
  const firstDay = getFirstDayOfMonth(year, month)
  const monthNames = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월']
  const dayNames = ['일', '월', '화', '수', '목', '금', '토']

  const cells = []
  for (let i = 0; i < firstDay; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)

  function goToday() {
    const t = new Date()
    const dateStr = `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, '0')}-${String(t.getDate()).padStart(2, '0')}`
    onSelectDate(dateStr)
  }

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <button className="nav-btn" onClick={() => setCurrentDate(new Date(year, month - 1, 1))}>‹</button>
        <h2 className="calendar-title">{year}년 {monthNames[month]}</h2>
        <button className="nav-btn" onClick={() => setCurrentDate(new Date(year, month + 1, 1))}>›</button>
      </div>

      {loading && <div className="loading-bar" />}

      <div className="day-names">
        {dayNames.map((d) => (
          <div key={d} className="day-name">{d}</div>
        ))}
      </div>

      <div className="calendar-grid">
        {cells.map((day, idx) => {
          if (!day) return <div key={`empty-${idx}`} className="calendar-cell empty" />
          const dateStr = formatDate(day)
          const hasStamp = stampedDates.has(dateStr)
          const today = isToday(day)
          return (
            <button
              key={dateStr}
              className={`calendar-cell ${hasStamp ? 'stamped' : ''} ${today ? 'today' : ''}`}
              onClick={() => onSelectDate(dateStr)}
            >
              <span className="day-number">{day}</span>
              {hasStamp && <span className="stamp-icon">{STAMP}</span>}
            </button>
          )
        })}
      </div>

      <div className="calendar-footer">
        <button className="today-btn" onClick={goToday}>
          오늘 운동 기록하기
        </button>
      </div>
    </div>
  )
}

export default CalendarView
