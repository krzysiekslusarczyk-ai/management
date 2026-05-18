import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { scheduleService, absenceService } from '../services/api'
import './Dashboard.css'

const Dashboard = () => {
  const { user, hasRole } = useAuth()
  const [schedules, setSchedules] = useState([])
  const [absences, setAbsences] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [schedulesRes, absencesRes] = await Promise.all([
        scheduleService.getAll({ status: 'PUBLISHED' }),
        absenceService.getAll({ userId: user.id })
      ])
      setSchedules(schedulesRes.data.data.slice(0, 5))
      setAbsences(absencesRes.data.data.slice(0, 5))
    } catch (error) {
      console.error('Failed to load dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="loading">Ładowanie...</div>
  }

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      <p className="welcome-text">
        Witaj, {user.firstName} {user.lastName}!
      </p>

      <div className="dashboard-grid">
        <div className="card">
          <h2>Ostatnie Grafiki</h2>
          {schedules.length === 0 ? (
            <p className="empty-state">Brak opublikowanych grafików</p>
          ) : (
            <div className="schedule-list">
              {schedules.map((schedule) => (
                <Link
                  key={schedule.id}
                  to={`/schedules/${schedule.id}`}
                  className="schedule-item"
                >
                  <div>
                    <strong>{schedule.pharmacy.name}</strong>
                    <div className="schedule-dates">
                      {new Date(schedule.startDate).toLocaleDateString()} -{' '}
                      {new Date(schedule.endDate).toLocaleDateString()}
                    </div>
                  </div>
                  <span className={`badge badge-${getStatusColor(schedule.status)}`}>
                    {translateStatus(schedule.status)}
                  </span>
                </Link>
              ))}
            </div>
          )}
          <Link to="/schedules" className="btn btn-primary btn-sm">
            Zobacz wszystkie grafiki
          </Link>
        </div>

        <div className="card">
          <h2>Moje Nieobecności</h2>
          {absences.length === 0 ? (
            <p className="empty-state">Brak zgłoszonych nieobecności</p>
          ) : (
            <div className="absence-list">
              {absences.map((absence) => (
                <div key={absence.id} className="absence-item">
                  <div>
                    <strong>{translateAbsenceType(absence.absenceType)}</strong>
                    <div className="absence-dates">
                      {new Date(absence.startDate).toLocaleDateString()} -{' '}
                      {new Date(absence.endDate).toLocaleDateString()}
                    </div>
                  </div>
                  <span className={`badge ${absence.isApproved ? 'badge-success' : 'badge-warning'}`}>
                    {absence.isApproved ? 'Zatwierdzona' : 'Oczekuje'}
                  </span>
                </div>
              ))}
            </div>
          )}
          <Link to="/absences" className="btn btn-primary btn-sm">
            Zarządzaj nieobecnościami
          </Link>
        </div>

        {hasRole('ADMINISTRATOR', 'MANAGER', 'KIEROWNIK') && (
          <div className="card">
            <h2>Szybkie Akcje</h2>
            <div className="quick-actions">
              <Link to="/schedules" className="action-button">
                <span className="action-icon">📅</span>
                <span>Utwórz nowy grafik</span>
              </Link>
              {hasRole('ADMINISTRATOR', 'MANAGER') && (
                <>
                  <Link to="/users" className="action-button">
                    <span className="action-icon">👥</span>
                    <span>Zarządzaj użytkownikami</span>
                  </Link>
                  <Link to="/pharmacies" className="action-button">
                    <span className="action-icon">🏥</span>
                    <span>Zarządzaj aptekami</span>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
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
    PENDING_APPROVAL: 'Oczekuje na zatwierdzenie',
    APPROVED: 'Zatwierdzony',
    PUBLISHED: 'Opublikowany'
  }
  return translations[status] || status
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

export default Dashboard
