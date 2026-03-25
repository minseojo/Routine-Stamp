import { useState, useEffect } from 'react'
import { supabase } from '../supabase'
import { EXERCISE_DB, GROUP_COLORS, DEFAULT_TEMPLATE, PRESET_TEMPLATES, createWeeklyTemplateFromPreset } from '../exercises'
import './TemplateView.css'

const DAYS = [
  { val: 1, label: '월' },
  { val: 2, label: '화' },
  { val: 3, label: '수' },
  { val: 4, label: '목' },
  { val: 5, label: '금' },
  { val: 6, label: '토' },
  { val: 0, label: '일' }
]

function TemplateView({ userId, onBack }) {
  const [template, setTemplate] = useState({
    0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: []
  })
  const [unit, setUnit] = useState('kg')
  const [activeDay, setActiveDay] = useState(1) // 기본: 월요일
  const [saving, setSaving] = useState(false)
  const [showExPicker, setShowExPicker] = useState(false)
  
  // 모달 관리: { type: 'COPY_CURRENT' } | { type: 'APPLY_PRESET', preset: presetObject } | null
  const [daySelectModal, setDaySelectModal] = useState(null)
  const [selectedDays, setSelectedDays] = useState([])

  const groups = Object.keys(GROUP_COLORS)

  useEffect(() => {
    async function loadTemplate() {
      const { data } = await supabase
        .from('user_templates')
        .select('template, unit')
        .eq('user_id', userId)
        .maybeSingle()
      
      if (data && data.template) {
        if (Array.isArray(data.template)) {
          setTemplate(createWeeklyTemplateFromPreset(data.template))
        } else {
          setTemplate({
            0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: [],
            ...data.template
          })
        }
        setUnit(data.unit || 'kg')
      } else {
        setTemplate(createWeeklyTemplateFromPreset(DEFAULT_TEMPLATE))
      }
    }
    loadTemplate()
  }, [userId])

  const activeRoutines = template[activeDay] || []

  function openExPicker() {
    setSelectedExsPicker([])
    setShowExPicker(true)
  }

  function togglePickerExercise(ex) {
    if (selectedExsPicker.some(e => e.id === ex.id)) {
      setSelectedExsPicker(selectedExsPicker.filter(e => e.id !== ex.id))
    } else {
      setSelectedExsPicker([...selectedExsPicker, ex])
    }
  }

  function commitSelectedExercises() {
    if (selectedExsPicker.length === 0) {
      setShowExPicker(false)
      return
    }
    const newExs = selectedExsPicker.map(ex => ({
      ...ex, sets: 3, defaultReps: 10, defaultWeight: 20
    }))
    setTemplate({
      ...template,
      [activeDay]: [...activeRoutines, ...newExs]
    })
    setShowExPicker(false)
    setSelectedExsPicker([])
  }

  function removeExercise(id) {
    setTemplate({
      ...template,
      [activeDay]: activeRoutines.filter(t => t.id !== id)
    })
  }

  function updateEx(id, field, delta) {
    setTemplate({
      ...template,
      [activeDay]: activeRoutines.map(t => {
        if (t.id === id) {
          let val = Number(t[field]) + delta
          if (field === 'sets') val = Math.max(1, Math.min(10, val))
          if (field === 'defaultReps') val = Math.max(1, val)
          if (field === 'defaultWeight') val = Math.max(unit === 'lb' ? 0 : 0, val) 
          return { ...t, [field]: val }
        }
        return t
      })
    })
  }

  function handleOpenDaySelect(type, presetObj = null) {
    // 미리 현재 탭(activeDay)을 체크 상태로 만듭니다.
    setSelectedDays([activeDay])
    setDaySelectModal({ type, preset: presetObj })
  }

  function handleDayToggle(dayVal) {
    if (selectedDays.includes(dayVal)) {
      setSelectedDays(selectedDays.filter(d => d !== dayVal))
    } else {
      setSelectedDays([...selectedDays, dayVal])
    }
  }

  function applyDaySelection() {
    if (selectedDays.length === 0) {
      alert('적용할 요일을 하나 이상 선택해주세요.')
      return
    }

    const t = { ...template }
    const sourceArray = daySelectModal.type === 'APPLY_PRESET' 
      ? daySelectModal.preset.template 
      : activeRoutines

    selectedDays.forEach(day => {
      t[day] = [...sourceArray]
    })
    
    setTemplate(t)
    setDaySelectModal(null)
  }

  async function handleSave() {
    setSaving(true)
    const { error } = await supabase
      .from('user_templates')
      .upsert({ user_id: userId, template, unit })
    
    setSaving(false)
    if (error) {
      alert('저장 실패: ' + error.message)
    } else {
      alert('요일별 템플릿이 저장되었습니다! 💪')
      onBack()
    }
  }

  return (
    <div className="template-container">
      <div className="template-header">
        <button className="back-btn" onClick={onBack}>←</button>
        <div>
          <h2 className="template-title">요일별 루틴 설정</h2>
          <span className="template-subtitle">각 요일에 할 운동 세팅</span>
        </div>
      </div>

      <div className="day-tabs">
        {DAYS.map(day => (
          <button 
            key={day.val} 
            className={`day-tab ${activeDay === day.val ? 'active' : ''}`}
            onClick={() => setActiveDay(day.val)}
          >
            {day.label}
            {template[day.val]?.length > 0 && <span className="day-dot" />}
          </button>
        ))}
      </div>

      <div className="template-content">
        <div className="preset-scroll">
          <div className="preset-label">추천 템플릿 (선택한 요일에 덮어쓰기):</div>
          <div className="preset-list">
            {PRESET_TEMPLATES.map(preset => (
              <button 
                key={preset.id} 
                className="preset-btn"
                onClick={() => handleOpenDaySelect('APPLY_PRESET', preset)}
              >
                {preset.name}
              </button>
            ))}
          </div>
        </div>

        <div className="unit-toggle">
          <label>무게 단위 (모든 요일 공통)</label>
          <div className="unit-buttons">
            <button className={unit === 'kg' ? 'active' : ''} onClick={() => setUnit('kg')}>kg</button>
            <button className={unit === 'lb' ? 'active' : ''} onClick={() => setUnit('lb')}>lb</button>
          </div>
        </div>
        
        <div className="action-row" style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
          <button className="copy-btn" onClick={() => handleOpenDaySelect('COPY_CURRENT')} disabled={activeRoutines.length === 0}>
            지금 화면에 있는 루틴을 다른 요일에 복사
          </button>
        </div>

        <div className="template-list">
          {activeRoutines.length === 0 && (
            <div className="empty-state">
              오늘은 휴식일인가요? 😴<br/>[운동 추가하기]를 눌러 루틴을 만들어보세요!
            </div>
          )}
          {activeRoutines.map((ex, idx) => (
            <div key={ex.id} className="template-card">
              <div className="template-card-header">
                <div>
                  <span className="idx-badge">{idx + 1}</span>
                  <span className="group-badge" style={{ background: GROUP_COLORS[ex.group] + '33', color: GROUP_COLORS[ex.group] }}>
                    {ex.group}
                  </span>
                  <span className="ex-name">{ex.name}</span>
                </div>
                <button className="remove-btn" onClick={() => removeExercise(ex.id)}>✕</button>
              </div>

              <div className="setup-grid">
                <div className="setup-item">
                  <span className="setup-label">세트</span>
                  <div className="stepper-mini">
                    <button onClick={() => updateEx(ex.id, 'sets', -1)}>−</button>
                    <span>{ex.sets}</span>
                    <button onClick={() => updateEx(ex.id, 'sets', 1)}>+</button>
                  </div>
                </div>
                <div className="setup-item">
                  <span className="setup-label">횟수</span>
                  <div className="stepper-mini">
                    <button onClick={() => updateEx(ex.id, 'defaultReps', -1)}>−</button>
                    <span>{ex.defaultReps}</span>
                    <button onClick={() => updateEx(ex.id, 'defaultReps', 1)}>+</button>
                  </div>
                </div>
                <div className="setup-item">
                  <span className="setup-label">무게({unit})</span>
                  <div className="stepper-mini">
                    <button onClick={() => updateEx(ex.id, 'defaultWeight', unit === 'kg' ? -5 : -10)}>−</button>
                    <span>{ex.defaultWeight}</span>
                    <button onClick={() => updateEx(ex.id, 'defaultWeight', unit === 'kg' ? 5 : 10)}>+</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <button className="add-ex-btn" onClick={openExPicker}>
          + {DAYS.find(d => d.val === activeDay).label}요일에 운동 추가하기
        </button>
      </div>

      <div className="save-footer">
        <button className="save-btn" onClick={handleSave} disabled={saving}>
          {saving ? '저장 중...' : '요일별 템플릿 일괄 저장'}
        </button>
      </div>

      {/* 요일 다중 선택 모달 (복사 및 프리셋 공용) */}
      {daySelectModal && (
        <div className="modal-overlay" onClick={(e) => e.target.className === 'modal-overlay' && setDaySelectModal(null)}>
          <div className="picker-modal" style={{ maxHeight: '50vh', top: 'auto', bottom: 0, position: 'absolute' }}>
            <h3 className="picker-title" style={{ fontSize: '1.1rem', marginBottom: '8px' }}>
              {daySelectModal.type === 'APPLY_PRESET' ? `'${daySelectModal.preset.name}'` : '현재 루틴'} 적용할 요일 선택
            </h3>
            <p style={{ fontSize: '0.8rem', color: '#999', marginBottom: '20px' }}>선택된 요일의 기존 운동은 모두 지워지고 덮어쓰여집니다.</p>
            
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'space-between', marginBottom: '24px' }}>
              {DAYS.map(day => {
                const isSelected = selectedDays.includes(day.val)
                return (
                  <button 
                    key={day.val}
                    onClick={() => handleDayToggle(day.val)}
                    style={{
                      flex: 1, padding: '12px 0', borderRadius: '12px', fontSize: '1rem', fontWeight: 600,
                      background: isSelected ? '#FF6B6B' : 'rgba(255,255,255,0.1)',
                      color: isSelected ? '#fff' : 'rgba(255,255,255,0.7)',
                      border: 'none', cursor: 'pointer', transition: 'all 0.2s'
                    }}
                  >
                    {day.label}
                  </button>
                )
              })}
            </div>
            
            <div style={{ display: 'flex', gap: '12px' }}>
              <button className="picker-close" style={{ flex: 1, marginTop: 0 }} onClick={() => setDaySelectModal(null)}>취소</button>
              <button 
                style={{ flex: 2, padding: '16px', borderRadius: '16px', background: '#FF6B6B', border: 'none', color: '#fff', fontWeight: 700, fontSize: '1rem', cursor: 'pointer' }} 
                onClick={applyDaySelection}
              >
                선택한 요일에 적용하기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 운동 종목 다중 선택 모달 */}
      {showExPicker && (
        <div className="modal-overlay" onClick={(e) => e.target.className === 'modal-overlay' && setShowExPicker(false)}>
          <div className="picker-modal" style={{ display: 'flex', flexDirection: 'column' }}>
            <h3 className="picker-title">{DAYS.find(d => d.val === activeDay).label}요일 운동 추가</h3>
            <div className="picker-list" style={{ flex: 1, overflowY: 'auto', marginBottom: '16px' }}>
              {groups.map(group => (
                <div key={group} className="picker-group">
                  <div className="picker-group-title" style={{ color: GROUP_COLORS[group] }}>{group}</div>
                  <div className="picker-items">
                    {EXERCISE_DB.filter(e => e.group === group).map(ex => {
                      const isAlreadyInRoutine = activeRoutines.some(t => t.id === ex.id)
                      const isSelectedInPicker = selectedExsPicker.some(t => t.id === ex.id)
                      return (
                        <button 
                          key={ex.id} 
                          className={`picker-item ${isAlreadyInRoutine ? 'selected' : isSelectedInPicker ? 'active-select' : ''}`}
                          style={isSelectedInPicker ? { background: '#4ECDC4', color: '#000', fontWeight: 'bold' } : {}}
                          onClick={() => togglePickerExercise(ex)}
                          disabled={isAlreadyInRoutine}
                        >
                          {ex.name} {isSelectedInPicker && '✓'}
                        </button>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
            <button className="picker-close" onClick={() => setShowExPicker(false)}>닫기</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default TemplateView
