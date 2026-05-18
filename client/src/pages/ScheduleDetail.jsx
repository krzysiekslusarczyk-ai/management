import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { scheduleService, shiftService, userService } from '../services/api'
import { format, parseISO, eachDayOfInterval, startOfWeek, endOfWeek, isSameDay } from 'date-fns'
import { pl } from 'date-fns/locale'

const ScheduleDetail = () => {
  const { id } = useParams()
  const { hasRole } = useAuth()
  const [schedule, setSchedule] = useState(null)
  const [shifts, setShifts] = useState([])
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAddShift, setShowAddShift] = useState(false)
  const [shiftForm, setShiftForm] = useState({
    userId: '',
    date: '',
    shiftType: 'MORNING',
    startTime: '08:00',
    endTime: '16:00',
    notes: ''
  })

  useEffect(() => {
    loadData()
  }, [id])

  const loadData = async () => {
    try {
      const [scheduleRes, shiftsRes, usersRes] = await Promise.all([
        scheduleService.getById(id),
        shiftService.getBySchedule(id),
        userService.getAll()
      ])
      setSchedule(scheduleRes.data.data)
      setShifts(shiftsRes.data.data)
      setUsers(usersRes.data.data)
    } catch (error) {
      console.error('Failed to load data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddShift = async (e) => {
    e.preventDefault()
    try {
      await shiftService.create({
        ...shiftForm,
        scheduleId: id
      })
      setShowAddShift(false)
      setShiftForm({
        userId: '',
        date: '',
        shiftType: 'MORNING',
        startTime: '08:00',
        endTime: '16:00',
        notes: ''
      })
      loadData()
    } catch (error) {
      alert('Błąd: ' + error.response?.data?.error?.message)
    }
  }

  const handleApprove = async () => {
    try {
      await scheduleService.approve(id)
      loadData()
    } catch (error) {
      alert('Błąd podczas zatwierdzania')
    }
  }

  const handlePublish = async () => {
    try {
      await scheduleService.publish(id)
      loadData()
    } catch (error) {
      alert('Błąd podczas publikacji')
    }
  }

  if (loading) {
    return <div className="loading">Ładowanie...</div>
  }

  if (!schedule) {
    return <div>Nie znaleziono grafiku</div>
  }

  const days = eachDayOfInterval({
    start: parseISO(schedule.startDate),
    end: parseISO(schedule.endDate)
  })

  return (
    <div className="container">
      <div className="page-header">
        <div>
          <h1>{schedule.pharmacy.name}</h1>
          <p>
            {format(parseISO(schedule.startDate), 'dd MMMM yyyy', { locale: pl })} -{' '}
            {format(parseISO(schedule.endDate), 'dd MMMM yyyy', { locale: pl })}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <span className={`badge badge-${getStatusColor(schedule.status)}`}>
            {translateStatus(schedule.status)}
          </span>
          {hasRole('ADMINISTRATOR', 'MANAGER') && schedule.status === 'DRAFT' && (
            <button onClick={handleApprove} className="btn btn-success">
              Zatwierdź
            </button>
          )}
          {hasRole('ADMINISTRATOR', 'MANAGER', 'KIEROWNIK') && schedule.status === 'APPROVED' && (
            <button onClick={handlePublish} className="btn btn-primary">
              Opublikuj
            </button>
          )}
          {hasRole('ADMINISTRATOR', 'MANAGER', 'KIEROWNIK') && (
            <button onClick={() => setShowAddShift(!showAddShift)} className="btn btn-primary">
              Dodaj zmianę
            </button>
          )}
        </div>
      </div>

      {showAddShift && (
        <div className="card">
          <h2>Dodaj zmianę</h2>
          <form onSubmit={handleAddShift}>
            <div className="form-group">
              <label>Pracownik</label>
              <select
                value={shiftForm.userId}
                onChange={(e) => setShiftForm({ ...shiftForm, userId: e.target.value })}
                required
              >
                <option value="">Wybierz pracownika</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.firstName} {user.lastName} ({user.role})
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Data</label>
              <input
                type="date"
                value={shiftForm.date}
                onChange={(e) => setShiftForm({ ...shiftForm, date: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Typ zmiany</label>
              <select
                value={shiftForm.shiftType}
                onChange={(e) => setShiftForm({ ...shiftForm, shiftType: e.target.value })}
              >
                <option value="MORNING">Poranna</option>
                <option value="AFTERNOON">Popołudniowa</option>
                <option value="NIGHT">Nocna</option>
                <option value="FULL_DAY">Cały dzień</option>
              </select>
            </div>
            <div className="form-group">
              <label>Godzina rozpoczęcia</label>
              <input
                type="time"
                value={shiftForm.startTime}
                onChange={(e) => setShiftForm({ ...shiftForm, startTime: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Godzina zakończenia</label>
              <input
                type="time"
                value={shiftForm.endTime}
                onChange={(e) => setShiftForm({ ...shiftForm, endTime: e.target.value })}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary">Dodaj</button>
          </form>
        </div>
      )}

      <div className="card calendar-container">
        <h2>Grafik</h2>
        <div className="calendar-grid">
          {days.map((day) => {
            const dayShifts = shifts.filter((shift) =>
              isSameDay(parseISO(shift.date), day)
            )
            return (
              <div key={day.toISOString()} className="calendar-day">
                <div className="day-header">
                  <div className="day-name">
                    {format(day, 'EEEE', { locale: pl })}
                  </div>
                  <div className="day-date">{format(day, 'dd.MM')}</div>
                </div>
                <div className="day-shifts">
                  {dayShifts.map((shift) => (
                    <div
                      key={shift.id}
                      className={`shift-item shift-${shift.shiftType.toLowerCase()}`}
                    >
                      <div className="shift-user">
                        {shift.user.firstName} {shift.user.lastName}
                      </div>
                      <div className="shift-time">
                        {shift.startTime} - {shift.endTime}
                      </div>
                    </div>
                  ))}
                  {dayShifts.length === 0 && (
                    <div className="no-shifts">Brak zmian</div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
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

export default ScheduleDetail
