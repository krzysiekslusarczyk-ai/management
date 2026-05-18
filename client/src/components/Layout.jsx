import { Outlet, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import './Layout.css'

const Layout = () => {
  const { user, logout, hasRole } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="layout">
      <nav className="navbar">
        <div className="navbar-brand">
          <h1>System Grafików Aptek</h1>
        </div>
        <div className="navbar-menu">
          <Link to="/dashboard" className="nav-link">Dashboard</Link>
          <Link to="/schedules" className="nav-link">Grafiki</Link>
          {hasRole('ADMINISTRATOR', 'MANAGER') && (
            <>
              <Link to="/users" className="nav-link">Użytkownicy</Link>
              <Link to="/pharmacies" className="nav-link">Apteki</Link>
            </>
          )}
          <Link to="/absences" className="nav-link">Nieobecności</Link>
          <Link to="/preferences" className="nav-link">Preferencje</Link>
        </div>
        <div className="navbar-user">
          <span className="user-name">{user?.firstName} {user?.lastName}</span>
          <span className="user-role badge badge-primary">{user?.role}</span>
          <button onClick={handleLogout} className="btn btn-secondary btn-sm">Wyloguj</button>
        </div>
      </nav>
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  )
}

export default Layout
