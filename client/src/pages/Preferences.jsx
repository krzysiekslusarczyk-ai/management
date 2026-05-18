import { useEffect, useState } from 'react'
import { preferenceService } from '../services/api'

const Preferences = () => {
  const [preference, setPreference] = useState(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState({
    preferredDays: [],
    preferredShiftTypes: [],
    notes: ''
  })

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  const shiftTypes = ['MORNING', 'AFTERNOON', 'NIGHT', 'FULL_DAY']

  useEffect(() => {
    loadPreferences()
  }, [])

  const loadPreferences = async () => {
    try {
      const response = await preferenceService.getMy()
      const pref = response.data.data
      if (pref) {
        setPreference(pref)
        setFormData({
          preferredDays: pref.preferredDays || [],
          preferredShiftTypes: pref.preferredShiftTypes || [],
          notes: pref.notes || ''
        })
      } else {
        setEditing(true)
      }
    } catch (error) {
      console.error('Failed to load preferences:', error)
      setEditing(true)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await preferenceService.createOrUpdate(formData)
      setEditing(false)
      loadPreferences()
    } catch (error) {
      alert('Błąd podczas zapisywania preferencji')
    }
  }

  const toggleDay = (day) => {
    setFormData((prev) => ({
      ...prev,
      preferredDays: prev.preferredDays.includes(day)
        ? prev.preferredDays.filter((d) => d !== day)
        : [...prev.preferredDays, day]
    }))
  }

  const toggleShiftType = (type) => {
    setFormData((prev) => ({
      ...prev,
      preferredShiftTypes: prev.preferredShiftTypes.includes(type)
        ? prev.preferredShiftTypes.filter((t) => t !== type)
        : [...prev.preferredShiftTypes, type]
    }))
  }

  if (loading) {
    return <div className="loading">Ładowanie...</div>
  }

  return (
    <div className="container">
      <div className="page-header">
        <h1>Moje Preferencje</h1>
        {!editing && preference && (
          <button onClick={() => setEditing(true)} className="btn btn-primary">
            Edytuj
          </button>
        )}
      </div>

      {editing ? (
        <div className="card">
          <h2>{preference ? 'Edytuj preferencje' : 'Ustaw preferencje'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Preferowane dni tygodnia</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {daysOfWeek.map((day) => (
                  <label key={day} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <input
                      type="checkbox"
                      checked={formData.preferredDays.includes(day)}
                      onChange={() => toggleDay(day)}
                    />
                    {translateDay(day)}
                  </label>
                ))}
              </div>
            </div>
            <div className="form-group">
              <label>Preferowane typy zmian</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {shiftTypes.map((type) => (
                  <label key={type} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <input
                      type="checkbox"
                      checked={formData.preferredShiftTypes.includes(type)}
                      onChange={() => toggleShiftType(type)}
                    />
                    {translateShiftType(type)}
                  </label>
                ))}
              </div>
            </div>
            <div className="form-group">
              <label>Dodatkowe uwagi</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows="4"
                placeholder="Dodatkowe informacje dotyczące twoich preferencji..."
              />
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button type="submit" className="btn btn-primary">Zapisz</button>
              {preference && (
                <button
                  type="button"
                  onClick={() => {
                    setEditing(false)
                    setFormData({
                      preferredDays: preference.preferredDays || [],
                      preferredShiftTypes: preference.preferredShiftTypes || [],
                      notes: preference.notes || ''
                    })
                  }}
                  className="btn btn-secondary"
                >
                  Anuluj
                </button>
              )}
            </div>
          </form>
        </div>
      ) : (
        <div className="card">
          <h2>Twoje preferencje</h2>
          <div className="preference-view">
            <div className="preference-section">
              <h3>Preferowane dni tygodnia</h3>
              {preference.preferredDays.length > 0 ? (
                <div className="preference-tags">
                  {preference.preferredDays.map((day) => (
                    <span key={day} className="badge badge-primary">
                      {translateDay(day)}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="empty-state">Brak preferencji</p>
              )}
            </div>
            <div className="preference-section">
              <h3>Preferowane typy zmian</h3>
              {preference.preferredShiftTypes.length > 0 ? (
                <div className="preference-tags">
                  {preference.preferredShiftTypes.map((type) => (
                    <span key={type} className="badge badge-success">
                      {translateShiftType(type)}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="empty-state">Brak preferencji</p>
              )}
            </div>
            {preference.notes && (
              <div className="preference-section">
                <h3>Dodatkowe uwagi</h3>
                <p>{preference.notes}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

const translateDay = (day) => {
  const translations = {
    Monday: 'Poniedziałek',
    Tuesday: 'Wtorek',
    Wednesday: 'Środa',
    Thursday: 'Czwartek',
    Friday: 'Piątek',
    Saturday: 'Sobota',
    Sunday: 'Niedziela'
  }
  return translations[day] || day
}

const translateShiftType = (type) => {
  const translations = {
    MORNING: 'Poranna',
    AFTERNOON: 'Popołudniowa',
    NIGHT: 'Nocna',
    FULL_DAY: 'Cały dzień'
  }
  return translations[type] || type
}

export default Preferences
