import { useEffect, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { userService } from '../services/api'

const Users = () => {
  const { hasRole } = useAuth()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    try {
      const response = await userService.getAll()
      setUsers(response.data.data)
    } catch (error) {
      console.error('Failed to load users:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleToggleActive = async (userId, isActive) => {
    try {
      await userService.update(userId, { isActive: !isActive })
      loadUsers()
    } catch (error) {
      alert('Błąd podczas aktualizacji użytkownika')
    }
  }

  if (loading) {
    return <div className="loading">Ładowanie...</div>
  }

  return (
    <div className="container">
      <h1>Użytkownicy</h1>
      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>Imię i nazwisko</th>
              <th>Email</th>
              <th>Rola</th>
              <th>Telefon</th>
              <th>Status</th>
              {hasRole('ADMINISTRATOR') && <th>Akcje</th>}
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>
                  {user.firstName} {user.lastName}
                </td>
                <td>{user.email}</td>
                <td>
                  <span className="badge badge-primary">{translateRole(user.role)}</span>
                </td>
                <td>{user.phoneNumber || '-'}</td>
                <td>
                  <span className={`badge ${user.isActive ? 'badge-success' : 'badge-danger'}`}>
                    {user.isActive ? 'Aktywny' : 'Nieaktywny'}
                  </span>
                </td>
                {hasRole('ADMINISTRATOR') && (
                  <td>
                    <button
                      onClick={() => handleToggleActive(user.id, user.isActive)}
                      className={`btn btn-sm ${user.isActive ? 'btn-danger' : 'btn-success'}`}
                    >
                      {user.isActive ? 'Dezaktywuj' : 'Aktywuj'}
                    </button>
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

const translateRole = (role) => {
  const translations = {
    ADMINISTRATOR: 'Administrator',
    MANAGER: 'Menadżer',
    KIEROWNIK: 'Kierownik',
    MAGISTER: 'Magister',
    TECHNIK: 'Technik'
  }
  return translations[role] || role
}

export default Users
