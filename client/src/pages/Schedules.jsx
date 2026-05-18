import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { scheduleService, pharmacyService } from '../services/api'

const Schedules = () => {
  const { hasRole } = useAuth()
  const [schedules, setSchedules] = useState([])
  const [pharmacies, setPharmacies] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [formData, setFormData] = useState({
    pharmacyId: '',
    startDate: '',
    endDate: '',
    notes: ''
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [schedulesRes, pharmaciesRes] = await Promise.all([
        scheduleService.getAll(),
        pharmacyService.getAll()
      ])
      setSchedules(schedulesRes.data.data)
      setPharmacies(pharmaciesRes.data.data)
    } catch (error) {
      console.error('Failed to load data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await scheduleService.create(formData)
      setShowCreateForm(false)
      setFormData({ pharmacyId: '', startDate: '', endDate: '', notes: '' })
      loadData()
    } catch (error) {
      alert('Błąd podczas tworzenia grafiku: ' + error.response?.data?.error?.message)
    }
  }

  if (loading) {
    return <div className="loading">Ładowanie...</div>
  }

  return (
    <div className="container">
      <div className="page-header">
        <h1>Grafiki</h1>
        {hasRole('ADMINISTRATOR', 'MANAGER', 'KIEROWNIK') && (
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="btn btn-primary"
          >
            {showCreateForm ? 'Anuluj' : 'Utwórz nowy grafik'}
          </button>
        )}
      </div>

      {showCreateForm && (
        <div className="card">
          <h2>Nowy grafik</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Apteka</label>
              <select
                value={formData.pharmacyId}
                onChange={(e) => setFormData({ ...formData, pharmacyId: e.target.value })}
                required
              >
                <option value="">Wybierz aptekę</option>
                {pharmacies.map((pharmacy) => (
                  <option key={pharmacy.id} value={pharmacy.id}>
                    {pharmacy.name}
                  </option>
                ))}
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
              <label>Notatki</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows="3"
              />
            </div>
            <button type="submit" className="btn btn-primary">Utwórz grafik</button>
          </form>
        </div>
      )}

      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>Apteka</th>
              <th>Okres</th>
              <th>Status</th>
              <th>Autor</th>
              <th>Akcje</th>
            </tr>
          </thead>
          <tbody>
            {schedules.map((schedule) => (
              <tr key={schedule.id}>
                <td>{schedule.pharmacy.name}</td>
                <td>
                  {new Date(schedule.startDate).toLocaleDateString()} -{' '}
                  {new Date(schedule.endDate).toLocaleDateString()}
                </td>
                <td>
                  <span className={`badge badge-${getStatusColor(schedule.status)}`}>
                    {translateStatus(schedule.status)}
                  </span>
                </td>
                <td>
                  {schedule.createdBy.firstName} {schedule.createdBy.lastName}
                </td>
                <td>
                  <Link to={`/schedules/${schedule.id}`} className="btn btn-sm btn-primary">
                    Szczegóły
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

const getStatusColor = (status) => {
  const colors = {
    DRAFT: 'secondary',
    PENDING_APPROVAL: 'warning',
    APPROVED: 'success',
    PUBLISHED: 'primary'
  }
  return colors[status] || 'secondary'
}

const translateStatus = (status) => {
  const translations = {
    DRAFT: 'Wersja robocza',
    PENDING_APPROVAL: 'Oczekuje',
    APPROVED: 'Zatwierdzony',
    PUBLISHED: 'Opublikowany'
  }
  return translations[status] || status
}

export default Schedules
