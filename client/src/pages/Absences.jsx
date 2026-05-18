import { useEffect, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { absenceService } from '../services/api'

const Absences = () => {
  const { user, hasRole } = useAuth()
  const [absences, setAbsences] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [formData, setFormData] = useState({
    startDate: '',
    endDate: '',
    absenceType: 'VACATION',
    reason: ''
  })

  useEffect(() => {
    loadAbsences()
  }, [])

  const loadAbsences = async () => {
    try {
      const params = hasRole('ADMINISTRATOR', 'MANAGER', 'KIEROWNIK') ? {} : { userId: user.id }
      const response = await absenceService.getAll(params)
      setAbsences(response.data.data)
    } catch (error) {
      console.error('Failed to load absences:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await absenceService.create(formData)
      setShowCreateForm(false)
      setFormData({ startDate: '', endDate: '', absenceType: 'VACATION', reason: '' })
      loadAbsences()
    } catch (error) {
      alert('Błąd podczas zgłaszania nieobecności')
    }
  }

  const handleApprove = async (id) => {
    try {
      await absenceService.approve(id)
      loadAbsences()
    } catch (error) {
      alert('Błąd podczas zatwierdzania')
    }
  }

  if (loading) {
    return <div className="loading">Ładowanie...</div>
  }

  return (
    <div className="container">
      <div className="page-header">
        <h1>Nieobecności</h1>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="btn btn-primary"
        >
          {showCreateForm ? 'Anuluj' : 'Zgłoś nieobecność'}
        </button>
      </div>

      {showCreateForm && (
        <div className="card">
          <h2>Zgłoś nieobecność</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Typ nieobecności</label>
              <select
                value={formData.absenceType}
                onChange={(e) => setFormData({ ...formData, absenceType: e.target.value })}
              >
                <option value="VACATION">Urlop</option>
                <option value="SICK_LEAVE">Zwolnienie lekarskie</option>
                <option value="PERSONAL">Sprawy osobiste</option>
                <option value="OTHER">Inne</option>
              </select>
            </div>
            <div className="form-group">
              <label>Data rozpoczęcia</label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Data zakończenia</label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Powód (opcjonalnie)</label>
              <textarea
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                rows="3"
              />
            </div>
            <button type="submit" className="btn btn-primary">Zgłoś</button>
          </form>
        </div>
      )}

      <div className="card">
        <table className="table">
          <thead>
            <tr>
              {hasRole('ADMINISTRATOR', 'MANAGER', 'KIEROWNIK') && <th>Pracownik</th>}
              <th>Typ</th>
              <th>Okres</th>
              <th>Powód</th>
              <th>Status</th>
              {hasRole('ADMINISTRATOR', 'MANAGER', 'KIEROWNIK') && <th>Akcje</th>}
            </tr>
          </thead>
          <tbody>
            {absences.map((absence) => (
              <tr key={absence.id}>
                {hasRole('ADMINISTRATOR', 'MANAGER', 'KIEROWNIK') && (
                  <td>
                    {absence.user.firstName} {absence.user.lastName}
                  </td>
                )}
                <td>{translateAbsenceType(absence.absenceType)}</td>
                <td>
                  {new Date(absence.startDate).toLocaleDateString()} -{' '}
                  {new Date(absence.endDate).toLocaleDateString()}
                </td>
                <td>{absence.reason || '-'}</td>
                <td>
                  <span className={`badge ${absence.isApproved ? 'badge-success' : 'badge-warning'}`}>
                    {absence.isApproved ? 'Zatwierdzona' : 'Oczekuje'}
                  </span>
                </td>
                {hasRole('ADMINISTRATOR', 'MANAGER', 'KIEROWNIK') && (
                  <td>
                    {!absence.isApproved && (
                      <button
                        onClick={() => handleApprove(absence.id)}
                        className="btn btn-sm btn-success"
                      >
                        Zatwierdź
                      </button>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

const translateAbsenceType = (type) => {
  const translations = {
    VACATION: 'Urlop',
    SICK_LEAVE: 'Zwolnienie lekarskie',
    PERSONAL: 'Sprawy osobiste',
    OTHER: 'Inne'
  }
  return translations[type] || type
}

export default Absences
