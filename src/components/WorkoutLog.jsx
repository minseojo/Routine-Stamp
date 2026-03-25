import { useState, useEffect } from 'react'
import { supabase } from '../supabase'
import { GROUP_COLORS, DEFAULT_TEMPLATE, EXERCISE_DB } from '../exercises'
import './WorkoutLog.css'

function WorkoutLog({ date, userId, onBack, onSaved, onOpenTemplate }) {
  const [records, setRecords] = useState(null)
  const [template, setTemplate] = useState([])
  const [unit, setUnit] = useState('kg')
  const [saving, setSaving] = useState(false)
  const [savedMsg, setSavedMsg] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      setLoading(true)
      const logRes = await supabase
        .from('workout_logs')
        .select('records')
        .eq('user_id', userId)
        .eq('date', date)
        .maybeSingle()

      const tplRes = await supabase
        .from('user_templates')
        .select('template, unit')
        .eq('user_id', userId)
        .maybeSingle()

      let baseTemplateData = tplRes.data?.template
      if (baseTemplateData && Array.isArray(baseTemplateData)) {
        baseTemplateData = { 0: [], 1: baseTemplateData, 2: [], 3: baseTemplateData, 4: [], 5: baseTemplateData, 6: [] }
      } else if (!baseTemplateData) {
        baseTemplateData = { 0: [], 1: DEFAULT_TEMPLATE, 2: [], 3: DEFAULT_TEMPLATE, 4: [], 5: DEFAULT_TEMPLATE, 6: [] }
      }

      // 오늘 무슨 요일인지 계산 (0: 일, 1: 월, ... 6: 토)
      const dayOfWeek = new Date(date + 'T00:00:00').getDay()
      const userTemplate = baseTemplateData[dayOfWeek] || []
        
      const userUnit = tplRes.data?.unit || 'kg'
      setUnit(userUnit)

      if (logRes.data?.records && Object.keys(logRes.data.records).length > 0) {
        // 과거(또는 이미 저장된) 데이터가 있을 경우: 저장된 종목들만으로 화면(템플릿)을 복구함
        const savedRecords = logRes.data.records
        const historicalTemplate = Object.keys(savedRecords).map(exId => {
          const exInfo = EXERCISE_DB.find(e => e.id === exId) || {
            id: exId, name: exId, group: '기타'
          }
          return {
            ...exInfo,
            sets: savedRecords[exId].length,
            // 렌더링에 필요한 더미값 (실제값은 records에서 가져옴)
            defaultReps: savedRecords[exId][0]?.reps || 10,  
            defaultWeight: savedRecords[exId][0]?.weight || 20
          }
        })
        setTemplate(historicalTemplate)
        setRecords(savedRecords)
      } else {
        // 기록이 아예 없는 새로운 날짜일 경우: 해당 요일의 기본 템플릿 세팅 적용
        const initialRecords = {}
        userTemplate.forEach((ex) => {
          initialRecords[ex.id] = Array.from({ length: ex.sets }, () => ({
            weight: ex.defaultWeight,
            reps: ex.defaultReps,
          }))
        })
        setTemplate(userTemplate)
        setRecords(initialRecords)
      }
      setLoading(false)
    }
    loadData()
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

  if (loading) return <div className="app-loading">불러오는 중...</div>

  return (
    <div className="workout-container">
      <div className="workout-header">
        <button className="back-btn" onClick={onBack}>←</button>
        <div>
          <div className="workout-date">{displayDate}</div>
          <div className="workout-subtitle">나만의 맞춤 머신 루틴</div>
        </div>
      </div>

      <div className="exercise-list">
        {template.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div style={{ fontSize: '3rem', marginBottom: '16px' }}>😴</div>
            <div style={{ color: '#aaa', fontSize: '1.05rem', lineHeight: 1.5, marginBottom: '24px' }}>
              <strong style={{ color: '#fff', fontSize: '1.2rem', display: 'block', marginBottom: '8px' }}>
                {['일', '월', '화', '수', '목', '금', '토'][new Date(date + 'T00:00:00').getDay()]}요일은 쉬는 날인가요?
              </strong>
              설정 메뉴에서 운동을 구성해보세요!
            </div>
            <button 
              onClick={onOpenTemplate}
              style={{ background: '#FF6B6B', color: '#fff', border: 'none', padding: '14px 28px', borderRadius: '16px', fontSize: '1rem', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 4px 12px rgba(255, 107, 107, 0.3)' }}
            >
              요일별 루틴 세팅하러 가기
            </button>
          </div>
        ) : (
          template.map((ex) => (
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
                <span>무게 ({unit})</span>
                <span>횟수 (reps)</span>
              </div>

              {records[ex.id]?.map((set, si) => (
                <div key={si} className="set-row">
                  <span className="set-num">{si + 1}</span>

                  <div className="stepper">
                    <button className="step-btn" onClick={() => adjust(ex.id, si, 'weight', unit === 'kg' ? -5 : -10)}>−</button>
                    <input
                      className="step-input"
                      type="number"
                      inputMode="decimal"
                      value={set.weight}
                      onChange={(e) => handleInputChange(ex.id, si, 'weight', e.target.value)}
                    />
                    <button className="step-btn" onClick={() => adjust(ex.id, si, 'weight', unit === 'kg' ? 5 : 10)}>+</button>
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
          ))
        )}
      </div>

      <div className="save-footer">
        <button className="save-btn" onClick={handleSave} disabled={saving || template.length === 0}>
          {saving ? '저장 중...' : savedMsg || '오늘의 운동 완료 🏋️'}
        </button>
      </div>
    </div>
  )
}

export default WorkoutLog
