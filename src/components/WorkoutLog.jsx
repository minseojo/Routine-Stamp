import { useState, useEffect } from 'react'
import { supabase } from '../supabase'
import { EXERCISES, GROUP_COLORS, DEFAULT_WEIGHT, DEFAULT_REPS, DEFAULT_SETS } from '../constants'
import './WorkoutLog.css'

function buildInitialRecords() {
  const rec = {}
  EXERCISES.forEach((ex) => {
    rec[ex.id] = Array.from({ length: DEFAULT_SETS }, () => ({
      weight: DEFAULT_WEIGHT,
      reps: DEFAULT_REPS,
    }))
  })
  return rec
}

function WorkoutLog({ date, userId, onBack, onSaved }) {
  const [records, setRecords] = useState(buildInitialRecords())
  const [saving, setSaving] = useState(false)
  const [savedMsg, setSavedMsg] = useState('')

  useEffect(() => {
    async function loadExisting() {
      const { data, error } = await supabase
        .from('workout_logs')
        .select('records')
        .eq('user_id', userId)
        .eq('date', date)
        .maybeSingle()
      if (!error && data?.records) {
        setRecords(data.records)
      }
    }
    loadExisting()
  }, [date, userId])

  function adjust(exId, setIdx, field, delta) {
    setRecords((prev) => {
      const next = JSON.parse(JSON.stringify(prev))
      const val = Number(next[exId][setIdx][field]) + delta
      next[exId][setIdx][field] = Math.max(field === 'weight' ? 0 : 1, val)
      return next
    })
  }

  function handleInputChange(exId, setIdx, field, value) {
    setRecords((prev) => {
      const next = JSON.parse(JSON.stringify(prev))
      const parsed = parseFloat(value)
      next[exId][setIdx][field] = isNaN(parsed) ? 0 : Math.max(0, parsed)
      return next
    })
  }

  async function handleSave() {
    setSaving(true)
    const { error } = await supabase
      .from('workout_logs')
      .upsert(
        { user_id: userId, date, records },
        { onConflict: 'user_id,date' }
      )

    setSaving(false)
    if (error) {
      alert('저장 실패: ' + error.message)
    } else {
      setSavedMsg('저장 완료! 💪')
      setTimeout(() => onSaved(), 800)
    }
  }

  const displayDate = new Date(date + 'T00:00:00').toLocaleDateString('ko-KR', {
    year: 'numeric', month: 'long', day: 'numeric', weekday: 'short',
  })

  return (
    <div className="workout-container">
      <div className="workout-header">
        <button className="back-btn" onClick={onBack}>←</button>
        <div>
          <div className="workout-date">{displayDate}</div>
          <div className="workout-subtitle">전신 무분할 8종목</div>
        </div>
      </div>

      <div className="exercise-list">
        {EXERCISES.map((ex) => (
          <div key={ex.id} className="exercise-card">
            <div className="exercise-title">
              <span
                className="group-badge"
                style={{ background: GROUP_COLORS[ex.group] + '33', color: GROUP_COLORS[ex.group] }}
              >
                {ex.group}
              </span>
              <span className="exercise-name">{ex.name}</span>
            </div>

            <div className="sets-header">
              <span>세트</span>
              <span>무게 (kg)</span>
              <span>횟수 (reps)</span>
            </div>

            {records[ex.id]?.map((set, si) => (
              <div key={si} className="set-row">
                <span className="set-num">{si + 1}</span>

                <div className="stepper">
                  <button className="step-btn" onClick={() => adjust(ex.id, si, 'weight', -5)}>−</button>
                  <input
                    className="step-input"
                    type="number"
                    inputMode="decimal"
                    value={set.weight}
                    onChange={(e) => handleInputChange(ex.id, si, 'weight', e.target.value)}
                  />
                  <button className="step-btn" onClick={() => adjust(ex.id, si, 'weight', 5)}>+</button>
                </div>

                <div className="stepper">
                  <button className="step-btn" onClick={() => adjust(ex.id, si, 'reps', -1)}>−</button>
                  <input
                    className="step-input"
                    type="number"
                    inputMode="numeric"
                    value={set.reps}
                    onChange={(e) => handleInputChange(ex.id, si, 'reps', e.target.value)}
                  />
                  <button className="step-btn" onClick={() => adjust(ex.id, si, 'reps', 1)}>+</button>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="save-footer">
        <button className="save-btn" onClick={handleSave} disabled={saving}>
          {saving ? '저장 중...' : savedMsg || '오늘의 운동 완료 🏋️'}
        </button>
      </div>
    </div>
  )
}

export default WorkoutLog
